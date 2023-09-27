import { MigrationInterface, QueryRunner } from "typeorm";

export class Nodejs1695787466934 implements MigrationInterface {
    name = 'Nodejs1695787466934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`base\` (\`id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`department\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`position\` (\`name\` varchar(255) NOT NULL, \`code\` int NOT NULL AUTO_INCREMENT, \`isDeleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`code\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userInformation\` (\`userId\` varchar(255) NOT NULL, \`fullName\` varchar(255) NULL, \`email\` varchar(255) NULL, \`dateOfBirth\` varchar(255) NULL, \`phoneNumber\` varchar(255) NULL, \`avatarPath\` varchar(255) NULL, UNIQUE INDEX \`REL_362b1cf8b6ab9bc4c0b7035e73\` (\`userId\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`email\` (\`id\` varchar(36) NOT NULL, \`subject\` varchar(50) NOT NULL, \`message\` longtext NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`email\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categoryAsset\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`asset\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`serial\` varchar(255) NOT NULL, \`type\` enum ('Stationary', 'Nonstationary', 'Other') NOT NULL, \`status\` enum ('Ready to Deploy', 'Deployed', 'Error') NOT NULL, \`description\` text NULL, \`picturePath\` varchar NULL, \`warrantDate\` date NULL, \`buyDate\` date NULL, \`categoryAssetId\` varchar(255) NOT NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97722584aab48508512c63aae5\` (\`serial\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`errorAsset\` (\`id\` varchar(36) NOT NULL, \`assetId\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`description\` longtext NULL, \`status\` enum ('Waiting to Approve', 'Approved', 'Fixed', 'Disapproved') NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`userAccount\` (\`id\` varchar(36) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` tinyint NOT NULL DEFAULT 0, \`departmentId\` varchar(255) NOT NULL, \`positionCode\` int NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDeleted\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`allocation\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`assetId\` varchar(255) NOT NULL, \`allocationStatus\` enum ('Pending', 'Allocated', 'Waiting to Approve', 'Returned', 'Rejected') NULL, \`allocationDate\` datetime NULL, \`returnDate\` datetime NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`userInformation\` ADD CONSTRAINT \`FK_362b1cf8b6ab9bc4c0b7035e73c\` FOREIGN KEY (\`userId\`) REFERENCES \`userAccount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`email\` ADD CONSTRAINT \`FK_fee9013b697946e8129caba8983\` FOREIGN KEY (\`email\`) REFERENCES \`userInformation\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`asset\` ADD CONSTRAINT \`FK_e75b75ad294f303378522fb89cc\` FOREIGN KEY (\`categoryAssetId\`) REFERENCES \`categoryAsset\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`errorAsset\` ADD CONSTRAINT \`FK_1b77872a457e5436878e944439c\` FOREIGN KEY (\`assetId\`) REFERENCES \`asset\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`errorAsset\` ADD CONSTRAINT \`FK_c6aff82b90362fab86ad5fc2f10\` FOREIGN KEY (\`userId\`) REFERENCES \`userAccount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`userAccount\` ADD CONSTRAINT \`FK_568f0fc1ea09d4c3e590adcb50c\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`userAccount\` ADD CONSTRAINT \`FK_85101dbf91a6952ab71b4048a71\` FOREIGN KEY (\`positionCode\`) REFERENCES \`position\`(\`code\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`allocation\` ADD CONSTRAINT \`FK_f4e7d395c42a2c5ed51d81923f1\` FOREIGN KEY (\`userId\`) REFERENCES \`userAccount\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`allocation\` ADD CONSTRAINT \`FK_738ee7b8a50c188504d3e0d0066\` FOREIGN KEY (\`assetId\`) REFERENCES \`asset\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`allocation\` DROP FOREIGN KEY \`FK_738ee7b8a50c188504d3e0d0066\``);
        await queryRunner.query(`ALTER TABLE \`allocation\` DROP FOREIGN KEY \`FK_f4e7d395c42a2c5ed51d81923f1\``);
        await queryRunner.query(`ALTER TABLE \`userAccount\` DROP FOREIGN KEY \`FK_85101dbf91a6952ab71b4048a71\``);
        await queryRunner.query(`ALTER TABLE \`userAccount\` DROP FOREIGN KEY \`FK_568f0fc1ea09d4c3e590adcb50c\``);
        await queryRunner.query(`ALTER TABLE \`errorAsset\` DROP FOREIGN KEY \`FK_c6aff82b90362fab86ad5fc2f10\``);
        await queryRunner.query(`ALTER TABLE \`errorAsset\` DROP FOREIGN KEY \`FK_1b77872a457e5436878e944439c\``);
        await queryRunner.query(`ALTER TABLE \`asset\` DROP FOREIGN KEY \`FK_e75b75ad294f303378522fb89cc\``);
        await queryRunner.query(`ALTER TABLE \`email\` DROP FOREIGN KEY \`FK_fee9013b697946e8129caba8983\``);
        await queryRunner.query(`ALTER TABLE \`userInformation\` DROP FOREIGN KEY \`FK_362b1cf8b6ab9bc4c0b7035e73c\``);
        await queryRunner.query(`DROP TABLE \`allocation\``);
        await queryRunner.query(`DROP TABLE \`userAccount\``);
        await queryRunner.query(`DROP TABLE \`errorAsset\``);
        await queryRunner.query(`DROP INDEX \`IDX_97722584aab48508512c63aae5\` ON \`asset\``);
        await queryRunner.query(`DROP TABLE \`asset\``);
        await queryRunner.query(`DROP TABLE \`categoryAsset\``);
        await queryRunner.query(`DROP TABLE \`email\``);
        await queryRunner.query(`DROP INDEX \`REL_362b1cf8b6ab9bc4c0b7035e73\` ON \`userInformation\``);
        await queryRunner.query(`DROP TABLE \`userInformation\``);
        await queryRunner.query(`DROP TABLE \`position\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP TABLE \`base\``);
    }

}
