import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { JobPosting, RoadmapTask } from '@/types';
import { toDate } from '@/utils/dates';

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleDeadlineNotification(job: JobPosting): Promise<string | undefined> {
  const granted = await requestNotificationPermission();
  if (!granted) return undefined;
  const end = toDate(job.applicationEndAt);
  if (!end) return undefined;
  const trigger = new Date(end);
  trigger.setDate(trigger.getDate() - 1);
  if (trigger.getTime() < Date.now()) return undefined;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${job.institution} 마감 D-1`,
      body: `${job.title} 접수 마감 전 최종 제출 여부를 확인하세요.`
    },
    trigger
  });
}

export async function addRoadmapToCalendar(job: JobPosting, tasks: RoadmapTask[]): Promise<string | undefined> {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return undefined;
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const defaultCalendar = calendars.find((calendar) => calendar.allowsModifications) ?? calendars[0];
  if (!defaultCalendar) return undefined;

  for (const task of tasks.filter((item) => item.dueDate)) {
    const start = toDate(task.dueDate);
    if (!start) continue;
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    await Calendar.createEventAsync(defaultCalendar.id, {
      title: `[부산공공잡] ${task.title}`,
      notes: `${job.institution} · ${task.description}`,
      startDate: start,
      endDate: end,
      timeZone: 'Asia/Seoul'
    });
  }
  return defaultCalendar.id;
}
