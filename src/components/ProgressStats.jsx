import { Col, Row } from 'react-bootstrap'

function ProgressStats({ stats }) {
  return (
    <Row className="g-3">
      {stats.map((stat) => (
        <Col key={stat.label} md={4}>
          <article className="metric-card">
            <p className="metric-label">{stat.label}</p>
            <p className="metric-value">{stat.value}</p>
            {stat.note ? <p className="metric-note">{stat.note}</p> : null}
          </article>
        </Col>
      ))}
    </Row>
  )
}

export default ProgressStats
