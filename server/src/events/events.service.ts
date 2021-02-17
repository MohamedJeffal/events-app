import { Inject, Injectable } from '@nestjs/common'
import { PgClient } from '../utils/pg.client'
import * as uuid from 'uuid/v4'
import { EventDto, EventStatus, HostDto } from './dto/events.dto'
import {
  createEvents,
  getLatestEventsByStatus,
  getLatestEventsWithEventMessagesCountByStatus,
} from './dao/events.queries'
import {
  getClosestSessionStartInfo,
  getEventHostsByEventId,
  getEventMessagesCountByEventId,
  getEventRegisteredAttendeesCountByEventId,
  getSessionCountByEventId,
  IGetClosestSessionStartInfoResult,
} from './dao/event.queries'

@Injectable()
export class EventsService {
  constructor(@Inject(PgClient) private pgClient: PgClient) {}

  public async createEvent(
    title: string,
  ): Promise<Pick<EventDto, 'id' | 'title' | 'publishedAt'>> {
    const createdEvent = await createEvents.run(
      {
        events: [
          {
            id: uuid(),
            title,
            created_at: new Date(),
            published_at: null,
          },
        ],
      },
      this.pgClient,
    )

    return {
      id: createdEvent[0]?.id,
      title: createdEvent[0]?.title,
      publishedAt: createdEvent[0]?.published_at,
    }
  }

  public async getLatestEvents(
    pageOffset: number,
    pageSize: number,
    filters?: { status?: EventStatus },
  ): Promise<
    (Pick<EventDto, 'id' | 'title' | 'publishedAt'> &
      Partial<Pick<EventDto, 'status'>>)[]
  > {
    const eventRecords = await getLatestEventsByStatus.run(
      { pageOffset, pageSize, status: filters?.status ?? '' },
      this.pgClient,
    )

    return eventRecords.map((er) => ({
      id: er.id,
      title: er.title,
      publishedAt: er.published_at,
      status: filters?.status,
    }))
  }

  public async getLatestEventsWithMessagesCount(
    pageOffset: number,
    pageSize: number,
    filters?: { status?: EventStatus },
  ): Promise<
    (Pick<EventDto, 'id' | 'title' | 'publishedAt' | 'totalMessagesCount'> &
      Partial<Pick<EventDto, 'status'>>)[]
  > {
    const eventRecords = await getLatestEventsWithEventMessagesCountByStatus.run(
      { pageOffset, pageSize, status: filters?.status ?? '' },
      this.pgClient,
    )

    return eventRecords.map((er) => ({
      id: er.id,
      title: er.title,
      publishedAt: er.published_at,
      totalMessagesCount: Number(er.messages_count) ?? 0,
      status: filters?.status,
    }))
  }

  public async getTotalSessionsCount(eventId: string): Promise<number> {
    const totalSessionsCount = await getSessionCountByEventId.run(
      {
        eventId,
      },
      this.pgClient,
    )

    return Number(totalSessionsCount[0]?.count) ?? 0
  }

  public async getRegisteredAttendeesCount(eventId: string): Promise<number> {
    const registeredAttendeesCount = await getEventRegisteredAttendeesCountByEventId.run(
      {
        eventId,
      },
      this.pgClient,
    )

    return Number(registeredAttendeesCount[0]?.count) ?? 0
  }

  public async getTotalMessagesCount(eventId: string): Promise<number> {
    const messagesCount = await getEventMessagesCountByEventId.run(
      {
        eventId,
      },
      this.pgClient,
    )

    return Number(messagesCount[0]?.count) ?? 0
  }

  public async getHosts(eventId: string): Promise<HostDto[]> {
    const hosts = await getEventHostsByEventId.run(
      {
        eventId,
      },
      this.pgClient,
    )

    return hosts.map((h) => ({
      fullName: `${h.firstname} ${h.lastname}`,
      avatarUrl: h.avatar,
    }))
  }

  public async getStatus(eventId: string): Promise<EventStatus> {
    const closestSessionInfo = await this.getClosestSessionStartInfo(eventId)

    return closestSessionInfo?.status === 'upcoming'
      ? EventStatus.UPCOMING
      : EventStatus.PAST
  }

  public async getSessionDate(
    eventId: string,
  ): Promise<Date | undefined | null> {
    const closestSessionInfo = await this.getClosestSessionStartInfo(eventId)

    return (
      closestSessionInfo?.upcoming_start_at ??
      closestSessionInfo?.past_session_start_at
    )
  }

  private async getClosestSessionStartInfo(
    eventId: string,
  ): Promise<IGetClosestSessionStartInfoResult | undefined> {
    const results = await getClosestSessionStartInfo.run(
      { eventId },
      this.pgClient,
    )

    return results[0]
  }
}
