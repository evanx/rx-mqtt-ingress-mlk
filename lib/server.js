const config = require('config')
const lodash = require('lodash')
const logger = require('pino')(Object.assign({ name: 'main' }, config.logger))
const mqtt = require('async-mqtt')

const client = mqtt.connect(
  Object.assign({ clientId: config.broker.username }, config.broker),
)

const start = async () => {
  logger.info({ config }, 'start')
  try {
    await client.publish('server', 'test')
    await client.end()
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()
