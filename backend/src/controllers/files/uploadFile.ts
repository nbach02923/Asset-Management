import { Request, Response, NextFunction } from "express";
import xlsx from "xlsx";
import fs from "fs";
import AppDataSource from "../../../ormconfig";
import UserInformation from "../../entities/User_Information";
import Asset from "../../entities/Asset";
import jsonwebtoken from "jsonwebtoken";
import { payload } from "../../config/Config";

async function uploadFile(req: Request, res: Response, next: NextFunction) {
	try {
		const file = req.file;
		const fileType = req.body.fileType;
		if (!file) {
			return res.status(400).json({ message: "Invalid file extension" });
		}
		const { filename } = file;
		const filePath = `http://127.0.0.1:2901/api/${filename}`;
		if (fileType === "user") {
			await uploadUserFile(req, res, filePath);
		} else if (fileType === "asset") {
			await uploadAssetFile(req, res, filePath);
		} else {
			return res.status(400).json({ message: "Invalid fileType" });
		}
	} catch (err) {
		next(err);
	}
}
async function uploadUserFile(req: Request, res: Response, filePath: string) {
	const userRepository = AppDataSource.getRepository(UserInformation);
	const existingUser = await userRepository.findOne({
		where: {
			userId: req.params.id,
		},
	});
	if (!existingUser) {
		return res.status(404).json({ message: "User account does not exist" });
	}
	await userRepository.update({ userId: req.params.id }, { avatarPath: filePath });
	return res.status(200).json({ message: "File upload successful" });
}
async function uploadAssetFile(req: Request, res: Response, filePath: string) {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jsonwebtoken.decode(token) as payload;
	if (!decodedToken.role) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	const assetRepository = AppDataSource.getRepository(Asset);
	const existingAsset = await assetRepository.findOne({
		where: { id: req.params.id },
	});
	if (!existingAsset) {
		return res.status(404).json({ message: "Asset does not exist" });
	}
	await assetRepository.update({ id: req.params.id }, { picturePath: filePath });
	return res.status(200).json({ message: "File upload successful" });
}
const upload = {
	uploadFile,
};
export default upload;
