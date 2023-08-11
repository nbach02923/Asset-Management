import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import Base from "./Base";
import User from "./User_Account";
import Asset from "./Asset";

@Entity("allocation")
export default class Allocation extends Base {
	@Column()
		userId: string;
	@ManyToOne(() => User, (user) => user.allocation, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		user: User;
	@Column()
		assetId: string;
	@ManyToOne(() => Asset, (asset) => asset.allocation, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		asset: Asset;
	@Column({
		type: "enum",
		enum: ["Pending", "Allocated", "Waiting to Approve", "Returned", "Rejected"],
		default: null,
	})
		allocationStatus: string;
	@Column({
		type: "datetime",
		default: null,
	})
		allocationDate: string;

	@Column({
		type: "datetime",
		default: null,
	})
		returnDate: string;

	@CreateDateColumn()
		createAt: string;

	@UpdateDateColumn()
		updateAt: string;
}
