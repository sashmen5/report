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
  cn,
} from '@sashmen5/components';
import { useMediaQuery } from '@sashmen5/hooks';

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

function ProfileForm({ className }: React.ComponentProps<'form'>) {
  return (
    <form className={cn('grid items-start gap-4', className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}

const ReportModal: FC = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ReportYear: FC = () => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      <div className={'mx-auto border'}>
        <ReportModal />
      </div>
      <Calendar year={2025} />
    </div>
  );
};

export { ReportYear };
