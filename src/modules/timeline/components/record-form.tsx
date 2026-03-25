'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useEffect, useMemo } from 'react'
import { DatePicker } from '@/components/ui/date-picker'
import type { Record, RecordInsert, RecordUpdate } from '@/types/record'
import { useTranslations } from 'next-intl'
import { dateToTimestamptz } from '@/lib/date-handle'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

interface RecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  record?: Record
  onCreate?: (data: RecordInsert) => Promise<Record>
  onUpdate?: (data: RecordUpdate) => Promise<Record>
}

type FormValues = {
  title: string
  description: string
  category: string
  date: Date | undefined
}

type CategoriesType = {
  label: string
  value: string
}

function CategoryOptions({ categories }: { categories: CategoriesType[] }) {
  return categories.map(({ label, value }) => (
    <SelectItem key={value} value={value}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </SelectItem>
  ))
}

export function RecordForm({
  record,
  open,
  onOpenChange,
  onSuccess,
  onCreate,
  onUpdate
}: RecordModalProps) {
  const t = useTranslations()
  const isEditMode = Boolean(record)

  const categories = useMemo<CategoriesType[]>(
    () => [
      { label: t('timeline.categories.Education'), value: 'Education' },
      { label: t('timeline.categories.Entertainment'), value: 'Entertainment' },
      { label: t('timeline.categories.Finance'), value: 'Finance' },
      { label: t('timeline.categories.Food'), value: 'Food' },
      { label: t('timeline.categories.Health'), value: 'Health' },
      { label: t('timeline.categories.Home'), value: 'Home' },
      { label: t('timeline.categories.Personal'), value: 'Personal' },
      { label: t('timeline.categories.Shopping'), value: 'Shopping' },
      { label: t('timeline.categories.Social'), value: 'Social' },
      { label: t('timeline.categories.Transport'), value: 'Transport' },
      { label: t('timeline.categories.Work'), value: 'Work' }
    ],
    [t]
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      title: record?.title ?? '',
      description: record?.description ?? '',
      category: record?.category ?? '',
      date: record?.date ? new Date(record.date) : new Date()
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        title: record?.title ?? '',
        description: record?.description ?? '',
        category: record?.category ?? '',
        date: record?.date ? new Date(record.date) : new Date()
      })
    }
  }, [open, record, reset])

  const onSubmit = async (values: FormValues) => {
    if (!values.date) return

    try {
      if (isEditMode && record && onUpdate) {
        await onUpdate({
          id: record.id,
          title: values.title,
          description: values.description || null,
          category: values.category,
          date: dateToTimestamptz(values.date)
        })
      } else if (onCreate) {
        await onCreate({
          title: values.title,
          description: values.description || null,
          category: values.category,
          date: dateToTimestamptz(values.date)
        })
      }
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving record', error)
      toast.error(t('timeline.form.errors.serverError'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>
            {record
              ? t('forms.edit.header', { item: t('common.record') })
              : t('forms.add.header', { item: t('common.record') })}
          </DialogTitle>
          <DialogDescription className='subheader-text'>
            {record
              ? t('forms.edit.subheader', { item: t('common.record') })
              : t('forms.add.subheader', { item: t('common.record') })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>{t('timeline.form.title')}</Label>
              <Input
                id='title'
                placeholder={t('timeline.form.titlePlaceholder')}
                {...register('title', {
                  required: t('timeline.form.errors.titleRequired')
                })}
              />
              {errors.title && (
                <p className='text-sm text-red-600'>{errors.title.message}</p>
              )}
            </div>

            {record?.isAutoGenerated ? (
              <div className='space-y-2'>
                <Label htmlFor='description'>
                  {t('timeline.form.description')}
                </Label>
                <div className='text-sm text-muted-foreground italic rounded-md border bg-muted/50 p-3'>
                  Descripción automática generada por Google Calendar (No editable).
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <Label htmlFor='description'>
                  {t('timeline.form.description')}
                </Label>
                <Input
                  id='description'
                  placeholder={t('timeline.form.descriptionPlaceholder')}
                  {...register('description')}
                />
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='category'>{t('timeline.form.category')}</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: t('timeline.form.errors.categoryRequired') }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('timeline.form.categoryPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <CategoryOptions categories={categories} />
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className='text-sm text-red-600'>
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='date'>{t('timeline.form.date')}</Label>
              <Controller
                name='date'
                control={control}
                rules={{ required: t('timeline.form.errors.dateInvalid') }}
                render={({ field }) => (
                  <DatePicker value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.date && (
                <p className='text-sm text-red-600'>{errors.date.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? t('forms.edit.ctaLoadingText')
                  : t('forms.add.ctaLoadingText', { item: t('common.record') })
                : isEditMode
                  ? t('forms.edit.ctaText')
                  : t('forms.add.ctaText', { item: t('common.record') })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
