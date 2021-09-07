import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log("Insert User with ID", this.id)
    }

    @AfterUpdate()
    logUpdate() {
        console.log("Update User with ID", this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log("Remove User with ID", this.id)
    }
}