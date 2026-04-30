import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import { formatDisplayDate, formatTime, getCategory } from '../utils/planner'

function PlannerItemList({
  items,
  categories,
  emptyText = 'No planner items yet.',
  onToggleItem,
  onDeleteItem,
  showDate = true,
}) {
  if (!items.length) {
    return <p className="text-muted mb-0">{emptyText}</p>
  }

  return (
    <ListGroup variant="flush" className="planner-list">
      {items.map((item) => {
        const category = getCategory(categories, item.categoryId)

        return (
          <ListGroup.Item key={item.id} className="planner-list-item">
            <div className="planner-item-main">
              {onToggleItem ? (
                <Form.Check
                  checked={item.completed}
                  onChange={() => onToggleItem(item.id)}
                  aria-label={`Mark ${item.title} complete`}
                />
              ) : null}

              <div>
                <div className="planner-item-title-row">
                  <strong className={item.completed ? 'completed-item' : ''}>
                    {item.title}
                  </strong>
                  <Badge bg={category.variant}>{category.name}</Badge>
                  <Badge bg={item.type === 'task' ? 'secondary' : 'dark'}>
                    {item.type}
                  </Badge>
                </div>

                <p className="planner-item-meta">
                  {showDate ? `${formatDisplayDate(item.date)} at ` : ''}
                  {formatTime(item.start)} - {formatTime(item.end)}
                  {' | '}
                  {item.priority} priority
                </p>

                {item.details ? (
                  <p className="planner-item-detail">{item.details}</p>
                ) : null}

                {item.assistantSuggestion ? (
                  <p className="assistant-note">{item.assistantSuggestion}</p>
                ) : null}
              </div>
            </div>

            {onDeleteItem ? (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDeleteItem(item.id)}
              >
                Delete
              </Button>
            ) : null}
          </ListGroup.Item>
        )
      })}
    </ListGroup>
  )
}

export default PlannerItemList
