import { Injectable } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { SubjectTimerService } from '../subject-timers/subject-timer.service';
import { TodosService } from '../todo/todo.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly groupService: GroupsService,
    private readonly todoService: TodosService,
    private readonly subjectTimerService: SubjectTimerService,
  ) {}

  async findAllGroupTodoTime(user_id: string) {
    const groups = await this.groupService.get(user_id); // 그룹 목록 가져오기

    const groupDataPromises = groups.map(async (group) => {
      const [todos, accumulatedTime] = await Promise.all([
        this.todoService.findTodosByGroupAndUser(user_id, group.group_id),
        this.subjectTimerService.getTimerAccumulatedTime(
          user_id,
          group.group_id,
        ),
      ]);

      return {
        group_id: group.group_id,
        group_name: group.name,
        todos,
        timer_accumulated_sec: accumulatedTime,
      };
    });

    return await Promise.all(groupDataPromises);
  }
}
