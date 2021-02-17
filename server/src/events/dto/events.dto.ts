import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsUrl } from 'class-validator'

export enum EventStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  PAST = 'past',
}

registerEnumType(EventStatus, {
  name: 'EventStatus',
  description: `An event status can be:
    - 'draft' if the event is not published,
    - 'upcoming' is there is at least a future session,
    - 'past' is all event sessions are in the past.`,
})

@ObjectType()
export class HostDto {
  @Field((type) => String, { description: 'Host full name' })
  fullName: string

  @Field((type) => String, { description: 'Host avatar url', nullable: true })
  @IsUrl()
  avatarUrl: string | null
}

@ObjectType()
export class EventDto {
  @Field((type) => ID)
  id: string

  @Field((type) => String)
  title: string

  @Field((type) => EventStatus)
  status: EventStatus

  @Field((type) => Date, {
    description:
      'Date of the next future session or the last session if there are no next sessions',
    nullable: true,
  })
  sessionDate?: Date | null

  @Field((type) => Int, { description: 'total sessions count for the event' })
  totalSessionsCount: number

  @Field((type) => [HostDto])
  hosts: HostDto[]

  @Field((type) => Int, {
    description:
      'registered people count (excluding hosts) for all the event sessions',
  })
  registeredAttendeesCount: number

  @Field((type) => Int, {
    description: 'total messages count of all the event sessions',
  })
  totalMessagesCount: number

  publishedAt: Date | null
}
