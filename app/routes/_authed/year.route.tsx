import { createFileRoute } from '@tanstack/react-router';

import { getHabitConfigs, getHabits } from '../../entities/habit';
import { ReportYear } from '../../pages';

export const Route = createFileRoute('/_authed/year')({
  component: Home,
  loader: async () => {
    const [habitConfigs, days] = await Promise.all([getHabitConfigs(), getHabits()]);
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
