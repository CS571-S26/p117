import Container from 'react-bootstrap/Container'
import CalendarWorkspace from '../components/CalendarWorkspace'

function CalendarPage({
  items,
  categories,
  isLoggedIn,
  onToggleItem,
  onDeleteItem,
  onAddItem,
}) {
  return (
    <Container
      fluid
      className="flex h-[calc(100vh-6.75rem)] min-h-[560px] overflow-hidden px-0 sm:px-3 xl:px-6"
    >
      <CalendarWorkspace
        items={items}
        categories={categories}
        isLoggedIn={isLoggedIn}
        onToggleItem={onToggleItem}
        onDeleteItem={onDeleteItem}
        onAddItem={onAddItem}
      />
    </Container>
  )
}

export default CalendarPage
