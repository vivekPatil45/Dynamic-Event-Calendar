import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Event } from '@/type'

interface EventListProps {
    selectedDate: Date | null
    events: Event[]
    onClose: () => void
    onEdit: (event: Event) => void
    onDelete: (eventId: string) => void
}

export default function EventList({ selectedDate, events, onClose, onEdit, onDelete }: EventListProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>
                Events for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            {events.length === 0 ? (
                <p>No events for this day.</p>
            ) : (
                events.map(event => (
                <div key={event.id} className="border p-2 rounded">
                    <h3 className="font-bold">{event.name}</h3>
                    <p>{event.startTime} - {event.endTime}</p>
                    {event.description && <p>{event.description}</p>}
                    <div className="flex gap-2 mt-2">
                    <Button onClick={() => onEdit(event)} variant="outline" size="sm">Edit</Button>
                    <Button onClick={() => onDelete(event.id)} variant="destructive" size="sm">Delete</Button>
                    </div>
                </div>
                ))
            )}
            </div>
        </DialogContent>
        </Dialog>
    )
}

