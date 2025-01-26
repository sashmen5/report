import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';
import { uid } from 'uid';

import { dateToDayDate } from '../../lib/date-utils';
import { authMiddleware } from '../../lib/route-utils';
import { HabitLog } from '../../models';

const removeHabit = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(data => {
    return {
      date: data.date as number,
      habitId: data.habitId as string,
    };
  })
  .handler(async ({ data, context }) => {
    const { habitId, date } = data;
    const { user } = context;

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
  .middleware([authMiddleware])
  .validator(data => {
    return {
      date: data.date as string,
      habitId: data.habitId as string,
      value: data.value as number | string,
    };
  })
  .handler(async ({ data, context }) => {
    const { habitId, date, value } = data;
    const { user } = context;

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

export { removeHabit, updateHabit };
