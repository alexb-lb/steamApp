const CronJob = require('cron').CronJob;

/**  Start Cron Job **/
const startCron = (cronPattern, functionToExecute) => {
  try {
    new CronJob(cronPattern, functionToExecute, cronJobStops, true, 'Europe/Kiev');
  } catch (ex) {
    console.log("cron pattern not valid");
  }
};

const cronJobStops = () => {
  console.log('CronJob stops')
};

module.exports = startCron;