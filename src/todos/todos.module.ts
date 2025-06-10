import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todos } from './entities/todos.entity';
import { GroupMembers } from '../groups/entities/group-members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todos, GroupMembers])],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
