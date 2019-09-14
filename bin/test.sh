#!/bin/bash
set -e
if [ $NODE_ENV != 'development' ]
then
  exit 1
fi

redis-cli del mr:topic:test:x

PASSWORD=test node lib/main.js

redis-cli xrange mr:topic:test:x - +
