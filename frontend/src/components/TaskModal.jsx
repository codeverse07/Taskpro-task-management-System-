import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task, employees }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        deadline: '',
        assignedTo: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'Medium',
                status: task.status || 'Pending',
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                assignedTo: task.assignedTo?._id || task.assignedTo || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                status: 'Pending',
                deadline: '',
                assignedTo: ''
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500 ease-in-out" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom glass-panel border border-white/10 rounded-3xl text-left overflow-hidden shadow-2xl shadow-cyan-500/10 transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-lg w-[95%] sm:w-full animate-in fade-in zoom-in-95">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10 border-b border-slate-700/30 pb-4">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-300 tracking-tight text-glow" id="modal-title">
                                {task ? 'Reconfigure Protocol' : 'Initialize New Protocol'}
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Designation</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="Enter protocol designation"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Parameters (Description)</label>
                                    <textarea
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="input-field resize-none"
                                        placeholder="Define protocol execution parameters"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-cyan-400 mb-1">Threat Level</label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="Low" className="bg-slate-900/50">Low (Routine)</option>
                                            <option value="Medium" className="bg-slate-900/50">Medium (Elevated)</option>
                                            <option value="High" className="bg-slate-900/50">High (Critical)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-cyan-400 mb-1">Current State</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="Pending" className="bg-slate-900/50">Pending</option>
                                            <option value="In Progress" className="bg-slate-900/50">Processing</option>
                                            <option value="Completed" className="bg-slate-900/50">Executed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Target Cycle (Deadline)</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            required
                                            value={formData.deadline}
                                            onChange={handleChange}
                                            className="input-field py-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2">Allocated Agent</label>
                                        <select
                                            name="assignedTo"
                                            value={formData.assignedTo}
                                            onChange={handleChange}
                                            className="input-field py-3"
                                        >
                                            <option value="" className="bg-slate-900/50 text-slate-400">Unassigned</option>
                                            {employees.map(emp => (
                                                <option key={emp._id} value={emp._id} className="bg-slate-900/50">{emp.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3 relative z-10 pt-4 border-t border-slate-700/30">
                                <button
                                    type="submit"
                                    className="btn-primary w-full sm:w-auto shadow-lg shadow-cyan-500/20 py-3 sm:py-2.5"
                                >
                                    Commit Parameters
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-secondary w-full sm:w-auto py-3 sm:py-2.5 active:scale-95 transition-all"
                                >
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
