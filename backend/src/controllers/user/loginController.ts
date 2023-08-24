import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../../ormconfig";
import { compareSync } from "bcrypt";
import User from "../../entities/User_Account";
import token from "../../middlewares/jwt.middleware";
//todo: make the login function will have the query for remember me to change the token expire time
async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await AppDataSource.getRepository(User).findOne({
			where: { userName: req.body.userName },
		});
		if (user) {
			const checkPassword = await compareSync(req.body.password, user.password);
			if (checkPassword) {
				const { id, role, departmentId } = await AppDataSource.getRepository(User)
					.createQueryBuilder("user")
					.select(["user.id", "user.role", "user.departmentId"])
					.where("user.userName = :userName", { userName: req.body.userName })
					.getOne();
				const accessToken = await token.signToken(
					{ id: user.id, userName: user.userName, role: user.role, departmentId: departmentId },
					process.env.ACCESSTOKEN,
					"24h"
				);
				return res.status(200).json({ accessToken, userRole: role, department: departmentId, userId: id });
			} else {
				return res.status(400).json({ message: "Enter wrong password" });
			}
		} else {
			return res.status(404).json({ message: "Account not exist" });
		}
	} catch (err) {
		return next(err);
	}
}
export default login;
