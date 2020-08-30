const fs = require('fs')
const targets = require('./targets.json')
const tracker = require('./tracker.json')

function formatDate(s) {
  var d = s ? new Date(s) : new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

// print week('2020-08-15', 1, new Date())
const week = (date, start = '2020-08-15') => {
  const s = typeof start === 'string' ? new Date(start) : start
  let end = new Date(s.valueOf())
  end.setDate(s.getDate() + 7)
  if (date >= s && date < end) {
    return s.toISOString().substring(0, 10)
  } else {
    if (date > new Date('2030-01-01')) {
      return 'crap'
    }
    return week(date, end)
  }
}
const displayStatus = (date) => {
  Object.keys(tracker[date]).forEach((a) => {
    const { target, current, remaining, percentComplete, weeks } = tracker[
      date
    ][a]
    console.log(
      JSON.stringify(
        { [a]: { target, current, remaining, percentComplete, weeks } },
        null,
        2
      )
    )
  })
}
const addEntry = (date, activity, value) => {
  const keys = Object.keys(targets[date])
  const today = new Date()
  const todayFormatted = formatDate()
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
        weeks: {},
        ...tracker[date][activity],
      },
    }
    tracker[date][activity].items.push({
      value,
      date: todayFormatted,
    })
    switch (targets[date][activity].mode) {
      case 'target':
        tracker[date][activity].current =
          tracker[date][activity].items[
            tracker[date][activity].items.length - 1
          ].value
        tracker[date][activity].weeks[week(today)] = parseFloat(value)
        break
      default:
        tracker[date][activity].current = tracker[date][activity].items.reduce(
          (sum, v) => sum + parseFloat(v.value),
          0
        )
        tracker[date][activity].weeks[week(today)] =
          (tracker[date][activity].weeks[week(today)] || 0) + parseFloat(value)
        break
    }

    tracker[date][activity].remaining =
      Math.round(
        100 * (tracker[date][activity].target - tracker[date][activity].current)
      ) / 100

    tracker[date][activity].percentComplete =
      Math.round(
        (10000 * tracker[date][activity].current) /
          tracker[date][activity].target
      ) / 100

    let data = JSON.stringify(tracker)
    fs.writeFileSync('tracker.json', data)
    console.log(tracker[date][activity])
  }
}

const main = () => {
  const activity = process.argv[2]
  const value = parseFloat(eval(process.argv[3]))

  const Dates = Object.keys(targets)
  Dates.forEach((date) => {
    if (new Date(date) - new Date() > 0) {
      if (process.argv.length == 2) {
        displayStatus(date)
      } else {
        addEntry(date, activity, value)
      }
    }
  })
}

main()
