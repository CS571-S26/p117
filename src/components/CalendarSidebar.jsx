import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { formatDisplayDate, formatTime, getCategory } from '../utils/planner'

function CalendarSidebar({
  isLoggedIn,
  selectedDate,
  selectedItems,
  selectedInsight,
  categories,
  onOpenCreateForm,
  onToggleItem,
  onDeleteItem,
}) {
  return (
    <aside className="flex min-h-0 min-w-0 shrink-0 flex-col gap-3 overflow-y-auto border-b border-[rgba(59,70,80,0.35)] bg-[rgba(20,27,33,0.68)] p-4 sm:p-5 xl:w-[360px] xl:border-b-0 xl:border-r">
      <Button
        variant="primary"
        className="w-full py-3 text-base shadow-[0_14px_30px_rgba(94,140,123,0.18)]"
        onClick={onOpenCreateForm}
      >
        + Add item
      </Button>

      {!isLoggedIn ? (
        <div className="rounded-full border border-[rgba(59,70,80,0.24)] bg-[rgba(42,49,56,0.24)] px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] !text-[var(--color-text-muted)]">
          Demo mode - editing locked
        </div>
      ) : null}

      <section className="rounded-2xl border border-[rgba(59,70,80,0.24)] bg-[rgba(42,49,56,0.34)] p-4">
        <p className="small-label">Selected date</p>
        <p className="m-0 text-xl font-extrabold !text-[var(--color-text)]">
          {formatDisplayDate(selectedDate)}
        </p>
        <p className="mb-0 mt-1 text-sm !text-[var(--color-text-muted)]">
          {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}
        </p>
      </section>

      <section className="rounded-2xl border border-[rgba(59,70,80,0.22)] border-l-[3px] border-l-[rgba(127,175,154,0.48)] bg-[linear-gradient(145deg,rgba(127,175,154,0.1),rgba(42,49,56,0.28))] p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="small-label mb-0">Demo AI insight</p>
          <Badge bg="success">Preset</Badge>
        </div>
        <p className="mb-0 text-sm font-semibold leading-relaxed !text-[var(--color-text)]">
          {selectedInsight}
        </p>
      </section>

      <section className="min-h-0 rounded-2xl border border-[rgba(59,70,80,0.22)] bg-[rgba(42,49,56,0.28)] p-4">
        <div className="mb-2 flex items-center justify-between gap-3 border-b border-[rgba(59,70,80,0.24)] pb-3">
          <p className="small-label mb-0">Today's plan</p>
          <span className="text-sm !text-[var(--color-text-muted)]">
            {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}
          </span>
        </div>

        {selectedItems.length ? (
          <div className="divide-y divide-[rgba(170,180,190,0.08)]">
            {selectedItems.map((item) => {
              const category = getCategory(categories, item.categoryId)

              return (
                <article key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-2 h-2 w-2 shrink-0 rounded-full bg-${category.variant}`}
                      aria-hidden="true"
                    />
                    <Form.Check
                      checked={item.completed}
                      disabled={!isLoggedIn}
                      onChange={() => onToggleItem(item.id)}
                      aria-label={`Mark ${item.title} complete`}
                      className="mt-0.5 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center">
                        <strong
                          className={`truncate text-sm !text-[var(--color-text)] ${
                            item.completed ? 'completed-item' : ''
                          }`}
                        >
                          {item.title}
                        </strong>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs !text-[var(--color-text-muted)]">
                        <Badge bg={item.type === 'task' ? 'secondary' : 'dark'}>
                          {item.type}
                        </Badge>
                        <span>
                          {formatTime(item.start)} - {formatTime(item.end)}
                        </span>
                        <span aria-hidden="true">|</span>
                        <span>{item.priority}</span>
                      </div>
                    </div>

                    {isLoggedIn ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="shrink-0 p-0 text-xs !text-[#f0a2a2]"
                        onClick={() => onDeleteItem(item.id)}
                      >
                        Del
                      </Button>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="mb-0 text-sm !text-[var(--color-text-muted)]">
            No items for this date.
          </p>
        )}
      </section>
    </aside>
  )
}

export default CalendarSidebar
