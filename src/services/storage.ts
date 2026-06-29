import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChangeLog, JobPosting, UserProfile } from '@/types';

const KEYS = {
  profile: 'bpublic.profile',
  jobs: 'bpublic.jobs',
  changes: 'bpublic.changes'
};

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | undefined> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  return raw ? (JSON.parse(raw) as UserProfile) : undefined;
}

export async function saveJobs(jobs: JobPosting[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.jobs, JSON.stringify(jobs));
}

export async function loadJobs(): Promise<JobPosting[] | undefined> {
  const raw = await AsyncStorage.getItem(KEYS.jobs);
  return raw ? (JSON.parse(raw) as JobPosting[]) : undefined;
}

export async function saveChanges(changes: ChangeLog[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.changes, JSON.stringify(changes));
}

export async function loadChanges(): Promise<ChangeLog[] | undefined> {
  const raw = await AsyncStorage.getItem(KEYS.changes);
  return raw ? (JSON.parse(raw) as ChangeLog[]) : undefined;
}
