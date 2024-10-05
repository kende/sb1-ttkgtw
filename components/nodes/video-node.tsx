'use client'

import * as React from 'react'
import { Handle, Position } from 'reactflow'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface VideoNodeProps {
  data: {
    videoUrl: string
    onChange: (id: string, newData: object) => void
  }
  id: string
  isConnectable: boolean
}

export function VideoNode({ data, id, isConnectable }: VideoNodeProps) {
  const [videoUrl, setVideoUrl] = React.useState(data.videoUrl || '')
  const [videoId, setVideoId] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    setVideoUrl(data.videoUrl || '')
    extractVideoId(data.videoUrl || '')
  }, [data.videoUrl])

  const extractVideoId = (url: string) => {
    if (!url) {
      setVideoId('')
      setError('')
      return
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      setVideoId(match[2])
      setError('')
    } else {
      setVideoId('')
      setError('Invalid YouTube URL')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    extractVideoId(videoUrl)
    data.onChange(id, { videoUrl })
  }

  return (
    <div className="bg-neon-pink/20 border-2 border-neon-pink rounded-md p-4 w-64">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <h3 className="text-lg font-semibold mb-2">Video Node</h3>
      <form onSubmit={handleSubmit}>
        <Input
          type="url"
          placeholder="Enter YouTube video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mb-2"
        />
        <Button type="submit" className="w-full mb-2">Load Video</Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {videoId && (
        <div className="mt-2">
          <iframe
            width="100%"
            height="150"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )
}