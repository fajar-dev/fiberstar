import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class HomePass {
  @PrimaryColumn({
    name: "homepass_id",
  })
  homepassId!: string;

  @Column({
    name: "project_id",
  })
  projectId!: string; 

  @Column({
    name: "project_name",
  })
  projectName!: string;

  @Column({
    name: "region",
  })
  region: string;

  @Column({
    name: "sub_region",
  })
  subRegion!: string;

  @Column({
    name: "area_name",
  })
  areaName!: string;

  @Column({
    name: "province",
  })
  province: string;

  @Column({
    name: "city",
  })
  city: string;

  @Column({
    name: "district",
  })
  district: string;

  @Column({
    name: "sub_district",
  })
  subDistrict!: string;

  @Column({
    name: "postal_code",
  })
  postalCode!: number;

  @Column({
    name: "homepassed_coordinate",
  })
  homepassedCoordinate!: string;

  @Column({
    name: "homepass_type",
  })
  homepassType!: string;

  @Column({
    name: "resident_type",
  })
  residentType!: string;

  @Column({
    name: "resident_name",
  })
  residentName!: string;

  @Column({
    name: "street_name",
  })
  streetName!: string;

  @Column({
    name: "no",
  })
  no: string;

  @Column({
    name: "unit",
    nullable: true,
  })
  unit: string;

  @Column({
    name: "pop_id",
  })
  popId: string;

  @Column({
    name: "splitter_id",
  })
  splitterId: string;

  @Column({
    name: "spliter_distribusi_koordinat",
  })
  spliterDistribusiKoordinat: string;

  @Column({
    name: "rfs_date",
  })
  rfsDate: string;
}

