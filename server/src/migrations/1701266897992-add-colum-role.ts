import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddColumRole1701266897992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "customer" ADD "role_id" integer`);
    await queryRunner.createForeignKey(
      "customer",
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedColumnNames: ["role_id"],
        referencedTableName: "customer_role",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("customer", "role_id");
  }
}
