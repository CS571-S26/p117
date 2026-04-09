import Container from 'react-bootstrap/Container'
import CalendarWorkspace from '../components/CalendarWorkspace'
import PageHeader from '../components/PageHeader'
import {
  calendarCalendars,
  calendarConfig,
  initialEvents,
} from '../data/mockData'

function PlannerPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Calendar"
        title="Planner"
        description="Browse months, filter calendars, and manage events."
        primaryAction={{ label: 'Home', to: '/' }}
      />

      <section className="page-section">
        <CalendarWorkspace
          config={calendarConfig}
          calendars={calendarCalendars}
          initialEvents={initialEvents}
        />
      </section>
    </Container>
  )
}

export default PlannerPage
