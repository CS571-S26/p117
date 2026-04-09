import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function PageHeader({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className="page-header">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {description ? <p className="page-header-copy">{description}</p> : null}

      {(primaryAction || secondaryAction) && (
        <div className="page-header-actions">
          {primaryAction ? (
            <Button as={Link} to={primaryAction.to} variant="primary">
              {primaryAction.label}
            </Button>
          ) : null}

          {secondaryAction ? (
            <Button as={Link} to={secondaryAction.to} variant="outline-secondary">
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      )}
    </section>
  )
}

export default PageHeader
