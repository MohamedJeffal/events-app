/*
  @name CreateEvents
  @param events -> ((id, title, created_at, published_at)...)
*/
INSERT INTO events (id, title, created_at, published_at)
VALUES :events
RETURNING id, title, published_at;

/* @name GetLatestEventsByStatus */
SELECT
    events.id,
    events.title,
    events.published_at
from
    events
    INNER JOIN sessions on sessions.event_id = events.id
WHERE
    (
        :status != 'draft'
        OR published_at IS NULL
    )
    AND (
        :status NOT IN ('past', 'upcoming')
        OR published_at IS NOT NULL
    )
GROUP BY
    events.id
HAVING
    (
        :status != 'upcoming'
        OR MAX(sessions.start_at) > NOW()
    )
    AND (
        :status != 'past'
        OR MAX(sessions.start_at) <= NOW()
    )
ORDER BY
    events.created_at DESC
OFFSET
    :pageOffset
LIMIT
    :pageSize;

/* @name GetLatestEventsWithEventMessagesCountByStatus */
SELECT
    events.id,
    events.title,
    events.published_at,
    COUNT(messages.id) as messages_count
from
    events
    LEFT JOIN sessions ON sessions.event_id = events.id
    LEFT JOIN messages ON messages.session_id = sessions.id
WHERE
    (
        :status != 'draft'
        OR published_at IS NULL
    )
    AND (
        :status NOT IN ('past', 'upcoming')
        OR published_at IS NOT NULL
    )
GROUP BY
    events.id
HAVING
    (
        :status != 'upcoming'
        OR MAX(sessions.start_at) > NOW()
    )
    AND (
        :status != 'past'
        OR MAX(sessions.start_at) <= NOW()
    )
ORDER BY
    events.created_at DESC
OFFSET
    :pageOffset
LIMIT
    :pageSize;
