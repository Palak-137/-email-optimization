const Queue = require('bull');
const path = require('path');
const numCPUs = require('os').cpus.length;

const { REDIS_PORT, REDIS_URI } = require("../config/redisCredentials");

const emailQueue = new Queue('emailQueue', {
  redis: {
    port: REDIS_PORT, host: REDIS_URI
  }
})
emailQueue.process(path.join(__dirname, 'emailQueueProcessor.js'));

const emailQueue2 = new Queue('emailQueue2', {
    redis: {
      port: REDIS_PORT, host: REDIS_URI
    }
  })
emailQueue2.process(path.join(__dirname, 'emailQueueProcessor.js'));

const emailQueue3 = new Queue('emailQueue3', {
    redis: {
      port: REDIS_PORT, host: REDIS_URI
    }
  })
  emailQueue3.process(path.join(__dirname, 'emailQueueProcessor.js'));

  
emailQueue.on('completed', (job) => {
    console.log("number of cpus :",numCPUs);
    console.log(`completed #${job.id} Job by queue`);
});
emailQueue2.on('completed', (job) => {
    console.log("number of cpus :",numCPUs);
    console.log(`completed #${job.id} Job by queue2`);
});

emailQueue3.on('completed', (job) => {
    console.log("number of cpus :",numCPUs);
    console.log(`completed #${job.id} Job by queue3`);
});