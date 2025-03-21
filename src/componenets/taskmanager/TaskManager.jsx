import React, { useState } from 'react'
import './TaskManager.css'
import { useTasks } from '../../context/TaskContext'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Task from '../task/Task'
const TaskManager = () => {
    const { tasks, addedTask, setTasks } = useTasks();
    const [taskText, setTaskText] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskText.trim()) return;

        addedTask({ id: Date.now(), text: taskText, completed: false });
        setTaskText("");
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTasks((prevTasks) => {
            const oldIndex = prevTasks.findIndex(task => task.id === active.id);
            const newIndex = prevTasks.findIndex(task => task.id === over.id);
            return arrayMove(prevTasks, oldIndex, newIndex);
        });
    };

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,  // Prevent accidental drags
                tolerance: 5, // Allow small movements before triggering drag
            },
        }),
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5, // Ensure slight movement before triggering drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div >
            <div className='form-container'>
                <h1>Create Tasks</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className='task-input'
                        type='text'
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                    />
                    <button type='submit'>Create</button>
                </form>
            </div>
            <div className='task-container'>
                {tasks?.length !== 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2> All Tasks</h2>
                                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {tasks?.map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }


                {tasks?.filter(t => !t.completed).length !== 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2>In Progress</h2>
                                <SortableContext items={tasks.filter(t => !t.completed)} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {tasks?.filter((task) => !task.completed).map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }

                {tasks?.filter(t => t.completed).length !== 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2> Completed</h2>
                                <SortableContext items={tasks.filter(t => t.completed)} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {tasks?.filter((task) => task.completed).map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }

            </div>

        </div>
    )
}

export default TaskManager