import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

function MilestoneChecklist({ items, title, description }) {
  return (
    <section className="section-card h-100">
      <div className="section-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>

      <ListGroup variant="flush" className="checklist-list">
        {items.map((item) => (
          <ListGroup.Item
            key={`${item.title}-${item.label}`}
            className="d-flex gap-3 justify-content-between align-items-start"
          >
            <div className="checklist-copy">
              <h4>{item.title}</h4>
              {item.detail ? <p>{item.detail}</p> : null}
            </div>

            <Badge className={`status-badge status-${item.status}`}>{item.label}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </section>
  )
}

export default MilestoneChecklist
