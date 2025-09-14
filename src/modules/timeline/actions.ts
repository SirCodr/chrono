'use server'

import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const postCreationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  date: z.coerce.date({ error: 'Invalid date' })
})

const editCreationSchema = postCreationSchema.extend({
  id: z.string().uuid('Invalid ID')
})

const idSchema = z.string().min(1, 'ID is required').uuid('Invalid ID')

export async function createPost(data: FormData) {
  const values = {
    title: data.get('title') as string,
    description: data.get('description') as string,
    category: data.get('category') as string,
    date: data.get('date') as string
  }

  try {
    const parsedData = postCreationSchema.safeParse(values)

    if (!parsedData.success) {
      return {
        success: false,
        error: parsedData.error.flatten().fieldErrors,
        values
      }
    }

    const { userId } = await auth()
    const supabase = await createServerClient()

    await supabase.from('records').insert({
      title: parsedData.data.title,
      description: parsedData.data.description,
      category: parsedData.data.category,
      date: parsedData.data.date,
      user_id: userId
    })

    revalidatePath('/timeline')
    return { success: true, error: {}, values }
  }
  catch(error) {
    console.log('Error on create record action', error)
    return { error: "Server error", values }
  }
}

export async function editPost(data: FormData) {
  const values = {
    id: data.get('id') as string,
    title: data.get('title') as string,
    description: data.get('description') as string,
    category: data.get('category') as string,
    date: data.get('date') as string
  }

  try {
    const parsedData = editCreationSchema.safeParse(values)

    if (!parsedData.success) {
      return {
        success: false,
        error: parsedData.error.flatten().fieldErrors,
        values
      }
    }

    const { userId } = await auth()
    const supabase = await createServerClient()

    await supabase.from('records').update({
      title: parsedData.data.title,
      description: parsedData.data.description,
      category: parsedData.data.category,
      date: parsedData.data.date,
      user_id: userId
    })
    .eq('id', parsedData.data.id)

    revalidatePath('/timeline')
    return { success: true, error: {}, values }
  }
  catch(error) {
    console.log('Error on edit record action', error)
    return { error: "Server error", values }
  }
}

export async function deletePost(id: string) {
  try {
    const parsedData = idSchema.safeParse(id)

    if (!parsedData.success) {
      return {
        success: false,
        error: parsedData.error.flatten().fieldErrors,
        id
      }
    }

    const supabase = await createServerClient()

    await supabase.from('records').delete().eq('id', id)

    revalidatePath('/timeline')
    return { success: true, error: {}, id }
  }
  catch(error) {
    console.log('Error on delete record action', error)
    return { error: "Server error", id }
  }
}