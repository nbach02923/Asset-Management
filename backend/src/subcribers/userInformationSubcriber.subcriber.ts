import { EventSubscriber, EntitySubscriberInterface, UpdateEvent } from "typeorm";
import UserAccount from "../entities/User_Account";
import UserInformation from "../entities/User_Information";
import AppDataSource from "../../ormconfig";

@EventSubscriber()
export class UserInformationSubscriber implements EntitySubscriberInterface<UserInformation> {
	listenTo() {
		return UserInformation;
	}

	async afterUpdate(event: UpdateEvent<UserInformation>) {
		const userAccountRepository = AppDataSource.getRepository(UserAccount);
		const userAccount = await userAccountRepository.findOne(event.entity.userId);
		userAccount.updateAt = new Date().toISOString().replace("T", " ").substring(0, 23);
		await userAccountRepository.save(userAccount);
	}
}
