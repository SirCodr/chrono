'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const SUPABASE_DATA = [
  {"id":"1d550c5b-d202-4265-a3e2-c384994b7d30","title":"Pago HDI Seguros","description":"Pago 1/4 de seguro todo riesgo","category":"Finance","date":"2025-06-26T00:00:00+00:00","createdAt":"2025-09-03T00:16:39.22402+00:00","updatedAt":"2025-09-03T00:16:39.22402+00:00"},
  {"id":"f521fd2b-f5b0-4118-8b1c-1845c2947ffd","title":"Pago HDI Seguros","description":"Pago 2/4","category":"Finance","date":"2025-09-02T00:00:00+00:00","createdAt":"2025-09-03T00:17:04.809882+00:00","updatedAt":"2025-09-03T00:17:04.809882+00:00"},
  {"id":"06efffc2-fc24-4967-ac0f-4d3decaf3e86","title":"Mercado","description":"Cositas que faltaban","category":"Home","date":"2025-10-17T01:27:48+00:00","createdAt":"2025-10-17T01:28:00.004643+00:00","updatedAt":"2025-10-17T01:28:00.004643+00:00"},
  {"id":"0ecd7b3f-f52d-45eb-8826-f1bb8ce372d2","title":"Moto | Cambio de aceite | Filtro de aceite","description":"Kilometraje: 32.687","category":"Transport","date":"2025-09-06T00:00:00+00:00","createdAt":"2025-09-06T01:16:04.39266+00:00","updatedAt":"2025-09-06T01:16:04.39266+00:00"},
  {"id":"46822c51-61a1-43e0-acfb-5805324e68b5","title":"First test record","description":"","category":"Home","date":"2025-10-29T05:00:00+00:00","createdAt":"2025-10-30T01:20:37.042625+00:00","updatedAt":"2025-10-30T01:20:37.042625+00:00"},
  {"id":"3d5968d6-5109-4d6a-9875-1834bd278302","title":"today record","description":"","category":"Personal","date":"2025-10-27T05:00:00+00:00","createdAt":"2025-10-30T01:32:42.26808+00:00","updatedAt":"2025-10-30T01:32:42.26808+00:00"},
  {"id":"7d88ccfc-98b8-40b9-be4f-5e7d7ed13b1c","title":"Mercado","description":"Pequeña compra","category":"Home","date":"2025-10-27T05:00:00+00:00","createdAt":"2025-10-30T01:57:58.96099+00:00","updatedAt":"2025-10-30T01:57:58.96099+00:00"},
  {"id":"66f5f36f-fc31-4137-be31-2fe7aa8c8a68","title":"Mercado","description":"","category":"Home","date":"2025-09-27T22:33:02+00:00","createdAt":"2025-09-27T22:33:09.706763+00:00","updatedAt":"2025-09-27T22:33:09.706763+00:00"},
  {"id":"7317ed6e-78e9-4a2e-b2d8-fd8635cec484","title":"Motilada","description":"","category":"Personal","date":"2025-10-28T05:00:00+00:00","createdAt":"2025-10-30T01:58:33.676802+00:00","updatedAt":"2025-10-30T01:58:33.676802+00:00"},
  {"id":"4855f1ce-7c70-4c4f-a1a4-a11e29c09a0a","title":"Mercado","description":"","category":"Home","date":"2025-09-10T05:00:00+00:00","createdAt":"2025-09-14T03:16:10.11868+00:00","updatedAt":"2025-09-14T03:16:10.11868+00:00"},
  {"id":"f3297df9-0efd-414b-93f9-2123cf9f87ab","title":"Pago HDI Seguros","description":"Ultima cuota","category":"Transport","date":"2025-10-10T05:00:00+00:00","createdAt":"2025-10-31T18:35:36.325349+00:00","updatedAt":"2025-10-31T18:35:36.325349+00:00"},
  {"id":"a6f441d8-cf2c-460a-8649-421b0e1c1307","title":"Pago HDI Seguros","description":"","category":"Transport","date":"2025-08-01T05:00:00+00:00","createdAt":"2025-10-31T18:36:04.825977+00:00","updatedAt":"2025-10-31T18:36:04.825977+00:00"},
  {"id":"209f3763-0278-44ce-9a04-a03116bb2f15","title":"Mercado","description":"","category":"Home","date":"2025-11-01T05:00:00+00:00","createdAt":"2025-11-04T15:16:44.951573+00:00","updatedAt":"2025-11-04T15:16:44.951573+00:00"},
  {"id":"13377e9d-b3fa-4b83-b649-3de6475a1f15","title":"Mercado","description":"Leche y atun que faltaban","category":"Home","date":"2025-11-12T05:00:00+00:00","createdAt":"2025-11-13T15:18:53.134721+00:00","updatedAt":"2025-11-13T15:18:53.134721+00:00"},
  {"id":"7cbc1072-9983-4ac5-ae5f-60d3f5ea0cc7","title":"Moto - Lavada","description":"Restauracion partes negras","category":"Transport","date":"2025-11-19T22:45:31+00:00","createdAt":"2025-11-19T22:45:58.52592+00:00","updatedAt":"2025-11-19T22:45:58.52592+00:00"},
  {"id":"45fe1485-2661-4e6e-b713-d9c571f27fef","title":"Moto - Tensión de cadena","description":"","category":"Transport","date":"2025-11-19T22:46:00+00:00","createdAt":"2025-11-19T22:46:14.739106+00:00","updatedAt":"2025-11-19T22:46:14.739106+00:00"},
  {"id":"0173ce43-156b-4cd1-9c5d-d19bb392c0a5","title":"Motilada","description":"","category":"Personal","date":"2025-10-07T05:00:00+00:00","createdAt":"2025-10-14T14:30:40.613254+00:00","updatedAt":"2025-10-14T14:30:40.613254+00:00"},
  {"id":"5e8adbff-e36e-4fe3-939d-583e9d527d39","title":"Mercado","description":"","category":"Home","date":"2025-10-12T05:00:00+00:00","createdAt":"2025-10-14T14:31:52.044349+00:00","updatedAt":"2025-10-14T14:31:52.044349+00:00"},
  {"id":"21f140be-2894-446e-8484-1ac5d94bc334","title":"Entrega TC Mastercard Bancolombia","description":"Exoneración de cuota de manejo de 6 meses","category":"Finance","date":"2025-10-31T05:00:00+00:00","createdAt":"2025-11-24T00:51:54.963745+00:00","updatedAt":"2025-11-24T00:51:54.963745+00:00"},
  {"id":"f6dfa244-4b31-434e-93c3-b346ada99b7e","title":"Moto - Cambio de aceite","description":"Km: 35350 | SIN cambio de filtro","category":"Transport","date":"2025-12-12T05:00:00+00:00","createdAt":"2025-12-13T19:41:37.546727+00:00","updatedAt":"2025-12-13T19:41:37.546727+00:00"}
]

export default function ImportPage() {
  const t = useTranslations('common')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = useState('')

  const handleImport = async () => {
    setStatus('loading')
    try {
      const request = indexedDB.open('chrono-db')
      
      request.onsuccess = function (event) {
        // @ts-expect-error Types for IndexedDB are complex, bypass for simple script
        const db = event.target.result
        const tx = db.transaction('records', 'readwrite')
        const store = tx.objectStore('records')
        
        let count = 0
        SUPABASE_DATA.forEach(record => {
          store.put(record)
          count++
        })
        
        tx.oncomplete = () => {
          setStatus('success')
          setMessage(`¡Éxito! Migrados ${count} registros a la base de datos de Chrono.`)
        }
        
        tx.onerror = (e) => {
          setStatus('error')
          setMessage(`Falla al importar: ${e}`)
        }
      }
      
      request.onerror = (e) => {
          setStatus('error')
          setMessage(`No se pudo abrir DB: ${e}`)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  return (
    <main className='container mx-auto p-6 md:p-24 flex items-center justify-center min-h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Migración Manual Chrono</CardTitle>
          <CardDescription>
            Usa esta página temporal para cargar tus datos desde Supabase directo a tu base de datos local en el navegador o teléfono.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
            {status !== 'idle' && (
                <div className={`p-4 rounded-md font-semibold text-center ${status === 'success' ? 'bg-green-100 text-green-800' : status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                    {message || (status === 'loading' ? 'Importando...' : '')}
                </div>
            )}
            
            <Button 
                onClick={handleImport} 
                disabled={status === 'loading' || status === 'success'}
                className='w-full'
            >
                {status === 'success' ? 'Datos Migrados Correctamente' : `Importar ${SUPABASE_DATA.length} Registros Ahora`}
            </Button>
            
            {status === 'success' && (
                <Button 
                    variant='outline' 
                    className='w-full'
                    onClick={() => window.location.href = '/'}
                >
                    Ir a Inicio
                </Button>
            )}
        </CardContent>
      </Card>
    </main>
  )
}
