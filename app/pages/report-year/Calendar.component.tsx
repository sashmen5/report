import React, { useEffect } from 'react';

import { Day, DropdownMenuLabel, DropdownMenuSeparator, cn } from '@sashmen5/components';
import { getRouteApi } from '@tanstack/react-router';

import { habitEntity } from '../../entities/habit';
import { ModeToggle } from '../../features';
import { dateToDayDate } from '../../lib/date-utils';
import { HabitLogDTO } from '../../models';
import { DayColorGrid } from './DayColorGrid.component';

interface CalendarProps {
  year: number;
  onSelectDate: (date: Date) => void;
  data: Record<string, HabitLogDTO>;
}
const RouterAuthed = getRouteApi('/_authed');

export const Calendar: React.FC<CalendarProps> = ({ year, onSelectDate, data }) => {
  const { user } = RouterAuthed.useLoaderData();

  const dayHabits = (date?: Date | number | null): HabitLogDTO['habits'] => {
    if (!date) {
      return [];
    }
    const day = dateToDayDate(date);

    return data[day]?.habits ?? [];
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
            initial={user.email[0].toUpperCase()}
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
          <div key={d} className={'flex aspect-square w-10 items-center justify-center first:invisible'}>
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
            {week.map((day, dayIndex) => {
              const habits = dayHabits(day);
              const includesHabits = Boolean(habits?.length ?? 0 > 0);
              const toDay = Boolean(day && day.toDateString() === new Date().toDateString());
              return (
                <Day
                  id={day ? `day-${weekIndex}-${dayIndex}` : undefined}
                  includesHabits={includesHabits}
                  toDay={toDay}
                  key={dayIndex}
                  onMouseDown={() => {
                    if (day) {
                      onSelectDate(day);
                    }
                  }}
                  className={'h-14'}
                >
                  <div className={'flex h-full w-full flex-col gap-[1px] p-[1px]'}>
                    <div
                      className={cn(
                        'mx-auto aspect-square basis-1/4 overflow-hidden rounded-full text-[10px] font-normal',
                        'flex items-center justify-center',
                        { 'bg-primary text-[8px] text-primary-foreground': toDay },
                      )}
                    >
                      {day?.getDate()}
                    </div>
                    <div className={'flex w-full flex-grow flex-col gap-[1px]'}>
                      {habits.slice(0, 4).map(e => (
                        <div
                          key={e.habitTypeId}
                          className={'w-full basis-1/4 rounded-sm bg-purple-600'}
                          style={{
                            backgroundColor: habitEntity.getHabitColor(e.habitTypeId),
                          }}
                        />
                      ))}

                      {/*<div className={'w-full basis-1/4 rounded-sm bg-purple-600'}></div>*/}
                      {/*<div className={'w-full basis-1/4 rounded-sm bg-purple-600'}></div>*/}
                      {/*<div className={'w-full basis-1/4 rounded-sm bg-purple-600'}></div>*/}
                    </div>
                  </div>
                  {/*<div className={'w-full rounded-sm bg-purple-600'}>*/}
                  {/*  /!*<div />*!/*/}
                  {/*  /!*<div>{day?.getDate()}</div>*!/*/}
                  {/*</div>*/}
                  {/*<div className={'w-full rounded-sm bg-purple-600'}></div>*/}
                  {/*{includesHabits ? <DayColorGrid habits={habits} /> : day?.getDate()}{' '}*/}
                  {/* Show date or empty if null */}
                </Day>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
