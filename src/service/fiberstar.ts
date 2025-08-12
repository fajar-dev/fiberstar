import axios from 'axios'
import { dbConfig } from '../config/database'
import { HomepassDto } from '../dto/homepass.dto'
import { HomepassApiResponse, HomepassRaw } from '../interface/homepass.interface'
import { HomePass } from '../entity/HomePass'

export class HomepassService {
  private repository = dbConfig.getRepository(HomePass)
  private apiUrl = process.env.API_URL || ''

  constructor() {
    if (!this.apiUrl) {
      throw new Error('API_URL environment variable is not set')
    }
  }

  public async fetchData(
    page: number,
    token: string,
    start_date: string,
    end_date: string,
    tipe_homepass: string,
    kota: string
  ): Promise<HomepassApiResponse> {
    const url = `${this.apiUrl}?page=${page}`
    const response = await axios.post(
      url,
      { start_date, end_date, tipe_homepass, kota },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return response.data
  }

  private async count(homepassType: string, city: string): Promise<number> {
    return this.repository
      .createQueryBuilder('homepass')
      .where('homepass.residentType = :homepassType', { homepassType })
      .andWhere('homepass.city = :city', { city })
      .getCount()
  }

  public async store(data: HomepassRaw[]): Promise<boolean> {
    const entities = data.map((item) => HomepassDto.toEntity(item))
    await this.repository.save(entities)
    return true
  }

  public async exist(
    total: number,
    homepassType: string,
    city: string
  ): Promise<boolean> {
    const existingDataCount = await this.count(homepassType, city)
    if (total === existingDataCount) {
      return true
    }
    return false
  }
}
