"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPost } from "../actions"
import { useActionState, useEffect, useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

interface AddRecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type ActionState = {
  success: boolean
  error: Record<string, string[]>
  values: {
    title: string
    description: string
    category: string
    date: string
  }
}

const initialState: ActionState = {
  success: false,
  error: {},
  values: {
    title: '',
    description: '',
    category: '',
    date: ''
  }
}

export function AddRecordForm({ open, onOpenChange, onSuccess }: AddRecordModalProps) {
  const [category, setCategory] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, payload: FormData) => await createPost(payload),
    initialState
  )

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess();
    }
  }, [state.success, onSuccess])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>
            Create a new entry in your timeline. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={state.values.title} placeholder="Enter record title" />
                {typeof state.error === "object" && state.error?.title && !isPending && (
                <p className="text-sm text-red-600">{state.error.title}</p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={state.values.description} placeholder="Brief description" />
              {typeof state.error === "object" && state.error?.description && !isPending && (
                <p className="text-sm text-red-600">{state.error.description}</p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} defaultValue={state.values.category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {typeof state.error === "object" && state.error?.category && !isPending && (
                <p className="text-sm text-red-600">{state.error.category}</p>
                )}
              <input type="hidden" name="category" value={category} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Date</Label>
              <DatePicker value={date} onChange={(value) => setDate(value)} />
              {typeof state.error === "object" && state.error?.date && !isPending && (
              <p className="text-sm text-red-600">{state.error.date}</p>
              )}
              <input type="hidden" name="date" value={date?.toISOString().split('T')[0]} />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" placeholder="Enter tags separated by commas" />
            </div> */}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}