import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Record } from '@/types/record'

const DB_NAME = 'chrono-db'
const DB_VERSION = 2
const STORE_NAME = 'records'

interface ChronoDB extends DBSchema {
  records: {
    key: string
    value: Record
    indexes: {
      'by-date': string
      'by-category': string
      'by-sync-pending': number
    }
  }
}

let dbInstance: IDBPDatabase<ChronoDB> | null = null
let dbPromise: Promise<IDBPDatabase<ChronoDB>> | null = null

export function getDb(): Promise<IDBPDatabase<ChronoDB>> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (dbPromise) return dbPromise

  dbPromise = openDB<ChronoDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, _newVersion, transaction) {
      if (oldVersion < 1) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('by-date', 'date')
        store.createIndex('by-category', 'category')
        store.createIndex('by-sync-pending', 'syncPending')
      }
      if (oldVersion === 1) {
        const store = transaction.objectStore(STORE_NAME)
        if (!store.indexNames.contains('by-sync-pending')) {
          store.createIndex('by-sync-pending', 'syncPending')
        }
      }
    },
  }).then((db) => {
    dbInstance = db
    return db
  })

  return dbPromise
}

export async function getAllRecords(): Promise<Record[]> {
  const db = await getDb()
  return db.getAll(STORE_NAME)
}

export async function getPendingSyncRecords(): Promise<Record[]> {
  const db = await getDb()
  const all = await db.getAll(STORE_NAME)
  return all.filter((r) => r.syncPending === true)
}

export async function addRecord(record: Record): Promise<void> {
  const db = await getDb()
  await db.add(STORE_NAME, record)
}

export async function putRecord(record: Record): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, record)
}

export async function removeRecord(id: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
