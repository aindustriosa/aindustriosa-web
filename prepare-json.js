const dotenv = require('dotenv').config()
const colors = require("colors")
const fs = require('fs')
const request = require('sync-request')
const { Events, Videos, Source } = require('metagroup-schema-tools')
const moment = require('moment')
const yaml = require('json2yaml')
const lowdb = require('lowdb')
const fileSync = require('lowdb/adapters/FileSync')

const SOURCE_JSON = 'https://vigotech.org/vigotech.json'
const GENERATED_JSON = process.env.GENERATED_JSON_PATH
const JSON_SCHEMA = 'https://vigotech.org/vigotech-schema.json'
const MEMBER_KEY =  process.env.MEMBER
const VIDEOS_YML = 'source/_data/videos.yml'
const PREVIOUS_EVENTS_JSON = 'source/events.json'
const PREVIOUS_EVENTS_YML = 'source/_data/events.yml'


function eventDate(date) {
  return moment(date).format('dddd, D MMMM YYYY HH:mm')
}

function getNextEvents(member) {

  const eventEmitter = Events.getEventsEmitter()

  eventEmitter.on('getNextFromSourceInit', (source, options) => {
    console.log(`    · Getting upcoming events json for ${colors.green(options.member.name)} from ${colors.underline(source.type)}`);
  })

  eventEmitter.on('getNextFromSourceCompleted', (nextEvents, options) => {
    if (nextEvents.length === 0) {
      console.log(`        ${colors.yellow(`No upcoming events found`)}`)
    } else {
      nextEvents = Array.isArray(nextEvents) ? [nextEvents] : nextEvents

      const nextEvent = nextEvents[0]
      console.log(`        ${colors.cyan(`Upcoming event found:`)} ${colors.blue(`${colors.bold(`${nextEvent.title}`)} ${eventDate(nextEvent.date)}`)}`)
    }
    console.log();
  })

  // Get members next events
  const membersNextEvents = Events.getGroupNextEvents(member.events, {
    eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
    member: member
  })

  member.nextEvent = membersNextEvents[0]
  member.nextEvents = membersNextEvents

  return member;
}

function getPreviousEvents(member) {

  const eventEmitter = Events.getEventsEmitter()

  eventEmitter.on('getPrevFromSourceInit', (source, options) => {
    console.log(`    · Getting previous events json for ${colors.green(options.member.name)} from ${colors.underline(source.type)}`);
  })

  eventEmitter.on('getPrevFromSourceCompleted', (previousEvents, options) => {
    if (previousEvents.length === 0) {
      console.log(`        ${colors.yellow(`No previous events found`)}`)
    } else {
      previousEvents = !Array.isArray(previousEvents) ? [previousEvents] : previousEvents

      const previousEvent = previousEvents[0]
      console.log(`        ${colors.cyan(`Previous event found:`)} ${colors.blue(`${colors.bold(`${previousEvent.title}`)} ${eventDate(previousEvent.date)}`)}`)
    }
    console.log();
  })

  // Get members previous events
  return membersPrevEvents = Events.getGroupPrevEvents(member.events, {
    eventbriteToken: process.env.EVENTBRITE_OAUTH_TOKEN,
    member: member
  })
}


async function getMembersVideos(member) {

  const eventEmitter = Videos.getEventsEmitter()

  eventEmitter.on('getVideosFromSourceInit', (source, options) => {
    console.log(`    · Getting member videos for ${colors.green(options.member.name)} from ${colors.underline(source.type)}`);
  })

  eventEmitter.on('getVideosFromSourceCompleted', (videos, options) => {
    if (videos.length === 0) {
      console.log(`        ${colors.yellow(`No videos found`)}`)
    }
    else {
      console.log(`        ${colors.cyan(`Imported ${videos.length} videos`)}`)
    }
    console.log();
  })

  // Get members videos
  member.videoList = await Videos.getGroupVideos(member.videos, 50, {
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    member: member
  })

  return member
}

function saveJsonFile(data) {
  fs.writeFileSync(GENERATED_JSON, JSON.stringify(data));
  console.log(`  ${colors.inverse(`Saving ${colors.yellow(`${GENERATED_JSON}`)}`)}`);
}

function saveVideosYmlFile(videos) {
  fs.writeFileSync(VIDEOS_YML, yaml.stringify(videos));
  console.log(`  ${colors.inverse(`Saving ${colors.yellow(`${VIDEOS_YML}`)}`)}`);
}

function savePrevEventsToYmlFile(events) {
  fs.writeFileSync(PREVIOUS_EVENTS_YML, yaml.stringify(events));
  console.log(`  ${colors.inverse(`Saving ${colors.yellow(`${PREVIOUS_EVENTS_YML}`)}`)}`);
}








// Read and parse source data
console.log(`${colors.inverse("Getting vigotech.json file")}`);
console.log(`   Getting members json from ${colors.underline(SOURCE_JSON)}`)
let data = {}
try {
  const dataRaw = request('GET', SOURCE_JSON).getBody("utf8")
  data = JSON.parse(dataRaw)
} catch(e) {
  console.log(`${colors.red.inverse(e)}`);
  process.exit(1)
}

// Validate data schema
console.log(`${colors.inverse("Validate vigotech.json file")}`);
console.log(`   Getting json schema from ${colors.underline(JSON_SCHEMA)}`);
let schema = {}
try {
  const schemaRaw = request('GET', JSON_SCHEMA).getBody("utf8")
  schema = JSON.parse(schemaRaw)
} catch(e) {
  console.log(`${colors.red.inverse(e)}`);
  process.exit(1)
}
const validationResult = Source.validate(data, schema)

if (validationResult.errors.length > 0) {
  console.log(`${colors.red.inverse('Error validating source data')}`);
  console.log(typeof validationResult.errors)
  validationResult.errors.forEach( (error) => {
    console.log(`  ${colors.red(error.property + ' ' + error.message)}`)
    console.log(error.instance)
  })
  process.exit(1);
}
console.log(`   ${colors.green.inverse('OK')}`);


const memberData = getNextEvents(data.members[MEMBER_KEY])

// Import previous events
const prevEvents = getPreviousEvents(memberData)
const adapter = new fileSync(PREVIOUS_EVENTS_JSON)
const db = lowdb(adapter)
db.defaults({ events: []}).value()

// Add new avents to db
prevEvents.forEach(event => {
  if (!db.get('events').find({ date: event.date }).value()) {
    db
      .get('events')
      .push(event)
      .write();
  } else {
    db
      .get('events')
      .find({ date: event.date })
      .assign(event)
      .write();
  }
})
// Convert to json
savePrevEventsToYmlFile(db.get('events').orderBy('date', 'desc').value())

// Import next events
console.log(`${colors.inverse("Preparing json files")}`);
console.log(`${colors.bold("  Import next events")}`);

console.log();
console.log();

//Import videos
console.log(`${colors.bold("  Import videos")}`);
getMembersVideos(memberData)
  .then(memberData => {
    saveJsonFile(memberData)

    //Save videos to _data/videos.yml
    saveVideosYmlFile(memberData.videoList)

  })


