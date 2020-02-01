import Vue from 'vue'
import UpcomingEventsApp from './components/UpcomingEventsApp.vue'

import moment from 'moment'
import axios from 'axios'

const vmUpcoming = new Vue({
  data: {
    nextEvents: []
  },
  render: h => h(UpcomingEventsApp)
}).$mount('#upcoming-events')


const base = window.location.protocol + "//" + window.location.host
axios.get(`${base}/phpvigo.json`).then((data) => {
  vmUpcoming.nextEvents = data.data.nextEvents.filter(event => {
    return moment(event.date) >= new Date()
  })

  // const videos = data.data.videos
})




