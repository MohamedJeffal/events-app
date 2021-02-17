<template>
  <div>
    <h3 class="p-3 text-center">Latest events</h3>
    <div class="event-table" v-if="eventsPage">
      <select v-model="selectedStatus">
        <option v-for="(status, idx3) in statuses" v-bind:value="status.value" :key="idx3">
          {{ status.text }}
        </option>
      </select>
      <input v-model="newEventTile" placeholder="Enter new event title">
      <button @click="addEvent">Create event</button>
      <table class="table table-striped table-bordered">
        <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Session</th>
          <th>Sessions</th>
          <th>Hosts</th>
          <th>Attendees</th>
          <th>Messages</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(event, idx) in eventsPage.events" :key="idx">
          <td>{{ event.title }}</td>
          <td>{{ event.status.toLowerCase() }}</td>
          <td>{{ formatSessionDate(event.sessionDate) }}</td>
          <td>{{ event.totalSessionsCount }}</td>
          <td>
            <div v-for="(host, idx2) in event.hosts" :key="idx2">
              <img v-if="host.avatarUrl" :src="host.avatarUrl" :title="host.fullName">
            </div>
            <div v-if="event.hosts.length === 0">None</div>
          </td>
          <td>{{ event.registeredAttendeesCount }}</td>
          <td>{{ event.totalMessagesCount }}</td>
        </tr>
        </tbody>
      </table>
      <div class="actions">
        <button v-if="eventsPage.hasMore" @click="showMore">Show more</button>
      </div>
    </div>
  </div>

</template>

<script>
import gql from 'graphql-tag'

const pageSize = 10

const statuses = [
  {text: 'All events', value: null},
  {text: 'Upcoming events', value: 'UPCOMING'},
  {text: 'Past events', value: 'PAST'},
  {text: 'Drafted events', value: 'DRAFT'},
]

// this.$apollo.queries.users.refetch()

export default {
  name: 'app',
  data: () => ({
    page: 0,
    statuses,
    selectedStatus: null,
    newEventTile: '',
  }),
  apollo: {
    eventsPage: {
      // GraphQL Query
      query: gql`query eventsPage($page: Int!, $pageSize: Int!, $selectedStatus: EventStatus) {
        eventsPage(eventsPageInput: {page: $page, pageSize: $pageSize, filters: {status: $selectedStatus}}) {
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
      }`,
      variables() {
        return {
          page: 0,
          pageSize,
          selectedStatus: this.selectedStatus
        }
      },
    },
  },
  methods: {
    addEvent() {
      // We save the user input in case of an error
      const newTitle = this.newEventTile
      // We clear it early to give the UI a snappy feel
      this.newEventTile = ''

      return this.$apollo.mutate({
        mutation: gql`mutation createEvent($title: String!) {
            createEvent(title: $title) { id }
        }`,
        variables: {
          title: newTitle
        }
      })
      .catch((error) => {
        // Error
        console.error(error)
        // We restore the initial user input
        this.newEventTile = newTitle
      })
      .then((data) => {
        // Result
        console.log(data)

        return this.$apollo.queries.eventsPage.refetch()
      })
    },
    showMore() {
      this.page++
      // Fetch more data and transform the original result
      return this.$apollo.queries.eventsPage.fetchMore({
        // New variables
        variables: {
          page: this.page,
          pageSize,
          selectedStatus: this.selectedStatus,
        },
        // Transform the previous result with new data
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newEvents = fetchMoreResult.eventsPage.events
          const hasMore = fetchMoreResult.eventsPage.hasMore

          return {
            eventsPage: {
              __typename: previousResult.eventsPage.__typename,
              // Merging the tag list
              events: [...previousResult.eventsPage.events, ...newEvents],
              hasMore,
            },
          }
        },
      })
    },
    formatSessionDate(sessionDate) {
      if (!sessionDate) {
        return 'None'
      }

      const sessionDateLocaleString = new Date(sessionDate).toLocaleString()

      return sessionDate > new Date()
          ? `Next: ${sessionDateLocaleString}`
          : `Past: ${sessionDateLocaleString}`
    }
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #999;
  padding: 0.5rem;
  text-align: left;
}
</style>
