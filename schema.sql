-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Buat tabel home_pass
CREATE TABLE home_pass (
  homepass_id                VARCHAR PRIMARY KEY,
  project_id                 VARCHAR,
  project_name               VARCHAR,
  region                     VARCHAR,
  sub_region                 VARCHAR,
  area_name                  VARCHAR,
  province                   VARCHAR,
  city                       VARCHAR,
  district                   VARCHAR,
  sub_district               VARCHAR,
  postal_code                INTEGER,
  homepassed_coordinate      VARCHAR,
  homepassed_coordinate_geo  geometry(Point,4326),
  homepass_type              VARCHAR,
  resident_type              VARCHAR,
  resident_name              VARCHAR,
  street_name                VARCHAR,
  no                         VARCHAR,
  unit                       VARCHAR NULL,
  pop_id                     VARCHAR,
  splitter_id                VARCHAR,
  spliter_distribusi_koordinat       VARCHAR,
  spliter_distribusi_koordinat_geo   geometry(Point,4326),
  rfs_date                   DATE
);

-- Index biasa
CREATE INDEX home_pass_city_index ON home_pass(city);
CREATE INDEX home_pass_resident_type_index ON home_pass(resident_type);

-- Index spasial GIST untuk kolom geometry
CREATE INDEX IF NOT EXISTS home_pass_homepassed_geom_gist
  ON home_pass USING GIST (homepassed_coordinate_geo);

CREATE INDEX IF NOT EXISTS home_pass_splitter_geom_gist
  ON home_pass USING GIST (spliter_distribusi_koordinat_geo);

-- Function untuk konversi koordinat text "lat, lon" ke geometry Point 4326
CREATE OR REPLACE FUNCTION to_point4326(coord TEXT)
RETURNS geometry AS $$
DECLARE
  lat DOUBLE PRECISION;
  lon DOUBLE PRECISION;
  arr TEXT[];
BEGIN
  IF coord IS NULL OR btrim(coord) = '' THEN
    RETURN NULL;
  END IF;

  arr := regexp_split_to_array(coord, '\\s*,\\s*');
  IF array_length(arr, 1) <> 2 THEN
    RETURN NULL;
  END IF;

  lat := arr[1]::DOUBLE PRECISION;
  lon := arr[2]::DOUBLE PRECISION;

  RETURN ST_SetSRID(ST_MakePoint(lon, lat), 4326);
EXCEPTION WHEN others THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger function untuk set kolom geometry secara otomatis
CREATE OR REPLACE FUNCTION home_pass_set_geoms()
RETURNS trigger AS $$
BEGIN
  NEW.homepassed_coordinate_geo := to_point4326(NEW.homepassed_coordinate);
  NEW.spliter_distribusi_koordinat_geo := to_point4326(NEW.spliter_distribusi_koordinat);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hapus trigger lama jika ada
DROP TRIGGER IF EXISTS home_pass_set_geoms_trg ON home_pass;

-- Buat trigger agar otomatis update kolom geometry saat insert/update koordinat
CREATE TRIGGER home_pass_set_geoms_trg
BEFORE INSERT OR UPDATE OF homepassed_coordinate, spliter_distribusi_koordinat
ON home_pass
FOR EACH ROW
EXECUTE FUNCTION home_pass_set_geoms();

-- Update data existing agar kolom geometry terisi
UPDATE home_pass
SET
  homepassed_coordinate_geo = to_point4326(homepassed_coordinate),
  spliter_distribusi_koordinat_geo = to_point4326(spliter_distribusi_koordinat)
WHERE (homepassed_coordinate IS NOT NULL AND btrim(homepassed_coordinate) <> '')
   OR (spliter_distribusi_koordinat IS NOT NULL AND btrim(spliter_distribusi_koordinat) <> '');

-- Statistik query planner
ANALYZE home_pass;
