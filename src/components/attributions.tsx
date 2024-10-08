"use client"

import React from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const attributions = [
  { name: "Next.js", url: "https://nextjs.org/", license: "MIT" },
  { name: "React", url: "https://reactjs.org/", license: "MIT" },
  { name: "React Flow", url: "https://reactflow.dev/", license: "MIT" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/", license: "MIT" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com/", license: "MIT" },
  { name: "Lucide React", url: "https://lucide.dev/", license: "ISC" },
  { name: "next-themes", url: "https://github.com/pacocoursey/next-themes", license: "MIT" },
  { name: "clsx", url: "https://github.com/lukeed/clsx", license: "MIT" },
  { name: "tailwind-merge", url: "https://github.com/dcastil/tailwind-merge", license: "MIT" },
  { name: "class-variance-authority", url: "https://cva.style/", license: "MIT" },
  { name: "Radix UI", url: "https://www.radix-ui.com/", license: "MIT" },
  { name: "date-fns", url: "https://date-fns.org/", license: "MIT" },
  { name: "cmdk", url: "https://cmdk.paco.me/", license: "MIT" },
  { name: "Embla Carousel", url: "https://www.embla-carousel.com/", license: "MIT" },
  { name: "Zod", url: "https://zod.dev/", license: "MIT" },
  { name: "React Hook Form", url: "https://react-hook-form.com/", license: "MIT" },
  { name: "Sonner", url: "https://sonner.emilkowal.ski/", license: "MIT" },
  { name: "Vaul", url: "https://vaul.emilkowal.ski/", license: "MIT" },
]

export function AttributionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 bg-background border-b">
        <h1 className="text-2xl font-bold">Attributions</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/">Back to Editor</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>User Preferences</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow p-6">
        <p className="mb-4">This application uses the following third-party packages and projects:</p>
        <ScrollArea className="h-[calc(100vh-200px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>License</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributions.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {item.url}
                    </a>
                  </TableCell>
                  <TableCell>{item.license}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </main>
    </div>
  )
}