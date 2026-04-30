export const STORAGE_KEY = 'aiPlannerItems'
export const LEGACY_STORAGE_KEY = 'ai-student-planner-items-v1'

export function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayKey() {
  return formatDateKey(new Date())
}

export function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getMonthKey(dateKey) {
  const date = parseDateKey(dateKey)
  return formatDateKey(new Date(date.getFullYear(), date.getMonth(), 1))
}

export function shiftMonthKey(monthDateKey, amount) {
  const date = parseDateKey(monthDateKey)
  return formatDateKey(new Date(date.getFullYear(), date.getMonth() + amount, 1))
}

export function formatDisplayDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonthLabel(monthDateKey) {
  return parseDateKey(monthDateKey).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export function formatTime(time) {
  if (!time) {
    return ''
  }

  const [rawHour, rawMinute] = time.split(':').map(Number)
  const suffix = rawHour >= 12 ? 'PM' : 'AM'
  const hour = rawHour % 12 || 12
  return `${hour}:${String(rawMinute).padStart(2, '0')} ${suffix}`
}

export function comparePlannerItems(left, right) {
  return (
    left.date.localeCompare(right.date) ||
    left.start.localeCompare(right.start) ||
    left.title.localeCompare(right.title)
  )
}

export function buildMonthDays(monthDateKey) {
  const monthDate = parseDateKey(monthDateKey)
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart)
    day.setDate(gridStart.getDate() + index)
    return day
  })
}

export function groupItemsByDate(items) {
  return items.reduce((grouped, item) => {
    const currentItems = grouped[item.date] ?? []
    return {
      ...grouped,
      [item.date]: [...currentItems, item].sort(comparePlannerItems),
    }
  }, {})
}

export function getCategory(categories, categoryId) {
  return (
    categories.find((category) => category.id === categoryId) ?? {
      id: 'other',
      name: 'Other',
      variant: 'secondary',
    }
  )
}

export function generateAssistantSuggestion(draft) {
  if (!draft.title.trim()) {
    return 'Add a title, then the planner can show a preset suggestion.'
  }

  if (draft.priority === 'High') {
    return 'Schedule this early and leave a review block before it is due.'
  }

  if (draft.type === 'event') {
    return 'Plan prep time before this event so it does not catch you off guard.'
  }

  if (draft.date === getTodayKey()) {
    return 'Keep this focused so it can realistically fit into today.'
  }

  return 'Use one focused work block and one quick review if needed.'
}

function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + amount)
  return formatDateKey(date)
}

function addMinutes(time, minutesToAdd) {
  const [hour, minute] = time.split(':').map(Number)
  const totalMinutes = hour * 60 + minute + minutesToAdd
  const nextHour = Math.floor(totalMinutes / 60) % 24
  const nextMinute = totalMinutes % 60
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`
}

function findCategoryId(categories, preferredId) {
  return (
    categories.find((category) => category.id === preferredId)?.id ??
    categories[0]?.id ??
    ''
  )
}

export function buildAiPlannerSuggestion({
  request,
  priority,
  deadline,
  selectedDate,
  items,
  categories,
}) {
  const cleanRequest = request.trim()
  const normalizedRequest = cleanRequest.toLowerCase()
  const isStudyRequest = /\b(exam|study|review)\b/.test(normalizedRequest)
  const isEventRequest = /\b(meeting|club|event)\b/.test(normalizedRequest)
  const isProjectRequest = /\b(project|milestone|presentation)\b/.test(
    normalizedRequest,
  )
  const isPersonalRequest = /\b(laundry|errand|groceries|personal)\b/.test(
    normalizedRequest,
  )
  const itemType = isEventRequest ? 'event' : 'task'
  const todayKey = getTodayKey()
  const startDate = selectedDate && selectedDate > todayKey ? selectedDate : todayKey
  const lastDate =
    deadline && deadline > startDate
      ? addDays(deadline, -1)
      : deadline || addDays(startDate, 6)
  const candidateDates = []
  let cursorDate = startDate

  while (cursorDate <= lastDate && candidateDates.length < 10) {
    candidateDates.push(cursorDate)
    cursorDate = addDays(cursorDate, 1)
  }

  if (!candidateDates.length) {
    candidateDates.push(startDate)
  }

  const suggestedDate = candidateDates.reduce((bestDate, dateKey) => {
    const bestCount = items.filter((item) => item.date === bestDate).length
    const currentCount = items.filter((item) => item.date === dateKey).length
    return currentCount < bestCount ? dateKey : bestDate
  }, candidateDates[0])
  const itemCount = items.filter((item) => item.date === suggestedDate).length
  const duration = priority === 'High' || isStudyRequest ? 90 : 60
  const start =
    itemCount === 0 ? '10:00' : itemCount <= 2 ? '14:00' : '18:00'
  const end = addMinutes(start, duration)
  const categoryId = isPersonalRequest
    ? findCategoryId(categories, 'personal')
    : isProjectRequest
      ? findCategoryId(categories, 'project')
      : isStudyRequest
        ? findCategoryId(categories, 'assignment')
        : findCategoryId(categories, itemType === 'event' ? 'class' : 'assignment')
  const title = cleanRequest || 'Suggested planner item'
  const explanation = deadline
    ? 'Picked a lighter day before the deadline.'
    : priority === 'High'
      ? 'Picked an earlier focused block for a high-priority item.'
      : itemCount <= 1
        ? 'Picked a lighter day with room for focused work.'
        : 'Picked a later slot because this day already has items.'

  return {
    title,
    date: suggestedDate,
    start,
    end,
    duration,
    explanation,
    draft: {
      title,
      type: itemType,
      date: suggestedDate,
      start,
      end,
      categoryId,
      priority,
      details: 'Created from the AI-assisted demo planner.',
      assistantSuggestion: explanation,
    },
  }
}

export function createPlannerItem(draft) {
  return {
    id: `item-${Date.now()}`,
    title: draft.title.trim(),
    type: draft.type,
    date: draft.date,
    start: draft.start,
    end: draft.end,
    categoryId: draft.categoryId,
    priority: draft.priority,
    details: draft.details.trim(),
    assistantSuggestion: draft.assistantSuggestion,
    completed: false,
  }
}
