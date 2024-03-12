import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerRole1701252674204 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "customer_role" ("role_id" integer NOT NULL, 
                  "nameRole" character varying NOT NULL, 
                  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`
    );
    await queryRunner.createPrimaryKey("customer_role", ["role_id"]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("customer_role", true);
  }
}
