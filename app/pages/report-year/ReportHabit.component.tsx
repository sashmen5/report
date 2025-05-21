import React, { useState } from 'react';

import { NumberInput, SortableList, Toggle } from '@sashmen5/components';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import debounce from 'lodash.debounce';

import { updateHabitOrder } from '../../entities/user';
import { HabitConfigDTO, HabitLogDTO, HabitTypeId, UserDTO } from '../../models';

interface ProfileFormProps {
  entries: HabitLogDTO['habits'];
  onChange: (tag: string, val: boolean | string) => void;
}
const RouterAuthed = getRouteApi('/_authed');
const Route = getRouteApi('/_authed/year');

export function ReportHabit({ entries, onChange }: ProfileFormProps) {
  const { user } = RouterAuthed.useLoaderData();
  const data = Route.useLoaderData();
  const router = useRouter();

  const findHabitEntry = (tag: string) => {
    return entries.find(e => e.habitTypeId === tag);
  };

  const debouncedHandleOnPressedChange = debounce(onChange, 0);

  const habitId = user.habits
    .sort((a, b) => a.order - b.order)
    .map(h => h.habitTypeId)
    .map(id => ({ id }));

  const configByHabitTypeId = {} as Record<HabitTypeId, HabitConfigDTO>;
  data.habitConfigs.configs.forEach(habit => {
    configByHabitTypeId[habit.habitTypeId] = habit;
  });

  const getHabitConfig = (id: HabitTypeId) => configByHabitTypeId[id];
  const [items, setItems] = useState(habitId);

  const handleChangeSort = async (ids: Array<{ id: HabitTypeId }>) => {
    setItems(ids);
    const newOrder: UserDTO['habits'] = ids.map((id, index) => ({
      order: index,
      habitTypeId: id.id,
    }));

    await updateHabitOrder({ data: { habits: newOrder } }).then(console.log);
    await router.invalidate();
  };

  return (
    <div className={'-ml-3 space-y-2 ring-0'}>
      <SortableList
        items={items}
        onChange={handleChangeSort}
        renderItem={({ id: tag }) => {
          const habitReport = findHabitEntry(tag);
          const habitConfig = getHabitConfig(tag);
          const habitValueString = typeof habitReport?.value === 'string' ? habitReport?.value : '';
          const inputType = habitConfig.valueType === 'numeric';

          return (
            <SortableList.Item id={tag}>
              <SortableList.DragHandle />
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
            </SortableList.Item>
          );

          // return (
          //   <SortableList.Item id={tag.id}>
          //     <div>{tag.id}</div>
          //     <SortableList.DragHandle />
          //   </SortableList.Item>
          // );
        }}
      />

      {/*{habitId.map(tag => {*/}
      {/*  const habitReport = findHabitEntry(tag);*/}
      {/*  const habitConfig = getHabitConfig(tag);*/}
      {/*  const habitValueString = typeof habitReport?.value === 'string' ? habitReport?.value : '';*/}
      {/*  const inputType = habitConfig.valueType === 'numeric';*/}

      {/*  return (*/}
      {/*    <Toggle*/}
      {/*      key={tag}*/}
      {/*      variant="outline"*/}
      {/*      defaultPressed={Boolean(habitReport)}*/}
      {/*      onPressedChange={v => debouncedHandleOnPressedChange(tag, v)}*/}
      {/*      className={'w-full justify-between text-start'}*/}
      {/*    >*/}
      {/*      <div>{tag}</div>*/}
      {/*      {inputType && (*/}
      {/*        <div*/}
      {/*          onClick={e => {*/}
      {/*            e.preventDefault();*/}
      {/*            e.stopPropagation();*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <NumberInput*/}
      {/*            className={'h-8 max-w-32 py-0'}*/}
      {/*            defaultValue={habitValueString}*/}
      {/*            onValueChange={(_, val) => {*/}
      {/*              debouncedHandleOnPressedChange(tag, val);*/}
      {/*            }}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      )}*/}
      {/*    </Toggle>*/}
      {/*  );*/}
      {/*})}*/}
    </div>
  );
}
