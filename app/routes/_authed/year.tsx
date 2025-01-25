import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { HabitConfig, HabitConfigDTO, HabitLog, HabitLogDTO } from '../../models';
import { ReportYear } from '../../pages';

const getHabitConfigs = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const habit = await HabitConfig.find<HabitConfigDTO>().exec();

    return {
      configs: habit,
    };
  });

const getDays = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;

    const days: HabitLogDTO[] = await HabitLog.find({
      userId: user.id,
      date: { $regex: '^2025' },
    }).exec();

    return {
      days: days,
    };
  });

export const Route = createFileRoute('/_authed/year')({
  component: Home,
  loader: async () => {
    const [habitConfigs, days] = await Promise.all([getHabitConfigs(), getDays()]);
    return {
      habitConfigs,
      days: days.days,
    };
  },
});

function Home() {
  return (
    <div className={'flex flex-col justify-center gap-1 overflow-hidden pb-10 pt-0'}>
      <ReportYear />
    </div>
  );
}
