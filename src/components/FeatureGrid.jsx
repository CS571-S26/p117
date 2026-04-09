import { Col, Row } from 'react-bootstrap'

function FeatureGrid({ items }) {
  return (
    <Row className="g-3">
      {items.map((item) => (
        <Col key={item.title} md={4}>
          <article className="feature-card">
            {item.tag ? <span className="feature-tag">{item.tag}</span> : null}
            <h3>{item.title}</h3>
            {item.detail ? <p>{item.detail}</p> : null}
          </article>
        </Col>
      ))}
    </Row>
  )
}

export default FeatureGrid
