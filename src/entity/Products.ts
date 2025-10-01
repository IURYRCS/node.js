import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categorie } from "./Categories";
import { ProductSituation } from "./ProductSituations";

@Entity('products')
export class Products {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

   
    @ManyToOne(() => Categorie, (categorie) => categorie.products)
    @JoinColumn({ name: "categorieId" })
    categorie!: Categorie;

    @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}