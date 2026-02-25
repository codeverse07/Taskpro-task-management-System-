import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { CheckCircle, Clock, ListTodo, Calendar, Loader, AlertTriangle } from 'lucide-react';
import { io } from 'socket.io-client';

const EmployeeDashboard = () => {
    const [stats, setStats] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [taskToConfirm, setTaskToConfirm] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, tasksRes] = await Promise.all([
                api.get('/dashboard/employee'), api.get('/tasks/my-tasks')
            ]);
            setStats(statsRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            // Error handled silently in UI via loader/error state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const socket = io('http://localhost:5000');

        socket.on('taskCreated', () => fetchData());
        socket.on('taskUpdated', () => fetchData());
        socket.on('taskDeleted', () => fetchData());

        return () => socket.disconnect();
    }, []);

    const handleStatusDropdownChange = (task, newStatus) => {
        if (newStatus === 'Completed') {
            setTaskToConfirm(task);
            setIsConfirmModalOpen(true);
        } else {
            submitStatusUpdate(task._id, newStatus);
        }
    };

    const submitStatusUpdate = async (taskId, newStatus) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
            setIsConfirmModalOpen(false);
            setTaskToConfirm(null);
            fetchData(); // This will also be triggered by socket, but keeping it for optimism
        } catch (error) {
            alert('Error updating status');
            setIsConfirmModalOpen(false);
            setTaskToConfirm(null);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-lg shadow-cyan-500/30';
            case 'Medium': return 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-lg shadow-cyan-500/30';
            case 'Low': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-cyan-500/30';
            default: return 'bg-slate-700/50 text-slate-300 border border-slate-600';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-cyan-500/30';
            case 'In Progress': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/30';
            case 'Pending': return 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-lg shadow-cyan-500/30';
            default: return 'bg-slate-700/50 text-slate-300 border border-slate-600';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const tasksByStatus = {
        Pending: tasks.filter(t => t.status === 'Pending'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        Completed: tasks.filter(t => t.status === 'Completed')
    };

    const renderTaskCard = (task) => (
        <div key={task._id} className="glass-card flex flex-col hover:-translate-y-1 transition-transform duration-300 mb-4">
            <div className="px-4 py-4 sm:p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-slate-300 tracking-wide mr-2">{task.title}</h4>
                    <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-bold uppercase tracking-wider rounded-md whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2 h-[36px] leading-relaxed">
                    {task.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">
                    <div className="flex items-center text-xs font-medium text-slate-300">
                        <Calendar className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-cyan-500/70" />
                        <span>Due: {formatDate(task.deadline)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/20 px-4 py-3 border-t border-slate-700/30">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-cyan-400 font-semibold tracking-wide uppercase">State:</span>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusDropdownChange(task, e.target.value)}
                        disabled={task.status === 'Completed'}
                        className={`block w-full sm:w-28 pl-2 pr-6 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 border focus:outline-none focus:ring-1 rounded-xl cursor-pointer appearance-none transition-all ${task.status === 'Completed' ? 'bg-emerald-900/10 border-emerald-700/30 text-emerald-500 opacity-60 cursor-not-allowed' : 'bg-slate-900/40 border-slate-700/50 hover:border-cyan-500/50 focus:ring-cyan-500 focus:border-cyan-500 shadow-lg shadow-cyan-500/5'}`}
                    >
                        {task.status !== 'Completed' && <option value="Pending" className="bg-slate-800 text-white">Pending</option>}
                        {task.status !== 'Completed' && <option value="In Progress" className="bg-slate-800 text-white">Processing</option>}
                        <option value="Completed" className="bg-slate-800 text-emerald-400">Executed</option>
                    </select>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative z-10">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between px-4 sm:px-0 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold leading-tight text-slate-300 tracking-tight text-glow">
                            Agent Workspace
                        </h2>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-cyan-400 font-semibold tracking-wide flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Personal Protocol Assignment Array
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                        <Loader className="animate-spin h-12 w-12 mx-auto mb-4 text-cyan-500 drop-shadow-lg shadow-cyan-500/30" />
                        <p className="animate-pulse">Syncing with Command Protocol...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 px-4 sm:px-0">

                            <div className="glass-card pt-5 px-4 pb-12 sm:pt-6 sm:px-6 border-t border-t-indigo-500/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-indigo-500/20 border border-indigo-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Assigned Protocols</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.myTasksCount || 0}</p>
                                </dd>
                            </div>

                            <div className="glass-card pt-5 px-4 pb-12 sm:pt-6 sm:px-6 border-t border-t-amber-500/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Requires Action</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.pendingTasksCount || 0}</p>
                                </dd>
                            </div>

                            <div className="glass-card pt-5 px-4 pb-12 sm:pt-6 sm:px-6 border-t border-t-emerald-500/50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Executed</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.completedTasksCount || 0}</p>
                                </dd>
                            </div>

                        </div>

                        {/* Task List items in Kanban layout */}
                        <div className="mt-10 sm:mt-12 px-4 sm:px-0 relative mb-20">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-300 tracking-wide mb-6 sm:mb-8 border-b border-slate-700/50 pb-4 text-glow transition-all">Protocol Execution Board</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {/* Assigned Column */}
                                <div className="glass-panel p-4 rounded-xl min-h-[400px]">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3 mb-2">
                                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                                                Assigned
                                            </h4>
                                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-bold">
                                                {tasksByStatus.Pending.length}
                                            </span>
                                        </div>
                                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {tasksByStatus.Pending.map(task => renderTaskCard(task))}
                                            {tasksByStatus.Pending.length === 0 && (
                                                <div className="py-8 text-center border-2 border-dashed border-slate-700/20 rounded-2xl">
                                                    <p className="text-xs text-slate-500 font-medium lowercase italic">queue empty</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* In Progress Column */}
                                <div className="glass-panel p-4 rounded-xl min-h-[400px]">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-2">
                                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                                                Processing
                                            </h4>
                                            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-md font-bold">
                                                {tasksByStatus['In Progress'].length}
                                            </span>
                                        </div>
                                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {tasksByStatus['In Progress'].map(task => renderTaskCard(task))}
                                            {tasksByStatus['In Progress'].length === 0 && (
                                                <div className="py-8 text-center border-2 border-dashed border-slate-700/20 rounded-2xl">
                                                    <p className="text-xs text-slate-500 font-medium lowercase italic">no active operations</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Completed Column */}
                                <div className="glass-panel p-4 rounded-xl min-h-[400px]">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 mb-2">
                                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                Executed
                                            </h4>
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                                                {tasksByStatus.Completed.length}
                                            </span>
                                        </div>
                                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                            {tasksByStatus.Completed.map(task => renderTaskCard(task))}
                                            {tasksByStatus.Completed.length === 0 && (
                                                <div className="py-8 text-center border-2 border-dashed border-slate-700/20 rounded-2xl">
                                                    <p className="text-xs text-slate-500 font-medium lowercase italic">archive empty</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={() => setIsConfirmModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom glass-panel border border-red-500/30 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-red-500/10 blur-3xl pointer-events-none"></div>
                                <div className="sm:flex sm:items-start relative z-10">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 border border-red-500/50 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-xl leading-6 font-bold text-slate-300" id="modal-title">
                                            Confirm Protocol Execution
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-300">
                                                Are you sure you want to mark protocol <span className="text-cyan-400 font-bold">"{taskToConfirm?.title}"</span> as Executed (Completed)?
                                            </p>
                                            <p className="text-sm font-bold text-red-400 mt-2">
                                                WARNING: This action cannot be reversed. Once executed, the task is locked.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-white/5 bg-slate-900/40 relative z-10">
                                <button
                                    type="button"
                                    onClick={() => submitStatusUpdate(taskToConfirm._id, 'Completed')}
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 text-base font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-900 sm:ml-3 sm:w-auto sm:text-sm hover:scale-105 transition-transform"
                                >
                                    Confirm Execution
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-600 px-4 py-2 bg-slate-800 text-base font-semibold text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                >
                                    Abort
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
