import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, Index, PrimaryColumn, OneToMany } from "typeorm";
import { Customer } from "./customer";

@Entity()
export class CustomerRole extends BaseEntity {
  @Index("CustomerRoleId")
  @Column({ nullable: false })
  role_id: number;

  @Column({ type: "varchar", nullable: false })
  nameRole: string;

  @OneToMany(() => Customer, (custo) => custo.role_id)
  customers?: Customer[];
}
