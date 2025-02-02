import { useState } from 'react';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './Sortable4.css';

export const Column = ({ tasks }) => {
  return (
    <div className="column">
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map(task => (
          <Task key={task.id} id={task.id} title={task.title} />
        ))}
      </SortableContext>
    </div>
  );
};

export const Task = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    zIndex: 10,
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="task">
      {title}
    </div>
  );
};

const Input = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input) return;

    onSubmit(input);

    setInput('');
  };

  return (
    <div className="container">
      <input className="input" type="text" value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSubmit} className="button">
        Add
      </button>
    </div>
  );
};

export function Sortable4() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Add tests to homepage' },
    { id: 2, title: 'Fix styling in about section' },
    { id: 3, title: 'Learn how to center a div' },
  ]);

  const addTask = title => {
    setTasks(tasks => [...tasks, { id: tasks.length + 1, title }]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const getTaskPos = id => tasks.findIndex(task => task.id === id);

  const handleDragEnd = event => {
    const { active, over } = event;

    if (active.id === over.id) return;

    setTasks(tasks => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);

      return arrayMove(tasks, originalPos, newPos);
    });
  };

  return (
    <div className="App">
      <h1>My Tasks ✅</h1>
      <Input onSubmit={addTask} />
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Column id="toDo" tasks={tasks} />
      </DndContext>
    </div>
  );
}
