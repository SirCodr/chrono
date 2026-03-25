import { google } from 'googleapis'

export interface CalendarEventInput {
  title: string
  description?: string | null
  date: string // ISO date string
}

function getClient(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.calendar({ version: 'v3', auth })
}

function buildEvent(input: CalendarEventInput) {
  const start = new Date(input.date)
  const end = new Date(start)
  end.setHours(end.getHours() + 1)

  return {
    summary: input.title,
    description: input.description ?? undefined,
    start: { dateTime: start.toISOString(), timeZone: 'America/Bogota' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Bogota' },
    source: {
      title: 'Chrono',
      url: 'https://chrono.app',
    },
  }
}

export async function createCalendarEvent(
  accessToken: string,
  input: CalendarEventInput
): Promise<string> {
  const calendar = getClient(accessToken)
  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: buildEvent(input),
  })
  return response.data.id!
}

export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  input: CalendarEventInput
): Promise<void> {
  const calendar = getClient(accessToken)
  await calendar.events.update({
    calendarId: 'primary',
    eventId,
    requestBody: buildEvent(input),
  })
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const calendar = getClient(accessToken)
  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  })
}

export async function fetchCalendarEvents(
  accessToken: string,
  timeMin?: string,
  timeMax?: string
) {
  const calendar = getClient(accessToken)
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin ? new Date(timeMin).toISOString() : undefined,
    timeMax: timeMax ? new Date(timeMax).toISOString() : undefined,
    maxResults: 2500, // Large enough for a timeline
    singleEvents: true,
    orderBy: 'startTime',
  })
  return response.data.items || []
}
