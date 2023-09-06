import { Joi } from "express-validation";

//user
const login = {
	body: Joi.object({
		userName: Joi.string().min(4).required().messages({
			"string.min": "Username should be at least 4 characters long",
			"any.required": "Username is required",
			"string.empty": "UserName should not be left empty",
		}),
		password: Joi.string().required().messages({
			"any.required": "Password is required",
			"string.empty": "Password should not be left empty",
		}),
	}),
};

const createUser = {
	body: Joi.object({
		userName: Joi.string().min(4).required().messages({
			"string.min": "Username should be at least 4 characters long",
			"string.empty": "UserName should not be left empty",
			"any.required": "Username is required",
		}),
		role: Joi.boolean().required().messages({
			"boolean.base": "Role should be boolean",
			"any.required": "Role is required",
		}),
		departmentId: Joi.string().required().messages({
			"string.empty": "Department should not be empty",
			"any.required": "Department is required",
		}),
		positionCode: Joi.number().required().messages({
			"number.base": "Position should be a number",
			"any.required": "Position is required",
		}),
	}),
};

const updateUser = {
	body: Joi.object({
		departmentId: Joi.string().optional().messages({
			"string.base": "Department should be a string",
		}),
		positionCode: Joi.number().optional().messages({
			"number.base": "Position should be a number",
		}),
		fullName: Joi.string().min(3).optional().messages({
			"string.min": "Full name should be at least 3 characters long",
		}),
		dateOfBirth: Joi.string().optional().allow(""),
		email: Joi.string().email().optional().messages({
			"string.email": "Invalid email",
		}),
		phoneNumber: Joi.string()
			.pattern(
				/^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/
			)
			.optional()
			.messages({
				"string.pattern.base":
					"Invalid phone number. Phone number should start with 0 or 84(Viet Nam country code)",
			}),
	}),
};

const changePassword = {
	body: Joi.object({
		password: Joi.string().optional().allow(""),
		newPassword: Joi.string().min(8).required().messages({
			"string.min": "Password should be at least 8 characters long",
			"any.required": "New password is required",
		}),
		confPassword: Joi.string().required().messages({
			"any.required": "Re-enter password is required",
			"string.empty": "Password should not be left empty",
		}),
	}),
};

//asset
const createAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z0-9]/)
			.required()
			.messages({
				"string.base": "Asset name should be a string",
				"string.pattern.base": "Asset name should only contain alphanumeric characters",
				"any.required": "Asset name is required",
				"string.empty": "Asset name should not be empty",
			}),
		type: Joi.string().valid("Stationary", "Nonstationary", "Other").required().messages({
			"any.required": "Asset type is required",
			"string.empty": "Asset type should not be empty",
			"any.only": "Invalid asset type",
		}),
		categoryId: Joi.string().required().messages({
			"any.required": "Asset category is required",
		}),
		status: Joi.string().valid("Ready to Deploy", "Deployed", "Error").required().messages({
			"any.only": "Invalid asset status",
			"any.required": "Asset status is required",
		}),
		description: Joi.string().optional().allow("").messages({
			"string.base": "Asset description should be a string",
		}),
	}),
};

const updateAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z0-9]/)
			.optional()
			.messages({
				"string.base": "Asset name should be a string",
				"string.pattern.base": "Asset name should only contain alphanumeric characters",
			}),
		type: Joi.string().optional().valid("Stationary", "Nonstationary", "Other").messages({
			"any.only": "Invalid asset type",
		}),
		categoryId: Joi.string().optional(),
		status: Joi.string().valid("Ready to Deploy", "Deployed", "Error").optional().messages({
			"any.only": "Invalid asset status",
		}),
		description: Joi.string().optional().allow("").messages({
			"string.base": "Asset description should be a string",
		}),
	}),
};
//categoryAsset
const createCategoryAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z0-9]/)
			.required()
			.messages({
				"string.base": "Category name should be a string",
				"string.pattern.base": "Category name should only contain alphanumeric characters",
				"any.required": "Category name is required",
				"string.empty": "Category name should not be empty",
			}),
	}),
};

const updateCategoryAsset = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required()
			.messages({
				"string.base": "Category name should be a string",
				"string.pattern.base": "Category name should only contain alphanumeric characters",
				"any.required": "Category name is required",
				"string.empty": "Category name should not be empty",
			}),
	}),
};

//department
const createDepartment = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required()
			.messages({
				"string.base": "Department name should be a string",
				"string.pattern.base": "Department name should only contain alphanumeric characters",
				"any.required": "Department name is required",
				"string.empty": "Department name should not be empty",
			}),
	}),
};

const updateDepartment = {
	body: Joi.object({
		name: Joi.string()
			.regex(/[a-zA-Z]/)
			.required()
			.messages({
				"string.base": "Department name should be a string",
				"string.pattern.base": "Department name should only contain alphanumeric characters",
				"any.required": "Department name is required",
				"string.empty": "Department name should not be empty",
			}),
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
