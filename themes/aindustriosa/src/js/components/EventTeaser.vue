<template>
  <div class="event-teaser wrapper">
    <div class="next-event-content">
      <a :href="event.url">
        <h5>{{ event.title }}</h5>
        <strong>{{ eventDate(event.date) }}</strong>
        <span class="btn">
          Más información
        </span>
      </a>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  export default {
    props: {
      event: {
        type: [Object],
        required: true
      }
    },
    methods: {
      eventDate(date) {
        return moment(date).locale('es').format('dddd, D MMMM YYYY HH:mm')
      }
    }
  }
</script>
