import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>
                Events for {selectedDate?.toLocaleDateString()}
            </DialogTitle>
            </DialogHeader>
            <ScrollArea className="mt-8 max-h-[60vh]">
            {events.length === 0 ? (
                <p className="text-center text-muted-foreground">No events for this day.</p>
            ) : (
                <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="border border-border p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{event.startTime} - {event.endTime}</p>
                    {event.description && <p className="text-sm mb-2">{event.description}</p>}
                    <div className="flex justify-end space-x-2 mt-2">
                        <Button onClick={() => onEdit(event)} variant="outline" size="sm">Edit</Button>
                        <Button onClick={() => onDelete(event.id)} variant="destructive" size="sm">Delete</Button>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </ScrollArea>
        </DialogContent>
        </Dialog>
    )
}

