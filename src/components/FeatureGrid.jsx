import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function FeatureGrid({ items }) {
  return (
    <Row className="g-3">
      {items.map((item) => (
        <Col key={item.title} md={4}>
          <Card className="section-card feature-card h-100">
            <Card.Body>
              {item.tag ? (
                <Badge bg="light" text="dark" className="mb-2">
                  {item.tag}
                </Badge>
              ) : null}
              <Card.Title as="h3" className="h5">
                {item.title}
              </Card.Title>
              {item.detail ? (
                <Card.Text className="text-muted">{item.detail}</Card.Text>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default FeatureGrid
