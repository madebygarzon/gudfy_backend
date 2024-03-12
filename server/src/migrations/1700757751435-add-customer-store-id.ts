import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerStoreId1700757751435 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" ADD "store_id" character varying`
    );
    await queryRunner.query(
      `CREATE INDEX "CustomerStoreId" ON "customer" ("store_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."CustomerStoreId"`);
    await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "store_id"`);
  }
}
