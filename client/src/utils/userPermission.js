import decodeJWT from "./decodeJWT";
import React, { forwardRef } from "react";

const userPermission = (WrappedComponent, requiredPermissions) => {
	const UserPermission = (props, ref) => {
		const userRole = decodeJWT().role;
		if (requiredPermissions.includes(userRole)) {
			return <WrappedComponent ref={ref} {...props} />;
		} else {
			return null;
		}
	};
	return forwardRef(UserPermission);
};

export default userPermission;
