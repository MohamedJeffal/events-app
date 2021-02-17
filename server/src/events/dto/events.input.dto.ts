import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { EventDto, EventStatus } from './events.dto'

@ObjectType()
export class EventsPage {
  @Field((type) => [EventDto])
  events: EventDto[]

  @Field((type) => Boolean)
  hasMore: boolean
}

@InputType()
export class EventsPageInputFilters {
  @Field((type) => EventStatus, { nullable: true })
  status?: EventStatus
}

@InputType()
export class EventsPageInput {
  @Field((type) => Int, {
    description: 'Page number of events to fetch (offset = page * pageSize)',
  })
  page: number

  @Field((type) => Int, { description: 'Maximum number of events to fetch' })
  pageSize: number

  @Field((type) => EventsPageInputFilters, { nullable: true })
  filters?: EventsPageInputFilters
}
