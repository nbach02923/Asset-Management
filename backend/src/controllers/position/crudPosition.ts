import { NextFunction, Request, Response } from "express";
import AppDataSource from "../../../ormconfig";
import Position from "../../entities/Position";
async function createPosition(req: Request, res: Response, next: NextFunction) {
	try {
		const existingPosition = await AppDataSource.getRepository(Position).findOne({
			where: { name: req.body.name, isDeleted: false },
		});
		if (existingPosition) {
			return res.status(400).json({ message: "Chức vụ đã tồn tại" });
		} else {
			const data = {
				name: req.body.name,
			};
			const position = await AppDataSource.getRepository(Position).create(data);
			const result = await AppDataSource.getRepository(Position).save(position);
			return res.status(201).json({ message: "Thêm mới chức vụ thành công", result });
		}
	} catch (error) {
		return next(error);
	}
}

async function getPosition(req: Request, res: Response, next: NextFunction) {
	try {
		const result = await AppDataSource.getRepository(Position).find({ where: { isDeleted: false } });
		return res.status(200).json(result);
	} catch (err) {
		return next(err);
	}
}
async function deletePosition(req: Request, res: Response, next: NextFunction) {
	try {
		const existingPosition = await AppDataSource.getRepository(Position).findOne({
			where: {
				code: req.params.positionCode,
				isDeleted: false,
			},
		});
		if (!existingPosition) {
			return res.status(404).json({ message: "Vị trí không tồn tại" });
		} else {
			await AppDataSource.createQueryBuilder()
				.update(Position)
				.set({
					isDeleted: true,
				})
				.where("id = :id", { id: req.params.positionCode })
				.execute();
			return res.status(204).send();
		}
	} catch (err) {
		return next(err);
	}
}
async function updatePosition(req: Request, res: Response, next: NextFunction) {
	try {
		const existingPosition = await AppDataSource.getRepository(Position).findOne({
			where: {
				code: req.params.positionCode,
				isDeleted: false,
			},
		});
		if (!existingPosition) {
			return res.status(404).json({ message: "Vị trí không tồn tại" });
		} else {
			const data = {
				name: req.body.name,
			};
			await AppDataSource.createQueryBuilder()
				.update(Position)
				.set(data)
				.where("code = :code", { code: req.params.positionCode })
				.execute();
			return res.status(200).json({ message: "Chỉnh sửa vị trí thành công" });
		}
	} catch (error) {
		return next(error);
	}
}
const crudPosition = {
	createPosition,
	getPosition,
	deletePosition,
	updatePosition,
};
export default crudPosition;
