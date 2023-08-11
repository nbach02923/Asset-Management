import { Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity("base")
export default class Base {
	@PrimaryGeneratedColumn("uuid")
		id: string;
}
