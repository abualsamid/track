const fs = require('fs')
const targets = require('./targets.json')
const tracker = require('./tracker.json')

function formatDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

const activity = process.argv[2]
const value = parseFloat(eval(process.argv[3]))

const Dates = Object.keys(targets)
Dates.forEach((date) => {
  if (new Date(date) - new Date() > 0) {
    const keys = Object.keys(targets[date])
    if (!keys.includes(activity)) {
      console.log(`${activity} is not a defined for target ${date} `)
      console.log(keys)
    } else {
      tracker[date] = tracker[date] || {}
      tracker[date] = {
        ...tracker[date],
        [activity]: {
          ...targets[date][activity],
          items: [],
          ...tracker[date][activity],
        },
      }
      tracker[date][activity].items.push({
        value,
        date: formatDate(),
      })
      switch (targets[date][activity].mode) {
        case 'target':
          tracker[date][activity].current =
            tracker[date][activity].items[
              tracker[date][activity].items.length - 1
            ].value

          break
        default:
          tracker[date][activity].current = tracker[date][
            activity
          ].items.reduce((sum, v) => sum + parseFloat(v.value), 0)
          break
      }

      tracker[date][activity].remaining =
        Math.round(
          100 *
            (tracker[date][activity].target - tracker[date][activity].current)
        ) / 100

      let data = JSON.stringify(tracker)
      fs.writeFileSync('tracker.json', data)
      console.log(
        activity,
        'current: ',
        tracker[date][activity].current,
        ' remaining: ',
        tracker[date][activity].remaining
      )
    }
  }
})
