/** Types generated for queries found in "src\events\dao\event.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetClosestSessionStartInfo' parameters type */
export interface IGetClosestSessionStartInfoParams {
  eventId: string | null | void;
}

/** 'GetClosestSessionStartInfo' return type */
export interface IGetClosestSessionStartInfoResult {
  upcoming_start_at: Date;
  past_session_start_at: Date;
  status: string | null;
}

/** 'GetClosestSessionStartInfo' query type */
export interface IGetClosestSessionStartInfoQuery {
  params: IGetClosestSessionStartInfoParams;
  result: IGetClosestSessionStartInfoResult;
}

const getClosestSessionStartInfoIR: any = {"name":"GetClosestSessionStartInfo","params":[{"name":"eventId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":157,"b":163,"line":8,"col":20},{"a":361,"b":367,"line":20,"col":20}]}}],"usedParamSet":{"eventId":true},"statement":{"body":"with upcoming_session as (\r\n    SELECT\r\n        start_at\r\n    from\r\n        sessions\r\n    WHERE\r\n        event_id = :eventId\r\n        AND start_at > NOW()\r\n    ORDER BY\r\n        start_at\r\n    LIMIT\r\n        1\r\n), past_session as (\r\n    SELECT\r\n        start_at\r\n    from\r\n        sessions\r\n    WHERE\r\n        event_id = :eventId\r\n        AND start_at <= NOW()\r\n    ORDER BY\r\n        start_at DESC\r\n    LIMIT\r\n        1\r\n)\r\nSELECT\r\n    u.start_at as upcoming_start_at,\r\n    p.start_at as past_session_start_at,\r\n    CASE\r\n        WHEN u.start_at IS NOT NULL THEN 'upcoming'\r\n        ELSE 'past'\r\n    END status\r\nfrom\r\n    (\r\n        select\r\n           \tstart_at\r\n        from\r\n            (\r\n                select\r\n                    1 as x\r\n            ) x\r\n            left join upcoming_session on x.x = 1\r\n    ) u,\r\n    (\r\n        select\r\n            start_at\r\n        from\r\n            (\r\n                select\r\n                    1 as x\r\n            ) x\r\n            left join past_session on x.x = 1\r\n    ) p","loc":{"a":40,"b":1057,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * with upcoming_session as (
 *     SELECT
 *         start_at
 *     from
 *         sessions
 *     WHERE
 *         event_id = :eventId
 *         AND start_at > NOW()
 *     ORDER BY
 *         start_at
 *     LIMIT
 *         1
 * ), past_session as (
 *     SELECT
 *         start_at
 *     from
 *         sessions
 *     WHERE
 *         event_id = :eventId
 *         AND start_at <= NOW()
 *     ORDER BY
 *         start_at DESC
 *     LIMIT
 *         1
 * )
 * SELECT
 *     u.start_at as upcoming_start_at,
 *     p.start_at as past_session_start_at,
 *     CASE
 *         WHEN u.start_at IS NOT NULL THEN 'upcoming'
 *         ELSE 'past'
 *     END status
 * from
 *     (
 *         select
 *            	start_at
 *         from
 *             (
 *                 select
 *                     1 as x
 *             ) x
 *             left join upcoming_session on x.x = 1
 *     ) u,
 *     (
 *         select
 *             start_at
 *         from
 *             (
 *                 select
 *                     1 as x
 *             ) x
 *             left join past_session on x.x = 1
 *     ) p
 * ```
 */
export const getClosestSessionStartInfo = new PreparedQuery<IGetClosestSessionStartInfoParams,IGetClosestSessionStartInfoResult>(getClosestSessionStartInfoIR);


/** 'GetSessionCountByEventId' parameters type */
export interface IGetSessionCountByEventIdParams {
  eventId: string | null | void;
}

/** 'GetSessionCountByEventId' return type */
export interface IGetSessionCountByEventIdResult {
  count: string | null;
}

/** 'GetSessionCountByEventId' query type */
export interface IGetSessionCountByEventIdQuery {
  params: IGetSessionCountByEventIdParams;
  result: IGetSessionCountByEventIdResult;
}

const getSessionCountByEventIdIR: any = {"name":"GetSessionCountByEventId","params":[{"name":"eventId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1176,"b":1182,"line":62,"col":16}]}}],"usedParamSet":{"eventId":true},"statement":{"body":"SELECT\r\n    COUNT(sessions.id)\r\nfrom\r\n    sessions\r\nWHERE\r\n    event_id = :eventId","loc":{"a":1101,"b":1182,"line":57,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     COUNT(sessions.id)
 * from
 *     sessions
 * WHERE
 *     event_id = :eventId
 * ```
 */
export const getSessionCountByEventId = new PreparedQuery<IGetSessionCountByEventIdParams,IGetSessionCountByEventIdResult>(getSessionCountByEventIdIR);


/** 'GetEventHostsByEventId' parameters type */
export interface IGetEventHostsByEventIdParams {
  eventId: string | null | void;
}

/** 'GetEventHostsByEventId' return type */
export interface IGetEventHostsByEventIdResult {
  firstname: string;
  lastname: string;
  avatar: string | null;
}

/** 'GetEventHostsByEventId' query type */
export interface IGetEventHostsByEventIdQuery {
  params: IGetEventHostsByEventIdParams;
  result: IGetEventHostsByEventIdResult;
}

const getEventHostsByEventIdIR: any = {"name":"GetEventHostsByEventId","params":[{"name":"eventId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1410,"b":1416,"line":73,"col":29}]}}],"usedParamSet":{"eventId":true},"statement":{"body":"SELECT\r\n    users.firstname,\r\n    users.lastname,\r\n    users.avatar\r\nfrom\r\n    users\r\n    INNER JOIN events_users ON users.id = events_users.user_id\r\nWHERE\r\n    events_users.event_id = :eventId\r\n    AND events_users.is_host IS TRUE","loc":{"a":1224,"b":1454,"line":65,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     users.firstname,
 *     users.lastname,
 *     users.avatar
 * from
 *     users
 *     INNER JOIN events_users ON users.id = events_users.user_id
 * WHERE
 *     events_users.event_id = :eventId
 *     AND events_users.is_host IS TRUE
 * ```
 */
export const getEventHostsByEventId = new PreparedQuery<IGetEventHostsByEventIdParams,IGetEventHostsByEventIdResult>(getEventHostsByEventIdIR);


/** 'GetEventRegisteredAttendeesCountByEventId' parameters type */
export interface IGetEventRegisteredAttendeesCountByEventIdParams {
  eventId: string | null | void;
}

/** 'GetEventRegisteredAttendeesCountByEventId' return type */
export interface IGetEventRegisteredAttendeesCountByEventIdResult {
  count: string | null;
}

/** 'GetEventRegisteredAttendeesCountByEventId' query type */
export interface IGetEventRegisteredAttendeesCountByEventIdQuery {
  params: IGetEventRegisteredAttendeesCountByEventIdParams;
  result: IGetEventRegisteredAttendeesCountByEventIdResult;
}

const getEventRegisteredAttendeesCountByEventIdIR: any = {"name":"GetEventRegisteredAttendeesCountByEventId","params":[{"name":"eventId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1591,"b":1597,"line":82,"col":16}]}}],"usedParamSet":{"eventId":true},"statement":{"body":"SELECT\r\n    COUNT(event_id)\r\nfrom\r\n    events_users\r\nWHERE\r\n    event_id = :eventId\r\n    AND is_host IS FALSE","loc":{"a":1515,"b":1623,"line":77,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     COUNT(event_id)
 * from
 *     events_users
 * WHERE
 *     event_id = :eventId
 *     AND is_host IS FALSE
 * ```
 */
export const getEventRegisteredAttendeesCountByEventId = new PreparedQuery<IGetEventRegisteredAttendeesCountByEventIdParams,IGetEventRegisteredAttendeesCountByEventIdResult>(getEventRegisteredAttendeesCountByEventIdIR);


/** 'GetEventMessagesCountByEventId' parameters type */
export interface IGetEventMessagesCountByEventIdParams {
  eventId: string | null | void;
}

/** 'GetEventMessagesCountByEventId' return type */
export interface IGetEventMessagesCountByEventIdResult {
  count: string | null;
}

/** 'GetEventMessagesCountByEventId' query type */
export interface IGetEventMessagesCountByEventIdQuery {
  params: IGetEventMessagesCountByEventIdParams;
  result: IGetEventMessagesCountByEventIdResult;
}

const getEventMessagesCountByEventIdIR: any = {"name":"GetEventMessagesCountByEventId","params":[{"name":"eventId","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":1819,"b":1825,"line":92,"col":25}]}}],"usedParamSet":{"eventId":true},"statement":{"body":"SELECT\r\n    COUNT(messages.id)\r\nfrom\r\n    messages\r\n    INNER JOIN sessions ON sessions.id = messages.session_id\r\nWHERE\r\n    sessions.event_id = :eventId","loc":{"a":1673,"b":1825,"line":86,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     COUNT(messages.id)
 * from
 *     messages
 *     INNER JOIN sessions ON sessions.id = messages.session_id
 * WHERE
 *     sessions.event_id = :eventId
 * ```
 */
export const getEventMessagesCountByEventId = new PreparedQuery<IGetEventMessagesCountByEventIdParams,IGetEventMessagesCountByEventIdResult>(getEventMessagesCountByEventIdIR);


