import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class SellerApplication1701493661573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "seller_application" ("id" character varying NOT NULL, 
                "customer_id" character varying NOT NULL,
                "identification_number" character varying NOT NULL,
                "address" character varying NOT NULL, 
                "approved" boolean NOT NULL,
                "rejected" boolean NOT NULL,
                "comment_status" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`
    );
    await queryRunner.createPrimaryKey("seller_application", ["id"]);
    await queryRunner.createForeignKey(
      "seller_application",
      new TableForeignKey({
        columnNames: ["customer_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "customer",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("seller_application", true);
  }
}
