import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todo.service';
import { TodosController } from './todo.controller';
import { Todo } from './entities/todo.entity';
import { GroupMembers } from '../groups/entities/group-members.entity';
import { User } from 'src/user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, GroupMembers, User, AuthModule])],
  providers: [TodosService],
  controllers: [TodosController],
  exports: [TodosService],
})
export class TodoModule {}
