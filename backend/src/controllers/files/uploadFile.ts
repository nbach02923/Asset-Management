import { Request, Response, NextFunction } from "express";
import xlsx from "xlsx";
import fs from "fs";
import AppDataSource from "../../../ormconfig";
import UserInformation from "../../entities/User_Information";

async function uploadFile(req: Request, res: Response, next: NextFunction) {
	try {
		const file = req.file;
		if (!file) {
			return res.status(400).json({ message: "Invalid file extension" });
		}
		const { filename } = file;
		const filePath = `http://127.0.0.1:2901/api/${filename}`;
		const existingUser = await AppDataSource.getRepository(UserInformation).findOne({
			where: {
				userId: req.params.userId,
			},
		});
		if (!existingUser) {
			return res.status(404).json({ message: "User account does not exist" });
		} else {
			await AppDataSource.getRepository(UserInformation).update(
				{ userId: req.params.userId },
				{ avatarPath: filePath }
			);
			return res.status(200).json({ message: "File upload successful" });
		}
	} catch (err) {
		next(err);
	}
}

const upload = {
	uploadFile,
};
export default upload;
