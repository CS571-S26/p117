import Container from 'react-bootstrap/Container'
import FeatureGrid from '../components/FeatureGrid'
import PageHeader from '../components/PageHeader'
import ProgressStats from '../components/ProgressStats'
import { featureCards, overviewStats } from '../data/siteContent'

function HomePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Planner"
        title="AI Smart Planner"
        description="Simple planner template with interactive calendar tools."
        primaryAction={{ label: 'Open calendar', to: '/planner' }}
      />

      <section className="page-section">
        <ProgressStats stats={overviewStats} />
      </section>

      <section className="page-section">
        <FeatureGrid items={featureCards} />
      </section>
    </Container>
  )
}

export default HomePage
