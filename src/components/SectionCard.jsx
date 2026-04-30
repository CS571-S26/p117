import Card from 'react-bootstrap/Card'

function SectionCard({ title, description, children, className = '' }) {
  return (
    <Card className={`section-card ${className}`.trim()}>
      <Card.Body>
        {(title || description) && (
          <div className="section-heading">
            {title ? <Card.Title as="h2">{title}</Card.Title> : null}
            {description ? (
              <Card.Text className="text-muted">{description}</Card.Text>
            ) : null}
          </div>
        )}

        {children}
      </Card.Body>
    </Card>
  )
}

export default SectionCard
