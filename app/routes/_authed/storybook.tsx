import React, { useState } from 'react';

import { closestCorners } from '@dnd-kit/core';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Sortable,
  SortableItem,
  SortableList,
} from '@sashmen5/components';
import { createFileRoute } from '@tanstack/react-router';

import { Sortable4 } from '../../../shared/components/Sortable/Sortable4';
import { KanbanBoard } from '../../pages/storybook/Kanban/KanbanBoard';

export const Route = createFileRoute('/_authed/storybook')({
  component: Stories,
});

export function createRange<T>(length: number, initializer: (index: number) => T): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockItems() {
  return createRange(50, index => ({ id: index + 1 }));
}

export type DataConfig = typeof dataConfig;

export const dataConfig = {
  speicalTricks: [
    {
      id: crypto.randomUUID(),
      name: 'The 900',
      points: 9000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Indy Backflip',
      points: 4000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Pizza Guy',
      points: 1500,
    },
    {
      id: crypto.randomUUID(),
      name: '360 Varial McTwist',
      points: 5000,
    },
    {
      id: crypto.randomUUID(),
      name: 'Kickflip Backflip',
      points: 3000,
    },
    {
      id: crypto.randomUUID(),
      name: 'FS 540',
      points: 4500,
    },
    {
      id: crypto.randomUUID(),
      name: 'Ghetto Bird',
      points: 3500,
    },
    {
      id: crypto.randomUUID(),
      name: 'Casper Flip 360 Flip',
      points: 2500,
    },
  ],
};

export function MixedSortingDemo() {
  const [specialTricks, setSpecialTricks] = React.useState(dataConfig.speicalTricks);

  return (
    <div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div>
          <div>Mixed sorting</div>
          <div>Sort items in both directions.</div>
        </div>
      </div>
      <div>
        <Sortable
          orientation="vertical"
          // collisionDetection={closestCorners}
          value={specialTricks}
          onValueChange={setSpecialTricks}
          overlay={<div className="size-full rounded-md bg-primary/10" />}
        >
          <div className="grid grid-cols-1 gap-4">
            {specialTricks.map(item => (
              <SortableItem key={item.id} value={item.id} asTrigger asChild>
                <div className="flex aspect-video max-h-[100px] w-full items-center justify-center rounded-md bg-accent hover:bg-accent/80">
                  <div className="items-center">
                    <div>{item.name}</div>
                    <div>{item.points} points</div>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </Sortable>
      </div>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(getMockItems);

  return (
    <div style={{ maxWidth: 400, margin: '30px auto' }}>
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={item => (
          <SortableList.Item id={item.id}>
            {item.id}
            <SortableList.DragHandle />
          </SortableList.Item>
        )}
      />
    </div>
  );
}

export const InitSortable = () => {
  const [items, setItems] = useState(getMockItems);
  return (
    <SortableList
      items={items}
      onChange={newItems => {
        setItems(newItems);
      }}
      renderItem={item => {
        return (
          <SortableList.Item id={item.id}>
            <div>{item.id}</div>
            <SortableList.DragHandle />
          </SortableList.Item>
        );
      }}
    />
  );
};

function Stories() {
  const [renderDialog, setRenderDialog] = useState(false);
  return (
    <div
      className={
        'm-10 flex flex-col justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-purple-700 p-10 pb-10 pt-0'
      }
    >
      <div>
        <Button onClick={() => setRenderDialog(prev => !prev)}>{'Click'}</Button>
        {/*  /!*{renderDialog && <KanbanBoard />}*!/*/}

        {/*  /!*<App />*!/*/}
        <div>
          <Dialog open={renderDialog} onOpenChange={setRenderDialog}>
            <DialogContent>
              <DialogTitle>{'Title'}</DialogTitle>
              {/*<InitSortable />*/}
              <Sortable4 />
              {/*<MixedSortingDemo />*/}
              {/*<KanbanBoard />*/}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
