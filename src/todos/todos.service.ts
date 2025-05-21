import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Todos } from './entities/todos.entity';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  // DI: 투두 엔티티에 대한 리포지터리 주입
  constructor(
    @InjectRepository(Todos)
    private todosRepository: Repository<Todos>,
  ) {}

  // 투두 생성
  async create(createTodoDTO: CreateTodoDTO) {
    try {
      const todo = {
        ...createTodoDTO,
      };

      await this.todosRepository.save({todo});

      return {
        status: HttpStatus.CREATED,
        message: 'Todo를 성공적으로 생성하였습니다.',
        data: todo,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        'Todo를 생성하는데 실패하였습니다.',
      );
    }
  }

  async findGroupTodo(user_id: string, group_id: string): Promise<object> {
    try {
      const todo = await this.todosRepository.find({
        where: { user_id, group_id },
      });

      if (!todo || todo.length === 0) {
        throw new NotFoundException('그룹에 Todo가 없습니다.');
      }
      return {
        status: HttpStatus.OK,
        message: '그룹 Todo가 성공적으로 조회되었습니다.',
        data: todo,
      };
    } catch (err) {
      console.log(err);
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new InternalServerErrorException(
        '그룹 Todo를 조회하지 못하였습니다.',
      );
    }
  }
}
