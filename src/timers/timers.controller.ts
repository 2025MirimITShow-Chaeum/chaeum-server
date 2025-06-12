import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubjectTimerService } from 'src/subject-timers/subject-timer.service';
import { TimerLogService } from 'src/timer-logs/timer-log.service';
import { UserInfo } from '../auth/decorators/user-info.decorator';
import { JwtAuthGuard } from 'src/config/jwt.config';

@UseGuards(JwtAuthGuard)
@ApiTags('Timers')
@ApiBearerAuth()
@Controller('api/timers')
export class TimersController {
  constructor(
    private readonly subjectTimerService: SubjectTimerService,
    private readonly timerLogService: TimerLogService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '타이머 상태 조회',
    description: '특정 날짜의 과목 타이머 상태를 조회합니다.',
  })
  @ApiQuery({ name: 'subject', type: String, required: true, example: '영어' })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2025-06-11',
  })
  @ApiResponse({ status: 200, description: '타이머 상태 정보 반환' })
  async getSubjectTimerStatus(
    @UserInfo('uid') uid: string,
    @Query('subject') subject: string,
    @Query('date') date: string,
  ) {
    const timerStatus = await this.subjectTimerService.getTimerStatus(
      uid,
      subject,
      date,
    );

    return timerStatus ?? { message: '해당 날짜에 타이머 정보가 없습니다.' };
  }

  @Get('logs')
  @ApiOperation({
    summary: '타이머 로그 조회',
    description: '특정 날짜와 과목에 대한 타이머 로그를 조회합니다.',
  })
  @ApiQuery({ name: 'subject', type: String, required: true, example: '수학' })
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2025-06-11',
  })
  @ApiResponse({ status: 200, description: '타이머 로그 목록 반환' })
  async getTimerLogs(
    @UserInfo('uid') uid: string,
    @Query('subject') subject: string,
    @Query('date') date: string,
  ) {
    return this.timerLogService.getTimerLogs(uid, subject, date);
  }

  @Post(':group_id/start')
  @ApiOperation({ summary: '타이머 시작' })
  @ApiParam({ name: 'group_id', example: 'group123' })
  @ApiResponse({ status: 201, description: '타이머 시작' })
  async startTimer(
    @UserInfo('uid') uid: string,
    @Param('group_id') group_id: string,
  ) {
    return this.subjectTimerService.startTimer(uid, group_id);
  }

  @Post(':group_id/stop')
  @ApiOperation({ summary: '타이머 정지' })
  @ApiParam({ name: 'group_id', example: 'group123' })
  @ApiResponse({ status: 201, description: '타이머 정지 및 누적 완료' })
  async stopTimer(
    @UserInfo('uid') uid: string,
    @Param('group_id') group_id: string,
  ) {
    return this.subjectTimerService.stopTimer(uid, group_id);
  }

  @Get('accumulated-time')
  async getAccumulatedTime(
    @UserInfo('uid') uid: string,
    @Query('date') date: string,
  ) {
    const seconds = await this.subjectTimerService.getSumTime(uid, date);
    return { date, accumulated_seconds: seconds };
  }
}
