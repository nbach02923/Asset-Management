import { Request, Response, NextFunction } from "express";
import AppDataSource from "../../../ormconfig";
import Asset from "../../entities/Asset";
import CategoryAsset from "../../../src/entities/CategoryAsset";
import Allocation from "../../../src/entities/Allocation";
import ErrorAsset from "../../entities/errorAsset";
import jsonwebtoken from "jsonwebtoken";
import email from "../email/email";
import { payload } from "src/config/Config";
import UserInformation from "../../entities/User_Information";

async function getAll(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
		const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		const allowedValues = ["Ready to Deploy", "Deployed", "Error"];
		let asset = await AppDataSource.getRepository(Asset).find({
			where: {
				isDeleted: false,
			},
			take: limit,
			skip: offset,
			select: ["id", "name", "type", "status", "status", "description", "serial", "categoryAssetId"],
		});
		for (const key in req.query) {
			switch (key) {
				case "status": {
					const status = req.query[key] as string;
					if (allowedValues.includes(status)) {
						asset = await AppDataSource.getRepository(Asset).find({
							where: { status: req.query.status as string, isDeleted: false },
							take: limit,
							skip: offset,
						});
					}
					break;
				}
				case "id": {
					const existingId = await AppDataSource.getRepository(Asset).findOne({
						where: { id: req.query[key] as string, isDeleted: false },
						select: ["id", "name", "type", "status", "status", "description", "serial", "categoryAssetId"],
					});
					if (!existingId) {
						return res.status(404).json({ message: "Tài sản không tồn tại" });
					} else {
						asset = [existingId];
					}
					break;
				}
				case "serial": {
					const existingSerial = await AppDataSource.getRepository(Asset).findOne({
						where: { serial: req.query[key] as string, isDeleted: false },
						select: ["id", "name", "type", "status", "status", "description", "serial", "categoryAssetId"],
					});
					if (!existingSerial) {
						return res.status(404).json({ message: "Serial tài sản không tồn tại" });
					} else {
						asset = [existingSerial];
					}
					break;
				}
				case "name": {
					const existingName = await AppDataSource.getRepository(Asset).find({
						where: { name: req.query[key] as string },
						take: limit,
						skip: offset,
						select: ["id", "name", "type", "status", "status", "description", "serial", "categoryAssetId"],
					});
					if (!existingName) {
						return res.status(404).json({ message: `Không có tài sản tên là ${req.query[key]}` });
					} else {
						asset = existingName;
					}
					break;
				}
				default:
					break;
			}
		}
		return res.status(200).json(asset);
	} catch (err) {
		return next(err);
	}
}

async function createAssetExcel(req: Request, res: Response, next: NextFunction) {
	try {
		const category = await AppDataSource.getRepository(CategoryAsset).findOne({
			where: { name: req.body.category },
		});
		if (!category) {
			throw new Error("Danh mục không tồn tại");
		} else {
			const serial = Math.random().toString(36).replace(".", "").toUpperCase().substring(6);
			const checkAsset = await AppDataSource.getRepository(Asset)
				.createQueryBuilder("asset")
				.where("asset.serial = :serial", { serial: serial })
				.getOne();
			if (checkAsset) {
				throw new Error("Mã số serial đã tồn tại");
			} else {
				const data = {
					serial: serial,
					name: req.body.name,
					type: req.body.type,
					categoryAssetId: category.id,
					status: req.body.status,
					description: req.body.description,
				};
				const asset = await AppDataSource.getRepository(Asset).create(data);
				//asset.categoryAsset = category;
				const result = await AppDataSource.getRepository(Asset).save(asset);
				return res.status(200).json({
					message: "Import và thêm mới tài sản thành công",
					result,
				});
			}
		}
	} catch (error) {
		return next(error);
	}
}

//thêm mới tài sản
async function createAsset(req: Request, res: Response, next: NextFunction) {
	try {
		let serial;
		let checkAsset;
		do {
			serial = Math.random().toString(36).replace(".", "").toUpperCase().substring(6);
			checkAsset = await AppDataSource.getRepository(Asset)
				.createQueryBuilder("asset")
				.where("asset.serial = :serial", { serial: serial })
				.getOne();
		} while (checkAsset);
		const data = {
			name: req.body.name,
			serial: serial,
			status: req.body.status,
			type: req.body.type,
			categoryAssetId: req.body.categoryId,
			description: req.body.description,
		};

		const category = await AppDataSource.getRepository(CategoryAsset).findOne({
			where: { id: req.body.categoryId, isDeleted: false },
		});
		if (!category) {
			return res.status(404).json({ message: "Danh mục không tồn tại" });
		} else {
			const asset = await AppDataSource.getRepository(Asset).create(data);
			const result = await AppDataSource.getRepository(Asset).save(asset);
			const token = req.headers.authorization.split(" ")[1];
			const decoded = jsonwebtoken.decode(token) as payload;
			switch (req.body.status) {
				case "Deployed": {
					const assetCreateDeployed = {
						assetId: result.id,
						userId: decoded.id,
						allocationStatus: "Allocated",
					};
					const assetAllocatedAlready = await AppDataSource.getRepository(Allocation).create(
						assetCreateDeployed
					);
					await AppDataSource.getRepository(Allocation).save(assetAllocatedAlready);
					break;
				}
				case "Error": {
					const assetCreateError = {
						assetId: result.id,
						userId: decoded.id,
						status: "Processing",
					};
					const assetErrorAlready = await AppDataSource.getRepository(ErrorAsset).create(assetCreateError);
					await AppDataSource.getRepository(ErrorAsset).save(assetErrorAlready);
					break;
				}
			}
			return res.status(201).json({
				message: "Tài sản thêm mới thành công",
				result,
			});
		}
	} catch (err) {
		return next(err);
	}
}

//sửa tài sản
async function updateAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const data = {
			name: req.body.name,
			serial: req.body.serial,
			status: req.body.status,
			type: req.body.type,
			categoryAssetId: req.body.categoryId,
			description: req.body.description,
		};
		const checkAsset = await AppDataSource.getRepository(Asset).findOne({
			where: { id: req.params.assetId, isDeleted: false },
		});
		if (!checkAsset) {
			return res.status(404).json({ message: "Tài sản không tồn tại" });
		} else {
			const category = await AppDataSource.getRepository(CategoryAsset).findOne({
				where: { id: req.body.categoryId },
			});
			if (!category) {
				return res.status(404).json({ message: "Danh mục không tồn tại" });
			} else {
				await AppDataSource.createQueryBuilder()
					.update(Asset)
					.set(data)
					.where("id = :assetId", { assetId: req.params.assetId })
					.execute();
				return res.status(200).json({
					message: "Sửa thông tin tài sản thành công",
				});
			}
		}
	} catch (err) {
		return next(err);
	}
}
//xóa tài sản
async function deleteAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const checkAsset = await AppDataSource.getRepository(Asset).findOne({
			where: { id: req.params.assetId, isDeleted: false },
		});
		if (!checkAsset) {
			return res.status(404).json({ message: "Tài sản không tồn tại" });
		} else {
			await AppDataSource.createQueryBuilder()
				.update(Asset)
				.set({
					isDeleted: true,
				})
				.where("id = :id", { id: req.params.assetId })
				.execute();
			return res.status(204).send();
		}
	} catch (err) {
		return next(err);
	}
}

//Đăng ký mượn tài sản
async function allocationAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const checkdata = await AppDataSource.getRepository(Asset).findOne({
			where: {
				id: req.params.assetId,
				isDeleted: false,
			},
		});
		if (!checkdata) {
			return res.status(404).json({ message: "Tài sản không tồn tại" });
		} else {
			const assetAllocated = await AppDataSource.getRepository(Allocation).findOne({
				where: {
					assetId: req.params.assetId,
					allocationStatus: "Allocated",
				},
			});
			if (assetAllocated) {
				return res.status(409).json({ message: "Tài sản đã cho mượn" });
			} else {
				const checkInformation = await AppDataSource.getRepository(UserInformation)
					.createQueryBuilder("userInformation")
					.leftJoinAndSelect("userInformation.user", "user")
					.where("user.id = :id AND user.isDeleted = :isDeleted", { id: req.body.userId, isDeleted: false })
					.getOne();
				if (!checkInformation.fullName || !checkInformation.email) {
					return res.status(406).json({ message: "Tài khoản người dùng không đủ điều kiện đăng ký tài sản" });
				} else {
					const data = {
						assetId: req.params.assetId,
						userId: req.body.userId,
						allocationStatus: "Pending",
						allocationDate: req.body.allocationDate,
						returnDate: req.body.returnDate,
					};
					email.sendEmailAllocationToAdmin(data);
					const allocation = await AppDataSource.getRepository(Allocation).create(data);
					const result = await AppDataSource.getRepository(Allocation).save(allocation);
					return res.status(201).json({
						message: "Gửi đề nghị cấp phát thành công",
						result,
					});
				}
			}
		}
	} catch (err) {
		return next(err);
	}
}

// Admin duyệt tài sản
async function verifyAllocation(req: Request, res: Response, next: NextFunction) {
	try {
		const allocation = await AppDataSource.getRepository(Allocation).findOne({
			where: {
				id: req.params.requestId,
			},
		});
		if (!allocation) {
			return res.status(404).json({ message: "Request không tồn tại" });
		} else {
			if (allocation.allocationStatus === "Pending") {
				const verify = req.body.status;
				switch (verify) {
					case "Allocated": {
						await AppDataSource.createQueryBuilder()
							.update(Allocation)
							.set({
								allocationStatus: verify,
							})
							.where("id = :id", { id: req.params.requestId })
							.execute();
						await AppDataSource.createQueryBuilder()
							.update(Asset)
							.set({
								status: "Deployed",
							})
							.where("id= :id", { id: allocation.assetId })
							.execute();
						await AppDataSource.createQueryBuilder()
							.update(Allocation)
							.set({
								allocationStatus: "Rejected",
							})
							.where(
								"assetId = :assetId AND allocationDate >= :allocationDate AND allocationDate <= :returnDate and id != :id",
								{
									assetId: allocation.assetId,
									allocationDate: allocation.allocationDate,
									returnDate: allocation.returnDate,
									id: req.params.requestId,
								}
							)
							.execute();
						// todo: Send email to the corresponding user who want to borrow asset
						return res.status(200).json({ message: "Cho mượn thành công" });
					}
					case "Rejected": {
						await AppDataSource.createQueryBuilder()
							.update(Allocation)
							.set({
								allocationStatus: verify,
							})
							.where("id = :id", { id: req.params.requestId })
							.execute();
						// ? Do I also need to send email to user when they get allocation request reject
						return res.status(200).json({ message: "Từ chối thành công" });
					}
				}
			} else {
				return res.status(422).json({ message: "Trạng thái tài sản không thể cho mượn" });
			}
		}
	} catch (err) {
		return next(err);
	}
}

//Hoàn trả tài sản
async function returnAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const checkRequest = await AppDataSource.getRepository(Allocation).findOne({
			where: { id: req.params.requestId },
		});
		if (!checkRequest) {
			return res.status(404).json({ message: "Request không tồn tại" });
		} else {
			const checkAsset = await AppDataSource.getRepository(Asset).findOne({
				where: { id: checkRequest.assetId },
			});
			if (checkAsset.status === "Deployed" && checkRequest.allocationStatus === "Allocated") {
				await AppDataSource.createQueryBuilder()
					.update(Allocation)
					.set({
						allocationStatus: "Waiting to Approve",
					})
					.where("id = :id", { id: req.params.requestId })
					.execute();
				// todo: Send email to admin in order for them to know and approved the return of the allocation
				return res.status(200).json({ message: "Yêu cầu được hoàn trả thành công" });
			} else {
				return res.status(422).json({ message: "Trạng thái tài sản không thể hoàn trả" });
			}
		}
	} catch (err) {
		return next(err);
	}
}

async function verifyReturn(req: Request, res: Response, next: NextFunction) {
	try {
		const existingRequest = await AppDataSource.getRepository(Allocation).findOne({
			where: { id: req.params.requestId },
		});
		console.log(existingRequest);
		if (!existingRequest) {
			return res.status(404).json({ message: "Request không tồn tại" });
		} else {
			if (existingRequest.allocationStatus === "Waiting to Approve") {
				await AppDataSource.createQueryBuilder()
					.update(Allocation)
					.set({
						allocationStatus: "Returned",
					})
					.where("id = :id", { id: req.params.requestId })
					.execute();
				await AppDataSource.createQueryBuilder()
					.update(Asset)
					.set({
						status: "Ready to Deploy",
					})
					.where("id = :id", { id: existingRequest.assetId })
					.execute();
				// todo: Send email to user to notify that their return request is approved by admin
				return res.status(200).json({ message: "Xác nhận hoàn trả thành công" });
			} else {
				return res
					.status(422)
					.json({ message: "Tài sản đã được hoàn trả hoặc chưa nhận được đơn yêu cầu hoàn trả" });
			}
		}
	} catch (err) {
		next(err);
	}
}

async function getAllocation(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
		const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		const allocation = await AppDataSource.getRepository(Allocation)
			.createQueryBuilder("allocation")
			.leftJoin("allocation.asset", "asset")
			.where("asset.isDeleted = :isDeleted", { isDeleted: false })
			.take(limit)
			.skip(offset)
			.getMany();
		return res.status(200).json(allocation);
	} catch (err) {
		next(err);
	}
}

// Thông báo tài sản gặp sự cố
async function errorAsset(req: Request, res: Response, next: NextFunction) {
	try {
		const assetId = await AppDataSource.getRepository(Asset).findOne({
			where: {
				id: req.params.assetId,
				isDeleted: false,
			},
		});
		if (assetId) {
			const data = {
				assetId: req.params.assetId,
				userId: req.body.userId,
				description: req.body.description,
				status: "Waiting to Approve",
			};
			const errorForm = await AppDataSource.getRepository(ErrorAsset).create(data);
			const result = await AppDataSource.getRepository(ErrorAsset).save(errorForm);
			// todo: send email to admin to notify there is an asset get an error or issue
			return res.status(201).json({ messsage: "Tạo thông báo lỗi thành công", result });
		} else {
			return res.status(404).json({ message: "Tài sản không tồn tại" });
		}
	} catch (err) {
		return next(err);
	}
}

async function verifyReport(req: Request, res: Response, next: NextFunction) {
	try {
		const existingRequest = await AppDataSource.getRepository(ErrorAsset).findOne({
			where: { id: req.params.requestId },
		});
		if (!existingRequest) {
			return res.status(404).json({ message: "Request không tồn tại" });
		} else {
			if (existingRequest.status !== "Waiting to Approve") {
				return res.status(422).json({ message: "Trạng thái request đã được duyệt hoặc đã sửa" });
			} else {
				if (req.body.status === "Approved") {
					await AppDataSource.createQueryBuilder()
						.update(Asset)
						.set({
							status: "Error",
						})
						.where("id = :id", { id: existingRequest.assetId })
						.execute();
					await AppDataSource.createQueryBuilder()
						.update(ErrorAsset)
						.set({
							status: "Approved",
						})
						.where("id = :id", { id: req.params.requestId })
						.execute();
					await AppDataSource.createQueryBuilder()
						.update(Allocation)
						.set({
							allocationStatus: "Returned",
						})
						.where("assetId = :assetId AND allocationStatus = :allocationStatus", {
							assetId: existingRequest.assetId,
							allocationStatus: "Allocated",
						})
						.execute();
					await AppDataSource.createQueryBuilder()
						.update(Allocation)
						.set({
							allocationStatus: "Rejected",
						})
						.where("assetId = :assetId AND allocationStatus = :allocationStatus", {
							assetId: existingRequest.assetId,
							allocationStatus: "Pending",
						})
						.execute();
					return res.status(200).json({ message: "Xác nhận lỗi thành công" });
					// todo: send email to user to notify that admin has receive the mail and approve that it is an error or issue
				} else if (req.body.status === "Disapproved") {
					await AppDataSource.createQueryBuilder()
						.update(ErrorAsset)
						.set({
							status: "Disapproved",
						})
						.where("id = :id", { id: req.params.requestId })
						.execute();
					return res.status(200).json({ message: "Xác nhận không phải lỗi thành công" });
				}
			}
		}
	} catch (err) {
		next(err);
	}
}

async function fixError(req: Request, res: Response, next: NextFunction) {
	try {
		const checkError = await AppDataSource.getRepository(ErrorAsset).findOne({ where: { id: req.params.errorId } });
		if (!checkError) {
			return res.status(404).json({ message: "Lỗi không có bản ghi trong cơ sở dữ liệu" });
		} else {
			if (checkError.status === "Approved") {
				await AppDataSource.createQueryBuilder()
					.update(ErrorAsset)
					.set({
						status: "Fixed",
					})
					.where("id = :id", { id: req.params.errorId })
					.execute();
				await AppDataSource.createQueryBuilder()
					.update(Asset)
					.set({
						status: "Ready to Deploy",
					})
					.where("id = :id", { id: checkError.assetId })
					.execute();
				return res.status(200).json({ message: "Xác nhận sửa lỗi thành công" });
			} else {
				return res.status(422).json({ message: "Lỗi đã được sửa hoặc không được chấp thuận" });
			}
		}
	} catch (err) {
		next(err);
	}
}

// Lấy về danh sách tài sản bị lỗi kèm tên tài sản
async function getDetailError(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit as string) : 15;
		const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
		const errorData = await AppDataSource.getRepository(ErrorAsset)
			.createQueryBuilder("errorAsset")
			.leftJoin("errorAsset.asset", "asset")
			.where("asset.isDeleted = :isDeleted", { isDeleted: false })
			.take(limit)
			.skip(offset)
			.getMany();
		return res.status(200).json(errorData);
	} catch (err) {
		next(err);
	}
}

const crudAsset = {
	getAll,
	allocationAsset,
	createAsset,
	deleteAsset,
	updateAsset,
	createAssetExcel,
	returnAsset,
	verifyAllocation,
	errorAsset,
	getDetailError,
	getAllocation,
	fixError,
	verifyReport,
	verifyReturn,
};

export default crudAsset;
