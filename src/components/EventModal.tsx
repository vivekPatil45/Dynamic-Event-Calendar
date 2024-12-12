import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                Name
                </Label>
                <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-time" className="text-right">
                Start Time
                </Label>
                <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-time" className="text-right">
                End Time
                </Label>
                <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                Description
                </Label>
                <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                Color
                </Label>
                <Select value={color} onValueChange={setColor}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            <div className="flex justify-end">
            <Button onClick={handleSave}>Save</Button>
            </div>
        </DialogContent>
        </Dialog>
    )
}

