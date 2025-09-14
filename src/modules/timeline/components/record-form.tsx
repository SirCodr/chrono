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
import { createPost, editPost } from "../actions"
import { useActionState, useEffect, useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { dateToTimestamptz } from "@/lib/utils"
import { Tables } from "@/lib/supabase/database.types"

interface RecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  record?: Tables<'records'>
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

const categories = [
  "Education",
  "Entertainment",
  "Finance",
  "Food",
  "Health",
  "Home",
  "Personal",
  "Shopping",
  "Social",
  "Transport",
  "Work"
];

function CategoryOptions({ categories }: { categories: string[] }) {
  return (
    categories.map((category) => (
      <SelectItem key={category} value={category}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </SelectItem>
    ))
  )
}

function SubmitButton({ isEditMode, isLoading } : { isEditMode: boolean, isLoading: boolean }) {
  const text = () => {
    if (isEditMode && isLoading) return 'Updating...'

    if (isEditMode && !isLoading) return 'Update Changes'

    if (!isEditMode && isLoading) return 'Adding...'

    return 'Add Record'
  }

  return (
    <Button type="submit" disabled={isLoading}>
      {text()}
    </Button>
  )
}

export function RecordForm({ record, open, onOpenChange, onSuccess }: RecordModalProps) {
  const initialState: ActionState = {
  success: false,
  error: {},
  values: {
    title: record?.title || '',
    description: record?.description || '',
    category: record?.category || '',
    date: record?.date || ''
  }
}

  const [category, setCategory] = useState<string>(initialState.values.category)
  const [date, setDate] = useState<Date | undefined>(
    initialState.values.date ? new Date(initialState.values.date) : new Date()
  )
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, payload: FormData) => record ? await editPost(payload) : await createPost(payload),
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
          <DialogTitle>{record ? 'Edit' : 'Add New'} Record</DialogTitle>
          <DialogDescription>
            {
              record
                ? 'Make changes to your record details and save.'
                : 'Fill in the details below to add a new record.'
            }
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <input type="hidden" name="id" value={record?.id} />

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
                  <CategoryOptions categories={categories} />
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
              <input type="hidden" name="date" value={date ? dateToTimestamptz(date) : undefined} />
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
            <SubmitButton isEditMode={Boolean(record)} isLoading={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}