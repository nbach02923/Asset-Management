import nodemailer from "nodemailer";
import AppDataSource from "../../../ormconfig";
import Email from "../../entities/Email";
import UserAccount from "../../entities/User_Account";
import Allocation from "../../entities/Allocation";
import UserInformation from "../../../src/entities/User_Information";
import Asset from "../../entities/Asset";
import "dotenv/config";
import fs from "fs";
import path from "path";
import moment from "moment";
interface data {
	assetId: string;
	userId: string;
	allocationStatus: string;
	allocationDate: string;
	returnDate: string;
}

async function transporter() {
	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "taquockhanh09022001@gmail.com",
			pass: "cdjxtnazcysnyhbj",
		},
	});
}

async function sendOverdueEmail() {
	try {
		const overdueAllocation = await AppDataSource.getRepository(Allocation)
			.createQueryBuilder("allocation")
			.leftJoinAndSelect("allocation.user", "user")
			.leftJoinAndSelect("user.userInformation", "userInformation")
			.leftJoinAndSelect("allocation.asset", "asset")
			.where("allocation.returnDate < :today AND allocation.allocationStatus != allocationStatus", {
				today: new Date(),
				allocationStatus: "Allocated",
			})
			.getMany();
		for (const allocation of overdueAllocation) {
			let emailTemplate = fs.readFileSync(path.join(__dirname, "./overdueTemplate.html"), "utf-8");
			emailTemplate = emailTemplate.replace("[User]", allocation.user.userInformation.fullName);
			emailTemplate = emailTemplate.replace("[Serial]", allocation.asset.serial);
			emailTemplate = emailTemplate.replace("[Asset]", allocation.asset.name);
			const formattedReturnDate = moment(allocation.returnDate).format("HH:mm:ss DD-MM-YYYY");
			emailTemplate = emailTemplate.replace("[ReturnDate]", formattedReturnDate);
			const mailOptions = {
				to: allocation.user.userInformation.email,
				subject: "Thông báo đến hạn hoàn trả tài sản",
				text: emailTemplate,
			};
			const service = await transporter();
			service.sendMail(mailOptions, function (err, info) {
				if (err) {
					console.log(err);
				} else {
					console.log("Email đã được gửi thành công: " + info.response);
				}
			});
			const recipient = await AppDataSource.getRepository(UserInformation).findOne({
				where: { email: mailOptions.to },
				select: ["email"],
			});
			await AppDataSource.createQueryBuilder()
				.insert()
				.into(Email)
				.values({
					recipient: () => recipient.email as string,
					subject: mailOptions.subject,
					message: mailOptions.text,
				})
				.execute();
		}
	} catch (err) {
		console.log(err);
	}
}

async function sendEmailAllocationToAdmin(data: data) {
	try {
		const adminEmail = await AppDataSource.getRepository(UserAccount)
			.createQueryBuilder("userAccount")
			.leftJoin("userAccount.userInformation", "userInformation")
			.select(["userInformation.email"])
			.where("userAccount.role = :role", { role: true })
			.getMany();
		const userName = await AppDataSource.getRepository(UserInformation).findOne({
			where: { userId: data.userId },
			select: ["fullName"],
		});
		const assetName = await AppDataSource.getRepository(Asset).findOne({
			where: { id: data.assetId },
			select: ["name", "serial"],
		});
		for (const email in adminEmail) {
			let emailTemplate = fs.readFileSync(path.join(__dirname, "./allocationTemplate.html"), "utf-8");
			emailTemplate = emailTemplate.replace("[Requester Name]", userName.fullName);
			emailTemplate = emailTemplate.replace("[Asset Name]", assetName.name);
			emailTemplate = emailTemplate.replace("[Asset Serial]", assetName.serial);
			emailTemplate = emailTemplate.replace("[Allocation Date]", data.allocationDate);
			emailTemplate = emailTemplate.replace("[Return Date]", data.returnDate);
			const mailOptions = {
				to: email,
				subject: "Thông báo đến hạn hoàn trả tài sản",
				text: emailTemplate,
			};
			const service = await transporter();
			service.sendMail(mailOptions, function (err, info) {
				if (err) {
					console.log(err);
				} else {
					console.log("Email đã được gửi thành công: " + info.response);
				}
			});
			const recipient = await AppDataSource.getRepository(UserInformation).findOne({
				where: { userId: data.userId },
				select: ["email"],
			});
			await AppDataSource.createQueryBuilder()
				.insert()
				.into(Email)
				.values({
					recipient: () => recipient.email as string,
					subject: mailOptions.subject,
					message: mailOptions.text,
				})
				.execute();
		}
	} catch (err) {
		console.log(err);
	}
}

const email = { sendOverdueEmail, sendEmailAllocationToAdmin };
export default email;
