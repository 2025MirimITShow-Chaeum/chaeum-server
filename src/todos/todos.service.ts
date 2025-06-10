import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Todos } from './entities/todos.entity';
import { CreateTodoDTO } from './dto/create-todo.dto';
import { UpdateTodoDTO } from './dto/update_todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GroupMembers } from '../groups/entities/group-members.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todos)
    private todosRepository: Repository<Todos>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  // 투두 생성
  async create(createTodoDTO: CreateTodoDTO) {
    try {
      const todo = {
        ...createTodoDTO,
      };

      await this.todosRepository.save(todo);

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

  // 그룹 전체 멤버의 투두 조회
  async findTodosByGroup(group_id: string) {
    // 1. 해당 그룹의 멤버 ID들 가져오기
    const members = await this.groupMembersRepository.find({
      where: { group_id },
    });

    const memberIds = members.map((member) => member.member_id);

    // 2. 멤버들이 만든 투두들 조회
    const todos = await this.todosRepository.find({
      where: {
        user_id: In(memberIds), // IN 절
        group_id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return {
      status: 200,
      message: '그룹 멤버들의 투두를 성공적으로 조회했습니다.',
      data: todos,
    };
  }

  // 유저 개인의 전체 투두 조회
  async findTodosByUser(user_id: string) {
    const todos = await this.todosRepository.find({
      where: { user_id },
      order: {
        created_at: 'DESC',
      },
    });

    return {
      status: 200,
      message: '해당 유저의 투두를 성공적으로 조회했습니다.',
      data: todos,
    };
  }

  // 투두 내용 수정
  async update(todoId: number, updateTodoDTO: UpdateTodoDTO) {
    const todo = await this.todosRepository.findOne({
      where: { uid: Number(todoId) },
    });

    if (!todo) {
      throw new NotFoundException('해당 Todo를 찾을 수 없습니다.');
    }

    // 변경할 필드가 있다면 수정
    if (updateTodoDTO.title !== undefined) {
      todo.title = updateTodoDTO.title;
    }

    if (updateTodoDTO.status !== undefined) {
      todo.status = updateTodoDTO.status;
    }

    await this.todosRepository.save(todo);

    return {
      status: 200,
      message: '투두를 성공적으로 수정했습니다.',
      data: todo,
    };
  }

  // 투두 삭제
  async delete(todo_id: number) {
    const todo = await this.todosRepository.findOne({
      where: { uid: todo_id },
    });

    if (!todo) {
      throw new NotFoundException('삭제할 투두가 존재하지 않습니다.');
    }

    await this.todosRepository.delete(todo_id);

    return {
      status: HttpStatus.OK,
      message: '투두가 성공적으로 삭제되었습니다.',
      data: { todo_id },
    };
  }
}
