import {MigrationInterface} from 'typeorm';
import {MongoQueryRunner} from 'typeorm/driver/mongodb/MongoQueryRunner';
import {User, UserRole} from '../entity/User';

export class CreateAdminUser1617927482651 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    const user: User = new User();
    user.email = 'hello@world.com';
    user.password = 'mysuperstrongpassword';
    user.role = UserRole.ADMIN;
    await queryRunner.insertOne('migration', user);
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.deleteOne('migration', {email: 'hello@world.com'});
  }
}
