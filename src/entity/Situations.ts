import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { User } from "./Users";

@Entity('situations')
export class Situation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nameSituation!: string;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTANP"})
    createdAt!: Date;

    @Column({type: "timestamp", default:()=> "CURRENT_TIMESTANP", onUpdate: "CURRENT_TIMESTANP"})
    updateAd!: Date;

    @OneToMany(()=> User, (user)=> user.situation)
    users!: User;
}