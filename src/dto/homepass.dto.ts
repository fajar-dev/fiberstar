import { HomepassRaw } from '../interface/homepass.interface';
import { HomePass } from '../entity/HomePass';

export class HomepassDto {
  static toEntity(data: HomepassRaw): HomePass {
    const homepass = new HomePass();
    homepass.projectId = data.project_id;
    homepass.projectName = data.project_name;
    homepass.region = data.region;
    homepass.subRegion = data.sub_region;
    homepass.areaName = data.area_name;
    homepass.province = data.province;
    homepass.city = data.city;
    homepass.district = data.district;
    homepass.subDistrict = data.sub_district;
    homepass.postalCode = data.postal_code;
    homepass.homepassId = data.homepass_id;
    homepass.homepassedCoordinate = data.homepassed_coordinate;
    homepass.homepassType = data.homepass_type;
    homepass.residentType = data.resident_type;
    homepass.residentName = data.resident_name;
    homepass.streetName = data.street_name;
    homepass.no = data.no;
    homepass.unit = data.unit ?? '';
    homepass.popId = data.pop_id;
    homepass.splitterId = data.splitter_id;
    homepass.spliterDistribusiKoordinat = data.spliter_distribusi_koordinat;
    homepass.rfsDate = data.rfs_date;
    return homepass;
  }
}
