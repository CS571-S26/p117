import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { Link, useSearchParams } from 'react-router-dom'
import PlannerItemForm from '../components/PlannerItemForm'

function CreatePage({ categories, onAddItem }) {
  const [searchParams] = useSearchParams()
  const [createdItem, setCreatedItem] = useState(null)
  const defaultDate = searchParams.get('date')

  const handleAddItem = (draft) => {
    const newItem = onAddItem(draft)
    setCreatedItem(newItem)
  }

  return (
    <Container>
      <section className="create-page">
        <div className="create-heading">
          <p className="eyebrow">Create</p>
          <h1>Add work.</h1>
          <Button as={Link} to="/calendar" variant="outline-secondary">
            Back to calendar
          </Button>
        </div>

        <div className="create-panel">
          {createdItem ? (
            <Alert variant="success">
              Added <strong>{createdItem.title}</strong>.{' '}
              <Button as={Link} to="/calendar" variant="link" className="p-0">
                View calendar
              </Button>
            </Alert>
          ) : null}

          <PlannerItemForm
            key={defaultDate || 'default'}
            categories={categories}
            defaultDate={defaultDate}
            onSubmit={handleAddItem}
          />
        </div>
      </section>
    </Container>
  )
}

export default CreatePage
