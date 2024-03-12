import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Customer } from "./customer";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class SellerApplication extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  customer_id: string;

  @ManyToOne(() => Customer, (customer) => customer.sellerapplications)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: Customer;

  @Column({ type: "varchar", nullable: false })
  identification_number: string;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "boolean", nullable: false })
  approved: boolean;

  @Column({ type: "boolean", nullable: false })
  rejected: boolean;

  @Column({ type: "varchar", nullable: true })
  comment_status: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "appli");
  }
}
