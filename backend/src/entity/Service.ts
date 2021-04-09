import {Column, Entity, ManyToOne, ObjectID, ObjectIdColumn} from 'typeorm';
import {IsPositive, IsUrl} from 'class-validator';
import {User} from './User';

@Entity()
export class Service {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  @IsUrl()
  photo: string;

  @Column()
  @IsPositive()
  price: number;

  @ManyToOne(() => User, user => user.services)
  user: User;
}
