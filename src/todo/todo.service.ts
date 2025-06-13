import { UpdateTodoDTO } from './dto/update_todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GroupMembers } from '../groups/entities/group-members.entity';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Todo } from 'src/todo/entities/todo.entity';
import { CreateTodoDTO } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,

    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  // 투두 생성
  async create(createTodoDTO: CreateTodoDTO) {
    const { user_id, group_id } = createTodoDTO;

    // 그룹 멤버 검증
    const membership = await this.groupMembersRepository.findOne({
      where: { group_id, member_id: user_id },
    });
    if (!membership) {
      throw new ForbiddenException('해당 그룹의 멤버가 아닙니다.');
    }

    try {
      const todo = this.todosRepository.create(createTodoDTO);
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

    // 그룹에 멤버가 없으면 빈 배열 반환
    if (memberIds.length === 0) {
      return {
        status: HttpStatus.OK,
        message: '그룹 멤버들의 투두를 성공적으로 조회했습니다.',
        data: [],
      };
    }

    // 2. 멤버들이 만든 투두들 조회
    const todos = await this.todosRepository.find({
      where: { user_id: In(memberIds), group_id },
      order: { created_at: 'DESC' },
      relations: ['user', 'group'],
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
      status: HttpStatus.OK,
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

    if (updateTodoDTO.is_completed !== undefined) {
      todo.is_completed = updateTodoDTO.is_completed;
      todo.finished_at = updateTodoDTO.is_completed ? new Date() : null;
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
