import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "./User_Account";

@Entity("position")
export default class Position {
	@Column({
		type: "varchar",
	})
		name: string;

	@PrimaryGeneratedColumn()
		code: string;

	@OneToMany(() => User, (user) => user.position)
		user: User;

	@Column({
		default: false,
	})
		isDeleted: boolean;
}
