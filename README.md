# rx-mqtt-ingress-mlk

Microservice for MQTT ingress into Redis streams.

- `rx` - the stack includes Redis streams
- `mlk` - suite named in honour of MLK

## config

See https://github.com/evanx/rx-mqtt-ingress-mlk/tree/master/config

```javascript
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
```

- `maxlen` - limit the size of the stream.

### env

A further environment variable is the MQTT `PASSWORD.` It is not included in `custom-environment-variables` so that `config` can be safely logged out at startup.

```javascript
module.exports = {
  maxlen: 'MAXLEN',
  broker: {
    username: 'USERNAME',
  },
  subscribeTopic: 'TOPIC',
}
```

- `subscribeTopic` - the topic to which to subscribe and push into the stream

## Implementation

https://github.com/evanx/rx-mqtt-ingress-mlk/blob/master/lib/main.js

```javascript
mqtt.on('connect', () => mqtt.subscribe(config.subscribeTopic))
mqtt.on('message', (topic, message) =>
  redis.xadd(
    `topic:${topic}:x`,
    'maxlen',
    '~',
    config.maxlen,
    '*',
    'message',
    message.toString(),
  ),
)
```
