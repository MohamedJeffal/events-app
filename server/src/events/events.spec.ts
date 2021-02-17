import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import * as uuid from 'uuid/v4'
import { AppModule } from '../app.module'
import { EventsService } from './events.service'
import { EventStatus } from './dto/events.dto'
import * as faker from 'faker'

function mockMultipleResolvedCalls(spyToMock, mockResolvedValues) {
  for (const mockValue of mockResolvedValues) {
    spyToMock.mockResolvedValueOnce(mockValue)
  }
}

function buildExpectedEvent(
  status: EventStatus,
  publishedAt: Date | null,
  sessionDate: Date | null,
  title?: string,
) {
  return {
    id: uuid(),
    title: title ?? faker.lorem.sentence(),
    status,
    publishedAt,
    sessionDate,
    totalMessagesCount: faker.random.number(1000),
    totalSessionsCount: faker.random.number(20),
    hosts: [
      {
        fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
        avatarUrl: faker.image.avatar(),
      },
    ],
    registeredAttendeesCount: faker.random.number(100),
  }
}

describe('Integration - Events', () => {
  let app: INestApplication
  let eventsService: EventsService

  let getLatestEventsWithMessagesCountSpy
  let getSessionDateSpy
  let getTotalSessionsCountSpy
  let getRegisteredAttendeesCountSpy
  let getHostsSpy

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    eventsService = await app.resolve<EventsService>(EventsService)

    await app.init()
  })

  beforeEach(() => {
    // Let's define some default mock values
    getLatestEventsWithMessagesCountSpy = jest
      .spyOn(eventsService, 'getLatestEventsWithMessagesCount')
      .mockResolvedValue([])

    getSessionDateSpy = jest
      .spyOn(eventsService, 'getSessionDate')
      .mockResolvedValue(new Date())

    getTotalSessionsCountSpy = jest
      .spyOn(eventsService, 'getTotalSessionsCount')
      .mockResolvedValue(9)

    getRegisteredAttendeesCountSpy = jest
      .spyOn(eventsService, 'getRegisteredAttendeesCount')
      .mockResolvedValue(42)

    getHostsSpy = jest.spyOn(eventsService, 'getHosts').mockResolvedValue([
      {
        fullName: 'fullname_example',
        avatarUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/100px-Gull_portrait_ca_usa.jpg',
      },
    ])
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('eventsPage', () => {
    it('Should return a page with the most recent 3 events', async () => {
      const expectedEvents = [
        buildExpectedEvent(EventStatus.DRAFT, null, faker.date.future()),
        buildExpectedEvent(
          EventStatus.PAST,
          faker.date.past(),
          faker.date.recent(10),
        ),
        buildExpectedEvent(
          EventStatus.UPCOMING,
          faker.date.future(),
          faker.date.future(),
        ),
      ]

      getLatestEventsWithMessagesCountSpy.mockResolvedValueOnce(
        expectedEvents.map((ee) => ({
          id: ee.id,
          title: ee.title,
          publishedAt: ee.publishedAt,
          status: ee.status,
          totalMessagesCount: ee.totalMessagesCount,
        })),
      )

      mockMultipleResolvedCalls(
        getSessionDateSpy,
        expectedEvents.map((ee) => ee.sessionDate),
      )

      mockMultipleResolvedCalls(
        getTotalSessionsCountSpy,
        expectedEvents.map((ee) => ee.totalSessionsCount),
      )

      mockMultipleResolvedCalls(
        getRegisteredAttendeesCountSpy,
        expectedEvents.map((ee) => ee.registeredAttendeesCount),
      )

      mockMultipleResolvedCalls(
        getHostsSpy,
        expectedEvents.map((ee) => ee.hosts),
      )

      const { status, body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              eventsPage(eventsPageInput: { page: 0, pageSize: 5 }) {
                events {
                  id
                  title
                  status
                  sessionDate
                  totalSessionsCount
                  hosts {
                    fullName
                    avatarUrl
                  }
                  registeredAttendeesCount
                  totalMessagesCount
                }
                hasMore
              }
            }
          `,
        })

      expect(status).toEqual(200)
      expect(body.errors).toBeUndefined()

      expect(body.data.eventsPage).toEqual(
        JSON.parse(
          JSON.stringify({
            events: expectedEvents.map((ee) => ({
              ...ee,
              publishedAt: undefined,
              status: ee.status.toUpperCase(),
            })),
            hasMore: false,
          }),
        ),
      )

      expect(getLatestEventsWithMessagesCountSpy).toHaveBeenCalledTimes(1)
      expect(getSessionDateSpy).toHaveBeenCalledTimes(3)
      expect(getTotalSessionsCountSpy).toHaveBeenCalledTimes(3)
      expect(getRegisteredAttendeesCountSpy).toHaveBeenCalledTimes(3)
      expect(getHostsSpy).toHaveBeenCalledTimes(3)
    })
  })

  describe('createEvent', () => {
    let createEventSpy
    let getTotalMessagesCountSpy

    beforeEach(() => {
      createEventSpy = jest
        .spyOn(eventsService, 'createEvent')
        .mockResolvedValue({
          id: uuid(),
          title: 'example_title',
          publishedAt: new Date(),
        })

      getTotalMessagesCountSpy = jest
        .spyOn(eventsService, 'getTotalMessagesCount')
        .mockResolvedValue(0)
    })

    it('Should create a new event from a title', async () => {
      const expectedEvent = buildExpectedEvent(
        EventStatus.DRAFT,
        null,
        null,
        'A newly created event',
      )

      createEventSpy.mockResolvedValueOnce({
        id: expectedEvent.id,
        title: expectedEvent.title,
        publishedAt: expectedEvent.publishedAt,
      })

      getSessionDateSpy.mockResolvedValueOnce(expectedEvent.sessionDate)
      getTotalSessionsCountSpy.mockResolvedValueOnce(
        expectedEvent.totalSessionsCount,
      )
      getRegisteredAttendeesCountSpy.mockResolvedValueOnce(
        expectedEvent.registeredAttendeesCount,
      )
      getHostsSpy.mockResolvedValueOnce(expectedEvent.hosts)
      getTotalMessagesCountSpy.mockResolvedValueOnce(
        expectedEvent.totalMessagesCount,
      )

      const { status, body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createEvent(title: "A newly created event") {
                  id
                  title
                  status
                  sessionDate
                  totalSessionsCount
                  hosts {
                      fullName
                      avatarUrl
                  }
                  registeredAttendeesCount
                  totalMessagesCount
              }
            }
          `,
        })

      expect(status).toEqual(200)
      expect(body.errors).toBeUndefined()

      expect(body.data.createEvent).toEqual(
        JSON.parse(
          JSON.stringify({
            ...expectedEvent,
            publishedAt: undefined,
            status: expectedEvent.status.toUpperCase(),
          }),
        ),
      )

      expect(getSessionDateSpy).toHaveBeenCalledTimes(1)
      expect(getTotalSessionsCountSpy).toHaveBeenCalledTimes(1)
      expect(getRegisteredAttendeesCountSpy).toHaveBeenCalledTimes(1)
    })
  })
})
