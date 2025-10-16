'use server'

import { createServerClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { getTranslations } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function createPost(data: FormData) {
  const t = await getTranslations('timeline.form.errors')

  const postCreationSchema = z.object({
    title: z.string().min(1, t('titleRequired')),
    description: z.string().optional(),
    category: z.string().min(1, t('categoryRequired')),
    date: z.coerce.date({ error: t('dateInvalid') })
  })

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
    return { error: t('serverError'), values }
  }
}

export async function editPost(data: FormData) {
  const t = await getTranslations('timeline.form.errors')
  const editCreationSchema = z.object({
    id: z.string().uuid(t('invalidId')),
    title: z.string().min(1, t('titleRequired')),
    description: z.string().optional(),
    category: z.string().min(1, t('categoryRequired')),
    date: z.coerce.date({ error: t('dateInvalid') })
  })

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
    return { error: t('serverError'), values }
  }
}

export async function deletePost(id: string) {
  const t = await getTranslations('timeline.form.errors')
  const idSchema = z.string().min(1, t('idRequired')).uuid(t('invalidId'))

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
    return { error: t('serverError'), id }
  }
}