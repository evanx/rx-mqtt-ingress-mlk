require('dotenv').config({
  path: require('path').join(process.env.HOME, '.mqtt-ingress', 'dotenv'),
})
const assert = require('assert')
const config = require('config')
const Redis = require('ioredis')
const Mqtt = require('async-mqtt')
const logger = require('pino')(Object.assign({ name: 'main' }, config.logger))
const redis = new Redis(config.redis)
assert(process.env.PASSWORD, 'PASSWORD')
const mqtt = Mqtt.connect(
  Object.assign(
    { clientId: config.broker.username, password: process.env.PASSWORD },
    config.broker,
  ),
)
const app = {}

const end = async ({ message, err }) => {
  logger.error({ err }, message)
  process.exit(1)
}

process.on('unhandledRejection', (err, promise) =>
  end({ message: 'unhandledRejection', err }),
)

const start = async () => {
  logger.info({ NODE_ENV: process.env.NODE_ENV, config }, 'start')
  try {
    mqtt.on('error', err => end({ message: 'mqttClient', err }))
    mqtt.on('message', async (topic, messageBuffer) => {
      const messageString = messageBuffer.toString()
      const message = JSON.parse(messageString)
      const { type, source } = message
      logger.debug({ type, source }, 'message')
      await redis.xadd(
        `topic:${topic}:x`,
        'maxlen',
        '~',
        config.maxlen,
        '*',
        'message',
        messageString,
      )
    })
    mqtt.on('reconnect', () => logger.info('reconnect'))
    mqtt.on('connect', async () => {
      logger.info({ subscribeTopic: config.subscribeTopic }, 'connect')
      await mqtt.subscribe(config.subscribeTopic)
      if (!app.started) {
        app.started = Date.now()
      }
    })
  } catch (err) {
    end({ message: 'start', err })
  }
}

start()
