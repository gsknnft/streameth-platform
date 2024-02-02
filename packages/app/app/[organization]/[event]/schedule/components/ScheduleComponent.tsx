import StageSelect from './StageSelect'
import DateSelect from './DateSelect'
import SessionList from '@/components/sessions/SessionList'

import { fetchAllSessions } from '@/lib/data'
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'
import { getEventDays } from '@/lib/utils/time'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const ScheduleComponent = async ({
  stages,
  event,
  stage,
  date,
}: {
  stages: IStage[]

  event: IEventModel
  stage?: string
  date?: string
}) => {
  const dates = getEventDays(event.start, event.end)

  const sessionsData = await fetchAllSessions({
    event: event.slug,
    stage: stage,
    date: date ? new Date(parseInt(date)) : undefined,
  })

  if (!sessionsData.sessions) return null
  return (
    <Card
      id="schedule"
      className="text-white bg-opacity-[0.04] bg-white border-white border-opacity-[0.04] lg:rounded-xl shadow">
      <CardHeader className="p-3 lg:p-6 flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-4 justify-center">
        <CardTitle className="text-4xl uppercase lg:mr-4">
          Schedule
        </CardTitle>
        <DateSelect dates={dates} />
        <StageSelect stages={stages} />
      </CardHeader>
      <CardContent className="p-3 lg:p-6">
        <div className="w-full flex flex-col relative">
          <SessionList
            event={event}
            sessions={sessionsData.sessions}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleComponent
