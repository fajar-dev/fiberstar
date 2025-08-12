import * as dotenv from 'dotenv'
dotenv.config()

import { dbConfig } from './config/database'
import { AuthService } from './service/auth'
import { HomepassService } from './service/fiberstar' // pastikan HomepassService sudah update
import logger from './config/logger'

export class HomepassCrawler {
  private authService: AuthService
  private homepassService: HomepassService
  private homepassTypes: string[]
  private cities: string[]
  private startDate: Date
  private endDate: Date
  private token: string

  constructor() {
    this.authService = new AuthService()
    this.homepassService = new HomepassService()
    this.homepassTypes = process.env.HOMEPASS_TYPES?.split(',') || []
    this.cities = process.env.CITIES?.split(',') || []
    this.startDate = process.env.START_DATE ? new Date(process.env.START_DATE) : new Date()
    this.endDate = process.env.END_DATE ? new Date(process.env.END_DATE) : new Date()
    this.token = process.env.API_TOKEN || ''
  }

  private async regenerateToken() {
    this.token = await this.authService.getNewToken()
    logger.info('🔑 New token generated successfully.')
  }

  public async run() {
    try {
      await dbConfig.initialize()

      if (!this.token) {
        logger.info('🔐 No token found, generating new token...')
        await this.regenerateToken()
      }

      for (
        let d = new Date(this.startDate);
        d <= this.endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split('T')[0]

        for (const city of this.cities) {
          for (const type of this.homepassTypes) {
            let page = 1
            let totalPages = 1

            while (page <= totalPages) {
              try {
                const result = await this.homepassService.fetchData(
                  page,
                  this.token,
                  dateStr,
                  dateStr,
                  type,
                  city
                )
                totalPages = result.message.last_page

                if (!result.message.data || result.message.data.length === 0) {
                  logger.info(`📭 ${dateStr} | ${city} | ${type} | Empty`)
                  break
                }

                // Mengecek data sudah ada atau belum
                const exists = await this.homepassService.exist(result.message.total, type, city)
                if (exists) {
                  logger.info(`⏩ ${dateStr} | ${city} | ${type} | Skip`)
                  break
                }

                await this.homepassService.store(result.message.data)
                logger.info(`✅ ${dateStr} | ${city} | ${type} | page ${page} | Store`)
                page++
              } catch (err: any) {
                if (err.response?.status === 401) {
                  logger.info('🔐 Token expired. Regenerating...')
                  await this.regenerateToken()
                } else {
                  logger.error(
                    `❌ Error on page ${page} for ${type} | ${city} | ${dateStr}: ${err.message}`
                  )
                  page++
                }
              }
            }
          }
        }
      }

      logger.info('✅ Completed!')
    } catch (error: any) {
      logger.error(`❌ Fatal error: ${error.message || error}`)
    } finally {
      await dbConfig.destroy()
    }
  }
}

// Eksekusi
const crawler = new HomepassCrawler()
crawler.run()
