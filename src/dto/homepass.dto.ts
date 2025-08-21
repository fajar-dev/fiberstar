import { HomepassRaw } from '../interface/homepass.interface'
import { sanitizeString } from '../helpers/sanitize.helper'

export class HomepassDto {
  static toValues(item: HomepassRaw): any[] {
    return [
      item.homepass_id,
      item.project_id,
      sanitizeString(item.project_name),
      sanitizeString(item.region),
      sanitizeString(item.sub_region),
      sanitizeString(item.area_name),
      sanitizeString(item.province),
      sanitizeString(item.city),
      sanitizeString(item.district),
      sanitizeString(item.sub_district),
      item.postal_code,
      sanitizeString(item.homepassed_coordinate),
      sanitizeString(item.homepass_type),
      sanitizeString(item.resident_type),
      sanitizeString(item.resident_name),
      sanitizeString(item.street_name),
      sanitizeString(item.no),   // ✅ sudah pakai helper
      sanitizeString(item.unit),
      item.pop_id,
      item.splitter_id,
      sanitizeString(item.spliter_distribusi_koordinat),
      item.rfs_date
    ]
  }
}
