import { Column, Entity, OneToMany } from "typeorm";
import Base from "./Base";
import Asset from "./Asset";

@Entity("categoryAsset")
export default class CategoryAsset extends Base {
	@Column({
		type: "varchar",
		length: 255,
	})
		name: string;

	@OneToMany(() => Asset, (asset) => asset.categoryAsset)
		asset: Asset;

	@Column({
		default: false,
	})
		isDeleted: boolean;
}
