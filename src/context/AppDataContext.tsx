import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import sampleJobs from '../../data/sample/jobs.sample.json';
import samplePolicies from '../../data/sample/policies.sample.json';
import sampleChanges from '../../data/sample/change-log.sample.json';
import { ChangeLog, JobPosting, PolicyProgram, UserProfile } from '@/types';
import { defaultProfile } from '@/data/defaultProfile';
import { detectChanges } from '@/services/changeDetection';
import { loadChanges, loadJobs, loadProfile, saveChanges, saveJobs, saveProfile } from '@/services/storage';
import { getJobStatus } from '@/utils/dates';

interface AppDataContextValue {
  loading: boolean;
  profile: UserProfile;
  jobs: JobPosting[];
  policies: PolicyProgram[];
  changes: ChangeLog[];
  setProfile: (profile: UserProfile) => Promise<void>;
  importJobs: (nextJobs: JobPosting[]) => Promise<ChangeLog[]>;
  resetToSample: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

function withStatus(jobs: JobPosting[]): JobPosting[] {
  return jobs.map((job) => ({ ...job, status: getJobStatus(job) }));
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, updateProfile] = useState<UserProfile>(defaultProfile);
  const [jobs, updateJobs] = useState<JobPosting[]>(withStatus(sampleJobs as JobPosting[]));
  const [policies] = useState<PolicyProgram[]>(samplePolicies as PolicyProgram[]);
  const [changes, updateChanges] = useState<ChangeLog[]>(sampleChanges as ChangeLog[]);

  useEffect(() => {
    async function bootstrap() {
      const [storedProfile, storedJobs, storedChanges] = await Promise.all([loadProfile(), loadJobs(), loadChanges()]);
      if (storedProfile) updateProfile(storedProfile);
      if (storedJobs?.length) updateJobs(withStatus(storedJobs));
      if (storedChanges?.length) updateChanges(storedChanges);
      setLoading(false);
    }
    bootstrap().catch(() => setLoading(false));
  }, []);

  const value = useMemo<AppDataContextValue>(() => ({
    loading,
    profile,
    jobs,
    policies,
    changes,
    setProfile: async (nextProfile: UserProfile) => {
      updateProfile(nextProfile);
      await saveProfile(nextProfile);
    },
    importJobs: async (nextJobs: JobPosting[]) => {
      const normalized = withStatus(nextJobs);
      const detected = detectChanges(jobs, normalized);
      updateJobs(normalized);
      updateChanges((prev) => [...detected, ...prev].slice(0, 100));
      await saveJobs(normalized);
      await saveChanges([...detected, ...changes].slice(0, 100));
      return detected;
    },
    resetToSample: async () => {
      const sample = withStatus(sampleJobs as JobPosting[]);
      updateJobs(sample);
      updateChanges(sampleChanges as ChangeLog[]);
      await saveJobs(sample);
      await saveChanges(sampleChanges as ChangeLog[]);
    }
  }), [changes, jobs, loading, policies, profile]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}
