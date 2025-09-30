import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Situation } from "./Situations";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({unique: true})
    email!: string;

    @ManyToOne(()=> Situation, (situation)=> situation.users)
    @JoinColumn({name: "situationId"})
    situation!: Situation;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTANP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTANP", onUpdate: "CURRENT_TIMESTANP"})
    updatedAt!: Date;

}