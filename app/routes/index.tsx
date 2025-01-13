import React, { useEffect, useRef } from 'react';

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sashmen5/components';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { ModeToggle } from '../features';
import { dbConnectMiddleware } from '../lib/db';
import { generateBlogTitle } from '../lib/generate';
import { Post } from '../models/post';
import { ReportYear } from '../pages';

let counter: number = 10;

async function readCount(): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(counter);
    }, 20);
  });
}

async function writeCount(number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      counter = number;
      resolve();
    }, 20);
  });
}

function getPosts(): Promise<{ title: string; description: string }[]> {
  return Post.find().exec();
}

const getCount = createServerFn({
  method: 'GET',
})
  .middleware([dbConnectMiddleware])
  .handler(async () => {
    return {
      count: await readCount(),
      posts: await getPosts(),
    };
  });

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    const count = await readCount();
    console.log({ count, data });
    await writeCount(count + data);
    console.log('[AFTER]');
  });

function readPosts() {
  return Post.find().exec();
}

const addPost = createServerFn({ method: 'POST' })
  .middleware([dbConnectMiddleware])
  .handler(async ({ data }) => {
    const newPost = new Post({ title: generateBlogTitle(), description: generateBlogTitle() });
    return newPost.save();
  });

export const Route = createFileRoute('/')({
  component: Home,
  // loader: async () => await getCount(),
});

interface CalendarProps {
  year: number;
}

const Calendar: React.FC<CalendarProps> = ({ year }) => {
  const todayRef = useRef<HTMLDivElement | null>(null); // Ref to scroll to today's date

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
    <div className="mx-auto flex flex-col gap-2">
      <div className="flex gap-2 *:rounded-md *:bg-gray-200">
        <div className="flex h-10 w-10 items-center justify-center border border-gray-100" />
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Sun</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Mon</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Tue</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Wed</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Thu</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Fri</div>
        <div className="flex h-10 w-10 items-center justify-center border border-gray-300">Sat</div>
      </div>
      <div className="flex flex-col gap-2">
        {weeks.map((week, weekIndex) => (
          <div className="flex gap-2" key={weekIndex}>
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-gray-200">
              {weekIndex + 1}
            </div>
            {week.map((day, dayIndex) => (
              <div
                id={day ? `day-${weekIndex}-${dayIndex}` : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-400 ${
                  day && day.toDateString() === new Date().toDateString()
                    ? 'border-2 border-purple-500 bg-purple-100 font-semibold text-purple-600'
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

function Home() {
  // const router = useRouter();
  // const state = Route.useLoaderData();
  // return <div>{'Empty'}</div>
  return (
    <div className={'flex flex-col justify-center gap-2 px-10 pt-10'}>
      <ModeToggle />
      <div className={'mx-auto border bg-red-400'}>Report 2025 Year</div>

      <Calendar year={2025} />
    </div>
  );
}
