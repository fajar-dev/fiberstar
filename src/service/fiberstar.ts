import axios from 'axios'
import { dbConfig } from '../config/database'
import { HomepassApiResponse, HomepassRaw } from '../interface/homepass.interface'
import { HomepassDto } from '../dto/homepass.dto'

export class HomepassService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.API_URL
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
      .replace(/\b\w/g, char => char.toUpperCase())

    const formattedDate = new Date(date.trim())

    const sql = `
      SELECT COUNT(*) as count
      FROM home_pass
      WHERE resident_type = ? AND city = ? AND rfs_date = ?
    `

    const [rows] = await dbConfig.query(sql, [
      formatTitleCase(homepassType),
      formatTitleCase(city),
      formattedDate
    ])

    return rows[0].count
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
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON DUPLICATE KEY UPDATE
        project_id = VALUES(project_id),
        project_name = VALUES(project_name),
        region = VALUES(region),
        sub_region = VALUES(sub_region),
        area_name = VALUES(area_name),
        province = VALUES(province),
        city = VALUES(city),
        district = VALUES(district),
        sub_district = VALUES(sub_district),
        postal_code = VALUES(postal_code),
        homepassed_coordinate = VALUES(homepassed_coordinate),
        homepass_type = VALUES(homepass_type),
        resident_type = VALUES(resident_type),
        resident_name = VALUES(resident_name),
        street_name = VALUES(street_name),
        no = VALUES(no),
        unit = VALUES(unit),
        pop_id = VALUES(pop_id),
        splitter_id = VALUES(splitter_id),
        spliter_distribusi_koordinat = VALUES(spliter_distribusi_koordinat),
        rfs_date = VALUES(rfs_date)
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
    city: string,
  ): Promise<boolean> {
    const existingDataCount = await this.count(homepassType, city, date)
    // console.log(date)
    // console.log(existingDataCount)
    // console.log(total)
    if (total === existingDataCount) {
      return true
    }
    return false
  }
}
