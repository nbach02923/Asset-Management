import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../../ormconfig";
import { compare } from "bcrypt";
import User from "../../entities/User_Account";
import token from "../../middlewares/jwt.middleware";

async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const { userName, password, rememberMe } = req.body;
		const userRepository = AppDataSource.getRepository(User);
		const user = await userRepository
			.createQueryBuilder("user")
			.select(["user.id", "user.userName", "user.password", "user.role", "user.departmentId"])
			.where("user.userName = :userName", { userName })
			.getOne();
		if (!user) {
			return res.status(404).json({ message: "Account does not exist" });
		}
		const checkPassword = await compare(password, user.password);
		if (!checkPassword) {
			return res.status(400).json({ message: "Enter wrong password" });
		}
		const accessToken = await token.signToken(
			{ id: user.id, userName: user.userName, role: user.role, departmentId: user.departmentId },
			process.env.ACCESSTOKEN,
			rememberMe ? "168h" : "24h"
		);
		return res.status(200).json({ accessToken });
	} catch (err) {
		return next(err);
	}
}

export default login;
