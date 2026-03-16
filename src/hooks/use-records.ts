'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  getAllRecords,
  addRecord,
  putRecord,
  removeRecord,
} from '@/lib/db'
import type { Record, RecordInsert, RecordUpdate } from '@/types/record'
import { dateToTimestamptz } from '@/lib/date-handle'

type FilterParams = {
  search?: string
  from?: string
  to?: string
}

export function useRecords() {
  const [records, setRecords] = useState<Record[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      const all = await getAllRecords()
      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecords(all)
    } catch (error) {
      console.error('Error loading records from IndexedDB', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const createRecord = useCallback(async (data: RecordInsert) => {
    const newRecord: Record = {
      ...data,
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      createdAt: dateToTimestamptz(new Date()),
    }
    await addRecord(newRecord)
    await loadRecords()
    return newRecord
  }, [loadRecords])

  const updateRecord = useCallback(async (data: RecordUpdate) => {
    const all = await getAllRecords()
    const existing = all.find((r) => r.id === data.id)
    if (!existing) throw new Error('Record not found')
    const updated: Record = {
      ...existing,
      ...data,
      updatedAt: dateToTimestamptz(new Date()),
    }
    await putRecord(updated)
    await loadRecords()
    return updated
  }, [loadRecords])

  const deleteRecord = useCallback(async (id: string) => {
    await removeRecord(id)
    await loadRecords()
  }, [loadRecords])

  const filterRecords = useCallback(
    (params: FilterParams) => {
      return records.filter((record) => {
        const recordDate = new Date(record.date)

        if (params.search) {
          const search = params.search.toLowerCase()
          if (!record.title.toLowerCase().includes(search)) return false
        }

        if (params.from) {
          const fromDate = new Date(params.from)
          fromDate.setHours(0, 0, 0, 0)
          if (recordDate < fromDate) return false
        }

        if (params.to) {
          const toDate = new Date(params.to)
          toDate.setHours(23, 59, 59, 999)
          if (recordDate > toDate) return false
        }

        return true
      })
    },
    [records]
  )

  return {
    records,
    isLoading,
    createRecord,
    updateRecord,
    deleteRecord,
    filterRecords,
  }
}
