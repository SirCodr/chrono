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
import { useActionState, useEffect, useMemo, useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { dateToTimestamptz } from "@/lib/utils"
import { Tables } from "@/lib/supabase/database.types"
import { useTranslations } from "next-intl"

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
  const t = useTranslations()

  const text = () => {
    if (isEditMode && isLoading) return t('forms.edit.ctaLoadingText', { item: t('common.record') })

    if (isEditMode && !isLoading) return t('forms.edit.ctaText')

    if (!isEditMode && isLoading) return t('forms.add.ctaLoadingText', { item: t('common.record') })

    return t('forms.add.ctaText', { item: t('common.record') })
  }

  return (
    <Button type="submit" disabled={isLoading}>
      {text()}
    </Button>
  )
}

export function RecordForm({ record, open, onOpenChange, onSuccess }: RecordModalProps) {
  const t = useTranslations()
  const initialState: ActionState = {
    success: false,
    error: {},
    values: {
      title: record?.title || '',
      description: record?.description || '',
      category: record?.category ? t(`timeline.categories.${record.category}` as any) : '',
      date: record?.date || ''
    }
  }
  const categories = useMemo<string[]>(() => [
    t('timeline.categories.Education'),
    t('timeline.categories.Entertainment'),
    t('timeline.categories.Finance'),
    t('timeline.categories.Food'),
    t('timeline.categories.Health'),
    t('timeline.categories.Home'),
    t('timeline.categories.Personal'),
    t('timeline.categories.Shopping'),
    t('timeline.categories.Social'),
    t('timeline.categories.Transport'),
    t('timeline.categories.Work')
  ], []);
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
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>
            {record ? t('forms.edit.header', { item: t('common.record') }) : t('forms.add.header', { item: t('common.record') })}
          </DialogTitle>
          <DialogDescription className="subheader-text">
            {record
              ? t('forms.edit.subheader', { item: t('common.record') })
              : t('forms.add.subheader', { item: t('common.record') })}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction}>
          <div className='grid gap-4 py-4'>
            <input type='hidden' name='id' value={record?.id} />

            <div className='space-y-2'>
              <Label htmlFor='title'>{t('timeline.form.title')}</Label>
              <Input
                id='title'
                name='title'
                defaultValue={state.values.title}
                placeholder={t('timeline.form.titlePlaceholder')}
              />
              {typeof state.error === 'object' &&
                state.error?.title &&
                !isPending && (
                  <p className='text-sm text-red-600'>{state.error.title}</p>
                )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>{t('timeline.form.description')}</Label>
              <Input
                id='description'
                name='description'
                defaultValue={state.values.description}
                placeholder={t('timeline.form.descriptionPlaceholder')}
              />
              {typeof state.error === 'object' &&
                state.error?.description &&
                !isPending && (
                  <p className='text-sm text-red-600'>
                    {state.error.description}
                  </p>
                )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>{t('timeline.form.category')}</Label>
              <Select
                value={category}
                defaultValue={state.values.category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('timeline.form.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <CategoryOptions categories={categories} />
                </SelectContent>
              </Select>
              {typeof state.error === 'object' &&
                state.error?.category &&
                !isPending && (
                  <p className='text-sm text-red-600'>{state.error.category}</p>
                )}
              <input type='hidden' name='category' value={category} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='content'>{t('timeline.form.date')}</Label>
              <DatePicker value={date} onChange={(value) => setDate(value)} />
              {typeof state.error === 'object' &&
                state.error?.date &&
                !isPending && (
                  <p className='text-sm text-red-600'>{state.error.date}</p>
                )}
              <input
                type='hidden'
                name='date'
                value={date ? dateToTimestamptz(date) : undefined}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" placeholder="Enter tags separated by commas" />
            </div> */}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <SubmitButton isEditMode={Boolean(record)} isLoading={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}