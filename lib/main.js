const assert = require('assert')
const config = require('config')
const Redis = require('ioredis')
const mqttLib = require('async-mqtt')
const logger = require('pino')(Object.assign({ name: 'main' }, config.logger))

const redis = new Redis(config.redis)
assert(process.env.PASSWORD, 'PASSWORD')
const mqtt = mqttLib.connect(
  Object.assign(
    { clientId: config.broker.username, password: process.env.PASSWORD },
    config.broker,
  ),
)

const app = {}

const end = async (message, err) => {
  logger.error({ err }, message)
  process.exit(1)
}

process.on('unhandledRejection', (err, promise) =>
  end('unhandledRejection', err),
)

const start = async () => {
  logger.info({ NODE_ENV: process.env.NODE_ENV, config }, 'start')
  try {
    mqtt.on('error', err => end('mqttClient', err))
    mqtt.on('message', async (topic, messageBuffer) => {
      const messageString = messageBuffer.toString()
      logger.debug({ topic, messageString }, 'message')
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
    mqtt.on('connect', async () => {
      await mqtt.subscribe(config.subscribeTopic)
      if (!app.started) {
        const now = new Date()
        app.started = now.toISOString()
        await mqtt.publish(
          config.subscribeTopic,
          JSON.stringify({
            type: 'started',
            time: now.getTime(),
            source: config.broker.username,
          }),
        )
      }
    })
  } catch (err) {
    end(err)
  }
}

start()
