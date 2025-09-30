import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categorie } from "./Categories";
import { ProductSituation } from "./ProductSituations";

@Entity('products')
export class Products {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @ManyToOne(() => Categorie, (categories) => categories.products)
    @JoinColumn({ name: "categorieId" })
    categories!: Categorie;

    @ManyToOne(() => ProductSituation, (productSituations) => productSituations.products)
    @JoinColumn({ name: "productSituationId" })
    productSituation!: ProductSituation;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}
