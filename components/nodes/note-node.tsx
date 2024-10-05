'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Textarea } from '@/components/ui/textarea'

interface NoteNodeProps {
  data: {
    note: string
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function NoteNode({ data, id, isConnectable }: NoteNodeProps) {
  const [note, setNote] = React.useState(data.note || '')

  React.useEffect(() => {
    setNote(data.note || '')
  }, [data.note])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value
    setNote(newNote)
    data.onChange(id, { note: newNote })
  }

  return (
    <div className="bg-phosphor-green/20 border-2 border-phosphor-green rounded-md p-4 w-64">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">Note Node</h3>
      <Textarea
        placeholder="Enter your note here..."
        value={note}
        onChange={handleChange}
        rows={4}
      />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}