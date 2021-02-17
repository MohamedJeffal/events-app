# Events app

## Tech used

**Frontend:**

- Language: JavaScript
- Vue.js
- Apollo Client
- [vue-apollo](https://vue-apollo.netlify.com/)
- graphql-tag (`gql`)

**Backend:**

- Language: Typescript
- Node.js
- Apollo Server with `NestJs`
- PostgreSQL: `pg` & `pgTyped`

## Setup

Server side:
```bash
# In /server
npm i
npm run generate

# Local db setup
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
docker cp db.sql some-postgres:docker-entrypoint-initdb.d/db.sql
docker exec -u postgres some-postgres psql postgres -f docker-entrypoint-initdb.d/db.sql

npm start
```

Client side:
```bash
# In /client
npm i

npm run serve
```

## Improvements needed
Due to spending a fair amount of time getting the client side setup (first time using vue & apollo),
I was short on time to do some things.

General: Have a way to setup server & client through a simple command (using lerna for example).

Backend:
* Add various level of descriptions to explain data & the business rules.
* Error handling: creating domain specific errors depending on which part of the app fails (+ logging).
* Refactoring db queries a bit.
* Current way of handling event pagination is simple, but is not performant & has multiple edge cases including the `showMore` computing: should implement relay paging.  
* Tests:
  * Not needing the db to be up for all tests.
  * Adding tests using the status filter + paging.
  * Units tests on the service level for business logic.
  * Testing sql queries.
  * Error cases (queries failing, invalid input, etc...).
* Performance:
  * Only call ``getClosestSessionStartInfo()`` queries once per event.
  * Try to look at a rewrite of the `getLatestEventsWithEventMessagesCountByStatus()` query
     to find another way than using a second ``LEFT JOIN``, which impacts the performance.

* Providing a `docker-compose.yml` to setup the db easily.

Client:
* Missing proper code composition, everything was done hastly.
* No documentation & tests.  
* Improve error handling by displaying a message or highlight the text input on creation.
* Should optimistically update the event lists on new event creation.
* Should look into using Apollo components (ex: ApolloQuery, ApolloMutation).
