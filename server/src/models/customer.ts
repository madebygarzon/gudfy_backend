import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Store } from "./store";
import { SellerApplication } from "./seller-application";
import { CustomerRole } from "./customer-role";

@Entity()
export class Customer extends MedusaCustomer {
  @Index("CustomerStoreId")
  @Column({ type: "varchar", nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ nullable: true })
  role_id?: number;

  @ManyToOne(() => CustomerRole, (role) => role.customers)
  @JoinColumn({ name: "role_id" })
  customerRole?: CustomerRole;

  @OneToMany(() => SellerApplication, (seller) => seller?.customer)
  sellerapplications?: SellerApplication[];
}
