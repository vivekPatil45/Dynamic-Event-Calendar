import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Event } from '@/type'

interface EventModalProps {
  selectedDate: Date | null
  onClose: () => void
  onSave: (event: Event) => void
  editingEvent: Event | null
}

export default function EventModal({ selectedDate, onClose, onSave, editingEvent }: EventModalProps) {
    const [name, setName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [description, setDescription] = useState('')
    const [color, setColor] = useState('')

    useEffect(() => {
        if (editingEvent) {
        setName(editingEvent.name)
        setStartTime(editingEvent.startTime)
        setEndTime(editingEvent.endTime)
        setDescription(editingEvent.description || '')
        setColor(editingEvent.color || '')
        }
    }, [editingEvent])

    const handleSave = () => {
        if (!selectedDate) return
        const event: Event = {
        id: editingEvent ? editingEvent.id : Date.now().toString(),
        date: selectedDate,
        name,
        startTime,
        endTime,
        description,
        color
        }
        onSave(event)
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
            <Input
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="flex gap-4">
                <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                />
                <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
            <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="lightblue">Work</SelectItem>
                <SelectItem value="lightgreen">Personal</SelectItem>
                <SelectItem value="lightpink">Other</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleSave}>Save</Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}

