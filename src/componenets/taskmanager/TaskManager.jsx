import React, { useState, useMemo, useCallback } from 'react'
import './TaskManager.css'
import { useTasks } from '../../context/TaskContext'
import { useTheme } from '../../context/ThemeContext'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Task from '../task/Task'
import darkNoTaskImg from '../../assets/dark-no-tasks-found.png'; 
import lightNoTaskImg from '../../assets/light-no-tasks-found.png'; 
const TaskManager = () => {
    const { tasks, addedTask, setTasks } = useTasks();
    const [taskText, setTaskText] = useState('');
    const { theme } = useTheme();
    // Memoize filtered task lists to avoid redundant filtering
    const filteredTasks = useMemo(() => tasks, [tasks]);
    const inProgressTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (!taskText.trim()) return;

            addedTask({ id: Date.now(), text: taskText, completed: false });
            setTaskText('');
        },
        [taskText, addedTask]
    );



     // Memoized function to handle drag-and-drop sorting
     const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            setTasks((prevTasks) => {
                const oldIndex = prevTasks.findIndex(task => task.id === active.id);
                const newIndex = prevTasks.findIndex(task => task.id === over.id);
                return arrayMove(prevTasks, oldIndex, newIndex);
            });
        },
        [setTasks]
    );

    const sensors = useSensors(
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,  // Prevent accidental drags
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
                {filteredTasks.length > 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2> All Tasks</h2>
                                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {filteredTasks?.map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }


                {inProgressTasks.length > 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2>In Progress</h2>
                                <SortableContext items={tasks.filter(t => !t.completed)} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {inProgressTasks?.map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }

                {completedTasks.length > 0 &&
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} >
                        <div className='task-cloumns'>
                            <div className='task-column'>
                                <h2> Completed</h2>
                                <SortableContext items={tasks.filter(t => t.completed)} strategy={verticalListSortingStrategy}>
                                    <ul>
                                        {completedTasks?.map((task) => (
                                            <Task key={task.id} task={task} id={task.id} />
                                        ))}
                                    </ul>
                                </SortableContext>
                            </div>
                        </div>
                    </DndContext>
                }

                {filteredTasks.length === 0 && 
                <div className='no-tasks'>
                    {theme === 'dark' ? <img src={darkNoTaskImg} alt='No Tasks Found' /> : <img src={lightNoTaskImg} alt='No Tasks Found' />}
                    <h2>No Tasks Found</h2>   
                </div>}

            </div>

        </div>
    )
}

export default React.memo(TaskManager); 