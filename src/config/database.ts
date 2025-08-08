import "reflect-metadata"
import { DataSource } from "typeorm"
import { HomePass } from "../entity/HomePass"
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [HomePass],
    migrations: [],
    subscribers: [],
})
