import "reflect-metadata"
import { DataSource } from "typeorm"
import { HomePass } from "../entity/HomePass"
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConfig = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    logging: false,
    entities: [HomePass],
    migrations: [],
    subscribers: [],
})
