import axios from 'axios'
import { dbConfig } from '../config/database'
import { HomepassApiResponse, HomepassRaw } from '../interface/homepass.interface'
import { HomepassDto } from '../dto/homepass.dto'

export class HomepassService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.API_URL || ''
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

  private async count(homepassType: string, city: string, date: string): Promise<number> {
    const formatTitleCase = (text: string) =>
      text
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())

    const sql = `
      SELECT COUNT(*)::int
      FROM home_pass
      WHERE resident_type = $1 AND city = $2 AND rfs_date = $3

    `

    const result = await dbConfig.query(sql, [
      formatTitleCase(homepassType),
      formatTitleCase(city),
      date
    ])

      return result[0].count

  }

  public async store(data: HomepassRaw[]): Promise<boolean> {
    if (!data.length) return false

    const sql = `
      INSERT INTO home_pass (
        homepass_id, project_id, project_name, region, sub_region,
        area_name, province, city, district, sub_district,
        postal_code, homepassed_coordinate, homepass_type, resident_type,
        resident_name, street_name, no, unit, pop_id,
        splitter_id, spliter_distribusi_koordinat, rfs_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      ON CONFLICT (homepass_id) DO UPDATE SET
        project_id = EXCLUDED.project_id,
        project_name = EXCLUDED.project_name,
        region = EXCLUDED.region,
        sub_region = EXCLUDED.sub_region,
        area_name = EXCLUDED.area_name,
        province = EXCLUDED.province,
        city = EXCLUDED.city,
        district = EXCLUDED.district,
        sub_district = EXCLUDED.sub_district,
        postal_code = EXCLUDED.postal_code,
        homepassed_coordinate = EXCLUDED.homepassed_coordinate,
        homepass_type = EXCLUDED.homepass_type,
        resident_type = EXCLUDED.resident_type,
        resident_name = EXCLUDED.resident_name,
        street_name = EXCLUDED.street_name,
        no = EXCLUDED.no,
        unit = EXCLUDED.unit,
        pop_id = EXCLUDED.pop_id,
        splitter_id = EXCLUDED.splitter_id,
        spliter_distribusi_koordinat = EXCLUDED.spliter_distribusi_koordinat,
        rfs_date = EXCLUDED.rfs_date
    `

    for (const item of data) {
      await dbConfig.query(sql, HomepassDto.toValues(item))
    }

    return true
  }

  public async exist(
    total: number,
    date: string,
    homepassType: string,
    city: string
  ): Promise<boolean> {
    const existingDataCount = await this.count(homepassType, city, date)
    return total === existingDataCount
  }
}
