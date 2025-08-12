import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()

export class AuthService {
  private username: string
  private password: string
  private authUrl: string

  constructor() {
    this.username = process.env.API_AUTH_USERNAME
    this.password = process.env.API_AUTH_PASSWORD
    this.authUrl = process.env.API_AUTH_URL
  }

  public async generateToken(): Promise<string> {
    const authHeader = Buffer.from(`${this.username}:${this.password}`).toString('base64')

    const response = await axios.post(
      this.authUrl,
      {},
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    )

    return response.data.token
  }
}
