import { useMemo, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { generateAssistantSuggestion, getTodayKey } from '../utils/planner'

const priorities = ['Low', 'Medium', 'High']

function buildInitialDraft(defaultDate, categories, initialDraft) {
  const baseDraft = {
    title: '',
    type: 'task',
    date: defaultDate || getTodayKey(),
    start: '09:00',
    end: '10:00',
    categoryId: categories[0]?.id ?? '',
    priority: 'Medium',
    details: '',
  }

  return initialDraft
    ? {
        ...baseDraft,
        ...initialDraft,
        categoryId: initialDraft.categoryId || baseDraft.categoryId,
      }
    : baseDraft
}

function PlannerItemForm({
  categories,
  defaultDate,
  initialDraft,
  onSubmit,
  submitLabel = 'Add item',
}) {
  const [draft, setDraft] = useState(() =>
    buildInitialDraft(defaultDate, categories, initialDraft),
  )
  const [error, setError] = useState('')

  const assistantSuggestion = useMemo(
    () => generateAssistantSuggestion(draft),
    [draft],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draft.title.trim()) {
      setError('Please enter a title.')
      return
    }

    if (draft.start >= draft.end) {
      setError('End time should be after start time.')
      return
    }

    onSubmit({
      ...draft,
      assistantSuggestion,
    })

    setError('')
    setDraft((currentDraft) => ({
      ...buildInitialDraft(currentDraft.date, categories),
      categoryId: currentDraft.categoryId,
    }))
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error ? <Alert variant="warning">{error}</Alert> : null}

      <div className="form-row-block">
        <Form.Group className="mb-3" controlId="plannerTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={draft.title}
            onChange={handleChange}
            placeholder="Example: Finish project outline"
          />
        </Form.Group>

        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="plannerType">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={draft.type} onChange={handleChange}>
                <option value="task">Task</option>
                <option value="event">Event</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="plannerCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="categoryId"
                value={draft.categoryId}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="form-row-block">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group controlId="plannerDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={draft.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="plannerStart">
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="time"
                name="start"
                value={draft.start}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="plannerEnd">
              <Form.Label>End</Form.Label>
              <Form.Control
                type="time"
                name="end"
                value={draft.end}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="form-row-block">
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="plannerPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={draft.priority}
                onChange={handleChange}
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="plannerDetails">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="details"
                value={draft.details}
                onChange={handleChange}
                placeholder="Optional notes, class info, or next steps"
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      <Alert variant="light" className="assistant-preview mt-3">
        <strong>Preset planner suggestion:</strong> {assistantSuggestion}
      </Alert>

      <div className="form-actions">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </Form>
  )
}

export default PlannerItemForm
