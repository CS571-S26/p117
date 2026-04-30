import { useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AiAssistedAddForm from './AiAssistedAddForm'
import CalendarGrid from './CalendarGrid'
import CalendarSidebar from './CalendarSidebar'
import CalendarToolbar from './CalendarToolbar'
import PlannerItemForm from './PlannerItemForm'
import {
  buildMonthDays,
  getMonthKey,
  getTodayKey,
  groupItemsByDate,
  shiftMonthKey,
} from '../utils/planner'

function CalendarWorkspace({
  items,
  categories,
  isLoggedIn,
  onToggleItem,
  onDeleteItem,
  onAddItem,
}) {
  const todayKey = getTodayKey()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedDate = searchParams.get('date')
  const initialSelectedDate = useMemo(() => {
    if (requestedDate) {
      return requestedDate
    }

    const nextOpenItem = items.find(
      (item) => !item.completed && item.date >= todayKey,
    )

    return nextOpenItem?.date ?? items.find((item) => !item.completed)?.date ?? todayKey
  }, [items, requestedDate, todayKey])
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate)
  const [monthDate, setMonthDate] = useState(getMonthKey(initialSelectedDate))
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(
    isLoggedIn && searchParams.get('create') === '1',
  )
  const [showShareMessage, setShowShareMessage] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(
    !isLoggedIn && searchParams.get('create') === '1',
  )
  const [activeCreateTab, setActiveCreateTab] = useState('manual')
  const [manualDraft, setManualDraft] = useState(null)
  const [manualDraftVersion, setManualDraftVersion] = useState(0)

  const visibleItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return items.filter((item) => {
      const matchesSearch = normalizedSearch
        ? `${item.title} ${item.details}`.toLowerCase().includes(normalizedSearch)
        : true
      const matchesCategory =
        categoryFilter === 'all' ? true : item.categoryId === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [items, searchTerm, categoryFilter])

  const itemsByDate = useMemo(() => groupItemsByDate(visibleItems), [visibleItems])
  const selectedItems = itemsByDate[selectedDate] ?? []
  const monthDays = buildMonthDays(monthDate)
  const currentMonth = new Date(`${monthDate}T00:00:00`).getMonth()
  const selectedHighPriority = selectedItems.some(
    (item) => item.priority === 'High' && !item.completed,
  )
  const selectedInsight =
    selectedItems.length === 0
      ? 'This day is open. Add a task manually or use AI-assisted add.'
      : selectedHighPriority
        ? 'Start with the high-priority item first.'
        : selectedItems.length <= 2
          ? 'This is a lighter day, so it may be a good place for a focused work block.'
          : 'This day is busy. Avoid adding another long task unless it is urgent.'

  const handleSelectDate = (dateKey) => {
    setSelectedDate(dateKey)
    setMonthDate(getMonthKey(dateKey))
  }

  const handleMonthChange = (amount) => {
    const nextMonth = shiftMonthKey(monthDate, amount)
    setMonthDate(nextMonth)
    setSelectedDate(nextMonth)
  }

  const handleToday = () => {
    setSelectedDate(todayKey)
    setMonthDate(getMonthKey(todayKey))
  }

  const closeCreateForm = () => {
    setShowCreateForm(false)
    if (searchParams.get('create') === '1') {
      setSearchParams({})
    }
  }

  const openCreateForm = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }

    setActiveCreateTab('manual')
    setManualDraft(null)
    setManualDraftVersion((currentVersion) => currentVersion + 1)
    setShowCreateForm(true)
  }

  const handleAddItem = (draft) => {
    const newItem = onAddItem(draft)
    if (!newItem) {
      setShowLoginPrompt(true)
      return
    }

    handleSelectDate(newItem.date)
    closeCreateForm()
  }

  const handleEditSuggestedItem = (draft) => {
    setManualDraft(draft)
    setManualDraftVersion((currentVersion) => currentVersion + 1)
    setActiveCreateTab('manual')
  }

  return (
    <>
      <section className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[rgba(18,25,30,0.72)] shadow-[0_24px_80px_rgba(7,10,13,0.18)] xl:flex-row xl:rounded-[22px]">
        <CalendarSidebar
          isLoggedIn={isLoggedIn}
          selectedDate={selectedDate}
          selectedItems={selectedItems}
          selectedInsight={selectedInsight}
          categories={categories}
          onOpenCreateForm={openCreateForm}
          onToggleItem={onToggleItem}
          onDeleteItem={onDeleteItem}
        />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col p-4 sm:p-5 xl:p-6">
          <CalendarToolbar
            monthDate={monthDate}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            categories={categories}
            onMonthChange={handleMonthChange}
            onToday={handleToday}
            onSearchTermChange={setSearchTerm}
            onCategoryFilterChange={setCategoryFilter}
            onShare={() => setShowShareMessage(true)}
          />

          <CalendarGrid
            monthDays={monthDays}
            itemsByDate={itemsByDate}
            categories={categories}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            todayKey={todayKey}
            onSelectDate={handleSelectDate}
          />
        </main>
      </section>

      <Modal
        show={showCreateForm}
        onHide={closeCreateForm}
        size="lg"
        centered
        contentClassName="planner-create-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            activeKey={activeCreateTab}
            onSelect={(nextTab) => setActiveCreateTab(nextTab ?? 'manual')}
            className="planner-create-tabs mb-3"
          >
            <Tab eventKey="manual" title="Manual">
              <PlannerItemForm
                key={`${selectedDate}-${manualDraftVersion}`}
                categories={categories}
                defaultDate={selectedDate}
                initialDraft={manualDraft}
                onSubmit={handleAddItem}
              />
            </Tab>
            <Tab eventKey="ai" title="AI-assisted">
              <AiAssistedAddForm
                items={visibleItems}
                categories={categories}
                defaultDate={selectedDate}
                onAccept={handleAddItem}
                onEditManually={handleEditSuggestedItem}
              />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      <Modal
        show={showShareMessage}
        onHide={() => setShowShareMessage(false)}
        centered
        contentClassName="planner-create-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Share calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 text-[var(--color-text-muted)]">
            Sharing is a placeholder for this milestone.
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showLoginPrompt}
        onHide={() => setShowLoginPrompt(false)}
        centered
        contentClassName="planner-create-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Log in to edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0 text-[var(--color-text-muted)]">
            You are viewing the demo calendar. Log in to add, complete, or delete
            planner items.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowLoginPrompt(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowLoginPrompt(false)
              navigate('/login')
            }}
          >
            Go to login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CalendarWorkspace
