import React, { FC, useState } from 'react';

import { Button } from '@sashmen5/components';
import { ReportModal } from '@sashmen5/widgets';
import { getRouteApi } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { dateToDayDate } from '../../lib/date-utils';
import { HabitLogDTO } from '../../models';
import { Calendar } from './Calendar.component';
import { ReportHabit } from './ReportHabit.component';

const Route = getRouteApi('/_authed/year');

const ReportYear: FC = () => {
  const data = Route.useLoaderData();
  const [selectedDate, onSelect] = useState<Date | undefined>();
  const daysByDay: Record<string, HabitLogDTO> = {};

  const handleNextDay = () => {
    if (!selectedDate) {
      return;
    }
    onSelect(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
  };

  const handlePrevDay = () => {
    if (!selectedDate) {
      return;
    }
    onSelect(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
  };

  data.days.forEach((day: HabitLogDTO) => {
    daysByDay[day.date] = day;
  });

  const selectedHabits = (selectedDate && daysByDay[dateToDayDate(selectedDate)]?.habits) ?? [];

  return (
    <div>
      <ReportModal
        open={Boolean(selectedDate)}
        onOpenChange={() => onSelect(undefined)}
        title={
          <div className={'flex w-full items-center justify-center space-x-6'}>
            <Button
              variant={'outline'}
              size={'icon'}
              className={'opacity-50 hover:opacity-100 sm:size-9 md:size-7'}
              onClick={handlePrevDay}
            >
              <ChevronLeft />
            </Button>
            <div>{selectedDate?.toDateString()}</div>
            <Button
              variant={'outline'}
              size={'icon'}
              className={'opacity-50 hover:opacity-100 sm:size-9 md:size-7'}
              onClick={handleNextDay}
            >
              <ChevronRight />
            </Button>
          </div>
        }
      >
        <ReportHabit key={selectedDate?.toDateString()} date={selectedDate} entries={selectedHabits ?? []} />
      </ReportModal>

      <Calendar data={daysByDay} year={2025} onSelectDate={onSelect} selectedDate={selectedDate} />
    </div>
  );
};

export { ReportYear };
