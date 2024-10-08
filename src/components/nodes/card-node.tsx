'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CardNodeProps {
  data: {
    title: string
    content: string
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function CardNode({ data, id, isConnectable }: CardNodeProps) {
  const [title, setTitle] = React.useState(data.title || '')
  const [content, setContent] = React.useState(data.content || '')

  React.useEffect(() => {
    setTitle(data.title || '')
    setContent(data.content || '')
  }, [data.title, data.content])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    data.onChange(id, { title: newTitle, content })
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    data.onChange(id, { title, content: newContent })
  }

  return (
    <div className="bg-amber/20 border-2 border-amber rounded-md p-4 w-64">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">Card Node</h3>
      <Input
        placeholder="Card Title"
        value={title}
        onChange={handleTitleChange}
        className="mb-2"
      />
      <Textarea
        placeholder="Card Content"
        value={content}
        onChange={handleContentChange}
        rows={3}
      />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}