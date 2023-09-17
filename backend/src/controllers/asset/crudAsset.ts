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
		const limit = parseInt(req.query.limit as string) || 15;
		const offset = parseInt(req.query.offset as string) || 0;
		const allowedValues = ["Ready to Deploy", "Deployed", "Error"];
		const assetQuery = {
			isDeleted: false,
			...(req.query.status &&
				allowedValues.includes(req.query.status as string) && {
					status: req.query.status as string,
				}),
			...(req.query.id && {
				id: req.query.id as string,
			}),
			...(req.query.serial && {
				serial: req.query.serial as string,
			}),
			...(req.query.name && {
				name: req.query.name as string,
			}),
		};
		const assetTotal = await AppDataSource.getRepository(Asset).count({
			where: assetQuery,
		});
		const asset = await AppDataSource.getRepository(Asset).find({
			where: assetQuery,
			take: limit,
			skip: offset,
			select: ["id", "name", "type", "status", "status", "description", "serial", "categoryAssetId"],
		});
		if (req.query.id && asset.length === 0) {
			return res.status(404).json({ message: "Asset does not exist" });
		}
		if (req.query.serial && asset.length === 0) {
			return res.status(404).json({ message: "Asset serial does not exist" });
		}
		if (req.query.name && asset.length === 0) {
			return res.status(404).json({ message: `There is no asset with name: ${req.query.name}` });
		}
		return res.status(200).json({ assetTotal, asset });
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
			return res.status(404).json("Category does not exist");
		} else {
			const serial = Math.random().toString(36).replace(".", "").toUpperCase().substring(6);
			const checkAsset = await AppDataSource.getRepository(Asset)
				.createQueryBuilder("asset")
				.where("asset.serial = :serial", { serial: serial })
				.getOne();
			if (checkAsset) {
				throw new Error("Serial Number already exists");
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
				const result = await AppDataSource.getRepository(Asset).save(asset);
				return res.status(200).json({
					message: "Create asset successfully",
					result,
				});
			}
		}
	} catch (error) {
		return next(error);
	}
}

async function createAsset(req: Request, res: Response, next: NextFunction) {
	try {
		let serial;
		let checkAsset;
		do {
			serial = Math.random().toString(36).replace(".", "").toUpperCase().substring(6);
			checkAsset = await AppDataSource.getRepository(Asset).findOne({
				where: { serial, isDeleted: false },
			});
		} while (checkAsset);
		const { name, status, type, categoryId, description } = req.body;
		const category = await AppDataSource.getRepository(CategoryAsset).findOne({
			where: { id: categoryId, isDeleted: false },
		});
		if (!category) {
			return res.status(404).json({ message: "Category does not exist" });
		}
		const assetData = {
			name,
			serial,
			status,
			type,
			categoryAssetId: categoryId,
			description,
		};
		const asset = await AppDataSource.getRepository(Asset).create(assetData);
		const result = await AppDataSource.getRepository(Asset).save(asset);
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jsonwebtoken.decode(token) as payload;
		switch (status) {
			case "Deployed": {
				const assetCreateDeployed = {
					assetId: result.id,
					userId: decoded.id,
					allocationStatus: "Allocated",
				};
				const assetAllocatedAlready = await AppDataSource.getRepository(Allocation).create(assetCreateDeployed);
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
			message: "Asset is created successfully",
			result,
		});
	} catch (err) {
		return next(err);
	}
}

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
			return res.status(404).json({ message: "Asset does not exist" });
		} else {
			const category = await AppDataSource.getRepository(CategoryAsset).findOne({
				where: { id: req.body.categoryId },
			});
			if (!category) {
				return res.status(404).json({ message: "Category does not exist" });
			} else {
				await AppDataSource.createQueryBuilder()
					.update(Asset)
					.set(data)
					.where("id = :assetId", { assetId: req.params.assetId })
					.execute();
				return res.status(200).json({
					message: "Update asset successfully",
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
			return res.status(404).json({ message: "Asset does not exist" });
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
			return res.status(404).json({ message: "Asset does not exist" });
		} else {
			const assetAllocated = await AppDataSource.getRepository(Allocation).findOne({
				where: {
					assetId: req.params.assetId,
					allocationStatus: "Allocated",
				},
			});
			if (assetAllocated) {
				return res.status(409).json({ message: "Asset is already allocated" });
			} else {
				const checkInformation = await AppDataSource.getRepository(UserInformation)
					.createQueryBuilder("userInformation")
					.leftJoinAndSelect("userInformation.user", "user")
					.where("user.id = :id AND user.isDeleted = :isDeleted", { id: req.body.userId, isDeleted: false })
					.getOne();
				if (!checkInformation.fullName || !checkInformation.email) {
					return res
						.status(406)
						.json({ message: "User account does not meet the requirement to send request" });
				} else {
					const data = {
						assetId: req.params.assetId,
						userId: req.body.userId,
						allocationStatus: "Pending",
						allocationDate: req.body.allocationDate,
						returnDate: req.body.returnDate,
					};
					const allocation = await AppDataSource.getRepository(Allocation).create(data);
					const result = await AppDataSource.getRepository(Allocation).save(allocation);
					return res.status(201).json({
						message: "Request sent successfully",
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
			return res.status(404).json({ message: "Request does not exist" });
		} else {
			if (allocation.allocationStatus === "Pending") {
				const verify = req.body.allocationStatus;
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
						return res.status(200).json({ message: "Accepted request successfully" });
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
						return res.status(200).json({ message: "Reject request susccesfully" });
					}
					default: {
						return res.status(400).json({ message: "Invalid request" });
					}
				}
			} else {
				return res.status(422).json({ message: "Asset can not be allcated" });
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
			return res.status(404).json({ message: "Request does not exist" });
		} else {
			const checkAsset = await AppDataSource.getRepository(Asset).findOne({
				where: { id: checkRequest.assetId },
			});
			if (
				checkAsset.status === "Deployed" &&
				checkRequest.allocationStatus === "Allocated" &&
				req.body.allocationStatus === "Waiting to Approve"
			) {
				await AppDataSource.createQueryBuilder()
					.update(Allocation)
					.set({
						allocationStatus: req.body.allocationStatus,
					})
					.where("id = :id", { id: req.params.requestId })
					.execute();
				// todo: Send email to admin in order for them to know and approved the return of the allocation
				return res.status(200).json({ message: "Request to return asset successfully" });
			} else {
				return res.status(422).json({ message: "Asset can not be return" });
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
		if (!existingRequest) {
			return res.status(404).json({ message: "Request does not exist" });
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
				return res.status(200).json({ message: "Approve return asset successfully" });
			} else {
				return res
					.status(422)
					.json({ message: "Asset is already returned or does not receive return request" });
			}
		}
	} catch (err) {
		next(err);
	}
}

async function getAllocation(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = parseInt(req.query.limit as string) || 15;
		const offset = parseInt(req.query.offset as string) || 0;
		let allocation;
		const allocationTotal = await AppDataSource.getRepository(Allocation).count();
		if (req.query.userId) {
			allocation = await AppDataSource.getRepository(Allocation)
				.createQueryBuilder("allocation")
				.leftJoin("allocation.asset", "asset")
				.leftJoin("allocation.user", "user")
				.where(
					"asset.isDeleted = :isAssetDeleted AND user.isDeleted = :isUserDeleted AND allocation.userId = :userId",
					{
						isAssetDeleted: false,
						isUserDeleted: false,
						userId: req.query.userId,
					}
				)
				.take(limit)
				.skip(offset)
				.getMany();
		} else {
			allocation = await AppDataSource.getRepository(Allocation)
				.createQueryBuilder("allocation")
				.leftJoin("allocation.asset", "asset")
				.leftJoin("allocation.user", "user")
				.where("asset.isDeleted = :isAssetDeleted AND user.isDeleted = :isUserDeleted", {
					isAssetDeleted: false,
					isUserDeleted: false,
				})
				.take(limit)
				.skip(offset)
				.getMany();
		}
		return res.status(200).json({ allocationTotal, allocation });
	} catch (err) {
		next(err);
	}
}

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
			return res.status(201).json({ message: "Report error successfully", result });
		} else {
			return res.status(404).json({ message: "Asset does not exist" });
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
			return res.status(404).json({ message: "Report does not exist" });
		} else {
			if (existingRequest.status !== "Waiting to Approve") {
				return res.status(422).json({ message: "Report is already fixed or approved" });
			} else {
				if (req.body.status === "Approved") {
					await AppDataSource.getRepository(Asset).update(existingRequest.assetId, { status: "Error" });
					await AppDataSource.getRepository(ErrorAsset).update(req.params.requestId, {
						status: req.body.status,
					});
					return res.status(200).json({ message: "Error approve successfully" });
				} else if (req.body.status === "Disapproved") {
					await AppDataSource.getRepository(ErrorAsset).update(req.params.requestId, {
						status: req.body.status,
					});
					return res.status(200).json({ message: "Error disapproved" });
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
			return res.status(404).json({ message: "Error report does not exist" });
		} else {
			if (checkError.status === "Approved") {
				await AppDataSource.getRepository(ErrorAsset).update(req.params.errorId, { status: "Ready to Deploy" });
				await AppDataSource.getRepository(Asset).update(checkError.assetId, { status: "Ready to Deploy" });
				return res.status(200).json({ message: "Error fixed successfully" });
			}
			return res.status(422).json({ message: "Error is already fixed or disapproved or not yet approved" });
		}
	} catch (err) {
		next(err);
	}
}

async function getDetailError(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = parseInt(req.query.limit as string) || 15;
		const offset = parseInt(req.query.offset as string) || 0;
		const errorTotal = await AppDataSource.getRepository(ErrorAsset).count();
		const errorData = await AppDataSource.getRepository(ErrorAsset)
			.createQueryBuilder("errorAsset")
			.innerJoinAndSelect("errorAsset.asset", "asset", "asset.isDeleted = :isDeleted", { isDeleted: false })
			.take(limit)
			.skip(offset)
			.getMany();
		return res.status(200).json({ errorTotal, errorData });
	} catch (err) {
		next(err);
	}
}

async function getStatistic(req: Request, res: Response, next: NextFunction) {
	try {
		const limit = parseInt(req.query.limit as string) || 15;
		const offset = parseInt(req.query.offset as string) || 0;
		const assetTotal = await AppDataSource.getRepository(Asset).count();
		const assetStatistics = await AppDataSource.getRepository(Asset)
			.createQueryBuilder("asset")
			.leftJoin("asset.allocation", "allocation")
			.leftJoin("asset.errorAsset", "errorAsset")
			.select(["asset.id AS id", "asset.name AS name"])
			.addSelect("COUNT(allocation.assetId)", "timeRequested")
			.addSelect("COUNT(errorAsset.assetId)", "timeReported")
			.where("asset.isDeleted = :isDeleted", { isDeleted: false })
			.take(limit)
			.skip(offset)
			.groupBy("asset.id")
			.getRawMany();
		return res.status(200).json({ assetTotal, assetStatistics });
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
	getStatistic,
};

export default crudAsset;
