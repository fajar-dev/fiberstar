import * as dotenv from 'dotenv';
dotenv.config();

import { dbConfig } from './config/database';
import { getNewToken } from './service/auth';
import { checkAndSaveData, fetchData, } from './service/fiberstar';
import logger from './config/logger';

const homepassTypes: string[] = process.env.HOMEPASS_TYPES?.split(',') || [];
const cities: string[] = process.env.CITIES?.split(',') || [];
const startDate: Date = process.env.START_DATE ? new Date(process.env.START_DATE) : new Date();
const endDate: Date = process.env.END_DATE ? new Date(process.env.END_DATE) : new Date();

const main = async () => {
  try {
    await dbConfig.initialize();
    let token = process.env.API_TOKEN || (await getNewToken());

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];

      for (const city of cities) {
        for (const type of homepassTypes) {
          let page = 1;
          let totalPages = 1;

          while (page <= totalPages) {
            try {
              const result = await fetchData(page, token, dateStr, dateStr, type, city);
              totalPages = result.message.last_page;

              if (!result.message.data || result.message.data.length === 0) {
                logger.info(`📭 ${dateStr} | ${city} | ${type} | Empty `)
                break;
              }

              const skipPage = await checkAndSaveData(result.message.data, result.message.total, type, city);
              if (skipPage) {
                logger.info(`⏩ ${dateStr} | ${city} | ${type} | Skip`)
                break;
              }
              logger.info(`✅ ${dateStr} | ${city} | ${type} | page ${page} | Save`)
              page++;

            } catch (err: any) {
              if (err.response?.status === 401) {
                logger.info(`🔐 Token expired. Regenerating...`)
                token = await getNewToken();
                logger.info('🔑 New token generated successfully.');
              } else {
                logger.error(`❌ Error on page ${page} for ${type} | ${city} | ${dateStr}: ${err.message}`);
                page++; 
              }
            }
          }
        }
      }
    }

    logger.info(`✅ Completed!`)
  } catch (error) {
    logger.error(`❌ Fatal error:', error`)
  } finally {
    await dbConfig.destroy();
  }
};

main();
