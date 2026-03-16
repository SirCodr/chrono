'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-6 mx-auto'>
        <div className='flex items-center space-x-8'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80'>
              <Clock className='h-4 w-4 text-primary-foreground' />
            </div>
            <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>
              Chrono
            </h1>
          </Link>
        </div>
      </div>
    </header>
  )
}
