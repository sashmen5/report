import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { uid } from 'uid';

import { dateToDayDate } from '../../lib/date-utils';
import { authMiddleware } from '../../lib/route-utils';
import { HabitConfig, HabitConfigDTO, HabitLog, HabitLogDTO } from '../../models';

const removeHabit = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: Record<string, string | number>) => {
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
    // CACHE.clearHabits(user.id);

    return;
  });

const updateHabit = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: Record<string, string | number | boolean>) => {
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
    // CACHE.clearHabits(user.id);
  });

const getHabits = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { user } = context;

    // let days = CACHE.getHabits(user.id) ?? null;
    const days = await HabitLog.find<HabitLogDTO>({
      userId: user.id,
      date: { $regex: '^2025' },
    }).exec();
    // if (!days) {
    //   days && CACHE.setHabits(user.id, days);
    // }

    return { days };
  });

const getHabitConfigs = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const habit = await HabitConfig.find<HabitConfigDTO>().exec();
    // if (!habit) {
    //   habit && CACHE.setHabitConfigs(context.user.id, habit);
    // }

    return {
      configs: habit,
    };
  });
export { removeHabit, updateHabit, getHabits, getHabitConfigs };
