'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface EventTriggerNodeProps {
  data: {
    eventType: string
    eventValue: string
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function EventTriggerNode({ data, id, isConnectable }: EventTriggerNodeProps) {
  const [eventType, setEventType] = React.useState(data.eventType || '')
  const [eventValue, setEventValue] = React.useState(data.eventValue || '')

  React.useEffect(() => {
    setEventType(data.eventType || '')
    setEventValue(data.eventValue || '')
  }, [data.eventType, data.eventValue])

  const handleEventTypeChange = (newEventType: string) => {
    setEventType(newEventType)
    data.onChange(id, { eventType: newEventType, eventValue })
  }

  const handleEventValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEventValue = e.target.value
    setEventValue(newEventValue)
    data.onChange(id, { eventType, eventValue: newEventValue })
  }

  return (
    <div className="bg-vivid-cobalt/20 border-2 border-vivid-cobalt rounded-md p-4 w-64">
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">Event Trigger Node</h3>
      <Select onValueChange={handleEventTypeChange} value={eventType}>
        <SelectTrigger className="w-full mb-2">
          <SelectValue placeholder="Select event type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="time">Time-based</SelectItem>
          <SelectItem value="data">Data-based</SelectItem>
          <SelectItem value="user">User action</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Event value"
        value={eventValue}
        onChange={handleEventValueChange}
      />
    </div>
  )
}