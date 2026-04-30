import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function ProgressStats({ stats }) {
  return (
    <Row className="g-3">
      {stats.map((stat) => (
        <Col key={stat.label} md={4}>
          <Card className="section-card stat-card h-100">
            <Card.Body>
              <p className="small-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              {stat.note ? <Card.Text className="text-muted">{stat.note}</Card.Text> : null}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default ProgressStats
