/** Types generated for queries found in "src\events\dao\events.sql" */
import { PreparedQuery } from '@pgtyped/query'

/** 'CreateEvents' parameters type */
export interface ICreateEventsParams {
  events: readonly {
    id: string | null | void
    title: string | null | void
    created_at: Date | null | void
    published_at: Date | null | void
  }[]
}

/** 'CreateEvents' return type */
export interface ICreateEventsResult {
  id: string
  title: string
  published_at: Date | null
}

/** 'CreateEvents' query type */
export interface ICreateEventsQuery {
  params: ICreateEventsParams
  result: ICreateEventsResult
}

const createEventsIR: any = {
  name: 'CreateEvents',
  params: [
    {
      name: 'events',
      codeRefs: {
        defined: { a: 35, b: 40, line: 3, col: 9 },
        used: [{ a: 159, b: 164, line: 6, col: 8 }],
      },
      transform: {
        type: 'pick_array_spread',
        keys: ['id', 'title', 'created_at', 'published_at'],
      },
    },
  ],
  usedParamSet: { events: true },
  statement: {
    body:
      'INSERT INTO events (id, title, created_at, published_at)\r\nVALUES :events\r\nRETURNING id, title, published_at',
    loc: { a: 93, b: 199, line: 5, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO events (id, title, created_at, published_at)
 * VALUES :events
 * RETURNING id, title, published_at
 * ```
 */
export const createEvents = new PreparedQuery<
  ICreateEventsParams,
  ICreateEventsResult
>(createEventsIR)

/** 'GetLatestEventsByStatus' parameters type */
export interface IGetLatestEventsByStatusParams {
  status: string | null | void
  pageOffset: number
  pageSize: number
}

/** 'GetLatestEventsByStatus' return type */
export interface IGetLatestEventsByStatusResult {
  id: string
  title: string
  published_at: Date | null
}

/** 'GetLatestEventsByStatus' query type */
export interface IGetLatestEventsByStatusQuery {
  params: IGetLatestEventsByStatusParams
  result: IGetLatestEventsByStatusResult
}

const getLatestEventsByStatusIR: any = {
  name: 'GetLatestEventsByStatus',
  params: [
    {
      name: 'status',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 409, b: 414, line: 19, col: 9 },
          { a: 488, b: 493, line: 23, col: 9 },
          { a: 617, b: 622, line: 30, col: 9 },
          { a: 709, b: 714, line: 34, col: 9 },
        ],
      },
    },
    {
      name: 'pageOffset',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 829, b: 838, line: 40, col: 5 }] },
    },
    {
      name: 'pageSize',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 853, b: 860, line: 42, col: 5 }] },
    },
  ],
  usedParamSet: { status: true, pageOffset: true, pageSize: true },
  statement: {
    body:
      "SELECT\r\n    events.id,\r\n    events.title,\r\n    events.published_at\r\nfrom\r\n    events\r\n    INNER JOIN sessions on sessions.event_id = events.id\r\nWHERE\r\n    (\r\n        :status != 'draft'\r\n        OR published_at IS NULL\r\n    )\r\n    AND (\r\n        :status NOT IN ('past', 'upcoming')\r\n        OR published_at IS NOT NULL\r\n    )\r\nGROUP BY\r\n    events.id\r\nHAVING\r\n    (\r\n        :status != 'upcoming'\r\n        OR MAX(sessions.start_at) > NOW()\r\n    )\r\n    AND (\r\n        :status != 'past'\r\n        OR MAX(sessions.start_at) <= NOW()\r\n    )\r\nORDER BY\r\n    events.created_at DESC\r\nOFFSET\r\n    :pageOffset\r\nLIMIT\r\n    :pageSize",
    loc: { a: 242, b: 860, line: 10, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     events.id,
 *     events.title,
 *     events.published_at
 * from
 *     events
 *     INNER JOIN sessions on sessions.event_id = events.id
 * WHERE
 *     (
 *         :status != 'draft'
 *         OR published_at IS NULL
 *     )
 *     AND (
 *         :status NOT IN ('past', 'upcoming')
 *         OR published_at IS NOT NULL
 *     )
 * GROUP BY
 *     events.id
 * HAVING
 *     (
 *         :status != 'upcoming'
 *         OR MAX(sessions.start_at) > NOW()
 *     )
 *     AND (
 *         :status != 'past'
 *         OR MAX(sessions.start_at) <= NOW()
 *     )
 * ORDER BY
 *     events.created_at DESC
 * OFFSET
 *     :pageOffset
 * LIMIT
 *     :pageSize
 * ```
 */
export const getLatestEventsByStatus = new PreparedQuery<
  IGetLatestEventsByStatusParams,
  IGetLatestEventsByStatusResult
>(getLatestEventsByStatusIR)

/** 'GetLatestEventsWithEventMessagesCountByStatus' parameters type */
export interface IGetLatestEventsWithEventMessagesCountByStatusParams {
  status: string | null | void
  pageOffset: number
  pageSize: number
}

/** 'GetLatestEventsWithEventMessagesCountByStatus' return type */
export interface IGetLatestEventsWithEventMessagesCountByStatusResult {
  id: string
  title: string
  published_at: Date | null
  messages_count: string | null
}

/** 'GetLatestEventsWithEventMessagesCountByStatus' query type */
export interface IGetLatestEventsWithEventMessagesCountByStatusQuery {
  params: IGetLatestEventsWithEventMessagesCountByStatusParams
  result: IGetLatestEventsWithEventMessagesCountByStatusResult
}

const getLatestEventsWithEventMessagesCountByStatusIR: any = {
  name: 'GetLatestEventsWithEventMessagesCountByStatus',
  params: [
    {
      name: 'status',
      transform: { type: 'scalar' },
      codeRefs: {
        used: [
          { a: 1195, b: 1200, line: 56, col: 9 },
          { a: 1274, b: 1279, line: 60, col: 9 },
          { a: 1403, b: 1408, line: 67, col: 9 },
          { a: 1495, b: 1500, line: 71, col: 9 },
        ],
      },
    },
    {
      name: 'pageOffset',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 1615, b: 1624, line: 77, col: 5 }] },
    },
    {
      name: 'pageSize',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 1639, b: 1646, line: 79, col: 5 }] },
    },
  ],
  usedParamSet: { status: true, pageOffset: true, pageSize: true },
  statement: {
    body:
      "SELECT\r\n    events.id,\r\n    events.title,\r\n    events.published_at,\r\n    COUNT(messages.id) as messages_count\r\nfrom\r\n    events\r\n    LEFT JOIN sessions ON sessions.event_id = events.id\r\n    LEFT JOIN messages ON messages.session_id = sessions.id\r\nWHERE\r\n    (\r\n        :status != 'draft'\r\n        OR published_at IS NULL\r\n    )\r\n    AND (\r\n        :status NOT IN ('past', 'upcoming')\r\n        OR published_at IS NOT NULL\r\n    )\r\nGROUP BY\r\n    events.id\r\nHAVING\r\n    (\r\n        :status != 'upcoming'\r\n        OR MAX(sessions.start_at) > NOW()\r\n    )\r\n    AND (\r\n        :status != 'past'\r\n        OR MAX(sessions.start_at) <= NOW()\r\n    )\r\nORDER BY\r\n    events.created_at DESC\r\nOFFSET\r\n    :pageOffset\r\nLIMIT\r\n    :pageSize",
    loc: { a: 925, b: 1646, line: 45, col: 0 },
  },
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     events.id,
 *     events.title,
 *     events.published_at,
 *     COUNT(messages.id) as messages_count
 * from
 *     events
 *     LEFT JOIN sessions ON sessions.event_id = events.id
 *     LEFT JOIN messages ON messages.session_id = sessions.id
 * WHERE
 *     (
 *         :status != 'draft'
 *         OR published_at IS NULL
 *     )
 *     AND (
 *         :status NOT IN ('past', 'upcoming')
 *         OR published_at IS NOT NULL
 *     )
 * GROUP BY
 *     events.id
 * HAVING
 *     (
 *         :status != 'upcoming'
 *         OR MAX(sessions.start_at) > NOW()
 *     )
 *     AND (
 *         :status != 'past'
 *         OR MAX(sessions.start_at) <= NOW()
 *     )
 * ORDER BY
 *     events.created_at DESC
 * OFFSET
 *     :pageOffset
 * LIMIT
 *     :pageSize
 * ```
 */
export const getLatestEventsWithEventMessagesCountByStatus = new PreparedQuery<
  IGetLatestEventsWithEventMessagesCountByStatusParams,
  IGetLatestEventsWithEventMessagesCountByStatusResult
>(getLatestEventsWithEventMessagesCountByStatusIR)
