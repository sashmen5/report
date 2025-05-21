import React, { FC, useState } from 'react';

import { Button } from '@sashmen5/components';
import { ReportModal } from '@sashmen5/widgets';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { removeHabit, updateHabit } from '../../entities/habit';
import { dateToDayDate, isToday, isYesterday } from '../../lib/date-utils';
import { HabitLogDTO } from '../../models';
import { Calendar } from './Calendar.component';
import { ReportHabit } from './ReportHabit.component';

const Route = getRouteApi('/_authed/year');

const ReportYear: FC = () => {
  const router = useRouter();
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

  const handleOnPressedChange = async (tag: string, val: boolean | string) => {
    const date = selectedDate;
    if (!date) {
      return;
    }

    if (val) {
      await updateHabit({
        data: { date: dateToDayDate(date), habitId: tag, value: val },
      });
    } else {
      await removeHabit({
        data: { date: dateToDayDate(date), habitId: tag },
      });
    }

    toast.success('Done');
    await router.invalidate();
  };

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
            <div className={'grid gap-2 text-center'}>
              <div>{selectedDate?.toDateString()}</div>
              {isToday(selectedDate) && <div className={'text-sm text-muted-foreground'}>{'Today'}</div>}
              {isYesterday(selectedDate) && (
                <div className={'text-sm text-muted-foreground'}>{'Yesterday'}</div>
              )}
            </div>
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
        <ReportHabit
          key={selectedDate?.toDateString()}
          entries={selectedHabits ?? []}
          onChange={handleOnPressedChange}
        />
      </ReportModal>

      <Calendar data={daysByDay} year={2025} onSelectDate={onSelect} selectedDate={selectedDate} />
    </div>
  );
};

export { ReportYear };
