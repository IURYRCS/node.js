import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductsTable1686780200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "nome",
                    type: "varchar",
                },
                {
                    name: "categorieId",
                    type: "int",
                },
                {
                    name: "productSituationId",
                    type: "int",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                },
            ],
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["categorieId"],
            referencedTableName: "categories",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));

        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["productSituationId"],
            referencedTableName: "productsituations",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("products");

        const foreignKeyCategorie = table?.foreignKeys.find(fk => fk.columnNames.indexOf("categorieId") !== -1);
        if (foreignKeyCategorie) {
            await queryRunner.dropForeignKey("products", foreignKeyCategorie);
        }

        const foreignKeyProductSituation = table?.foreignKeys.find(fk => fk.columnNames.indexOf("productSituationId") !== -1);
        if (foreignKeyProductSituation) {
            await queryRunner.dropForeignKey("products", foreignKeyProductSituation);
        }

        await queryRunner.dropTable("products");
    }
}