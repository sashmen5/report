import React, { FC, useEffect, useState } from 'react';

import {
  Button,
  Day,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  NumberInput,
  Toggle,
} from '@sashmen5/components';
import { getRouteApi, notFound, useRouteContext, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { uid } from 'uid';

import { ModeToggle } from '../../features';
import { fetchAuth } from '../../lib/route-utils';
import { HabitConfigDTO, HabitLog, HabitLogDTO, HabitTypeId } from '../../models';
import { ReportModal } from './ReportModal.component';

interface CalendarProps {
  year: number;
  onSelectDate: (date: Date) => void;
  data: Record<string, HabitLogDTO>;
}

const Calendar: React.FC<CalendarProps> = ({ year, onSelectDate, data }) => {
  const { user } = useRouteContext({ from: '/_authed' });
  const includesHabits = (date?: Date | number | null) => {
    if (!date) {
      return false;
    }

    const day = dateToDayDate(date);

    return Boolean(data[day]?.habits?.length > 0);
  };

  const getDaysInYear = (year: number): Date[] => {
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year + 1, 0, 1); // January 1st of next year
    const days: Date[] = [];

    for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  };

  const daysInYear = getDaysInYear(year);
  const weeks: (Date | null)[][] = [];
  const firstDayOfYear = new Date(year, 0, 1).getDay(); // Get the day of the week for Jan 1

  // Fill the first week with empty days if necessary
  let currentWeek: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfYear; i++) {
    currentWeek.push(null); // Fill with null for empty days
  }

  for (let i = 0; i < daysInYear.length; i++) {
    currentWeek.push(daysInYear[i]);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add the last week if it has any days
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Scroll to today's date when the component mounts
  useEffect(() => {
    const today = new Date();
    const todayIndex = daysInYear.findIndex(
      date =>
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    );

    if (todayIndex !== -1) {
      const weekIndex = Math.floor(todayIndex / 7);
      const dayIndex = todayIndex % 7;
      const todayElement = document.getElementById(`day-${weekIndex}-${dayIndex}`);
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [daysInYear]);

  const weekDays = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col gap-1 overflow-hidden pt-2">
      <div className="flex justify-center gap-1 [&>*:not(:last-child)]:invisible">
        {weekDays.slice(0, weekDays.length - 1).map(d => (
          <div key={d} className={'aspect-square w-10'} />
        ))}
        <div>
          <ModeToggle
            header={
              <>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            }
          />
        </div>
      </div>
      <div className="flex justify-center gap-1">
        {weekDays.map(d => (
          <div
            key={d}
            className={'flex aspect-square w-10 items-center justify-center p-0.5 first:invisible'}
          >
            <div
              className={
                'flex size-full items-center justify-center rounded-md bg-accent text-xs font-normal text-muted-foreground'
              }
            >
              {d}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div className="flex justify-center gap-1" key={weekIndex}>
            <div className={'flex aspect-square w-10 items-center justify-center p-0.5'}>
              <div
                className={
                  'flex size-full items-center justify-center rounded-md bg-accent text-xs font-normal text-muted-foreground'
                }
              >
                {weekIndex + 1}
              </div>
            </div>
            {week.map((day, dayIndex) => (
              <Day
                id={day ? `day-${weekIndex}-${dayIndex}` : undefined}
                includesHabits={includesHabits(day)}
                toDay={Boolean(day && day.toDateString() === new Date().toDateString())}
                key={dayIndex}
                onMouseDown={() => {
                  if (day) {
                    onSelectDate(day);
                  }
                }}
              >
                {day ? day.getDate() : ''} {/* Show date or empty if null */}
              </Day>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function dateToDayDate(val: Date | number) {
  const date = new Date(val);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

const removeHabit = createServerFn({ method: 'POST' })
  .validator(data => {
    return {
      date: data.date as number,
      habitId: data.habitId as string,
    };
  })
  .handler(async ({ data }) => {
    const { habitId, date } = data;
    const { user } = await fetchAuth();

    if (!user) {
      throw new Error('User not found');
    }

    const habitDay = dateToDayDate(date);

    const habit = await HabitLog.findOne({ date: habitDay, userId: user.id }).exec();
    if (!habit) {
      throw notFound();
    }

    await HabitLog.updateOne(
      { userId: user.id, date: habitDay },
      { $pull: { habits: { habitTypeId: habitId, value: true } } },
    );
    return;
  });

const updateHabit = createServerFn({ method: 'POST' })
  .validator(data => {
    return {
      date: data.date as string,
      habitId: data.habitId as string,
      value: data.value as number | string,
    };
  })
  .handler(async ({ data }) => {
    const { habitId, date, value } = data;
    const { user } = await fetchAuth();

    if (!user) {
      throw new Error('User not found');
    }

    const habit = await HabitLog.findOne({ date, userId: user.id }).exec();
    if (!habit) {
      const newHabit = new HabitLog({
        id: uid(21),
        date: date,
        userId: user.id,
        habits: [{ habitTypeId: habitId, value }],
      });

      await newHabit.save();
      return;
    }

    const habitIdEntry = habit.habits.find(habit => habit.habitTypeId === habitId);
    if (!habitIdEntry) {
      await HabitLog.updateOne(
        { userId: user.id, date },
        { $push: { habits: { habitTypeId: habitId, value } } },
      );
      return;
    }

    await HabitLog.updateOne(
      { userId: user.id, date },
      { $set: { 'habits.$[habit].value': value } },
      { arrayFilters: [{ 'habit.habitTypeId': habitId }], upsert: true },
    );
  });

interface ProfileFormProps {
  date?: Date;
  entries: HabitLogDTO['habits'];
}

const RouterAuthed = getRouteApi('/_authed');
function ReportHabit({ date, entries }: ProfileFormProps) {
  const { user } = RouterAuthed.useLoaderData();
  const data = Route.useLoaderData();
  const router = useRouter();

  const findHabitEntry = (tag: string) => {
    return entries.find(e => e.habitTypeId === tag);
  };

  const handleOnPressedChange = (tag: string) => async (val: boolean | string) => {
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

    await router.invalidate();
  };

  const habitId = user.habits.map(h => h.habitTypeId);
  const configByHabitTypeId = {} as Record<HabitTypeId, HabitConfigDTO>;
  data.habitConfigs.configs.forEach(habit => {
    configByHabitTypeId[habit.habitTypeId] = habit;
  });

  const getHabitConfig = (id: HabitTypeId) => configByHabitTypeId[id];

  return (
    <div className={'space-y-2'}>
      {habitId.map(tag => {
        const habitReport = findHabitEntry(tag);
        const habitConfig = getHabitConfig(tag);
        const habitValueString = typeof habitReport?.value === 'string' ? habitReport?.value : '';
        const inputType = habitConfig.valueType === 'numeric';

        if (inputType) {
          console.log({ habitValueString });
        }

        return (
          <Toggle
            key={tag}
            variant="outline"
            defaultPressed={Boolean(habitReport)}
            onPressedChange={handleOnPressedChange(tag)}
            className={'w-full justify-between text-start'}
          >
            <div>{tag}</div>
            {inputType && (
              <div
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <NumberInput
                  className={'h-8 max-w-32 py-0'}
                  value={habitValueString}
                  onValueChange={(_, val) => {
                    handleOnPressedChange(tag)(val);
                  }}
                />
              </div>
            )}
          </Toggle>
        );
      })}
    </div>
  );
}

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
