import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'

function LoginPage({ isLoggedIn, onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin()
    navigate('/calendar')
  }

  return (
    <Container>
      <section className="login-page mx-auto">
        <div className="create-heading">
          <p className="eyebrow">Login</p>
          <h1>Student login.</h1>
        </div>

        <div className="login-panel">
          <Alert variant={isLoggedIn ? 'success' : 'info'}>
            {isLoggedIn
              ? 'You are logged in. Planner edits save in this browser.'
              : 'Local demo login for the milestone. No real account or backend is used.'}
          </Alert>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.edu"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Demo login
            </Button>
          </Form>
        </div>
      </section>
    </Container>
  )
}

export default LoginPage
