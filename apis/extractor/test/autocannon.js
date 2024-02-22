const autocannon = require('autocannon')

// http://127.0.0.1:4504/pool-codes/1
const url = 'http://127.0.0.1:4504'

const instance = autocannon(
  {
    url,
    duration: 30,
    requests: [
      {
        method: 'GET',
        path: '/pool-codes/1'
      },
    ],
  },
  console.log,
)

// this is used to kill the instance on CTRL-C
process.once('SIGINT', () => {
  instance.stop()
})

// just render results
autocannon.track(instance, { renderProgressBar: true })
