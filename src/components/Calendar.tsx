import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Event } from '@/type'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Input } from '@/components/ui/input'

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

    const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const handleEventDrop = (event: Event, newDate: Date) => {
      const updatedEvent = { ...event, date: newDate }
      onUpdateEvent(updatedEvent)
    }

    const DraggableEvent = ({ event }: { event: Event }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: 'EVENT',
        item: { event },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging(),
        }),
      }))

      return (
        <div
          ref={drag}
          className={`text-xs truncate cursor-move ${isDragging ? 'opacity-50' : ''}`}
          style={{ backgroundColor: event.color || 'lightblue' }}
        >
          {event.name}
        </div>
      )
    }

    const CalendarDay = ({ date, dayEvents }: { date: Date, dayEvents: Event[] }) => {
      const [, drop] = useDrop(() => ({
        accept: 'EVENT',
        drop: (item: { event: Event }) => handleEventDrop(item.event, date),
      }))

      const isToday = date.toDateString() === new Date().toDateString()

      return (
        <div
          ref={drop}
          className={`h-24 border p-1 cursor-pointer ${isToday ? 'bg-blue-100' : ''}`}
          onClick={() => onDateClick(date)}
        >
          <div className="font-bold">{date.getDate()}</div>
          {dayEvents.map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
        </div>
      )
    }

    const renderCalendarDays = () => {
      const days = []
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-24"></div>)
      }
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
        days.push(
          <CalendarDay key={day} date={date} dayEvents={dayEvents} />
        )
      }
      return days
    }

    return (
      <DndProvider backend={HTML5Backend}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Filter events"
                onChange={(e) => onFilterEvents(e.target.value)}
                className="w-40"
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
              <Button onClick={() => onExportEvents('json')} variant="outline">
                Export JSON
              </Button>
              <Button onClick={() => onExportEvents('csv')} variant="outline">
                Export CSV
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-bold text-center">{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      </DndProvider>
    )
}

