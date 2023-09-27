import { validate } from "express-validation";
import login from "../controllers/user/loginController";
import { Router } from "express";
import validation from "../middlewares/validation.middleware";
import crudUser from "../controllers/user/crudUser";
import crudAsset from "../controllers/asset/crudAsset";
import crudDepartment from "../controllers/department/crudDepartment";
import crudCategoryAsset from "../controllers/asset/crudCategoryAsset";
import email from "../controllers/email/email";
import uploadFile from "../middlewares/uploadFile.middleware";
import upload from "../controllers/files/uploadFile";
import exportAssetReport from "../controllers/files/exportFile"
import crudPosition from "../controllers/position/crudPosition";
import token from "../middlewares/jwt.middleware";
import schedule from "node-schedule";

const router = Router();
router.route("/auth/login").post(token.verifyToken, validate(validation.login), login);

router.route("/categoryAsset").get(token.verifyToken, crudCategoryAsset.getCategory);
router.route("/categoryAsset").post(token.verifyToken, token.checkAdmin, validate(validation.createCategoryAsset), crudCategoryAsset.create);
router.route("/categoryAsset/:categoryId").patch(token.verifyToken, token.checkAdmin, validate(validation.updateCategoryAsset), crudCategoryAsset.update);
router.route("/categoryAsset/:categoryId").delete(token.verifyToken, token.checkAdmin, crudCategoryAsset.deleteCategoryAsset);

//Department
router.route("/department").get(token.verifyToken, crudDepartment.getAll);
router.route("/department").post(token.verifyToken, token.checkAdmin, validate(validation.createDepartment), crudDepartment.createDepartment);
router.route("/department/:departmentId").patch(token.verifyToken, token.checkAdmin, validate(validation.updateDepartment), crudDepartment.updateDepartment);
router.route("/department/:departmentId").delete(token.verifyToken, token.checkAdmin, crudDepartment.deleteDepartment);

//Asset
router.route("/asset").get(token.verifyToken, crudAsset.getAll);
router.route("/asset/allocation").get(token.verifyToken, crudAsset.getAllocation);
router.route("/asset/error").get(token.verifyToken, crudAsset.getDetailError);
router.route("/asset/export").get(token.verifyToken, token.checkAdmin, exportAssetReport)
router.route("/asset/statistics").get(token.verifyToken, token.checkAdmin, crudAsset.getStatistic)
router.route("/asset").post(token.verifyToken, token.checkAdmin, validate(validation.createAsset), crudAsset.createAsset);
router.route("/asset/:assetId").patch(token.verifyToken, token.checkAdmin, validate(validation.updateAsset), crudAsset.updateAsset);
router.route("/asset/:assetId").delete(token.verifyToken, token.checkAdmin, crudAsset.deleteAsset);
router.route("/asset/allocationAsset/:assetId").post(token.verifyToken, crudAsset.allocationAsset);
router.route("/asset/returnAsset/:requestId").patch(token.verifyToken, crudAsset.returnAsset);
router.route("/asset/verifyReturn/:requestId").patch(token.verifyToken, token.checkAdmin, crudAsset.verifyReturn)
router.route("/asset/verifyAsset/:requestId").patch(token.verifyToken, token.checkAdmin, crudAsset.verifyAllocation);
router.route("/asset/errorReport/:assetId").post(token.verifyToken, crudAsset.errorAsset);
router.route("/asset/verifyReport/:requestId").patch(token.verifyToken, token.checkAdmin, crudAsset.verifyReport)
router.route("/asset/fixAsset/:errorId").patch(token.verifyToken, token.checkAdmin, crudAsset.fixError)
// router.route("/asset/createAssetExcel").post(uploadFile.single("fileExcel"),uploadFileExcel,validate(validation.createAsset),crudAsset.createAssetExcel);

//User
router.route("/user").get(token.verifyToken, crudUser.getUserData);
router.route("/user").post(token.verifyToken, token.checkAdmin, validate(validation.createUser), crudUser.create);
router.route("/user/:id").patch(token.verifyToken, crudUser.updateUser);
router.route("/user/changePassword/:userId").patch(token.verifyToken, validate(validation.changePassword), crudUser.changePassword);
router.route("/user/:userId").delete(token.verifyToken, token.checkAdmin,   crudUser.deleteUser); //route xóa user
//router.route("/user/verifyEmail").post(email.sendVerifyEmail); //route gửi email, xác thực email
// router.route("/user/active/:emailToken").patch(validate(validation.updateUser), crudUser.updateUser); //route sửa thông tin người dùng
// router.route("/user/verifyEmailExcel").post(uploadFile.single("fileExcel"), uploadFileExcel, email.sendVerifyEmail); //xác thực email trong file Excel trong
// router.route("/user/active/:emailToken").post(uploadFile.single("fileExcel"),uploadFileExcel,validate(validation.updateUser),crudUser.updateInformationUserExcel); //sửa thoong tin người dùng theo file Excel trong

//file
router.route("/upload/:id").post(token.verifyToken, uploadFile.single("file"), upload.uploadFile)

//misc
router.route("/recentAct").get(token.verifyToken, token.checkAdmin, crudAsset.getRecentActivities);

//email
// router.route("/email/sendEmailNotifications").post(token.verifyToken, email.sendEmailNotifications);

// position
router.route("/position").get(token.verifyToken, crudPosition.getPosition);
router.route("/position").post(token.verifyToken, token.checkAdmin, crudPosition.createPosition);
router.route("/position/:positionCode").delete(token.verifyToken, token.checkAdmin, crudPosition.deletePosition);
router.route("/position/:positionCode").patch(token.verifyToken, token.checkAdmin, crudPosition.updatePosition);

// function startScheduler() {
// 	schedule.scheduleJob("0 9,15 * * *", email.sendOverdueEmail);
// }
// startScheduler()

export default router;
