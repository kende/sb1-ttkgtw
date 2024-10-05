'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface APIIntegrationNodeProps {
  data: {
    apiUrl: string
    method: string
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function APIIntegrationNode({ data, id, isConnectable }: APIIntegrationNodeProps) {
  const [apiUrl, setApiUrl] = React.useState(data.apiUrl || '')
  const [method, setMethod] = React.useState(data.method || 'GET')

  React.useEffect(() => {
    setApiUrl(data.apiUrl || '')
    setMethod(data.method || 'GET')
  }, [data.apiUrl, data.method])

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiUrl = e.target.value
    setApiUrl(newApiUrl)
    data.onChange(id, { apiUrl: newApiUrl, method })
  }

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod)
    data.onChange(id, { apiUrl, method: newMethod })
  }

  return (
    <div className="bg-warm-purple/20 border-2 border-warm-purple rounded-md p-4 w-64">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">API Integration Node</h3>
      <Input
        placeholder="API URL"
        value={apiUrl}
        onChange={handleApiUrlChange}
        className="mb-2"
      />
      <Select onValueChange={handleMethodChange} value={method}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="HTTP Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GET">GET</SelectItem>
          <SelectItem value="POST">POST</SelectItem>
          <SelectItem value="PUT">PUT</SelectItem>
          <SelectItem value="DELETE">DELETE</SelectItem>
        </SelectContent>
      </Select>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}