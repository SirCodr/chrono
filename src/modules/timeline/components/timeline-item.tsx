'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Record, RecordUpdate } from '@/types/record'
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { RecordForm } from './record-form'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

const MODALS = {
  EDIT: 'edit',
  DELETE: 'delete',
}

interface TimelineItemProps {
  record: Record
  onUpdate: (data: RecordUpdate) => Promise<Record>
  onDelete: (id: string) => Promise<void>
}

function DeleteDialog({
  open,
  setOpen,
  id,
  onDelete,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
  onDelete: (id: string) => Promise<void>
}) {
  const t = useTranslations()
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await onDelete(id)
      setOpen(false)
    } catch (error) {
      console.error('Error deleting record', error)
      toast.error(t('timeline.form.errors.serverError'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('timeline.form.confirmDeleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('timeline.form.confirmDeleteDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <Button
            type='button'
            disabled={isPending}
            variant='outline'
            className='text-white bg-destructive hover:bg-destructive/90 hover:text-white'
            onClick={handleDelete}
          >
            {isPending ? t('forms.delete.ctaLoadingTextNoItem') : t('common.continue')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function TimelineItem({ record, onUpdate, onDelete }: TimelineItemProps) {
  const t = useTranslations()
  const [currentModal, setCurrentModal] = useState<typeof MODALS[keyof typeof MODALS] | null>(null)

  return (
    <>
      <Card className='relative'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <CardTitle className='text-lg'>{record.title}</CardTitle>
              <CardDescription className='flex items-center gap-2'>
                <Badge variant='secondary' className='text-xs'>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(`timeline.categories.${record.category}` as any)}
                </Badge>
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setCurrentModal(MODALS.EDIT)}>
                  <Edit className='mr-2 h-4 w-4' />
                  {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => setCurrentModal(MODALS.DELETE)}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-3'>{record.description}</p>
        </CardContent>
      </Card>

      {currentModal === MODALS.EDIT && (
        <RecordForm
          key={MODALS.EDIT + record.id}
          open={true}
          onOpenChange={(isOpen) => {
            if (isOpen) setCurrentModal(MODALS.EDIT)
            else setCurrentModal(null)
          }}
          onSuccess={() => setCurrentModal(null)}
          record={record}
          onUpdate={onUpdate}
        />
      )}
      {currentModal === MODALS.DELETE && (
        <DeleteDialog
          open={true}
          setOpen={(isOpen) => {
            if (isOpen) setCurrentModal(MODALS.DELETE)
            else setCurrentModal(null)
          }}
          id={record.id}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
