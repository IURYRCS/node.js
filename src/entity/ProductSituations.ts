import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Products } from "./Products";

@Entity("productsituations") 
export class ProductSituation {
    
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ unique: true })
    name!: string;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
    
    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
    
    @OneToMany(() => Products, (product) => product.productSituation)
    products!: Products[];
}