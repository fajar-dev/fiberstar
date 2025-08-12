import { HomepassRaw } from "../interface/homepass.interface";

export class HomepassDto {
  static toValues(item: HomepassRaw): any[] {
    return [
      item.homepass_id,
      item.project_id,
      item.project_name,
      item.region,
      item.sub_region,
      item.area_name,
      item.province,
      item.city,
      item.district,
      item.sub_district,
      item.postal_code,
      item.homepassed_coordinate,
      item.homepass_type,
      item.resident_type,
      item.resident_name,
      item.street_name,
      item.no,
      item.unit || null,
      item.pop_id,
      item.splitter_id,
      item.spliter_distribusi_koordinat,
      item.rfs_date
    ]
  }
}
