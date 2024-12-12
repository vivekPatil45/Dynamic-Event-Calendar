import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Event } from '@/type'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface CalendarProps {
  events: Event[]
  onDateClick: (date: Date) => void
  onAddEvent: () => void
  onFilterEvents: (keyword: string) => void
  onExportEvents: (format: 'json' | 'csv') => void
  onUpdateEvent: (event: Event) => void
}

export default function Calendar({ events, onDateClick, onAddEvent, onFilterEvents, onExportEvents, onUpdateEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  // Navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  // Navigate to the next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle dragging and dropping of events onto a new date

  const handleEventDrop = (event: Event, newDate: Date) => {
    const updatedEvent = { ...event, date: newDate }
    onUpdateEvent(updatedEvent)
  }

  // Draggable Event component that can be moved between calendar days
  const DraggableEvent = ({ event }: { event: Event }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'EVENT',
      item: { event },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }))

    const colorClass = event.color || 'bg-primary'

    return (
      <div
        ref={drag}
        className={`text-xs truncate cursor-move p-1 rounded mb-1 ${colorClass} ${isDragging ? 'opacity-50' : ''}`}
      >
        {event.name}
      </div>
    )
  }

  // Calendar day cell that displays a date and its associated events
  const CalendarDay = ({ date, dayEvents }: { date: Date, dayEvents: Event[] }) => {
    const [, drop] = useDrop(() => ({
      accept: 'EVENT',
      drop: (item: { event: Event }) => handleEventDrop(item.event, date),
    }))

    const isToday = date.toDateString() === new Date().toDateString()
    const isCurrentMonth = date.getMonth() === currentDate.getMonth()

    return (
      <div
        ref={drop}
        className={`min-h-[100px] border border-border p-1 transition-colors duration-200 ease-in-out
  ${isToday ? 'bg-primary/20' : ''}
  ${isCurrentMonth ? '' : 'opacity-50'}
  hover:bg-secondary/20 hover:shadow-md`}
        onClick={() => onDateClick(date)}
      >
        <div className={`font-bold text-sm ${isToday ? 'text-primary' : ''}`}>{date.getDate()}</div>
        <div className="space-y-1 mt-1">
          {dayEvents.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </div>
      </div>
    )
  }

  const renderCalendarDays = () => {
    const days = []
    const totalDays = 42 // 6 weeks
    const lastMonthDays = firstDayOfMonth
    const nextMonthDays = totalDays - daysInMonth - lastMonthDays

    // Previous month days
    for (let i = lastMonthDays - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - i)
      const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
      days.push(
        <CalendarDay key={`prev-${i}`} date={date} dayEvents={dayEvents} />
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
      days.push(
        <CalendarDay key={day} date={date} dayEvents={dayEvents} />
      )
    }

    // Next month days
    for (let i = 1; i <= nextMonthDays; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
      days.push(
        <CalendarDay key={`next-${i}`} date={date} dayEvents={dayEvents} />
      )
    }

    return days
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
              <Input
                placeholder="Filter events"
                onChange={(e) => onFilterEvents(e.target.value)}
                className="w-full sm:w-40"
              />
              <Button onClick={prevMonth} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextMonth} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button onClick={onAddEvent} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button onClick={() => onExportEvents('json')} variant="outline" size="sm">
                Export JSON
              </Button>
              <Button onClick={() => onExportEvents('csv')} variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-bold text-center text-sm">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>
    </DndProvider>
  )
}

