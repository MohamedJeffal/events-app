/* @name GetClosestSessionStartInfo */
with upcoming_session as (
    SELECT
        start_at
    from
        sessions
    WHERE
        event_id = :eventId
        AND start_at > NOW()
    ORDER BY
        start_at
    LIMIT
        1
), past_session as (
    SELECT
        start_at
    from
        sessions
    WHERE
        event_id = :eventId
        AND start_at <= NOW()
    ORDER BY
        start_at DESC
    LIMIT
        1
)
SELECT
    u.start_at as upcoming_start_at,
    p.start_at as past_session_start_at,
    CASE
        WHEN u.start_at IS NOT NULL THEN 'upcoming'
        ELSE 'past'
    END status
from
    (
        select
           	start_at
        from
            (
                select
                    1 as x
            ) x
            left join upcoming_session on x.x = 1
    ) u,
    (
        select
            start_at
        from
            (
                select
                    1 as x
            ) x
            left join past_session on x.x = 1
    ) p;

/* @name GetSessionCountByEventId */
SELECT
    COUNT(sessions.id)
from
    sessions
WHERE
    event_id = :eventId;

/* @name GetEventHostsByEventId */
SELECT
    users.firstname,
    users.lastname,
    users.avatar
from
    users
    INNER JOIN events_users ON users.id = events_users.user_id
WHERE
    events_users.event_id = :eventId
    AND events_users.is_host IS TRUE;

/* @name GetEventRegisteredAttendeesCountByEventId */
SELECT
    COUNT(event_id)
from
    events_users
WHERE
    event_id = :eventId
    AND is_host IS FALSE;

/* @name GetEventMessagesCountByEventId */
SELECT
    COUNT(messages.id)
from
    messages
    INNER JOIN sessions ON sessions.id = messages.session_id
WHERE
    sessions.event_id = :eventId;