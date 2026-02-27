import React from 'react';

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unified Control Center */}
            <div className="col-span-full">
                <h1 className="text-2xl font-bold text-white mb-2">Unified Control Center</h1>
                <p className="text-text-muted">Centralized command for Management, Evaluation, and Identity systems.</p>
            </div>

            {/* MANAGEMENT CONSOLE */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-text-muted text-sm mb-2">MANAGEMENT CONSOLE</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-primary text-xl">$</span>
                        <span className="text-2xl font-bold text-white">Revenue This Month</span>
                    </div>
                    <span className="text-green-400 text-sm font-semibold">+5.2%</span>
                </div>
            </div>

            {/* EVALUATION SYSTEM */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-text-muted text-sm mb-2">EVALUATION SYSTEM</h3>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">Avg. Quality Score</span>
                    <span className="text-red-400 text-sm font-semibold">-0.8%</span>
                </div>
            </div>

            {/* IDENTITY CONTROL */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-text-muted text-sm mb-2">IDENTITY CONTROL</h3>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">Centers Online</span>
                    <span className="text-yellow-400 text-sm font-semibold">+0.0%</span>
                </div>
            </div>

            {/* Cross-Domain Performance */}
            <div className="col-span-full md:col-span-2 bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-text-muted text-sm mb-4">Cross-Domain Performance</h3>
                <div className="flex gap-8">
                    <span className="text-white">Revenue</span>
                    <span className="text-white">Quality</span>
                </div>
            </div>

            {/* Revenue Source */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-text-muted text-sm mb-4">Revenue Source</h3>
                <div className="flex gap-8">
                    <span className="text-white">Revenue</span>
                    <span className="text-white">Quality</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;