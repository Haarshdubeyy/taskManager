// src/components/TaskManager.js
import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrashAlt,
  FaTimes,
  FaTasks,
  FaRegClock,
  FaRegCalendarCheck,
  FaFilter,
  FaSort,
  FaInfoCircle,
  FaSignOutAlt
} from 'react-icons/fa';

import 'react-toastify/dist/ReactToastify.css';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from '../api';
import { notify } from '../utils';


function TaskManager({ onLogout }) {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [copyTasks, setCopyTasks] = useState([]);
    const [updateTask, setUpdateTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fadeIn, setFadeIn] = useState({});
    const [filter, setFilter] = useState('all'); 
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);



        const handleTask = () => {
            if (updateTask && input) {
                const obj = {
                    taskName: input,
                    isDone: updateTask.isDone,
                    _id: updateTask._id
                }
                handleUpdateItem(obj);
                setUpdateTask(null);
            } else if (updateTask === null && input) {
                handleAddTask();
            }
            setInput('')
        }

        useEffect(() => {
            if (updateTask) {
                setInput(updateTask.taskName);
            }
        }, [updateTask])

        const handleAddTask = async () => {
            const obj = {
                taskName: input,
                isDone: false
            }
            try {
                setLoading(true);
                const { success, message } = await CreateTask(obj);
                if (success) {
                    notify(message, 'success')
                } else {
                    notify(message, 'error')
                }
                fetchAllTasks()
            } catch (err) {
                console.error(err);
                notify('Failed to create task', 'error')
            } finally {
                
            }
        }

        const fetchAllTasks = async () => {
            try {
                setLoading(true);
                const { data } = await GetAllTasks();
                setTasks(data);
                setCopyTasks(data);

              
                const initialFadeEffects = {};
                data.forEach(task => initialFadeEffects[task._id] = false);
                setFadeIn(initialFadeEffects);

                
                const fadeEffects = {};
                data.forEach((task, index) => {
                    setTimeout(() => {
                        fadeEffects[task._id] = true;
                       
                        setFadeIn(prevFadeIn => ({ ...prevFadeIn, [task._id]: true }));
                    }, index * 80); 
                });

            } catch (err) {
                console.error(err);
                notify('Failed to fetch tasks', 'error')
            } finally {
                setLoading(false);
            }
        }


        useEffect(() => {
            fetchAllTasks()
           
        }, []) 

        const confirmDelete = (id) => {
            setShowConfirmDelete(id);
            setTimeout(() => {
                setShowConfirmDelete(null); 
            }, 3000);
        }

        const handleDeleteTask = async (id) => {
            setShowConfirmDelete(null); 
            try {
           
                setFadeIn(prev => ({ ...prev, [id]: false }));

             
                setTimeout(async () => {
                    const { success, message } = await DeleteTaskById(id);
                    if (success) {
                        notify(message, 'success')
                    } else {
                        notify(message, 'error')
                    }
                    
                    fetchAllTasks();
                }, 300); 

            } catch (err) {
                console.error(err);
                notify('Failed to delete task', 'error')
               
                 setFadeIn(prev => ({...prev, [id]: true}));
            }
        }

        const handleCheckAndUncheck = async (item) => {
            const { _id, isDone, taskName } = item;
            const obj = {
                taskName,
                isDone: !isDone
            }
            try {
                const { success, message } = await UpdateTaskById(_id, obj);
                if (success) {
                    notify(message, 'success')
                } else {
                    notify(message, 'error')
                }
                fetchAllTasks()
            } catch (err) {
                console.error(err);
                notify('Failed to update task status', 'error')
            }
        }

        const handleUpdateItem = async (item) => {
            const { _id, isDone, taskName } = item;
            const obj = {
                taskName,
                isDone: isDone
            }
            try {
                setLoading(true);
                const { success, message } = await UpdateTaskById(_id, obj);
                if (success) {
                    notify(message, 'success')
                } else {
                    notify(message, 'error')
                }
                fetchAllTasks() 
            } catch (err) {
                console.error(err);
                notify('Failed to update task', 'error')
            } finally {
                
            }
        }

        const handleSearch = (e) => {
            const term = e.target.value.toLowerCase();
          
            const results = copyTasks.filter((item) => item.taskName.toLowerCase().includes(term));
            setTasks(results); 
            
            setFilter('all'); 
        }

        const cancelUpdate = () => {
            setUpdateTask(null);
            setInput('');
        }

        const filteredTasks = () => {
         
            const currentTasks = tasks;
            switch(filter) {
                case 'active':
                    return currentTasks.filter(task => !task.isDone);
                case 'completed':
                    return currentTasks.filter(task => task.isDone);
                default:
                    return currentTasks;
            }
        }

       
        const completedCount = copyTasks.filter(t => t.isDone).length;
        const activeCount = copyTasks.length - completedCount;
        const totalCount = copyTasks.length; 

    return (
      
        <div className="container py-0"> 
            <div className='row justify-content-center'>
                <div className='col-12'> 
                    <div className='card shadow-lg border-0' style={{ borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}> {/* Slightly more opaque */}
                        <div className='card-header bg-gradient text-white p-4' style={{background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderTopLeftRadius: '15px', borderTopRightRadius: '15px'}}>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    <FaTasks className='me-3 text-black' size={28} />
                                    <h2 className='mb-0 fw-bold text-black'>Task Manager</h2>
                                </div>
                           
                                <button
                                  onClick={onLogout}
                                  className="btn btn-outline-light btn-sm d-flex align-items-center"
                                  title="Logout"
                                >
                                     <FaSignOutAlt className='me-1' /> Logout
                                </button>
                              
                                <div className='badge bg-light text-dark rounded-pill px-3 py-2 d-none d-md-block'>
                                    <FaRegCalendarCheck className='me-2' />
                                    {new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})}
                                </div>
                            </div>
                        </div>

                     

                           <div className='card-body p-4'>
                             <div className='row g-3 g-md-4 mb-4'> 
                                 <div className='col-12 col-md-7 col-lg-8'> 
                                     <div className='input-group input-group-lg shadow-sm'>
                                         <input
                                             type='text'
                                             value={input}
                                             onChange={(e) => setInput(e.target.value)}
                                             className='form-control border-0'
                                             placeholder={updateTask ? 'Update task...' : 'Add a new task...'}
                                             onKeyPress={(e) => e.key === 'Enter' && handleTask()}
                                             aria-label="Task input"
                                         />
                                         <button
                                             onClick={handleTask}
                                             className={`btn ${updateTask ? 'btn-warning' : 'btn-success'} d-flex align-items-center px-3 px-md-4`} // Adjusted padding
                                             disabled={!input.trim()} 
                                         >
                                             {updateTask ? (
                                                 <>
                                                     <FaEdit className='me-2' /> Update
                                                 </>
                                             ) : (
                                                 <>
                                                     <FaPlus className='me-2' /> Add
                                                 </>
                                             )}
                                         </button>
                                         {updateTask && (
                                             <button
                                                 onClick={cancelUpdate}
                                                 className='btn btn-outline-secondary'
                                                 title="Cancel update"
                                                 aria-label="Cancel task update"
                                             >
                                                 <FaTimes />
                                             </button>
                                         )}
                                     </div>
                                     {updateTask && (
                                         <div className='mt-2 text-muted small'>
                                             <FaInfoCircle className='me-1' /> <em>Editing task: {updateTask.taskName}</em>
                                         </div>
                                     )}
                                 </div>
                                 <div className='col-12 col-md-5 col-lg-4'> 
                                     <div className='input-group input-group-lg shadow-sm'>
                                         <span className='input-group-text bg-light border-0' id="search-addon"><FaSearch /></span>
                                         <input
                                             onChange={handleSearch}
                                             className='form-control border-0'
                                             type='search' 
                                             placeholder='Search tasks...'
                                             aria-label="Search tasks"
                                             aria-describedby="search-addon"
                                         />
                                     </div>
                                 </div>
                             </div>

                             <div className='filter-controls d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 mt-4 pb-2 border-bottom'>
                                <div className='btn-group mb-2 mb-sm-0' role='group' aria-label="Task filters">
                                     <button
                                         className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                                         onClick={() => setFilter('all')}
                                     >
                                         <FaTasks className='me-1 me-md-2' /> All ({totalCount})
                                     </button>
                                     <button
                                         className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                                         onClick={() => setFilter('active')}
                                     >
                                         <FaRegClock className='me-1 me-md-2' /> Active ({activeCount})
                                     </button>
                                     <button
                                         className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center`}
                                         onClick={() => setFilter('completed')}
                                     >
                                         <FaCheckCircle className='me-1 me-md-2' /> Completed ({completedCount})
                                     </button>
                                 </div>

                                 
                                 <div className='d-flex mt-2 mt-sm-0'>
                                     <button className='btn btn-sm btn-light d-flex align-items-center me-2' title="Sort tasks (Not implemented)">
                                         <FaSort className='me-2' /> Sort
                                     </button>
                                     <button className='btn btn-sm btn-light d-flex align-items-center' title="Advanced filter options (Not implemented)">
                                         <FaFilter className='me-2' /> Filter
                                     </button>
                                 </div>
                             </div>

                             <div className='task-list' style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto', paddingRight: '10px' }}> {/* Add scroll for long lists */}
                                {loading ? (
                                    <div className='text-center py-5'>
                                        <div className='spinner-grow text-primary' role='status' style={{ width: '3rem', height: '3rem' }}>
                                            <span className='visually-hidden'>Loading...</span>
                                        </div>
                                        <p className='mt-3 text-muted'>Loading your tasks...</p>
                                    </div>
                                ) : filteredTasks().length === 0 ? (
                                    <div className='text-center py-5 text-muted'>
                                         <div className='empty-state mb-3'>
                                        
                                             <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="5" y="5" width="90" height="70" rx="8" fill="#e9ecef"/>
                                                <rect x="20" y="20" width="60" height="8" rx="4" fill="#adb5bd"/>
                                                <rect x="20" y="35" width="60" height="8" rx="4" fill="#adb5bd"/>
                                                <rect x="20" y="50" width="40" height="8" rx="4" fill="#adb5bd"/>
                                            </svg>
                                         </div>
                                         <h5>No tasks found</h5>
                                         <p className='mb-0'>
                                            {copyTasks.length > 0 ? 
                                                `No ${filter} tasks.` :
                                                'Add a new task to get started!'
                                            }
                                         </p>
                                    </div>
                                ) : (
                                     <>
                                         {filteredTasks().map((item) => (
                                             <div
                                                 key={item._id}
                                               
                                                 className={`task-item card mb-3 border-0 shadow-sm ${fadeIn[item._id] ? 'fade-in-item' : 'fade-out-item'}`}
                                             >
                                                 <div className='card-body p-3 d-flex justify-content-between align-items-center'>
                                                     <div className='d-flex align-items-center task-content'>
                                                         <div className='form-check form-check-lg me-3 flex-shrink-0'> 
                                                             <input
                                                                 className='form-check-input'
                                                                 type='checkbox'
                                                                 checked={item.isDone}
                                                                 onChange={() => handleCheckAndUncheck(item)}
                                                                 id={`check-${item._id}`}
                                                                 aria-labelledby={`task-label-${item._id}`}
                                                             />
                                                         </div>
                                                         <label 
                                                            htmlFor={`check-${item._id}`}
                                                            id={`task-label-${item._id}`}
                                                            className={`task-text mb-0 ${item.isDone ? 'text-decoration-line-through text-muted' : ''}`}
                                                            style={{ cursor: 'pointer' }}
                                                         >
                                                             {item.taskName}
                                                         </label>
                                                     </div>

                                                     <div className='task-actions flex-shrink-0 ms-2'> 
                                                         {showConfirmDelete === item._id ? (
                                                             <div className='confirm-delete d-flex align-items-center'>
                                                                 <span className='me-2 text-danger small'>Delete?</span>
                                                                 <button
                                                                     onClick={() => handleDeleteTask(item._id)}
                                                                     className='btn btn-danger btn-sm me-1'
                                                                     aria-label={`Confirm delete task ${item.taskName}`}
                                                                 >
                                                                     Yes
                                                                 </button>
                                                                 <button
                                                                     onClick={() => setShowConfirmDelete(null)}
                                                                     className='btn btn-outline-secondary btn-sm'
                                                                     aria-label="Cancel deletion"
                                                                 >
                                                                     No
                                                                 </button>
                                                             </div>
                                                         ) : (
                                                             <div className='btn-group'>
                                                                 <button
                                                                     onClick={() => setUpdateTask(item)}
                                                                     className='btn btn-outline-primary btn-sm'
                                                                     disabled={updateTask !== null} 
                                                                     title="Edit task"
                                                                     aria-label={`Edit task ${item.taskName}`}
                                                                 >
                                                                     <FaEdit />
                                                                 </button>
                                                                 <button
                                                                     onClick={() => confirmDelete(item._id)}
                                                                     className='btn btn-outline-danger btn-sm'
                                                                     title="Delete task"
                                                                     aria-label={`Delete task ${item.taskName}`}
                                                                 >
                                                                     <FaTrashAlt />
                                                                 </button>
                                                             </div>
                                                         )}
                                                     </div>
                                                 </div>
                                             </div>
                                         ))}
                                     </>
                                 )}
                             </div>
                        </div>

                         <div className='card-footer bg-light p-3' style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                             <div className='row align-items-center'>
                                 <div className='col-12 col-md-6 text-center text-md-start mb-2 mb-md-0'>
                                     <div className='text-muted'>
                                         <small>
                                             <FaTasks className='me-1' /> Total: {totalCount} |
                                             <FaCheckCircle className='ms-2 me-1 text-success' /> Completed: {completedCount} |
                                             <FaRegClock className='ms-2 me-1 text-primary' /> Active: {activeCount}
                                         </small>
                                     </div>
                                 </div>
                                 <div className='col-12 col-md-6 text-center text-md-end'>
                                     <div className='progress' style={{ height: '8px' }} role="progressbar" aria-label="Task completion progress" aria-valuenow={totalCount > 0 ? (completedCount / totalCount) * 100 : 0} aria-valuemin="0" aria-valuemax="100">
                                         <div
                                             className='progress-bar bg-success'
                                             style={{
                                                 width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%'
                                             }}
                                          ></div>
                                     </div>
                                     <small className='text-muted mt-1 d-block'>
                                         {totalCount > 0 ?
                                             `${Math.round((completedCount / totalCount) * 100)}% completed` :
                                             'No tasks yet'}
                                     </small>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            
            <style jsx>{`
                .task-item {
                    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                    border-radius: 8px;
                }

                .fade-in-item {
                    opacity: 1;
                    transform: translateY(0);
                }

                .fade-out-item {
                     opacity: 0;
                     transform: translateY(-10px);
                     /* You might want to adjust height or margin during fade-out */
                     /* Example: height: 0; padding: 0; margin-bottom: 0; overflow: hidden; */
                     /* This requires careful handling */
                }

                .task-text {
                    transition: all 0.2s ease;
                    font-size: 1.05rem; /* Slightly adjusted size */
                     word-break: break-word; /* Allow long words to break */
                     white-space: normal; /* Override nowrap */
                     line-height: 1.4; /* Improve readability */
                }

                /* Style adjustments from original */
                .card {
                    border-radius: 15px; /* Match outer card */
                    overflow: hidden;
                }

                .card-header { /* Ensure header radius matches card */
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                }
                 .card-footer { /* Ensure footer radius matches card */
                    border-bottom-left-radius: 15px;
                    border-bottom-right-radius: 15px;
                }

                .form-check-input {
                    width: 20px; /* Slightly adjusted size */
                    height: 20px;
                    cursor: pointer;
                    margin-top: 0.2em; /* Align better with text */
                }

                .form-check-input:checked {
                    background-color: #10b981; /* Keep existing color */
                    border-color: #10b981;
                }
                .form-check-input:focus { /* Subtle focus */
                     box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.25);
                }

                .form-control:focus, .btn:focus {
                    box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
                    border-color: #8B5CF6;
                }

                .task-content {
                    flex: 1;
                    min-width: 0; /* Important for flex items */
                    padding-right: 10px;
                     display: flex; /* Ensure items inside align */
                     align-items: center; /* Vertically align checkbox and text */
                }

                /* Removed unnecessary styles for task-text ellipsis/nowrap as handled above */

                .empty-state svg {
                    opacity: 0.6;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .confirm-delete {
                    animation: fadeIn 0.2s ease-out;
                }

                .spinner-grow {
                    animation-duration: 1.2s;
                }

                 /* Ensure list scrolls within its container */
                .task-list {
                  scrollbar-width: thin; /* Firefox */
                  scrollbar-color: #adb5bd #f8f9fa; /* Firefox */
                }
                .task-list::-webkit-scrollbar {
                  width: 8px;
                }
                .task-list::-webkit-scrollbar-track {
                  background: #f8f9fa;
                  border-radius: 4px;
                }
                .task-list::-webkit-scrollbar-thumb {
                  background-color: #adb5bd;
                  border-radius: 4px;
                  border: 2px solid #f8f9fa;
                }

            `}</style>
        </div> 
    )
}

export default TaskManager;