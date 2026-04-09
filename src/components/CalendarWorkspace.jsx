import { useEffect, useMemo, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

const STORAGE_KEY = 'ai-smart-planner-events-v1'
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const miniWeekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonthDateKey(dateKey) {
  const date = parseDateKey(dateKey)
  return formatDateKey(new Date(date.getFullYear(), date.getMonth(), 1))
}

function shiftMonthKey(monthDateKey, delta) {
  const date = parseDateKey(monthDateKey)
  return formatDateKey(new Date(date.getFullYear(), date.getMonth() + delta, 1))
}

function formatMonthLabel(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function formatLongDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatWeekdayDate(dateKey) {
  return parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(time) {
  const [rawHour, rawMinute] = time.split(':').map(Number)
  const suffix = rawHour >= 12 ? 'PM' : 'AM'
  const hour = rawHour % 12 || 12
  return `${hour}:${String(rawMinute).padStart(2, '0')} ${suffix}`
}

function compareEvents(left, right) {
  return (
    left.date.localeCompare(right.date) ||
    left.start.localeCompare(right.start) ||
    left.title.localeCompare(right.title)
  )
}

function buildMonthGrid(monthDateKey) {
  const monthDate = parseDateKey(monthDateKey)
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())

  const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const gridEnd = new Date(lastDay)
  gridEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()))

  const days = []
  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor.setDate(cursor.getDate() + 1)) {
    days.push(new Date(cursor))
  }

  return days
}

function buildWeekGrid(selectedDateKey) {
  const selectedDate = parseDateKey(selectedDateKey)
  const start = new Date(selectedDate)
  start.setDate(selectedDate.getDate() - selectedDate.getDay())

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    return day
  })
}

function groupEventsByDate(events, calendarsById) {
  const grouped = {}

  events.forEach((event) => {
    if (!grouped[event.date]) {
      grouped[event.date] = []
    }

    grouped[event.date].push({
      ...event,
      tone: calendarsById[event.calendarId]?.tone ?? 'blue',
      calendarName: calendarsById[event.calendarId]?.name ?? 'Calendar',
    })
  })

  Object.values(grouped).forEach((items) => items.sort(compareEvents))

  return grouped
}

function loadEvents(initialEvents) {
  if (typeof window === 'undefined') {
    return initialEvents
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return initialEvents
  }

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : initialEvents
  } catch {
    return initialEvents
  }
}

function MiniMonth({
  monthDateKey,
  selectedDateKey,
  todayKey,
  eventsByDate,
  onSelectDay,
}) {
  const monthIndex = parseDateKey(monthDateKey).getMonth()
  const monthDays = buildMonthGrid(monthDateKey)

  return (
    <div className="mini-month">
      <div className="mini-month-weekdays">
        {miniWeekdayLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="mini-month-grid">
        {monthDays.map((date) => {
          const key = formatDateKey(date)
          const hasEvents = Boolean(eventsByDate[key]?.length)

          return (
            <button
              key={key}
              type="button"
              className={[
                'mini-month-day',
                date.getMonth() === monthIndex ? '' : 'is-outside',
                key === selectedDateKey ? 'is-selected' : '',
                key === todayKey ? 'is-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDay(key)}
            >
              <span>{date.getDate()}</span>
              {hasEvents ? <span className="mini-month-marker"></span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MonthView({
  monthDateKey,
  todayKey,
  selectedDateKey,
  eventsByDate,
  onSelectDay,
}) {
  const monthIndex = parseDateKey(monthDateKey).getMonth()
  const monthDays = buildMonthGrid(monthDateKey)

  return (
    <div className="calendar-view-content">
      <div className="calendar-weekdays">
        {weekdayLabels.map((label) => (
          <div key={label} className="calendar-weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {monthDays.map((date) => {
          const key = formatDateKey(date)
          const events = eventsByDate[key] ?? []
          const visibleEvents = events.slice(0, 3)
          const hiddenCount = events.length - visibleEvents.length

          return (
            <button
              key={key}
              type="button"
              className={[
                'calendar-day',
                date.getMonth() === monthIndex ? '' : 'calendar-day-outside',
                key === todayKey ? 'calendar-day-today' : '',
                key === selectedDateKey ? 'calendar-day-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDay(key)}
            >
              <div className="calendar-day-top">
                <span className="calendar-day-number">{date.getDate()}</span>
                {key === todayKey ? (
                  <Badge className="calendar-today-badge">Today</Badge>
                ) : null}
              </div>

              <div className="calendar-event-list">
                {visibleEvents.map((event) => (
                  <div key={event.id} className={`calendar-event tone-${event.tone}`}>
                    <span className="calendar-event-time">{formatTime(event.start)}</span>
                    <span>{event.title}</span>
                  </div>
                ))}

                {hiddenCount > 0 ? (
                  <div className="calendar-more">+{hiddenCount} more</div>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ selectedDateKey, todayKey, eventsByDate, onSelectDay, onOpenEvent }) {
  const weekDays = buildWeekGrid(selectedDateKey)

  return (
    <div className="week-view">
      {weekDays.map((date) => {
        const key = formatDateKey(date)
        const events = eventsByDate[key] ?? []

        return (
          <section
            key={key}
            className={`week-column${key === selectedDateKey ? ' is-selected' : ''}`}
          >
            <button
              type="button"
              className="week-column-header"
              onClick={() => onSelectDay(key)}
            >
              <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <strong>{date.getDate()}</strong>
              {key === todayKey ? <Badge className="calendar-today-badge">Today</Badge> : null}
            </button>

            <div className="week-column-events">
              {events.length ? (
                events.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={`week-event tone-${event.tone}`}
                    onClick={() => onOpenEvent(event)}
                  >
                    <strong>{formatTime(event.start)}</strong>
                    <span>{event.title}</span>
                  </button>
                ))
              ) : (
                <p className="calendar-empty">No events</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function DayView({ selectedDateKey, events, onOpenEvent }) {
  return (
    <div className="day-view">
      <div className="day-view-header">
        <h3>{formatLongDate(selectedDateKey)}</h3>
        <span>{events.length} item{events.length === 1 ? '' : 's'}</span>
      </div>

      <div className="day-view-events">
        {events.length ? (
          events.map((event) => (
            <button
              key={event.id}
              type="button"
              className={`day-view-event tone-${event.tone}`}
              onClick={() => onOpenEvent(event)}
            >
              <div>
                <strong>{event.title}</strong>
                <p>
                  {formatTime(event.start)} - {formatTime(event.end)}
                </p>
              </div>
              <Badge bg="light" text="dark">
                {event.calendarName}
              </Badge>
            </button>
          ))
        ) : (
          <p className="calendar-empty">No events for this day.</p>
        )}
      </div>
    </div>
  )
}

function ScheduleView({ groupedEvents, onSelectDay, onOpenEvent }) {
  const entries = Object.entries(groupedEvents).sort(([left], [right]) =>
    left.localeCompare(right),
  )

  return (
    <div className="schedule-view">
      {entries.map(([dateKey, events]) => (
        <section key={dateKey} className="schedule-group">
          <button
            type="button"
            className="schedule-group-header"
            onClick={() => onSelectDay(dateKey)}
          >
            {formatWeekdayDate(dateKey)}
          </button>

          <div className="schedule-group-items">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                className="schedule-item"
                onClick={() => onOpenEvent(event)}
              >
                <div>
                  <strong>{event.title}</strong>
                  <p>
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </p>
                </div>
                <span className={`calendar-pill tone-${event.tone}`}>
                  {event.calendarName}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function CalendarWorkspace({ config, calendars, initialEvents }) {
  const calendarsById = useMemo(
    () => Object.fromEntries(calendars.map((calendar) => [calendar.id, calendar])),
    [calendars],
  )

  const createCalendarState = () =>
    Object.fromEntries(calendars.map((calendar) => [calendar.id, true]))

  const [monthDateKey, setMonthDateKey] = useState(config.monthDate)
  const [view, setView] = useState(config.defaultView)
  const [selectedDateKey, setSelectedDateKey] = useState(config.defaultSelectedDate)
  const [events, setEvents] = useState(() =>
    [...loadEvents(initialEvents)].sort(compareEvents),
  )
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [activeCalendars, setActiveCalendars] = useState(() => createCalendarState())
  const [searchQuery, setSearchQuery] = useState('')
  const [draftEvent, setDraftEvent] = useState({
    title: '',
    date: config.defaultSelectedDate,
    start: '09:00',
    end: '10:00',
    calendarId: calendars[0]?.id ?? '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    }
  }, [events])

  const visibleEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return events
      .filter((event) => activeCalendars[event.calendarId])
      .filter((event) =>
        normalizedQuery ? event.title.toLowerCase().includes(normalizedQuery) : true,
      )
      .sort(compareEvents)
  }, [events, activeCalendars, searchQuery])

  const eventsByDate = useMemo(
    () => groupEventsByDate(visibleEvents, calendarsById),
    [visibleEvents, calendarsById],
  )

  const selectedEvents = eventsByDate[selectedDateKey] ?? []
  const monthEvents = useMemo(
    () => visibleEvents.filter((event) => getMonthDateKey(event.date) === monthDateKey),
    [monthDateKey, visibleEvents],
  )
  const monthLabel = formatMonthLabel(monthDateKey)
  const selectedBadge =
    selectedDateKey === config.todayKey ? 'Today' : `${selectedEvents.length} items`

  const quickStats = useMemo(
    () => [
      { label: 'Visible', value: String(visibleEvents.length) },
      { label: 'This month', value: String(monthEvents.length) },
      { label: 'Selected', value: String(selectedEvents.length) },
    ],
    [monthEvents.length, selectedEvents.length, visibleEvents.length],
  )

  const closeEventModal = () => {
    setShowEventModal(false)
    setEditingEventId(null)
  }

  const handleSelectDay = (dateKey) => {
    setSelectedDateKey(dateKey)
    setMonthDateKey(getMonthDateKey(dateKey))
  }

  const openCreateModal = (dateKey = selectedDateKey) => {
    const firstActiveCalendar =
      calendars.find((calendar) => activeCalendars[calendar.id])?.id ?? calendars[0]?.id ?? ''

    setEditingEventId(null)
    setDraftEvent({
      title: '',
      date: dateKey,
      start: '09:00',
      end: '10:00',
      calendarId: firstActiveCalendar,
    })
    setShowEventModal(true)
  }

  const openEditModal = (event) => {
    setEditingEventId(event.id)
    setDraftEvent({
      title: event.title,
      date: event.date,
      start: event.start,
      end: event.end,
      calendarId: event.calendarId,
    })
    setShowEventModal(true)
  }

  const handleDraftChange = (event) => {
    const { name, value } = event.target
    setDraftEvent((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSaveEvent = (event) => {
    event.preventDefault()

    if (!draftEvent.title.trim() || !draftEvent.calendarId) {
      return
    }

    const eventDetails = {
      title: draftEvent.title.trim(),
      date: draftEvent.date,
      start: draftEvent.start,
      end: draftEvent.end,
      calendarId: draftEvent.calendarId,
    }

    setEvents((current) => {
      if (editingEventId) {
        return current
          .map((item) => (item.id === editingEventId ? { id: editingEventId, ...eventDetails } : item))
          .sort(compareEvents)
      }

      return [
        ...current,
        {
          id: `custom-${Date.now()}`,
          ...eventDetails,
        },
      ].sort(compareEvents)
    })

    handleSelectDay(draftEvent.date)
    setView('Day')
    closeEventModal()
  }

  const handleDeleteEvent = () => {
    if (!editingEventId) {
      return
    }

    setEvents((current) => current.filter((event) => event.id !== editingEventId))

    if (draftEvent.date === selectedDateKey && selectedEvents.length === 1) {
      setView('Month')
    }

    closeEventModal()
  }

  const handleMonthChange = (delta) => {
    const nextMonthKey = shiftMonthKey(monthDateKey, delta)
    setMonthDateKey(nextMonthKey)
    setSelectedDateKey(nextMonthKey)
    setView('Month')
  }

  const handleGoToToday = () => {
    handleSelectDay(config.todayKey)
    setView('Month')
  }

  const handleResetDemo = () => {
    setEvents([...initialEvents].sort(compareEvents))
    setActiveCalendars(createCalendarState())
    setSearchQuery('')
    setMonthDateKey(config.monthDate)
    setSelectedDateKey(config.defaultSelectedDate)
    setView(config.defaultView)
    closeEventModal()
  }

  const renderView = () => {
    if (view === 'Week') {
      return (
        <WeekView
          selectedDateKey={selectedDateKey}
          todayKey={config.todayKey}
          eventsByDate={eventsByDate}
          onSelectDay={handleSelectDay}
          onOpenEvent={openEditModal}
        />
      )
    }

    if (view === 'Day') {
      return (
        <DayView
          selectedDateKey={selectedDateKey}
          events={selectedEvents}
          onOpenEvent={openEditModal}
        />
      )
    }

    if (view === 'Schedule') {
      return (
        <ScheduleView
          groupedEvents={eventsByDate}
          onSelectDay={handleSelectDay}
          onOpenEvent={openEditModal}
        />
      )
    }

    return (
      <MonthView
        monthDateKey={monthDateKey}
        todayKey={config.todayKey}
        selectedDateKey={selectedDateKey}
        eventsByDate={eventsByDate}
        onSelectDay={handleSelectDay}
      />
    )
  }

  return (
    <>
      <section className="calendar-shell">
        <aside className="calendar-sidebar-panel">
          <Button variant="primary" className="calendar-create-button" onClick={() => openCreateModal()}>
            Create event
          </Button>

          <div className="calendar-sidebar-card">
            <p className="calendar-panel-label">Jump to date</p>
            <MiniMonth
              monthDateKey={monthDateKey}
              selectedDateKey={selectedDateKey}
              todayKey={config.todayKey}
              eventsByDate={eventsByDate}
              onSelectDay={handleSelectDay}
            />
          </div>

          <div className="calendar-sidebar-card">
            <p className="calendar-panel-label">Overview</p>

            <div className="calendar-stat-grid">
              {quickStats.map((stat) => (
                <article key={stat.label} className="calendar-stat-item">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="calendar-sidebar-card">
            <p className="calendar-panel-label">Search</p>

            <Form.Control
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search events"
            />

            <div className="calendar-sidebar-actions">
              <Button variant="light" size="sm" onClick={() => setSearchQuery('')}>
                Clear
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleResetDemo}>
                Reset demo
              </Button>
            </div>
          </div>

          <div className="calendar-sidebar-card">
            <p className="calendar-panel-label">Calendars</p>

            <div className="calendar-filter-list">
              {calendars.map((calendar) => (
                <button
                  key={calendar.id}
                  type="button"
                  className={`calendar-filter-item${
                    activeCalendars[calendar.id] ? ' is-active' : ''
                  }`}
                  onClick={() =>
                    setActiveCalendars((current) => ({
                      ...current,
                      [calendar.id]: !current[calendar.id],
                    }))
                  }
                >
                  <span className={`calendar-dot tone-${calendar.tone}`}></span>
                  <span>{calendar.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="calendar-main-panel">
          <div className="calendar-toolbar">
            <div className="calendar-toolbar-heading">
              <p className="calendar-panel-label">Calendar</p>

              <div className="calendar-month-row">
                <Button
                  variant="light"
                  className="calendar-control-button"
                  onClick={() => handleMonthChange(-1)}
                >
                  Prev
                </Button>
                <h2>{monthLabel}</h2>
                <Button
                  variant="light"
                  className="calendar-control-button"
                  onClick={() => handleMonthChange(1)}
                >
                  Next
                </Button>
              </div>

              {config.subtitle ? (
                <p className="calendar-toolbar-note">{config.subtitle}</p>
              ) : null}
            </div>

            <div className="calendar-toolbar-actions">
              <Button
                variant="light"
                className="calendar-control-button"
                onClick={handleGoToToday}
              >
                Today
              </Button>

              <ButtonGroup size="sm" className="calendar-view-switcher">
                {config.views.map((nextView) => (
                  <Button
                    key={nextView}
                    variant={view === nextView ? 'primary' : 'light'}
                    onClick={() => setView(nextView)}
                  >
                    {nextView}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>

          <div className="calendar-grid-shell">{renderView()}</div>
        </div>

        <aside className="calendar-agenda-panel">
          <div className="calendar-agenda-header">
            <div>
              <p className="calendar-panel-label">Selected</p>
              <h3>{formatLongDate(selectedDateKey)}</h3>
            </div>

            <div className="calendar-agenda-actions">
              <Badge className="calendar-agenda-badge">{selectedBadge}</Badge>
              <Button variant="light" size="sm" onClick={() => openCreateModal(selectedDateKey)}>
                Add here
              </Button>
            </div>
          </div>

          <div className="calendar-agenda-list">
            {selectedEvents.length ? (
              selectedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="calendar-agenda-item"
                  onClick={() => openEditModal(event)}
                >
                  <span className={`calendar-dot tone-${event.tone}`}></span>

                  <div className="calendar-agenda-item-copy">
                    <strong>
                      {formatTime(event.start)} - {event.title}
                    </strong>
                    <span>{event.calendarName}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="calendar-empty">No events for this date.</p>
            )}
          </div>
        </aside>
      </section>

      <Modal show={showEventModal} onHide={closeEventModal} centered>
        <Form onSubmit={handleSaveEvent}>
          <Modal.Header closeButton>
            <Modal.Title>{editingEventId ? 'Edit event' : 'Create event'}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3" controlId="eventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={draftEvent.title}
                onChange={handleDraftChange}
                placeholder="New event"
                required
              />
            </Form.Group>

            <div className="calendar-form-grid">
              <Form.Group className="mb-3" controlId="eventDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={draftEvent.date}
                  onChange={handleDraftChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="eventCalendar">
                <Form.Label>Calendar</Form.Label>
                <Form.Select
                  name="calendarId"
                  value={draftEvent.calendarId}
                  onChange={handleDraftChange}
                >
                  {calendars.map((calendar) => (
                    <option key={calendar.id} value={calendar.id}>
                      {calendar.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="calendar-form-grid">
              <Form.Group controlId="eventStart">
                <Form.Label>Start</Form.Label>
                <Form.Control
                  type="time"
                  name="start"
                  value={draftEvent.start}
                  onChange={handleDraftChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="eventEnd">
                <Form.Label>End</Form.Label>
                <Form.Control
                  type="time"
                  name="end"
                  value={draftEvent.end}
                  onChange={handleDraftChange}
                  required
                />
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="calendar-modal-footer">
            {editingEventId ? (
              <Button variant="outline-danger" onClick={handleDeleteEvent}>
                Delete
              </Button>
            ) : null}

            <div className="calendar-modal-actions">
              <Button variant="outline-secondary" onClick={closeEventModal}>
                Cancel
              </Button>
              <Button type="submit">{editingEventId ? 'Save changes' : 'Save event'}</Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default CalendarWorkspace
