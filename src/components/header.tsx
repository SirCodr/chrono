'use client'

import { Clock, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useGoogleAuth } from '@/hooks/use-google-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface HeaderProps {
  pendingSyncCount?: number
  onRetrySync?: () => Promise<void>
}

export function Header({ pendingSyncCount = 0, onRetrySync }: HeaderProps) {
  const t = useTranslations()
  const { isSignedIn, isLoading, user, signIn, signOut } = useGoogleAuth()
  const [imgError, setImgError] = useState(false)

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

        <div className='flex items-center gap-3'>
          {/* Pending sync indicator */}
          {isSignedIn && pendingSyncCount > 0 && (
            <Button
              variant='outline'
              size='sm'
              onClick={onRetrySync}
              className='gap-1.5 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-950/60'
              aria-label={t('googleCalendar.retrySyncAriaLabel', {
                count: pendingSyncCount,
              })}
            >
              <RefreshCw className='h-3.5 w-3.5' />
              <span className='hidden sm:inline'>
                {t('googleCalendar.retrySync')}
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                  'bg-amber-600 text-white'
                )}
              >
                {pendingSyncCount}
              </span>
            </Button>
          )}

          {/* Google Auth controls */}
          {!isLoading && !isSignedIn && (
            <Button
              variant='outline'
              size='sm'
              onClick={signIn}
              className='gap-2'
              aria-label={t('googleCalendar.connectGoogle')}
            >
              {/* Google G logo */}
              <svg
                aria-hidden='true'
                className='h-4 w-4'
                viewBox='0 0 24 24'
              >
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
              <span className='hidden sm:inline'>
                {t('googleCalendar.connectGoogle')}
              </span>
            </Button>
          )}

          {isSignedIn && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full'
                  aria-label={t('googleCalendar.accountMenu')}
                >
                  {user.image && !imgError ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.image}
                      alt={user.name ? `Avatar de ${user.name}` : 'Avatar del usuario'}
                      loading='lazy'
                      decoding='async'
                      className='h-8 w-8 rounded-full object-cover'
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div
                      className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold'
                      aria-label='Avatar por defecto'
                    >
                      {user.name?.[0]?.toUpperCase() ?? 'G'}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel className='flex flex-col gap-0.5'>
                  <span className='font-medium'>{user.name}</span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={signOut}
                  className='text-destructive focus:text-destructive'
                >
                  {t('googleCalendar.disconnect')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
