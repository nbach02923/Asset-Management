import { Entity, JoinColumn, OneToOne, Column, PrimaryColumn } from "typeorm";
import User from "./User_Account";

@Entity("userInformation")
export default class UserInformation {
	@PrimaryColumn()
		userId: string;

	@OneToOne(() => User, (user) => user.userInformation)
	@JoinColumn()
		user: User[];

	@Column({
		type: "varchar",
		length: 255,
		default: null,
	})
		fullName: string;

	@Column({
		type: "varchar",
		default: null,
	})
		email: string;

	@Column({
		type: "varchar",
		default: null,
	})
		dateOfBirth: string;

	@Column({
		type: "varchar",
		default: null,
	})
		phoneNumber: string;

	@Column({
		type: "varchar",
		default: null
	})
		avatarPath: string
}
