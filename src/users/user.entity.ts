import { Report } from "src/reports/reports.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    admin: boolean;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

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