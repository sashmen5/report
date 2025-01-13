import React, { FC, useEffect, useRef } from 'react';

import { cn } from '@sashmen5/components';

import { ModeToggle } from '../../features';

interface CalendarProps {
  year: number;
}

const Calendar: React.FC<CalendarProps> = ({ year }) => {
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

  return (
    <div className="mx-2 flex flex-col gap-1 overflow-hidden pt-2">
      <div className="flex justify-center gap-1 *:rounded-md *:bg-gray-200 [&>*:not(:last-child)]:invisible">
        <div
          className={cn('flex items-center justify-center border border-gray-100', 'aspect-square w-10')}
        />
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Sun
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Mon
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Tue
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Wed
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Thu
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Fri
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div className="flex justify-center gap-1 *:rounded-md *:bg-gray-200">
        <div
          className={cn('flex items-center justify-center border border-gray-100', 'aspect-square w-10')}
        />
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Sun
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Mon
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Tue
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Wed
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Thu
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Fri
        </div>
        <div className={cn('flex items-center justify-center border border-gray-300', 'aspect-square w-10')}>
          Sat
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div className="flex justify-center gap-1" key={weekIndex}>
            <div
              className={cn(
                'flex items-center justify-center rounded-md border border-gray-300 bg-gray-200',
                'aspect-square w-10',
              )}
            >
              {weekIndex + 1}
            </div>
            {week.map((day, dayIndex) => (
              <div
                id={day ? `day-${weekIndex}-${dayIndex}` : undefined}
                className={`flex items-center justify-center rounded-md border border-gray-300 text-gray-400 ${'aspect-square w-10'} ${
                  day && day.toDateString() === new Date().toDateString()
                    ? 'border-2 border-purple-300 bg-purple-100 font-semibold text-purple-600'
                    : ''
                }`}
                key={dayIndex}
              >
                {day ? day.getDate() : ''} {/* Show date or empty if null */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportYear: FC = () => {
  return <Calendar year={2025} />;
};

export { ReportYear };
