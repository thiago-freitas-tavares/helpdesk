import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1783602046645 implements MigrationInterface {
    name = 'CreateInitialTables1783602046645'

    public async up(queryRunner: QueryRunner): Promise<void> { // este método será executado quando rodar o 'npm run migration:run'
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`email\` varchar(160) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('customer', 'agent', 'admin') NOT NULL DEFAULT 'customer', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tickets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(160) NOT NULL, \`description\` text NOT NULL, \`status\` enum ('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED') NOT NULL DEFAULT 'OPEN', \`priority\` enum ('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`requester_id\` int NOT NULL, \`assignee_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`ticket_id\` int NOT NULL, \`author_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_2a06f5cdaf003ceaa9fcf08be77\` FOREIGN KEY (\`requester_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD CONSTRAINT \`FK_dff6e2b44c9b5e177114588772f\` FOREIGN KEY (\`assignee_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_be8180d9b44a05e449b85f5b773\` FOREIGN KEY (\`ticket_id\`) REFERENCES \`tickets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e6d38899c31997c45d128a8973b\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { // este método será executado quando rodar o 'npm run migration:revert'
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e6d38899c31997c45d128a8973b\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_be8180d9b44a05e449b85f5b773\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_dff6e2b44c9b5e177114588772f\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP FOREIGN KEY \`FK_2a06f5cdaf003ceaa9fcf08be77\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP TABLE \`tickets\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
