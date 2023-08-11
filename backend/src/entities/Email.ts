import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import Base from "./Base";
import UserInformation from "./User_Information";

@Entity("email")
export default class Email extends Base {
	@ManyToOne(() => UserInformation)
	@JoinColumn({
		name: "email",
	})
		recipient: UserInformation;
	@Column({
		type: "varchar",
		length: 50,
	})
		subject: string;
	@Column({
		type: "longtext",
	})
		message: string;
	@CreateDateColumn()
		createAt: string;
}
