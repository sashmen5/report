import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { HabitLog, HabitLogDTO } from '../../models';
import { getHabitColor } from './utils';

export * from './api';

const habitEntity = {
  getHabitColor,
};

export { habitEntity };
