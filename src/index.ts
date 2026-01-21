import * as dotenv from 'dotenv'
dotenv.config()

import { dbConfig } from './config/database'
import { AuthService } from './service/auth'
import { HomepassService } from './service/fiberstar'
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
    this.homepassTypes = process.env.HOMEPASS_TYPES?.split(',')
    this.cities = process.env.CITIES?.split(',')
    this.startDate = new Date(process.env.START_DATE)
    this.endDate = new Date(process.env.END_DATE)
    this.token = process.env.API_TOKEN
  }

  private async regenerateToken() {
    this.token = await this.authService.generateToken()
    logger.info('🔑 New token generated successfully.')
  }

  public async run() {
    try {
      await dbConfig.initialize()
      if (!this.token) {
        logger.info('🔐 No token found, generating new token...')
        await this.regenerateToken()
      }

      for (let d = new Date(this.startDate); d <= this.endDate; d.setDate(d.getDate() + 1)) {
        await this.processDate(d)
      }

      logger.info('✅ Completed!')
    } catch (error: any) {
      logger.error(`❌ Fatal error: ${error.message || error}`)
    } finally {
      await dbConfig.destroy()
    }
  }

  private async processDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    for (const city of this.cities) {
      await this.processCity(dateStr, city)
    }
  }

  private async processCity(dateStr: string, city: string) {
    for (const type of this.homepassTypes) {
      await this.processType(dateStr, city, type)
    }
  }

  private async processType(dateStr: string, city: string, type: string) {
    let page = 1
    let totalPages = 1
    let retryCount = 0
    const MAX_RETRIES = 16

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

        const exists = await this.homepassService.exist(result.message.total, dateStr, type, city)
        if (exists) {
          logger.info(`⏩ ${dateStr} | ${city} | ${type} | Skip`)
          break
        }else{
          await this.homepassService.delete(type, city, dateStr)
        }

        await this.homepassService.store(result.message.data)
        logger.info(`✅ ${dateStr} | ${city} | ${type} | page ${page} | Store`)
        page++
        retryCount = 0
      } catch (err: any) {
        if (err.response?.status === 401) {
          logger.info('🔐 Token expired. Regenerating...')
          await this.regenerateToken()
        } else {
          logger.error(
            `❌ Error on page ${page} for ${type} | ${city} | ${dateStr}: ${err.message}`
          )
          retryCount++
          if (retryCount >= MAX_RETRIES) {
            break
          }
        }
      }
    }
  }
}

// Eksekusi
const crawler = new HomepassCrawler()
crawler.run()
