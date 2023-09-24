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
			.leftJoinAndSelect("asset.errorAsset", "errorAsset")
			.select([
				"asset.name AS Asset_Name",
				"asset.serial AS Serial",
				"categoryAsset.name AS Category_Name",
				"COUNT(allocation.assetId) AS Time_Requested",
				"SUM(CASE WHEN allocation.allocationStatus = 'Allocated' THEN 1 ELSE 0 END) AS Allocated_Count",
				"COUNT(errorAsset.assetId) AS Time_Reported",
				"SUM(CASE WHEN errorAsset.status = 'Fixed' THEN 1 ELSE 0 END) AS Fixed_Count",
			])
			.where("asset.isDeleted = :isDeleted", { isDeleted: false })
			.groupBy("asset.id")
			.orderBy("categoryAsset.name, asset.name", "ASC")
			.getRawMany();
		const assets = assetRepository.map((asset, index) => ({
			No: index + 1,
			...asset,
		}));
		const worksheet = XLSX.utils.json_to_sheet(assets);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
		const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
		res.set({
			"Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"Content-Disposition": "attachment; filename=AssetReport.xlsx",
		});
		res.send(buffer);
	} catch (err) {
		next(err);
	}
}
export default exportAssetReport;
