import { Request, Response, NextFunction } from "express";
import * as XLSX from "xlsx";
import Asset from "../../entities/Asset";
import AppDataSource from "../../../ormconfig";

async function exportAssetReport(req: Request, res: Response, next: NextFunction) {
	try {
		const assetRepository = await AppDataSource.getRepository(Asset)
			.createQueryBuilder("asset")
			.leftJoin("asset.categoryAsset", "categoryAsset", "categoryAsset.id = asset.categoryAssetId")
			.leftJoinAndSelect("asset.allocation", "allocation")
			.select([
				"asset.name as Asset_Name",
				"asset.serial as Serial",
				"asset.description as Description",
				"asset.type as Type",
				"asset.status as Status",
			])
			.addSelect("categoryAsset.name as Category_Name")
			.addSelect("SUM(CASE WHEN allocation.allocationStatus = 'Allocated' THEN 1 ELSE 0 END)", "Allocated_Count")
			.where("asset.isDeleted = :isDeleted", {isDeleted: false})
			.groupBy("asset.id")
			.orderBy("categoryAsset.name", "ASC")
			.addOrderBy("asset.name", "ASC")
			.getRawMany();
		const assets = assetRepository.map((asset, index) => ({
			No: index + 1,
			...asset,
		}));
		const worksheet = XLSX.utils.json_to_sheet(assets);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
		const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
		res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		res.setHeader("Content-Disposition", "attachment; filename=AssetReport.xlsx");
		res.end(buffer);
	} catch (err) {
		next(err);
	}
}
export default exportAssetReport;
