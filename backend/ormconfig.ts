import { DataSource } from "typeorm";
import "dotenv/config";
const port = parseInt(process.env.DB_PORT);
const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	logging: true,
	synchronize: false,
	entities: ["src/entities/**/*.{ts,js}"],
	migrations: ["src/migrations/**/*.{ts,js}"],
});

export default AppDataSource;
