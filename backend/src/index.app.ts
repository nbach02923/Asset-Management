import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import route from "./routes/route";
import { ValidationError } from "express-validation";
import { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", express.static("./src/controllers/files/file/picture/"));
app.use("/api", route);
app.use(function (_req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(function (err: Error, _req: Request, res: Response, next: NextFunction) {
	next(err);
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json(err);
	}
});
export default app;
