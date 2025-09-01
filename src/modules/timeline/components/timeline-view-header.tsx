'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { AddRecordModal } from "./add-record-modal"
import { useAuth } from "@clerk/nextjs"
import { useSupabase } from "@/lib/supabase/client-provider"

export default function TimelineViewHeader() {
  const { supabase } = useSupabase()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!supabase) return

      const { data: posts } = await supabase.from('posts').select('*')

      console.log('posts', posts)
    }

    loadData()
  }, [])

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <AddRecordModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}