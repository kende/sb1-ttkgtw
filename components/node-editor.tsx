'use client'

import * as React from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Node,
  NodeChange,
  applyNodeChanges,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageNode } from '@/components/nodes/image-node'
import { VideoNode } from '@/components/nodes/video-node'
import { NoteNode } from '@/components/nodes/note-node'
import { CardNode } from '@/components/nodes/card-node'
import { EventTriggerNode } from '@/components/nodes/event-trigger-node'
import { APIIntegrationNode } from '@/components/nodes/api-integration-node'
import { ThemeToggle } from '@/components/theme-toggle'
import { Settings, Image, Video, FileText, Layout, Zap, Globe, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const nodeTypes = {
  imageNode: ImageNode,
  videoNode: VideoNode,
  noteNode: NoteNode,
  cardNode: CardNode,
  eventTriggerNode: EventTriggerNode,
  apiIntegrationNode: APIIntegrationNode,
}

const proOptions = { hideAttribution: true }

const nodeColors = {
  imageNode: 'bg-electric-blue/20',
  videoNode: 'bg-neon-pink/20',
  noteNode: 'bg-phosphor-green/20',
  cardNode: 'bg-amber/20',
  eventTriggerNode: 'bg-vivid-cobalt/20',
  apiIntegrationNode: 'bg-warm-purple/20',
}

const NodeEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [workflowName, setWorkflowName] = React.useState('Untitled Workflow')
  const [loadedFileName, setLoadedFileName] = React.useState('')
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { project } = useReactFlow()

  const onConnect = React.useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const updateNodeData = React.useCallback((nodeId: string, newData: object) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } }
        }
        return node
      })
    )
  }, [setNodes])

  const isOverlapping = (node1: Node, node2: Node) => {
    return (
      node1.position.x < node2.position.x + (node2.width || 200) &&
      node1.position.x + (node1.width || 200) > node2.position.x &&
      node1.position.y < node2.position.y + (node2.height || 200) &&
      node1.position.y + (node1.height || 200) > node2.position.y
    )
  }

  const findNonOverlappingPosition = (nodes: Node[], startX: number, startY: number, width: number, height: number): { x: number, y: number } => {
    const gridSize = 20
    const maxAttempts = 100
    let x = startX
    let y = startY

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let overlap = false

      for (const node of nodes) {
        if (isOverlapping({ position: { x, y }, width, height } as Node, node)) {
          overlap = true
          break
        }
      }

      if (!overlap) {
        return { x, y }
      }

      x += gridSize
      if (x > reactFlowWrapper.current!.clientWidth - width) {
        x = 0
        y += gridSize
      }
    }

    return { x: startX, y: startY }
  }

  const addNode = (type: string, position: { x: number, y: number }) => {
    const newNodeWidth = 200
    const newNodeHeight = 200

    const newPosition = findNonOverlappingPosition(nodes, position.x, position.y, newNodeWidth, newNodeHeight)

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: newPosition,
      data: { 
        label: `${type} node`,
        onChange: (id: string, newData: object) => updateNodeData(id, newData)
      },
      className: nodeColors[type as keyof typeof nodeColors],
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const handleNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = applyNodeChanges(changes, nds)
      
      // Check for collisions after node movement
      const movedNodes = changes.filter((change) => change.type === 'position' && change.dragging)
      if (movedNodes.length > 0) {
        return updatedNodes.map((node) => {
          if (movedNodes.some((movedNode) => movedNode.id === node.id)) {
            const otherNodes = updatedNodes.filter((n) => n.id !== node.id)
            const newPosition = findNonOverlappingPosition(otherNodes, node.position.x, node.position.y, node.width || 200, node.height || 200)
            return { ...node, position: newPosition }
          }
          return node
        })
      }
      
      return updatedNodes
    })
  }

  const saveWorkflow = () => {
    const workflow = { 
      nodes: nodes.map(node => ({
        ...node,
        data: { ...node.data, onChange: undefined }
      })), 
      edges, 
      name: workflowName 
    }
    const json = JSON.stringify(workflow)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${workflowName}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const workflow = JSON.parse(event.target?.result as string)
        const nodesWithOnChange = workflow.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onChange: (id: string, newData: object) => updateNodeData(id, newData)
          }
        }))
        setNodes(nodesWithOnChange)
        setEdges(workflow.edges)
        setWorkflowName(workflow.name)
        setLoadedFileName(file.name)
      }
      reader.readAsText(file)
    }
  }

  const handleLoadClick = () => {
    fileInputRef.current?.click()
  }

  const handleTitleChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = React.useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'string' && reactFlowBounds) {
        const position = project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })
        addNode(type, position)
      }
    },
    [project]
  )

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex items-center justify-between p-2 bg-background border-b">
        <div className="w-1/3 pl-4">
          <h1 className="agency-mind-logo">Agency Mind</h1>
        </div>
        <div className="flex flex-col items-center justify-center w-1/3">
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            onKeyDown={handleTitleChange}
            className="workflow-title"
          />
          {loadedFileName && (
            <span className="filename-text">
              {loadedFileName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 w-1/3 justify-end">
          <Button variant="ghost" size="icon" onClick={saveWorkflow} title="Save Workflow">
            <Save className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLoadClick} title="Load Workflow">
            <Upload className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <Input
            type="file"
            onChange={loadWorkflow}
            accept=".json"
            className="hidden"
            ref={fileInputRef}
          />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-soft-white dark:bg-near-black">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/attributions">Attributions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>User Preferences</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div ref={reactFlowWrapper} className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={proOptions}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
        <TooltipProvider>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'imageNode')}
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Image Node</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'videoNode')}
                >
                  <Video className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Video Node</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'noteNode')}
                >
                  <FileText className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Note Node</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'cardNode')}
                >
                  <Layout className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Card Node</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'eventTriggerNode')}
                >
                  <Zap className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Event Trigger Node</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  draggable
                  onDragStart={(event) => onDragStart(event, 'apiIntegrationNode')}
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add API Integration Node</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

const ResponsiveNodeEditor: React.FC = () => (
  <ReactFlowProvider>
    <NodeEditor />
  </ReactFlowProvider>
)

export default ResponsiveNodeEditor