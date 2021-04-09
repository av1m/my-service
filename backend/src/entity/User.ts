import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
  Index,
  OneToMany,
  ObjectID,
} from 'typeorm';
import {Length, IsNotEmpty, IsEmail} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import {Service} from './Service';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GHOST = 'ghost',
}

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index({unique: true})
  @IsEmail()
  @IsNotEmpty({message: 'The email is required'})
  email: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EDITOR,
  })
  @IsNotEmpty()
  role: UserRole;

  @Column('date')
  @CreateDateColumn()
  createdAt: Date;

  @Column('date')
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  notes: string;

  @OneToMany(() => Service, service => service.user)
  services: Service[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
