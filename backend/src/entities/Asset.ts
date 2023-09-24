import { Column, Entity, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import Base from "./Base";
import CategoryAsset from "./CategoryAsset";
import ErrorAsset from "./errorAsset";
import Allocation from "./Allocation";

@Entity("asset")
export default class Asset extends Base {
	@Column({
		type: "varchar",
		length: 255,
	})
	name: string;

	@Column({ unique: true })
	serial: string;

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

	@Column({
		type: "date",
		default: null,
	})
	warrantDate: string;

	@Column({
		type: "date",
		default: null,
	})
	buyDate: string;

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

	@CreateDateColumn()
	createAt: string;

	@UpdateDateColumn()
	updateAt: string;
}
