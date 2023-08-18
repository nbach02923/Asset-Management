import { Joi } from "express-validation";

//user
const login = {
	body: Joi.object({
		userName: Joi.string().min(4).required(),
		password: Joi.string().required(),
		//.regex(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})/)
		//.required(),
	}),
};

const createUser = {
	body: Joi.object({
		userName: Joi.string().min(4).required(),
		role: Joi.boolean().required(),
		departmentId: Joi.string().required(),
		positionCode: Joi.string().required(),
	}),
};

const updateUser = {
	body: Joi.object({
		departmentId: Joi.string().optional(),
		fullName: Joi.string().min(3).optional(),
		dateOfBirth: Joi.string().optional().allow(""),
		email: Joi.string().email().optional(),
		phoneNumber: Joi.string()
			.regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
			.optional(),
	}),
};

const changePassword = {
	body: Joi.object({
		password: Joi.string().optional().allow(""),
		newPassword: Joi.string().min(8).required(),
		enterPassword: Joi.string().required(),
	}),
};

//asset
const createAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z0-9]/)
			.required(),
		type: Joi.string().valid("Stationary", "Nonstationary", "Other").required(),
		categoryId: Joi.string().required(),
		status: Joi.string().valid("Ready to Deploy", "Deployed", "Error").required(),
		description: Joi.string().optional().allow(""),
	}),
};

const updateAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z0-9]/)
			.optional(),
		type: Joi.string().optional().valid("Stationary", "Nonstationary", "Other").allow(""),
		categoryId: Joi.string().optional(),
		status: Joi.string().valid("Ready to Deploy", "Deployed", "Error").optional(),
		description: Joi.string().optional().allow(""),
	}),
};
//categoryAsset
const createCategoryAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required(),
	}),
};

const updateCategoryAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required(),
	}),
};

//department
const createDepartment = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required(),
	}),
};

const updateDepartment = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required(),
	}),
};

const validation = {
	login,
	createUser,
	updateUser,
	createAsset,
	updateAsset,
	createCategoryAsset,
	updateCategoryAsset,
	changePassword,
	createDepartment,
	updateDepartment,
};
export default validation;
