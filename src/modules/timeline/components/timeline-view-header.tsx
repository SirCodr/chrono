'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { RecordForm } from "./record-form"
import { useTranslations } from "next-intl"

export default function TimelineViewHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const t = useTranslations('timeline.activity')

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <Button onClick={() => setIsModalOpen(true)} className="capitalize">
          <Plus className="h-4 w-4 mr-2" />
          {t('addRecord')}
        </Button>
      </div>

      {isModalOpen && (
        <RecordForm open={true} onOpenChange={setIsModalOpen} onSuccess={() => setIsModalOpen(false)} />
      )}
    </>
  )
}