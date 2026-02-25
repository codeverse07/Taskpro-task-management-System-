import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import { CheckCircle, Clock, Users, ListTodo, Plus } from 'lucide-react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, tasksRes, empRes] = await Promise.all([
                api.get('/dashboard/admin'), api.get('/tasks'), api.get('/users/employees')
            ]);
            setStats(statsRes.data);
            setTasks(tasksRes.data);
            setEmployees(empRes.data);
        } catch (error) {
            // Silently handle admin fetch error
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

    const handleCreateNew = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchData(); // Refresh data
            } catch (error) {
                // Silently handle delete error
            }
        }
    };

    const handleSaveTask = async (formData) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            setIsModalOpen(false);
            fetchData(); // Refresh data
        } catch (error) {
            alert('Error saving task: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="min-h-screen relative z-10">
            <Navbar />

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between px-4 sm:px-0 mb-6 sm:mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold leading-tight text-slate-300 tracking-tight text-glow">
                            System Overview
                        </h2>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-cyan-400 font-semibold tracking-wide flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Command and Control Center
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4">
                        <button
                            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                        >
                            <Plus size={18} />
                            <span>Initialize Task</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="animate-pulse">Retrieving system data...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">

                            <div className="glass-card pt-5 px-4 pb-6 sm:pb-12 sm:pt-6 sm:px-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-indigo-500/20 border border-indigo-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Total Protocols</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.totalTasks || 0}</p>
                                </dd>
                            </div>

                            <div className="glass-card pt-5 px-4 pb-6 sm:pb-12 sm:pt-6 sm:px-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Executed</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.completedTasks || 0}</p>
                                </dd>
                            </div>

                            <div className="glass-card pt-5 px-4 pb-6 sm:pb-12 sm:pt-6 sm:px-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Processing</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.pendingTasks || 0}</p>
                                </dd>
                            </div>

                            <div className="glass-card pt-5 px-4 pb-6 sm:pb-12 sm:pt-6 sm:px-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-300">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                                <dt>
                                    <div className="absolute bg-cyan-500/20 border border-cyan-500/40 rounded-xl p-3 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" aria-hidden="true" />
                                    </div>
                                    <p className="ml-14 sm:ml-16 text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest truncate">Active Agents</p>
                                </dt>
                                <dd className="ml-14 sm:ml-16 pb-2 sm:pb-7 flex items-baseline mt-1">
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-300 text-glow">{stats?.totalUsers || 0}</p>
                                </dd>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="mt-12 px-4 sm:px-0">
                            <div className="mb-6 flex items-center justify-between border-b border-slate-700/50 pb-4">
                                <h3 className="text-xl font-bold text-slate-300 tracking-wide">Protocol Database</h3>
                            </div>
                            <div className="glass-panel rounded-xl overflow-hidden shadow-2xl">
                                <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
                            </div>
                        </div>
                    </>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={editingTask}
                employees={employees}
            />
        </div>
    );
};

export default AdminDashboard;
