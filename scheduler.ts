import cron from 'node-cron';
import {job} from "./job.ts";
import {toCron} from 'cron-translate';
import {logger} from './lib/logger.ts'

const environment = process.env.NODE_ENV || 'development';

let cronSchedule = toCron('every 5 minutes')
if (process.env.NODE_ENV === 'production') {
    let cronSchedule = toCron('every day at 6pm')
}

const task = cron.schedule(cronSchedule, async () => {
    logger.info('Job triggered')
    await job()
});

task.start();
//const result = await task.execute();