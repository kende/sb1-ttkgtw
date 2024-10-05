'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ImageNodeProps {
  data: {
    image: string | null
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function ImageNode({ data, id, isConnectable }: ImageNodeProps) {
  const [image, setImage] = React.useState<string | null>(data.image || null)

  const onImageUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = e.target?.result as string
        setImage(newImage)
        data.onChange(id, { image: newImage })
      }
      reader.readAsDataURL(file)
    }
  }, [id, data])

  React.useEffect(() => {
    setImage(data.image)
  }, [data.image])

  return (
    <div className="bg-electric-blue/20 border-2 border-electric-blue rounded-md p-4 w-64">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">Image Node</h3>
      {image ? (
        <img src={image} alt="Uploaded" className="w-full h-40 object-cover mb-2 rounded" />
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center mb-2 rounded">
          No image uploaded
        </div>
      )}
      <Input type="file" accept="image/*" onChange={onImageUpload} className="mb-2" />
      <Button onClick={() => {
        setImage(null)
        data.onChange(id, { image: null })
      }} variant="outline" className="w-full">
        Clear Image
      </Button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}