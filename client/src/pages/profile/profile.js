import React, { useState } from "react";
import { Tabs, Tab, Box, Container } from "@mui/material";
import UserProfile from "./userProfile";
import ChangePassword from "./changePassword";
import MyTicket from "./myTicket";

const Profile = () => {
	const [value, setValue] = useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	return (
		<>
			<Container>
				<Box>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={value}
							onChange={handleChange}
							centered>
							<Tab label="User Profile" />
							<Tab label="Change Password" />
							<Tab label="My Ticket" />
						</Tabs>
					</Box>
					{value === 0 && <UserProfile />}
					{value === 1 && <ChangePassword />}
					{value === 2 && <MyTicket />}
				</Box>
			</Container>
		</>
	);
};
export default Profile;
