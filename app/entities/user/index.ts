import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/start';

import { authMiddleware } from '../../lib/route-utils';
import { User, UserDTO } from '../../models';

const getUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const user = await User.findOne<UserDTO>({ id: context.user.id }).exec();

    if (!user) {
      throw notFound();
    }

    return { user };
  });

const updateHabitOrder = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { habits: UserDTO['habits'] }) => {
    return { habits: data.habits as UserDTO['habits'] };
  })
  .handler(async ({ data, context }) => {
    const validatedHabits = data.habits
      .map(({ habitTypeId, order }) => ({ habitTypeId, order }))
      .filter(habit => {
        if (typeof habit.order !== 'number') {
          return false;
        }

        return typeof habit.habitTypeId === 'string';
      });

    const res = await User.findOneAndUpdate(
      { id: context.user.id },
      {
        $set: {
          habits: data.habits,
        },
      },
      {
        new: true, // Return the modified document
        runValidators: true, // Run schema validations
      },
    );

    return { userId: context.user.id, habits: res?.habits };
  });

export { getUser, updateHabitOrder };
