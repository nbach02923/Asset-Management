import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import url from "url";
import { payload, CustomRequest } from "../config/Config";

async function signToken(payload: payload, secretkey: string, expiresIn: string) {
	return jwt.sign(payload, secretkey, { expiresIn });
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	const accessToken = req?.headers?.authorization?.split(" ")?.[1];
	const path = url.parse(req.url).pathname;
	if (path === "/auth/login") {
		return next();
	}
	if (!accessToken) {
		return res.status(401).json({ message: "Unauthenticated request" });
	}

	jwt.verify(accessToken, process.env.ACCESSTOKEN, function (err: jwt.JsonWebTokenError, decoded: payload) {
		if (err) {
			return res.status(401).json(err);
		}
		(req as CustomRequest).id = decoded.id;
		(req as CustomRequest).userName = decoded.userName;
		(req as CustomRequest).role = decoded.role;
		(req as CustomRequest).departmentId = decoded.departmentId;
		return next();
	});
}

async function checkAdmin(req: CustomRequest, res: Response, next: NextFunction) {
	const role = req.role;
	if (role === true) {
		return next();
	} else {
		res.status(403).json({ message: "Unauthorized request" });
	}
}

const token = {
	signToken,
	verifyToken,
	checkAdmin,
};
export default token;
