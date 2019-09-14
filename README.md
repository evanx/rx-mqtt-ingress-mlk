# rx-mqtt-ingress-mlk

Microservice for MQTT ingress into Redis streams.

- `rx` - the stack includes Redis streams
- `mlk` - named in honour of MLK

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
- `subscribeTopic` - the topic to which to subscribe and push into the stream

### env

A further environment variable is the MQTT `PASSWORD.` It is not included in `custom-environment-variables.js` as `config` is logged at startup.

```javascript
module.exports = {
  broker: {
    username: 'USERNAME',
  },
  subscribeTopic: 'TOPIC',
  maxlen: 'MAXLEN',
}
```
