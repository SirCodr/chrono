export type Record = {
  id: string
  title: string
  description?: string | null
  category: string
  date: string
  createdAt: string
  updatedAt?: string | null
}

export type RecordInsert = Omit<Record, 'id' | 'createdAt' | 'updatedAt'>
export type RecordUpdate = Partial<RecordInsert> & { id: string }
