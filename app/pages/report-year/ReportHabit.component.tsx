import React from 'react';

import { NumberInput, Toggle } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import debounce from 'lodash.debounce';

import { removeHabit, updateHabit } from '../../entities/habit';
import { dateToDayDate } from '../../lib/date-utils';
import { HabitConfigDTO, HabitLogDTO, HabitTypeId } from '../../models';

interface ProfileFormProps {
  date?: Date;
  entries: HabitLogDTO['habits'];
}
const RouterAuthed = getRouteApi('/_authed');
const Route = getRouteApi('/_authed/year');

export function ReportHabit({ date, entries }: ProfileFormProps) {
  const { user } = RouterAuthed.useLoaderData();
  const data = Route.useLoaderData();
  const router = useRouter();

  const findHabitEntry = (tag: string) => {
    return entries.find(e => e.habitTypeId === tag);
  };

  const handleOnPressedChange = async (tag: string, val: boolean | string) => {
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

  const debouncedHandleOnPressedChange = debounce(handleOnPressedChange, 300);

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

        return (
          <Toggle
            key={tag}
            variant="outline"
            defaultPressed={Boolean(habitReport)}
            onPressedChange={v => debouncedHandleOnPressedChange(tag, v)}
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
                  defaultValue={habitValueString}
                  onValueChange={(_, val) => {
                    debouncedHandleOnPressedChange(tag, val);
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
