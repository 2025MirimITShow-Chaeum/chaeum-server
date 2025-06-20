import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todo.service';
import { TodosController } from './todo.controller';
import { Todo } from './entities/todo.entity';
import { GroupMembers } from '../groups/entities/group-members.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, GroupMembers, User, AuthModule]),
    UsersModule,
  ],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodoModule {}
