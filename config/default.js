module.exports = {
  maxlen: 9999,
  broker: {
    protocol: 'mqtts',
    host: 'localhost',
    port: 8883,
    rejectUnauthorized: false,
  },
  logger: {
    level: 'info',
  },
  redis: {
    host: '127.0.0.1',
    keyPrefix: 'mr:',
  },
}
