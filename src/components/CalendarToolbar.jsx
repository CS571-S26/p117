import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { formatMonthLabel } from '../utils/planner'

function CalendarToolbar({
  monthDate,
  searchTerm,
  categoryFilter,
  categories,
  onMonthChange,
  onToday,
  onSearchTermChange,
  onCategoryFilterChange,
  onShare,
}) {
  return (
    <div className="mb-4 flex shrink-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="m-0 text-2xl font-extrabold tracking-tight !text-[var(--color-text)] sm:text-3xl">
          {formatMonthLabel(monthDate)}
        </h1>

        <div className="flex items-center gap-2">
          <Button
            variant="outline-secondary"
            className="px-3"
            aria-label="Previous month"
            onClick={() => onMonthChange(-1)}
          >
            {'<'}
          </Button>
          <Button variant="outline-secondary" className="px-4" onClick={onToday}>
            Today
          </Button>
          <Button
            variant="outline-secondary"
            className="px-3"
            aria-label="Next month"
            onClick={() => onMonthChange(1)}
          >
            {'>'}
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_190px_auto] xl:w-auto xl:grid-cols-[minmax(260px,360px)_190px_auto]">
        <Form.Control
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search events or tasks..."
          aria-label="Search events or tasks"
        />

        <Form.Select
          value={categoryFilter}
          onChange={(event) => onCategoryFilterChange(event.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>

        <Button variant="outline-secondary" className="px-4" onClick={onShare}>
          Share
        </Button>
      </div>
    </div>
  )
}

export default CalendarToolbar
