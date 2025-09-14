'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/lib/supabase/database.types'
import {
  AlertDialogHeader,
  AlertDialogFooter
} from '@/components/ui/alert-dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useActionState, useState } from 'react'
import { deletePost } from '../actions'
import { RecordForm } from './record-form'

const MODALS = {
  EDIT: 'edit',
  DELETE: 'delete'
}

interface TimelineItemProps {
  record: Tables<'records'>
}

function DeleteDialog({
  open,
  setOpen,
  id
}: {
  open: boolean
  setOpen: (open: boolean) => void
  id: string
}) {
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, payload: string) => await deletePost(payload),
    {
      success: false,
      error: {},
      id: ''
    }
  )

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <form action={() => formAction(id)}>
          <input type='hidden' name='id' value={id} />
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type='submit' disabled={isPending} variant='outline' className='text-white bg-destructive hover:bg-destructive/90 hover:text-white'>
              {isPending ? 'Deleting...' : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function TimelineItem({ record }: TimelineItemProps) {
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
                  {record.category}
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
                <DropdownMenuItem
                  onClick={() => setCurrentModal(MODALS.EDIT)}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={() => setCurrentModal(MODALS.DELETE)}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground mb-3'>
            {record.description}
          </p>
          {/* {record.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {record.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )} */}
        </CardContent>
      </Card>

      {currentModal === MODALS.EDIT && (
        <RecordForm
          key={MODALS.EDIT + record.id}
          open={true}
          onOpenChange={(isOpen: boolean) => {
            if (isOpen) setCurrentModal(MODALS.EDIT)
            else setCurrentModal(null)
          }}
          onSuccess={() => setCurrentModal(null)}
          record={record}
        />
      )}
      {
        currentModal === MODALS.DELETE && (
          <DeleteDialog
            open={true}
            setOpen={(isOpen: boolean) => {
              if (isOpen) setCurrentModal(MODALS.DELETE)
              else setCurrentModal(null)
            }}
            id={record.id}
          />
        )
      }
    </>
  )
}
