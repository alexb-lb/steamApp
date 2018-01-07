const CronJob = require('cron').CronJob;
const logger = require('./logger');

/**  Start Cron Job **/
const startCron = (cronPattern, functionToExecute) => {
  try {
    new CronJob(cronPattern, functionToExecute, cronJobStops, true, 'Europe/Kiev');
  } catch (ex) {
    logger.writeError("cron pattern not valid");
  }
};

const cronJobStops = () => {
  logger.writeInfo("cron pattern not valid");
};

module.exports = startCron;