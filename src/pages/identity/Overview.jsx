import React from 'react';
import { MapPin, Server } from 'lucide-react';

const Overview = () => {
    const centers = [
        { id: 'CTR-001', name: 'Mumbai Hub Alpha', location: 'Mumbai, India', capacity: 500, status: 'Online', uptime: '99.9%' },
        { id: 'CTR-002', name: 'Bangalore Ops', location: 'Bangalore, India', capacity: 350, status: 'Online', uptime: '99.5%' },
        { id: 'CTR-003', name: 'Delhi Support', location: 'Delhi, India', capacity: 200, status: 'Maintenance', uptime: '98.2%' },
        { id: 'CTR-004', name: 'Pune Tech', location: 'Pune, India', capacity: 400, status: 'Online', uptime: '99.8%' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Center Overview</h1>

            <div className="grid grid-cols-1 gap-4">
                {centers.map((center) => (
                    <div key={center.id} className="bg-dark-800 p-6 rounded-2xl border border-dark-600/50 flex flex-col md:flex-row items-center justify-between hover:bg-dark-700/50 transition-all">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${center.status === 'Online' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                <Server className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{center.name}</h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {center.location}</span>
                                    <span className="w-1 h-1 bg-dark-600 rounded-full"></span>
                                    <span>ID: {center.id}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8 mt-4 md:mt-0">
                            <div className="text-center">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Capacity</p>
                                <p className="text-lg font-bold text-white">{center.capacity}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Uptime</p>
                                <p className="text-lg font-bold text-primary">{center.uptime}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border ${center.status === 'Online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                {center.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Overview;