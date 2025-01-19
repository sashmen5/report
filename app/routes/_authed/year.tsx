import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { fetchAuth } from '../../lib/route-utils';
import { HabitLog, HabitLogDTO } from '../../models';
import { ReportYear } from '../../pages';

const getDays = createServerFn({ method: 'GET' }).handler(async ({ context }) => {
  const { user } = await fetchAuth();

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
  loader: async () => await getDays(),
});

function Home() {
  return (
    <div className={'flex flex-col justify-center gap-1 overflow-hidden pb-10 pt-0'}>
      <ReportYear />
    </div>
  );
}
