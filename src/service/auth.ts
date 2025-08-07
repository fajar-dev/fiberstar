import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const getNewToken = async (): Promise<string> => {
  const username = process.env.API_AUTH_USERNAME;
  const password = process.env.API_AUTH_PASSWORD;
  const authUrl = process.env.API_AUTH_URL;

  const authHeader = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await axios.post(
    authUrl!,
    {},
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    }
  );

  return response.data.token;
};
