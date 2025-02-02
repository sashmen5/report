import { HabitConfigDTO, HabitLogDTO, UserDTO } from '../models';

interface APICache {
  user?: UserDTO;
  habitConfigs?: HabitConfigDTO[];
  habits?: HabitLogDTO[];
}

const APICache = new Map<string, APICache>();

const CACHE = {
  getUser: (id: string) => undefined,
  setUser: (id: string, value: UserDTO) => {
    const cache = APICache.get(id) || {};
    cache.user = value;
    APICache.set(id, cache);
  },
  clearUser: (id: string) => {
    const cache = APICache.get(id) || {};
    cache.user = undefined;
    APICache.set(id, cache);
  },
  // getHabitConfigs: (id: string) => APICache.get(id)?.habitConfigs,
  getHabitConfigs: (id: string) => undefined,
  setHabitConfigs: (id: string, value: HabitConfigDTO[]) => {
    const cache = APICache.get(id) || {};
    cache.habitConfigs = value;
    APICache.set(id, cache);
  },
  clearHabitConfigs: (id: string) => {
    const cache = APICache.get(id) || {};
    cache.habitConfigs = undefined;
    APICache.set(id, cache);
  },
  getHabits: (id: string) => undefined,
  setHabits: (id: string, value: HabitLogDTO[]) => {
    const cache = APICache.get(id) || {};
    cache.habits = value;
    APICache.set(id, cache);
  },
  clearHabits: (id: string) => {
    const cache = APICache.get(id) || {};
    cache.habits = undefined;
    APICache.set(id, cache);
  },
};

export { CACHE };
