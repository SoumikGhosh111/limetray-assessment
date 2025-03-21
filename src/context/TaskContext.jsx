import React, { createContext, useContext, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useLocalStorage('tasks', []);

    const addedTask = (task) => setTasks([...tasks, task]);
    const removeTask = (id) => setTasks(tasks.filter((t) => t.id!== id), console.log(id)); 
    const toggleCompleted = (id) => { 
        setTasks( 
            tasks.map((task) =>  
                task.id === id ? {...task, completed: !task.completed} : task
            )
        ), console.log(id); 
    }

 

    return (
        <TaskContext.Provider value={{ tasks, addedTask, removeTask, toggleCompleted, setTasks }}>
            {children}
        </TaskContext.Provider>
    )
}

export const useTasks = () => useContext(TaskContext); 