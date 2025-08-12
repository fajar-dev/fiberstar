export interface HomepassApiResponse {
  status: string
  message: {
    current_page: number
    data: HomepassRaw[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
}

export interface HomepassRaw {
  project_id: string
  project_name: string
  region: string
  sub_region: string
  area_name: string
  province: string
  city: string
  district: string
  sub_district: string
  postal_code: number
  homepass_id: string
  homepassed_coordinate: string
  homepass_type: string
  resident_type: string
  resident_name: string
  street_name: string
  no: string
  unit: string | null
  pop_id: string
  splitter_id: string
  spliter_distribusi_koordinat: string
  rfs_date: string
}
