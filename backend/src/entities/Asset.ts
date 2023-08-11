import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import Base from "./Base";
import CategoryAsset from "./CategoryAsset";
import ErrorAsset from "./errorAsset";
import Allocation from "./Allocation";

@Entity("asset")
export default class Asset extends Base {
	//tên tài sản
	@Column({
		type: "varchar",
		length: 255,
	})
		name: string;

	@Column({ unique: true })
		serial: string;

	//loại tài sản
	@Column({
		type: "enum",
		enum: ["Stationary", "Nonstationary", "Other"],
	})
		type: string;

	@Column({
		type: "enum",
		enum: ["Ready to Deploy", "Deployed", "Error"],
	})
		status: string;

	@Column({
		type: "text",
		default: null,
	})
		description: string;

	@Column()
		categoryAssetId: string;

	@ManyToOne(() => CategoryAsset, (categoryAsset) => categoryAsset.asset, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
		categoryAsset: CategoryAsset;

	@Column({
		default: false,
	})
		isDeleted: boolean;

	@OneToMany(() => ErrorAsset, (errorAsset) => errorAsset.asset)
		errorAsset: ErrorAsset;

	@OneToMany(() => Allocation, (allocation) => allocation.asset)
		allocation: Allocation;
}
