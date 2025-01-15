import React, { FC, useEffect, useRef, useState } from 'react';

import {
  Button,
  Day,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
  ToggleGroup,
  ToggleGroupItem,
  cn,
} from '@sashmen5/components';
import { useMediaQuery } from '@sashmen5/hooks';
import { Bold, Italic, Underline } from 'lucide-react';

import { ModeToggle } from '../../features';
import { ReportModal } from './ReportModal.component';

interface CalendarProps {
  year: number;
  onSelectDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ year, onSelectDate }) => {
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
    <div className="mx-2 flex flex-col gap-1 overflow-hidden pt-2">
      <div className="flex justify-center gap-1 [&>*:not(:last-child)]:invisible">
        {weekDays.slice(0, weekDays.length - 1).map(d => (
          <div key={d} className={'aspect-square w-10'} />
        ))}
        <div>
          <ModeToggle />
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

interface ReportModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const tags = ['training:gym', 'training:kettlebell', 'weight'];

function ProfileForm() {
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <ToggleGroup
      value={value}
      onValueChange={setValue}
      orientation={'vertical'}
      variant="outline"
      type="multiple"
    >
      {tags.map(tag => (
        <ToggleGroupItem
          key={tag}
          value={tag}
          aria-label="Toggle bold"
          className={'w-full justify-start text-start'}
        >
          {tag}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

const ReportYear: FC = () => {
  const [selectedDate, onSelect] = useState<Date | undefined>();
  // const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className={'mx-auto border'}>
        <ReportModal open={Boolean(selectedDate)} onOpenChange={() => onSelect(undefined)}>
          <ProfileForm />
        </ReportModal>
      </div>
      <Calendar year={2025} onSelectDate={onSelect} />
    </div>
  );
};

export { ReportYear };
