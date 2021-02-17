import { Inject } from '@nestjs/common'
import { PgClient } from '../utils/pg.client'
import {
  Args,
  Info,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql'
import { EventDto, EventStatus, HostDto } from './dto/events.dto'
import { GraphQLResolveInfo } from 'graphql'
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info'
import { EventsService } from './events.service'
import { EventsPage, EventsPageInput } from './dto/events.input.dto'

@Resolver(() => EventDto)
export class EventsResolver {
  constructor(
    @Inject(PgClient) private pgClient: PgClient,
    @Inject(EventsService) private eventService: EventsService,
  ) {}

  @Mutation(() => EventDto)
  public async createEvent(
    @Args('title') title: string,
  ): Promise<Pick<EventDto, 'id' | 'title' | 'publishedAt'>> {
    return this.eventService.createEvent(title)
  }

  @Query(() => EventsPage)
  public async eventsPage(
    @Args('eventsPageInput') eventsPageInput: EventsPageInput,
    @Info()
    info: GraphQLResolveInfo,
  ): Promise<{ events: Partial<EventDto>[]; hasMore: boolean }> {
    const parsedInfo = parseResolveInfo(info) as ResolveTree
    const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedInfo,
      info.returnType,
    )

    const requestFields = Object.keys(
      // @ts-ignore
      simplifiedInfo.fields.events?.fieldsByTypeName.EventDto,
    )

    const statusFilter = eventsPageInput.filters?.status
    const pageOffset = eventsPageInput.page * eventsPageInput.pageSize

    /**
     * This look ahead optimization makes sense here because this is a costly
     * operation to do for each event separately.
     */
    const events = requestFields.includes('totalMessagesCount')
      ? await this.eventService.getLatestEventsWithMessagesCount(
          pageOffset,
          eventsPageInput.pageSize,
          { status: statusFilter },
        )
      : await this.eventService.getLatestEvents(
          pageOffset,
          eventsPageInput.pageSize,
          { status: statusFilter },
        )

    return {
      events,
      hasMore: events.length === eventsPageInput.pageSize,
    }
  }

  @ResolveField()
  public async status(@Root() event: EventDto): Promise<EventStatus> {
    // When the query filter is used, we just reused it here.
    if (event.status) return event.status

    if (!event.publishedAt) return EventStatus.DRAFT

    return this.eventService.getStatus(event.id)
  }

  @ResolveField()
  public async sessionDate(
    @Root() { id }: Pick<EventDto, 'id'>,
  ): Promise<Date | undefined | null> {
    return this.eventService.getSessionDate(id)
  }

  @ResolveField()
  public async totalSessionsCount(
    @Root() { id }: Pick<EventDto, 'id'>,
  ): Promise<number> {
    return this.eventService.getTotalSessionsCount(id)
  }

  @ResolveField()
  public async registeredAttendeesCount(
    @Root() { id }: Pick<EventDto, 'id'>,
  ): Promise<number> {
    return this.eventService.getRegisteredAttendeesCount(id)
  }

  @ResolveField()
  public async totalMessagesCount(
    @Root()
    { id, totalMessagesCount }: Pick<EventDto, 'id' | 'totalMessagesCount'>,
  ): Promise<number> {
    // List query case when it has been already queried at the root level
    if (totalMessagesCount) {
      return totalMessagesCount
    }

    // After mutation query case
    return this.eventService.getTotalMessagesCount(id)
  }

  @ResolveField()
  public async hosts(@Root() { id }: Pick<EventDto, 'id'>): Promise<HostDto[]> {
    return this.eventService.getHosts(id)
  }
}
