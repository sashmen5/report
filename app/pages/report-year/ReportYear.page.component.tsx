import React, { FC, useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';

import { dateToDayDate } from '../../lib/date-utils';
import { HabitLogDTO } from '../../models';
import { Calendar } from './Calendar.component';
import { ReportHabit } from './ReportHabit.component';
import { ReportModal } from './ReportModal.component';

const Route = getRouteApi('/_authed/year');

const ReportYear: FC = () => {
  const data = Route.useLoaderData();
  const [selectedDate, onSelect] = useState<Date | undefined>();
  const daysByDay: Record<string, HabitLogDTO> = {};

  data.days.forEach((day: HabitLogDTO) => {
    daysByDay[day.date] = day;
  });

  const selectedHabits = (selectedDate && daysByDay[dateToDayDate(selectedDate)]?.habits) ?? [];

  return (
    <div>
      <ReportModal
        open={Boolean(selectedDate)}
        onOpenChange={() => onSelect(undefined)}
        title={`Select habits - ${selectedDate?.toDateString()}`}
      >
        <ReportHabit date={selectedDate} entries={selectedHabits ?? []} />
      </ReportModal>

      <Calendar data={daysByDay} year={2025} onSelectDate={onSelect} />
    </div>
  );
};

export { ReportYear };
