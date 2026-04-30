import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { buildAiPlannerSuggestion, formatDisplayDate, formatTime } from '../utils/planner'

const priorities = ['Low', 'Medium', 'High']

function AiAssistedAddForm({
  items,
  categories,
  defaultDate,
  onAccept,
  onEditManually,
}) {
  const [request, setRequest] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [deadline, setDeadline] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = () => {
    if (!request.trim()) {
      setError('Enter what you need to plan first.')
      return
    }

    setError('')
    setSuggestion(
      buildAiPlannerSuggestion({
        request,
        priority,
        deadline,
        selectedDate: defaultDate,
        items,
        categories,
      }),
    )
  }

  return (
    <div>
      {error ? <Alert variant="warning">{error}</Alert> : null}

      <Alert variant="light" className="assistant-preview">
        This demo uses preset planning rules, not a real AI API.
      </Alert>

      <Form.Group className="mb-3" controlId="aiPlannerRequest">
        <Form.Label>What do you need to plan?</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={request}
          onChange={(event) => setRequest(event.target.value)}
          placeholder="Example: Study for math exam by Friday"
        />
      </Form.Group>

      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="aiPlannerPriority">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {priorities.map((nextPriority) => (
                <option key={nextPriority} value={nextPriority}>
                  {nextPriority}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="aiPlannerDeadline">
            <Form.Label>Deadline</Form.Label>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="mt-3">
        <Button type="button" variant="primary" onClick={handleGenerate}>
          Generate suggestion
        </Button>
      </div>

      {suggestion ? (
        <section className="mt-3 rounded-2xl border border-[rgba(59,70,80,0.28)] bg-[rgba(42,49,56,0.36)] p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge bg="success">Preset suggestion</Badge>
            <Badge bg={suggestion.draft.type === 'task' ? 'secondary' : 'dark'}>
              {suggestion.draft.type}
            </Badge>
            <Badge bg="primary">{suggestion.draft.priority}</Badge>
          </div>

          <p className="mb-1 text-lg font-extrabold !text-[var(--color-text)]">
            {suggestion.title}
          </p>
          <p className="mb-2 text-sm !text-[var(--color-text-muted)]">
            {formatDisplayDate(suggestion.date)} · {formatTime(suggestion.start)} -{' '}
            {formatTime(suggestion.end)}
          </p>
          <p className="mb-3 text-sm !text-[var(--color-text)]">
            {suggestion.explanation}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => onAccept(suggestion.draft)}
            >
              Add suggested item
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => onEditManually(suggestion.draft)}
            >
              Edit manually
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default AiAssistedAddForm
