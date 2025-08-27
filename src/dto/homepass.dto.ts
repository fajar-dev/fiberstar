import { HomepassRaw } from '../interface/homepass.interface'
import { sanitizeString } from '../helpers/sanitize.helper'
import { normalizeNull } from '../helpers/nullNormalize.helper'
import { toTitleCase } from '../helpers/titleCase.helper'

export class HomepassDto {
  static toValues(item: HomepassRaw): any[] {
    return [
      sanitizeString(normalizeNull(item.homepass_id)),
      sanitizeString(normalizeNull(item.project_id)),
      sanitizeString(normalizeNull(item.project_name)),
      sanitizeString(normalizeNull(toTitleCase(item.region))),
      sanitizeString(normalizeNull(toTitleCase(item.sub_region))),
      sanitizeString(normalizeNull(item.area_name)),
      sanitizeString(normalizeNull(toTitleCase(item.province))),
      sanitizeString(normalizeNull(toTitleCase(item.city))),
      sanitizeString(normalizeNull(toTitleCase(item.district))),
      sanitizeString(normalizeNull(toTitleCase(item.sub_district))),
      normalizeNull(item.postal_code),
      sanitizeString(normalizeNull(item.homepassed_coordinate)),
      sanitizeString(normalizeNull(item.homepass_type)),
      sanitizeString(normalizeNull(toTitleCase(item.resident_type))),
      sanitizeString(normalizeNull(toTitleCase(item.resident_name))),
      sanitizeString(normalizeNull(item.street_name)),
      sanitizeString(normalizeNull(item.no)),
      sanitizeString(normalizeNull(item.unit)),
      sanitizeString(normalizeNull(item.pop_id)),
      sanitizeString(normalizeNull(item.splitter_id)),
      sanitizeString(normalizeNull(item.spliter_distribusi_koordinat)),
      sanitizeString(normalizeNull(item.rfs_date)),
    ]
  }
}
