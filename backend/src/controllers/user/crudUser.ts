import { NextFunction, Request, Response } from "express";
import UserAccount from "../../entities/User_Account";
import AppDataSource from "../../../ormconfig";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { payload } from "../../config/Config";
import Department from "../../../src/entities/Department";
import UserInformation from "../../../src/entities/User_Information";
import Position from "../../entities/Position";

async function getUserData(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
		const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		let user;
		if (req.query.id) {
			const existedId = await AppDataSource.getRepository(UserAccount).findOne({
				where: { id: req.query.id as string, isDeleted: false },
			});
			if (!existedId) {
				return res.status(404).json({ message: "Tài khoản không tồn tại" });
			} else {
				user = await AppDataSource.getRepository(UserAccount)
					.createQueryBuilder("userAccount")
					.where("userAccount.id = :id AND userAccount.isDeleted = :isDeleted", {
						id: req.query.id,
						isDeleted: false,
					})
					.leftJoin("userAccount.userInformation", "userInformation")
					.select([
						"userAccount.id",
						"userAccount.userName",
						"userAccount.role",
						"userAccount.departmentId",
						"userAccount.positionCode",
					])
					.addSelect([
						"userInformation.fullName",
						"userInformation.email",
						"userInformation.phoneNumber",
						"userInformation.dateOfBirth",
						"userInformation.avatarPath",
					])
					.getOne();
			}
		} else if (req.query.name) {
			const existedName = await AppDataSource.getRepository(UserAccount).findOne({
				where: { userName: req.query.name as string },
			});
			if (!existedName) {
				return res.status(404).json({ message: "Tài khoản không tồn tại" });
			} else {
				user = await AppDataSource.getRepository(UserAccount)
					.createQueryBuilder("userAccount")
					.where("userAccount.userName = :name AND userAccount.isDeleted = :isDeleted", {
						name: req.query.name,
						isDeleted: false,
					})
					.leftJoin("userAccount.userInformation", "userInformation")
					.select([
						"userAccount.id",
						"userAccount.userName",
						"userAccount.role",
						"userAccount.departmentId",
						"userAccount.positionCode",
					])
					.addSelect([
						"userInformation.fullName",
						"userInformation.email",
						"userInformation.phoneNumber",
						"userInformation.dateOfBirth",
						"userInformation.avatarPath",
					])
					.getOne();
			}
		} else {
			user = await AppDataSource.getRepository(UserAccount)
				.createQueryBuilder("userAccount")
				.where("userAccount.isDeleted = :isDeleted", { isDeleted: false })
				.leftJoin("userAccount.userInformation", "userInformation")
				.take(limit)
				.skip(offset)
				.select([
					"userAccount.id",
					"userAccount.userName",
					"userAccount.role",
					"userAccount.departmentId",
					"userAccount.positionCode",
				])
				.addSelect([
					"userInformation.fullName",
					"userInformation.email",
					"userInformation.phoneNumber",
					"userInformation.dateOfBirth",
					"userInformation.avatarPath",
				])
				.getMany();
		}
		return res.status(200).json(user);
	} catch (err) {
		return next(err);
	}
}

async function updateInformationUserExcel(req: Request, res: Response, next: NextFunction) {
	interface token {
		email: string;
	}
	try {
		const emailToken = req.params.emailToken;
		jwt.verify(
			emailToken,
			process.env.EMAIL_SECRET_KEY,
			async function (error: jwt.JsonWebTokenError, token: token) {
				if (error) {
					return next(error);
				} else {
					if (req.body.email !== token.email) {
						throw new Error("Email không khớp");
					} else {
						const accessToken = req?.headers?.authorization?.split(" ")?.[1];
						jwt.verify(
							accessToken,
							process.env.ACCESSTOKEN,
							async function (error: jwt.JsonWebTokenError, decoded: payload) {
								if (error) {
									return next(error);
								} else {
									const checkInfUser = await AppDataSource.getRepository(UserInformation)
										.createQueryBuilder("UserInformation")
										.where("UserInformation.userId = :id", { id: decoded.id })
										.getOne();
									if (!checkInfUser) {
										throw new Error("Không tồn tại người dùng");
									} else {
										const data = {
											fullName: req.body.fullName,
											email: req.body.email,
											phoneNumber: req.body.phoneNumber,
											birthDay: req.body.birthDay,
										};
										const result = await AppDataSource.createQueryBuilder()
											.update(UserInformation)
											.set(data)
											.where("userId = :id", { id: decoded.id })
											.execute();
										return res
											.status(201)
											.json({ message: "Sửa thông tin người dùng thành công", result });
									}
								}
							}
						);
					}
				}
			}
		);
	} catch (err) {
		return next(err);
	}
}

async function create(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await AppDataSource.getRepository(UserAccount).findOne({
			where: {
				userName: req.body.userName,
				isDeleted: true,
			},
		});
		if (user) {
			return res.status(409).json({ message: "Tài khoản đã tồn tại" });
		} else {
			const department = await AppDataSource.getRepository(Department).findOne({
				where: {
					id: req.body.departmentId,
				},
			});
			if (!department) {
				return res.status(404).json({ message: "Phòng ban không tồn tại" });
			} else {
				const password = "abcd1234";
				const hashPassword = hashSync(password, 10);
				const data = {
					userName: req.body.userName,
					password: hashPassword,
					role: req.body.role,
					positionCode: req.body.positionCode,
					departmentId: req.body.departmentId,
				};
				const newUser = await AppDataSource.getRepository(UserAccount).create(data);
				const result = await AppDataSource.getRepository(UserAccount).save(newUser);
				await AppDataSource.createQueryBuilder()
					.insert()
					.into(UserInformation)
					.values({
						userId: newUser.id,
					})
					.execute();
				return res.status(201).send({ message: "Tài khoản được tạo thành công", result });
			}
		}
	} catch (err) {
		return next(err);
	}
}

//người dùng sửa thông tin cá nhân
async function updateUser(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await AppDataSource.getRepository(UserAccount).findOne({ where: { id: req.params.id } });
		if (!user) {
			return res.status(404).json("Người dùng không tồn tại");
		} else {
			const { positionCode, departmentId, fullName, phoneNumber, email, dateOfBirth } = req.body;
			if (departmentId !== undefined) {
				const existDepartment = await AppDataSource.getRepository(Department).findOne({
					where: { id: departmentId },
				});
				if (!existDepartment) {
					return res.status(404).json({ message: "Phòng ban không tồn tại" });
				} else {
					await AppDataSource.createQueryBuilder()
						.update(UserAccount)
						.set({ departmentId: departmentId })
						.where("id = :id", { id: req.params.id })
						.execute();
				}
			}
			if (positionCode !== undefined) {
				const existPosition = await AppDataSource.getRepository(Position).findOne({
					where: { code: positionCode },
				});
				if (!existPosition) {
					return res.status(404).json({ message: "Vị trí công việc không tồn tại" });
				} else {
					await AppDataSource.createQueryBuilder()
						.update(UserAccount)
						.set({ positionCode: positionCode })
						.where("id = :id", { id: req.params.id })
						.execute();
				}
			}
			const userInformationUpdate = {} as {
				fullName?: string;
				phoneNumber?: string;
				email?: string;
				dateOfBirth?: string;
			};
			if (fullName !== undefined) userInformationUpdate.fullName = fullName;
			if (phoneNumber !== undefined) userInformationUpdate.phoneNumber = phoneNumber;
			if (email !== undefined) userInformationUpdate.email = email;
			if (dateOfBirth !== undefined) userInformationUpdate.dateOfBirth = dateOfBirth;
			if (Object.keys(userInformationUpdate).length > 0) {
				await AppDataSource.createQueryBuilder()
					.update(UserInformation)
					.set(userInformationUpdate)
					.where("userId = :id", { id: req.params.id })
					.execute();
			}
			return res.status(200).json({ message: "Chỉnh sửa thành công" });
		}
	} catch (err) {
		next(err);
	}
}

//admin sửa thông tin

async function deleteUser(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await AppDataSource.getRepository(UserAccount).findOne({
			where: { id: req.params.userId, isDeleted: false },
		});
		if (!user) {
			return res.status(404).json({ message: "Tài khoản không tồn tại" });
		} else {
			await AppDataSource.createQueryBuilder()
				.update(UserAccount)
				.set({
					isDeleted: true,
				})
				.where("id = :id", { id: req.params.userId })
				.execute();
			return res.status(204).send();
		}
	} catch (err) {
		return next(err);
	}
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
	try {
		const data = {
			password: req.body.password,
			newPassword: req.body.newPassword,
			enterPassword: req.body.enterPassword,
		};
		const checkUser = await AppDataSource.getRepository(UserAccount).findOne({ where: { id: req.params.userId } });
		if (!checkUser) {
			return res.status(404).json({ message: "Tài khoản không tồn tại" });
		} else {
			const checkPassword = await compareSync(req.body.password, checkUser.password);
			if (!checkPassword) {
				return res.status(400).json({ message: "Sai mật khẩu" });
			} else {
				if (data.newPassword !== data.enterPassword) {
					return res.status(400).json({ message: "Sai tài khoản" });
				} else {
					const password = hashSync(data.newPassword, 10);
					await AppDataSource.getRepository(UserAccount).update({ id: req.params.userId }, { password });
					return res.status(200).json({ message: "Đổi mật khẩu thành công" });
				}
			}
		}
	} catch (err) {
		return next(err);
	}
}

const crudUser = {
	updateInformationUserExcel,
	updateUser,
	create,
	deleteUser,
	changePassword,
	getUserData,
};
export default crudUser;
