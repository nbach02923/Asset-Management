import { Entity, Column, OneToMany, ManyToOne, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Base from "./Base";
import Department from "./Department";
import Position from "./Position";
import UserInformation from "./User_Information";
import Email from "./Email";
import Allocation from "./Allocation";
import ErrorAsset from "./errorAsset";

@Entity("userAccount")
export default class UserAccount extends Base {
	@Column({
		type: "varchar",
		length: 255,
	})
		userName: string;

	@Column({
		type: "varchar",
		length: 255,
	})
		password: string;

	@Column({
		default: false,
	})
		role: boolean;

	@OneToOne(() => UserInformation, (userInformation) => userInformation.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		userInformation: UserInformation;

	@Column()
		departmentId: string;

	@ManyToOne(() => Department, (department) => department.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		department: Department;

	@Column()
		positionCode: string;

	@ManyToOne(() => Position, (position) => position.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		position: Position;

	@OneToMany(() => Email, (email) => email.recipient)
		email: Email;

	@CreateDateColumn()
		createAt: string;

	@UpdateDateColumn()
		updateAt: string;

	@OneToMany(() => Allocation, (allocation) => allocation.user)
		allocation: Allocation;

	@OneToMany(() => ErrorAsset, (errorAsset) => errorAsset.user)
		errorAsset: ErrorAsset;

	@Column({
		default: false,
	})
		isDeleted: boolean;
}
