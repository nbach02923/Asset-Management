import { Request, Response, NextFunction } from "express";
import Department from "../../../src/entities/Department";
import AppDataSource from "../../../ormconfig";

async function getAll(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
		const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		let department;
		if (req.query.id) {
			const checkDepartment = await AppDataSource.getRepository(Department).findOne({
				where: { id: req.query.id as string, isDeleted: false },
			});
			if (!checkDepartment) {
				return res.status(404).json({ message: "Department does not exist" });
			} else {
				department = await AppDataSource.getRepository(Department)
					.createQueryBuilder("department")
					.leftJoinAndSelect("department.user", "user")
					.select(["department.id as id", "department.name as name"])
					.addSelect("COUNT(user.id)", "userCount")
					.where("department.id = :id AND department.isDeleted = :isDeleted", {
						id: req.query.id as string,
						isDeleted: false,
					})
					.getRawOne();
			}
		} else {
			department = await AppDataSource.getRepository(Department)
				.createQueryBuilder("department")
				.leftJoinAndSelect("department.user", "user")
				.select(["department.id as id", "department.name as name"])
				.addSelect("COUNT(user.id)", "userCount")
				.take(limit)
				.skip(offset)
				.where("department.isDeleted = :isDeleted", { isDeleted: false })
				.groupBy("department.id")
				.getRawMany();
		}
		return res.status(200).json(department);
	} catch (err) {
		return next(err);
	}
}

async function createDepartment(req: Request, res: Response, next: NextFunction) {
	try {
		const data = {
			name: req.body.name,
		};
		const department = await AppDataSource.getRepository(Department).findOne({
			where: { name: req.body.name, isDeleted: false },
		});
		if (department) {
			return res.status(409).json({ message: "Department already exist" });
		} else {
			const departmentNew = await AppDataSource.getRepository(Department).create(data);
			const result = await AppDataSource.getRepository(Department).save(departmentNew);
			return res.status(201).send({ message: `Phòng ban được thêm thành công`, result });
		}
	} catch (err) {
		return next(err);
	}
}

async function updateDepartment(req: Request, res: Response, next: NextFunction) {
	try {
		const department = await AppDataSource.getRepository(Department).findOne({
			where: { id: req.params.departmentId, isDeleted: false },
		});
		if (!department) {
			return res.status(404).json({ message: "Department does not exist" });
		} else {
			const departmentName = await AppDataSource.getRepository(Department).findOne({
				where: { name: req.body.name, isDeleted: false },
			});
			if (departmentName) {
				return res.status(409).json({ message: "Department already exist" });
			} else {
				const data = {
					name: req.body.name,
				};
				await AppDataSource.createQueryBuilder()
					.update(Department)
					.set(data)
					.where("id = :id", { id: req.params.departmentId })
					.execute();
				return res.status(200).json({ message: "Update department succesfully" });
			}
		}
	} catch (err) {
		return next(err);
	}
}

async function deleteDepartment(req: Request, res: Response, next: NextFunction) {
	try {
		const department = await AppDataSource.getRepository(Department).findOne({
			where: { id: req.params.departmentId, isDeleted: false },
		});
		if (!department) {
			return res.status(404).json({ message: "Department does not exist" });
		} else {
			await AppDataSource.createQueryBuilder()
				.update(Department)
				.set({
					isDeleted: true,
				})
				.where("id = :id", { id: req.params.departmentId })
				.execute();
			return res.status(204).send();
		}
	} catch (err) {
		return next(err);
	}
}

const crudDepartment = {
	getAll,
	createDepartment,
	deleteDepartment,
	updateDepartment,
};
export default crudDepartment;
