import { Column, Entity, OneToMany } from "typeorm";
import Base from "./Base";
import User from "./User_Account";

@Entity("department")
export default class Department extends Base {
	@Column()
		name: string;

	@OneToMany(() => User, (user) => user.department)
		user: User;

	@Column({
		default: false,
	})
		isDeleted: boolean;
}
