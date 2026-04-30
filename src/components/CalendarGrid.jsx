import { formatDateKey, formatTime, getCategory, parseDateKey } from '../utils/planner'

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatCalendarDayLabel(dateKey, itemCount) {
  const fullDate = parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const itemText = itemCount === 1 ? '1 item' : `${itemCount} items`

  return `${fullDate}, ${itemText}`
}

function CalendarGrid({
  monthDays,
  itemsByDate,
  categories,
  currentMonth,
  selectedDate,
  todayKey,
  onSelectDate,
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-auto xl:overflow-visible">
      <div className="calendar-weekdays min-w-[980px] shrink-0 xl:min-w-0">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="calendar-grid min-w-[980px] flex-1 xl:min-w-0">
        {monthDays.map((day) => {
          const dateKey = formatDateKey(day)
          const dayItems = itemsByDate[dateKey] ?? []
          const isCurrentMonth = day.getMonth() === currentMonth
          const isSelected = dateKey === selectedDate
          const isToday = dateKey === todayKey

          return (
            <button
              key={dateKey}
              type="button"
              aria-label={formatCalendarDayLabel(dateKey, dayItems.length)}
              className={[
                'calendar-day',
                isCurrentMonth ? '' : 'calendar-day-muted',
                isSelected ? 'calendar-day-selected' : '',
                isToday ? 'calendar-day-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(dateKey)}
            >
              <span className="calendar-day-number">{day.getDate()}</span>

              <div className="calendar-day-items">
                {dayItems.slice(0, 3).map((item) => {
                  const category = getCategory(categories, item.categoryId)

                  return (
                    <span
                      key={item.id}
                      className={`calendar-chip bg-${category.variant}`}
                    >
                      <strong>{item.title}</strong>
                      <small>
                        {item.type === 'task'
                          ? item.priority
                          : `${formatTime(item.start)} - ${formatTime(item.end)}`}
                      </small>
                    </span>
                  )
                })}
                {dayItems.length > 3 ? (
                  <span className="calendar-more">+{dayItems.length - 3}</span>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarGrid
