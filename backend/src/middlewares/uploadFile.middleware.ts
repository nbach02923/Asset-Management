import multer from "multer";
import jsonwebtoken from "jsonwebtoken";
import { payload } from "../config/Config";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const path = "./src/controllers/files/file/";
		if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
			cb(null, `${path}spreadsheet/`);
		} else if (file.mimetype.startsWith("image/")) {
			cb(null, `${path}picture/`);
		}
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now();
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jsonwebtoken.decode(token) as payload;
		const userName = decodedToken.userName;
		cb(null, `${uniqueSuffix}_${req.params.id}_${userName}_${file.originalname}`);
	},
});

const uploadFile = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.mimetype.startsWith("image/")
		) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
});
export default uploadFile;
