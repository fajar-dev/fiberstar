import axios from 'axios';
import { dbConfig } from '../config/database';
import { HomepassDto } from '../dto/homepass.dto';
import { HomepassApiResponse, HomepassRaw } from '../interface/homepass.interface';
import { HomePass } from '../entity/HomePass';

export const fetchData = async (
  page: number,
  token: string,
  start_date: string,
  end_date: string,
  tipe_homepass: string,
  kota: string
): Promise<HomepassApiResponse> => {
  const url = `${process.env.API_URL}?page=${page}`;
  const response = await axios.post(
    url,
    { start_date, end_date, tipe_homepass, kota },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

const getDatabaseCount = async (tipe_homepass: string, kota: string): Promise<number> => {
  const repository = dbConfig.getRepository(HomePass);
  const count = await repository
    .createQueryBuilder('homepass')
    .where('homepass.residentType = :tipe_homepass', { tipe_homepass })
    .andWhere('homepass.city = :kota', { kota })
    .getCount();
  return count;
};

export const saveData = async (data: HomepassRaw[]) => {
  const repo = dbConfig.getRepository('HomePass');
  const entities = data.map((item) => HomepassDto.toEntity(item));
  await repo.save(entities);
};

export const checkAndSaveData = async (
  data: HomepassRaw[],
  total: number,
  tipe_homepass: string,
  kota: string
) => {
  const existingDataCount = await getDatabaseCount(tipe_homepass, kota);
// console.log(existingDataCount)
  if (total === existingDataCount) {
    return true;
  }
  await saveData(data);
};
