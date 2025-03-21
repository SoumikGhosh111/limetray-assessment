import React, {useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '../../context/TaskContext';
import './Task.css'
import { RiDeleteBin6Line } from "react-icons/ri";


const Task = ({ task, id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id});
    const { removeTask, toggleCompleted} = useTasks();
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'grab'
    }

    const handleToggle = useCallback(() => toggleCompleted(task?.id), [toggleCompleted, task?.id]);
  const handleRemove = useCallback(() => removeTask(task?.id), [removeTask, task?.id]);
    return (
        <li  ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className={`task ${task.completed ? "completed" : ""}`}>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="task-checkbox"
                />
                <span>{task?.text}</span>
            </div>
            <button className="remove-btn" onClick={handleRemove} onPointerDown={(e) => e.stopPropagation()}><RiDeleteBin6Line />
            </button>
        </li>
    )
}

export default React.memo(Task); 