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

let student = {
  name: 'Mike',
  age: 23,
  gender: 'Male',
  department: 'English',
  car: 'Honda',
}

const activity = process.argv[2]
const value = process.argv[3]

const keys = Object.keys(targets)
if (!keys.includes(activity)) {
  console.log(`${activity} is not a defined activity `)
  console.log(keys)
  process.exit()
} else {
  console.log(Object.keys(targets))

  tracker[activity] = {
    ...targets[activity],
    items: [],
    ...tracker[activity],
  }
  tracker[activity].items.push({
    value,
    date: formatDate(),
  })
  switch (tracker[activity].mode) {
    case 'target':
      tracker[activity].current =
        tracker[activity].items[tracker[activity].items.length - 1].value

      break
    default:
      tracker[activity].current = tracker[activity].items.reduce(
        (sum, v) => sum + parseFloat(v.value),
        0
      )
      break
  }

  tracker[activity].remaining =
    tracker[activity].target - tracker[activity].current

  let data = JSON.stringify(tracker)
  fs.writeFileSync('tracker.json', data)
  console.log(data)
}
