import { useState } from "react"
import Calendar from "./components/Calendar"
import EventModal from "./components/EventModal"
import EventList from "./components/EventList"
import { Event } from "./type"


function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showEventList, setShowEventList] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

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
    setEvents(events.filter(event => event.id !== eventId))
  }

  const handleSaveEvent = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === event.id ? event : e))
    } else {
      setEvents([...events, event])
    }
    setShowEventModal(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dynamic Event Calendar</h1>
      <Calendar 
        events={events}
        onDateClick={handleDateClick}
        onAddEvent={handleAddEvent}
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
          events={events.filter(event => 
            event.date.toDateString() === selectedDate?.toDateString()
          )}
          onClose={() => setShowEventList(false)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  )
}

export default App
