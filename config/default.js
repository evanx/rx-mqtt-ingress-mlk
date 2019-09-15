module.exports = {
  maxlen: 9999,
  broker: {
    protocol: 'mqtts',
    host: 'localhost',
    port: 8883,
    rejectUnauthorized: false,
    reconnectPeriod: 4000,
  },
  logger: {
    level: 'info',
  },
  redis: {
    host: '127.0.0.1',
    keyPrefix: 'mr:',
  },
}
