import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';

const TaskTable = ({ tasks, onEdit, onDelete }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5';
            case 'Medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5';
            case 'Low': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5';
            default: return 'bg-slate-700/10 text-slate-400 border border-slate-600/20';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5';
            case 'In Progress': return 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-lg shadow-cyan-500/5';
            case 'Pending': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/5';
            default: return 'bg-slate-700/10 text-slate-400 border border-slate-600/20';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="flex flex-col mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-slate-700/50 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-slate-700/30">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest transition-colors">
                                        Protocol Details
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest transition-colors">
                                        Agent Assigned
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest transition-colors">
                                        Priority / Deadline
                                    </th>
                                    <th scope="col" className="px-4 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest transition-colors">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-4 sm:px-6 py-4 text-right">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent divide-y divide-slate-700/30">
                                {tasks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-400 font-medium">
                                            No processing tasks found. Initialize a new protocol to commence operations.
                                        </td>
                                    </tr>
                                ) : (
                                    tasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-slate-800/10 transition-colors duration-200 group">
                                            <td className="px-4 sm:px-6 py-4 sm:py-5">
                                                <div className="text-sm font-bold text-slate-300 tracking-wide transition-colors group-hover:text-primary">{task.title}</div>
                                                <div className="text-xs sm:text-sm text-slate-400 truncate max-w-[150px] sm:max-w-xs mt-1">{task.description}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="text-sm font-bold text-slate-300">
                                                        {task.assignedTo ? task.assignedTo.name : <span className="text-slate-500 italic opacity-60">Awaiting Agent</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 inline-flex text-[10px] sm:text-xs leading-5 font-bold rounded-lg uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <div className="text-[10px] sm:text-xs text-slate-400 flex items-center mt-2 font-medium">
                                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-cyan-500/50" />
                                                    {formatDate(task.deadline)}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 inline-flex text-[10px] sm:text-xs leading-5 font-extrabold rounded-lg uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-400/10 rounded-lg transition-all transform active:scale-90"
                                                >
                                                    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(task._id)}
                                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-all transform active:scale-90"
                                                >
                                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskTable;
