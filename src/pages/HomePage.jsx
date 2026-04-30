import { useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'
import { formatTime, getCategory } from '../utils/planner'

const weekDays = ['Mon 5/4', 'Tue 5/5', 'Wed 5/6', 'Thu 5/7', 'Fri 5/8', 'Sat 5/9', 'Sun 5/10']
const timeLabels = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM']

const demoBlocks = [
  { title: 'Calculus II', time: '9:00 AM', variant: 'primary', day: 0, top: '11%', height: '10%' },
  { title: 'Physics Problem Set', time: '11:00 AM', variant: 'warning', day: 0, top: '25%', height: '9%' },
  { title: 'Study Session', time: '1:00 PM', variant: 'info', day: 0, top: '39%', height: '12%' },
  { title: 'Project Research', time: '4:00 PM', variant: 'warning', day: 0, top: '62%', height: '12%' },
  { title: 'Data Structures', time: '10:00 AM', variant: 'info', day: 1, top: '18%', height: '9%' },
  { title: 'Team Meeting', time: '1:00 PM', variant: 'warning', day: 1, top: '39%', height: '10%' },
  { title: 'Lab Report Work', time: '3:00 PM', variant: 'info', day: 1, top: '55%', height: '12%' },
  { title: 'Algorithms', time: '9:00 AM', variant: 'primary', day: 2, top: '11%', height: '12%' },
  { title: 'Work on Project', time: '12:00 PM', variant: 'warning', day: 2, top: '32%', height: '9%' },
  { title: 'Database Systems', time: '10:00 AM', variant: 'info', day: 3, top: '18%', height: '9%' },
  { title: 'Study Session', time: '2:00 PM', variant: 'info', day: 3, top: '46%', height: '10%' },
  { title: 'Chemistry Review', time: '7:00 PM', variant: 'secondary', day: 3, top: '80%', height: '9%' },
  { title: 'Calculus II', time: '9:00 AM', variant: 'primary', day: 4, top: '11%', height: '12%' },
  { title: 'Assignment Due', time: '11:00 AM', variant: 'warning', day: 4, top: '25%', height: '10%' },
  { title: 'Office Hours', time: '1:00 PM', variant: 'info', day: 4, top: '39%', height: '10%' },
  { title: 'Weekly Review', time: '5:00 PM', variant: 'info', day: 4, top: '67%', height: '10%' },
  { title: 'Library Session', time: '11:00 AM', variant: 'secondary', day: 5, top: '25%', height: '14%' },
  { title: 'Homework', time: '3:00 PM', variant: 'warning', day: 5, top: '55%', height: '14%' },
  { title: 'Plan Next Week', time: '7:00 PM', variant: 'primary', day: 5, top: '80%', height: '10%' },
  { title: 'Weekly Planning', time: '10:00 AM', variant: 'warning', day: 6, top: '18%', height: '9%' },
  { title: 'Laundry', time: '1:00 PM', variant: 'info', day: 6, top: '39%', height: '11%' },
  { title: 'Read Chapter 6', time: '6:00 PM', variant: 'secondary', day: 6, top: '73%', height: '10%' },
]

function HomePage({ items, upcomingItems, categories }) {
  const [viewMode, setViewMode] = useState('Week')
  const openItems = useMemo(
    () => items.filter((item) => !item.completed),
    [items],
  )
  const suggestedItem = upcomingItems[0] ?? openItems[0]
  const visibleDays = viewMode === 'Week' ? weekDays : [weekDays[2]]
  const visibleBlocks =
    viewMode === 'Week'
      ? demoBlocks
      : demoBlocks.filter((block) => block.day === 2)

  const realPlannerBlocks = openItems.slice(0, viewMode === 'Week' ? 4 : 1).map((item, index) => {
    const category = getCategory(categories, item.categoryId)

    return {
      title: item.title,
      time: formatTime(item.start),
      variant: category.variant,
      day: viewMode === 'Week' ? index + 1 : 0,
      top: `${18 + index * 17}%`,
      height: '10%',
    }
  })

  return (
    <Container fluid="xl">
      <section className="landing-reference">
        <div className="landing-reference-glow"></div>

        <div className="landing-reference-copy">
          <span className="landing-ai-pill">AI-powered planning</span>
          <h1>
            Plan the week around <span>real student work.</span>
          </h1>
          <p>Add tasks, events, and study sessions, then get smarter timing suggestions.</p>

          <div className="hero-actions">
            <Button as={Link} to="/calendar" variant="primary">
              Open calendar
            </Button>
            <Button as={Link} to="/calendar?create=1" variant="outline-secondary">
              Create item
            </Button>
          </div>
        </div>

        <div className="planner-showcase-window">
          <aside className="showcase-sidebar">
            <strong>AI Student Planner</strong>
            <nav aria-label="Preview navigation">
              <span className="is-active">Week</span>
              <span>Calendar</span>
              <span>Tasks</span>
              <span>Study Sessions</span>
              <span>AI Suggestions</span>
            </nav>

            <div className="showcase-side-note">
              <span>AI</span>
              <p>Learning your schedule and priorities.</p>
            </div>
          </aside>

          <div className="showcase-main">
            <div className="showcase-toolbar">
              <span className="btn btn-outline-secondary btn-sm" aria-hidden="true">
                Today
              </span>
              <strong>May 4 - May 10, 2025</strong>
              <div className="showcase-view-toggle" aria-label="Preview view">
                {['Week', 'Day'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={viewMode === mode ? 'is-active' : ''}
                    onClick={() => setViewMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div
              className={`showcase-calendar ${viewMode === 'Day' ? 'is-day-view' : ''}`}
              style={{ '--day-count': visibleDays.length }}
            >
              <div className="showcase-times">
                {timeLabels.map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>

              <div className="showcase-days">
                {visibleDays.map((day, visibleIndex) => {
                  const originalDayIndex = weekDays.indexOf(day)

                  return (
                    <section key={day} className="showcase-day">
                      <span>{day}</span>

                      {[...visibleBlocks, ...realPlannerBlocks]
                        .filter((block) =>
                          viewMode === 'Week'
                            ? block.day === originalDayIndex
                            : block.day === visibleIndex,
                        )
                        .map((block) => (
                          <article
                            key={`${day}-${block.title}-${block.top}`}
                            className={`showcase-event event-${block.variant}`}
                            style={{
                              '--event-top': block.top,
                              '--event-height': block.height,
                            }}
                          >
                            <strong>{block.title}</strong>
                            <small>{block.time}</small>
                          </article>
                        ))}

                      {originalDayIndex === 2 || viewMode === 'Day' ? (
                        <article className="showcase-suggested-block">
                          <strong>Suggested</strong>
                          <span>Focus Block</span>
                          <small>6:00 - 8:00 PM</small>
                        </article>
                      ) : null}
                    </section>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="showcase-ai-card">
            <span>AI suggestion</span>
            <strong>{suggestedItem?.assistantSuggestion ?? 'Protect a focus block.'}</strong>
            <span className="btn btn-primary btn-sm" aria-hidden="true">
              Apply suggestion
            </span>
          </aside>
        </div>
      </section>
    </Container>
  )
}

export default HomePage
