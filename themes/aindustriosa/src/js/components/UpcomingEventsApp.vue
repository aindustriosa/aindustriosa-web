<template>
  <div v-if="nextEvents.length > 0" class="upcoming-events">
    <h4>
      <i class="fa fa-calendar" />
      <span v-if="nextEvents.length == 1">Próximo evento</span>
      <span v-else>Próximos eventos</span>
    </h4>

    <event-teaser
        v-for="(nextEvent, key) in nextEvents"
        :key="key"
        :event="nextEvent"
    />
  </div>
</template>

<script>
  import EventTeaser from './EventTeaser'
  import axios from 'axios'
  import moment from 'moment'

  export default {
    components: { EventTeaser },
    computed: {
      nextEvents() {
        return this.$root.nextEvents
      }
    }
  }
</script>
