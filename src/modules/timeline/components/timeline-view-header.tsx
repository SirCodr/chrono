'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { RecordForm } from "./record-form"

export default function TimelineViewHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {isModalOpen && (
        <RecordForm open={true} onOpenChange={setIsModalOpen} onSuccess={() => setIsModalOpen(false)} />
      )}
    </>
  )
}