<template>
  <div id="app">
    <Events />
  </div>
</template>

<script>
import Events from './components/Events.vue'

export default {
  name: 'App',
  components: {
    Events
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
