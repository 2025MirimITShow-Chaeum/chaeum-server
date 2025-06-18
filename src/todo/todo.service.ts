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
  async create(user_id: string, createTodoDTO: CreateTodoDTO) {
    const { group_id } = createTodoDTO;

    const membership = await this.groupMembersRepository.findOne({
      where: { group_id, user_id },
    });

    if (!membership) {
      throw new ForbiddenException('해당 그룹의 멤버가 아닙니다.');
    }

    try {
      const todo = this.todosRepository.create({
        ...createTodoDTO,
        user_id,
        user: membership,
        user_color: membership.color,
      });
      await this.todosRepository.save(todo);

      return {
        status: HttpStatus.CREATED,
        message: 'Todo를 성공적으로 생성하였습니다.',
        data: todo,
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Todo를 생성하는데 실패하였습니다.',
      );
    }
  }

  // 그룹 전체 멤버의 투두 조회
  async findTodosByGroup(group_id: string) {
    const members = await this.groupMembersRepository.find({
      where: { group_id },
    });

    const memberIds = members.map((member) => member.user_id);

    if (memberIds.length === 0) {
      return {
        status: HttpStatus.OK,
        message: '그룹 멤버들의 투두를 성공적으로 조회했습니다.',
        data: [],
      };
    }

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
      order: { created_at: 'DESC' },
    });

    return {
      status: HttpStatus.OK,
      message: '해당 유저의 투두를 성공적으로 조회했습니다.',
      data: todos,
    };
  }

  // 유저의 그룹별 투두 조회
  async findTodosByGroupAndUser(user_id: string, group_id: string) {
    const todos = await this.todosRepository.find({
      where: { user_id, group_id },
      order: { created_at: 'DESC' },
    });

    return todos;
  }

  // 투두 내용 수정 (user_id 포함)
  async update(todoId: number, updateTodoDTO: UpdateTodoDTO, user_id: string) {
    const todo = await this.todosRepository.findOne({
      where: { uid: todoId },
    });

    if (!todo) {
      throw new NotFoundException('해당 Todo를 찾을 수 없습니다.');
    }

    if (todo.user_id !== user_id) {
      throw new ForbiddenException('본인의 Todo만 수정할 수 있습니다.');
    }

    if (updateTodoDTO.title !== undefined) {
      todo.title = updateTodoDTO.title;
    }

    if (updateTodoDTO.is_completed !== undefined) {
      todo.is_completed = updateTodoDTO.is_completed;
      todo.finished_at = updateTodoDTO.is_completed ? new Date() : null;
    }

    if (
      updateTodoDTO.group_id !== undefined &&
      updateTodoDTO.group_id !== todo.group_id
    ) {
      const newMembership = await this.groupMembersRepository.findOne({
        where: {
          group_id: updateTodoDTO.group_id,
          user_id,
        },
      });

      if (!newMembership) {
        throw new ForbiddenException(
          '변경하려는 그룹에 사용자가 속해있지 않습니다.',
        );
      }

      todo.group_id = updateTodoDTO.group_id;
      todo.user_color = newMembership.color;
    }

    await this.todosRepository.save(todo);

    return {
      status: 200,
      message: '투두를 성공적으로 수정했습니다.',
      data: todo,
    };
  }

  // 투두 삭제 (user_id 포함)
  async delete(todo_id: number, user_id: string) {
    const todo = await this.todosRepository.findOne({
      where: { uid: todo_id },
    });

    if (!todo) {
      throw new NotFoundException('삭제할 투두가 존재하지 않습니다.');
    }

    if (todo.user_id !== user_id) {
      throw new ForbiddenException('본인의 Todo만 삭제할 수 있습니다.');
    }

    await this.todosRepository.delete(todo_id);

    return {
      status: HttpStatus.OK,
      message: '투두가 성공적으로 삭제되었습니다.',
      data: { todo_id },
    };
  }
}
