import { Request, Response, NextFunction } from "express";
import xlsx from "xlsx";
import fs from "fs";
import AppDataSource from '../../../ormconfig';
import UserInformation from '../../entities/User_Information';

async function uploadFileExcel(req: Request, next: NextFunction) {
	const path = "./src/controllers/uploadFile/" + req.file.filename;
	const workbook = xlsx.readFile(path);
	const workbook_sheet = workbook.SheetNames;
	const workbook_response = xlsx.utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]]);
	(req as Request).body = workbook_response[0];
	fs.unlinkSync(path);
	return next();
}

async function uploadFile(req:Request, res: Response, next: NextFunction) {
	try {
		const file = req.file
		if (!file) {
			return res.status(400).json({message: "Invalid file extension"})
		}
		const fileName = file.filename
		const filePath = `http://127.0.0.1:2901/api/${fileName}`
		const existingUser = await AppDataSource.getRepository(UserInformation).findOne({
			where: {
				userId: req.params.userId
			}
		})
		if (!existingUser) {
			return res.status(404).json({message: "Người dùng không tồn tại"})
		} else {
			await AppDataSource.createQueryBuilder()
				.update(UserInformation)
				.set({
					avatarPath: filePath
				})
				.where("userId = :userId", {userId: req.params.userId})
				.execute()
			return res.status(200).json({message: "File upload thành công "})
		}
	} catch (err) {
		next(err)
	}
}

const upload = {
	uploadFile,
	uploadFileExcel
}
export default upload;
