const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'celestara_backend',
  streams: [
    {
      level: 'debug',
      hostname: false,
      stream: process.stdout,
    },
  ],
});

module.exports = logger;
