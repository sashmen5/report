import { FC } from 'react';

import { HabitLogDTO } from '../../models';

interface Props {
  habits: HabitLogDTO['habits'];
}

const DayColorGrid: FC<Props> = ({ habits }) => {
  return (
    <>
      {habits.slice(0, 3).map(habit => (
        <div
          key={habit.habitTypeId}
          className={'w-full rounded-sm bg-purple-600'}
          style={
            {
              // maxHeight: '25%',
            }
          }
        ></div>
      ))}
      {/*<div className={'rounded-sm bg-green-500'}></div>*/}
      {/*<div className={'rounded-sm bg-purple-600'}></div>*/}
      {/*<div className={'rounded-sm bg-red-500'}></div>*/}
      {/*{habits.map(habit => {*/}
      {/*  return <div key={habit.habitTypeId} className={''}></div>;*/}
      {/*})}*/}
    </>
  );
};

export { DayColorGrid };
