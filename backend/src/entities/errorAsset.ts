import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";
import Base from "./Base";
import Asset from "./Asset";
import User from "./User_Account";

@Entity("errorAsset")
export default class ErrorAsset extends Base {
	@Column()
		assetId: string;

	@ManyToOne(() => Asset, (asset) => asset.errorAsset)
		asset: Asset;

	@Column()
		userId: string;

	@ManyToOne(() => User, (user) => user.errorAsset)
		user: User;

	@Column({
		type: "longtext",
		default: null,
	})
		description: string;

	@Column({
		type: "enum",
		enum: ["Waiting to Approve", "Approved", "Fixed", "Disapproved"],
	})
		status: string;

	@CreateDateColumn()
		createAt: string;

	@UpdateDateColumn()
		updateAt: string;
}
