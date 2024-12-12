import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import EventList from './components/EventList'
import { Event } from '@/type'
import saveAs from 'file-saver'

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showEventList, setShowEventList] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  

  // Load events from localStorage when the component mounts
  useEffect(() => {
    const loadEvents = () => {
      const storedEvents = localStorage.getItem('events')
      console.log('Stored events from localStorage:', storedEvents)
      
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({
            ...event,
            date: new Date(event.date)
          }))
          console.log('Parsed events:', parsedEvents)
          setEvents(parsedEvents)
          setFilteredEvents(parsedEvents)
        } catch (error) {
          console.error('Error parsing stored events:', error)
        }
      }
    }

    loadEvents()
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    console.log('Saving events to localStorage:', events)
    localStorage.setItem('events', JSON.stringify(events))
    setFilteredEvents(events)
  }, [events])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setShowEventList(true)
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowEventModal(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEventModal(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
  }

  const handleSaveEvent = (event: Event) => {
    const overlappingEvent = events.find(e => 
      e.date.toDateString() === event.date.toDateString() &&
      e.id !== event.id &&
      ((event.startTime >= e.startTime && event.startTime < e.endTime) ||
       (event.endTime > e.startTime && event.endTime <= e.endTime) ||
       (event.startTime <= e.startTime && event.endTime >= e.endTime))
    )
    
    if (overlappingEvent) {
      alert('This event overlaps with an existing event. Please choose a different time.')
      return
    }

    setEvents(prevEvents => {
      const updatedEvents = editingEvent
        ? prevEvents.map(e => e.id === event.id ? event : e)
        : [...prevEvents, event];
      console.log('Updated events after save:', updatedEvents);
      return updatedEvents;
    })
    setShowEventModal(false)
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e);
      console.log('Updated events after drag-and-drop:', newEvents);
      return newEvents;
    })
  }

  const handleFilterEvents = (keyword: string) => {
    const filtered = events.filter(event =>
      event.name.toLowerCase().includes(keyword.toLowerCase()) ||
      event.description?.toLowerCase().includes(keyword.toLowerCase())
    )
    setFilteredEvents(filtered)
  }

  const handleExportEvents = (format: 'json' | 'csv') => {
    const currentDate = new Date()
    const currentMonthEvents = events.filter(
      event => event.date.getMonth() === currentDate.getMonth() &&
               event.date.getFullYear() === currentDate.getFullYear()
    )

    if (format === 'json') {
      const jsonString = JSON.stringify(currentMonthEvents, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      saveAs(blob, `events_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.json`)
    } else {
      const csvContent = [
        'Date,Name,Start Time,End Time,Description,Color',
        ...currentMonthEvents.map(event => 
          `${event.date.toISOString()},${event.name},${event.startTime},${event.endTime},${event.description || ''},${event.color || ''}`
        )
      ].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, `events_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.csv`)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex ">
          <h1 className="text-2xl font-bold">Dynamic Event Calendar</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 bg-gray-100">
        <Calendar 
          events={filteredEvents}
          onDateClick={handleDateClick}
          onAddEvent={handleAddEvent}
          onFilterEvents={handleFilterEvents}
          onExportEvents={handleExportEvents}
          onUpdateEvent={handleUpdateEvent}
        />
        {showEventModal && (
          <EventModal
            selectedDate={selectedDate}
            onClose={() => setShowEventModal(false)}
            onSave={handleSaveEvent}
            editingEvent={editingEvent}
          />
        )}
        {showEventList && (
          <EventList
            selectedDate={selectedDate}
            events={filteredEvents.filter(event => 
              event.date.toDateString() === selectedDate?.toDateString()
            )}
            onClose={() => setShowEventList(false)}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </main>
    </div>
  )
}

