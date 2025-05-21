import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodosService } from './todos.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTodoDTO } from './dto/create-todo.dto';

@Controller('api/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Todo 추가', description: 'Todo를 추가합니다.' })
  @ApiBody({ type: CreateTodoDTO })
  @ApiResponse({ status: 201, description: 'Todo 생성 성공' })
  @ApiResponse({ status: 500, description: 'Todo 생성 실패' })
  async create(@Body() createTodoDTO: CreateTodoDTO) {
    return this.todosService.create(createTodoDTO);
  }

  // 그룹별 Todo 조회
  @Get(':userId/:groupId')
  @ApiOperation({ summary: 'Todo 정보 조회', description: 'Todo 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: 'Todo 조회 성공' })  
  @ApiResponse({ status: 404, description: 'Todo 정보 없음' })
  @ApiResponse({ status: 500, description: 'Todo 조회 실패' })
  async 
}
