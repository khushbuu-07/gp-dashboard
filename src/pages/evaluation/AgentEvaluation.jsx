import React from 'react';
import { UserCheck, TrendingUp, AlertCircle } from 'lucide-react';

const AgentEvaluation = () => {
    const agents = [
        { id: 'AGT-001', name: 'Sarah Miller', campaign: 'Inbound Tech', calls: 145, aht: '4m 30s', score: 92, status: 'Excellent' },
        { id: 'AGT-002', name: 'John Doe', campaign: 'Outbound Sales', calls: 89, aht: '6m 15s', score: 78, status: 'Average' },
        { id: 'AGT-003', name: 'Emily Davis', campaign: 'Inbound Tech', calls: 160, aht: '4m 10s', score: 95, status: 'Excellent' },
        { id: 'AGT-004', name: 'Michael Brown', campaign: 'Customer Support', calls: 110, aht: '5m 00s', score: 85, status: 'Good' },
        { id: 'AGT-005', name: 'Jessica Wilson', campaign: 'Outbound Sales', calls: 75, aht: '7m 20s', score: 65, status: 'Poor' },
    ];

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Agent Evaluation</h1>
                    <p className="text-text-muted text-sm">Performance metrics and quality scores for agents.</p>
                </div>
            </div>

            <div className="bg-dark-900 border border-dark-600/60 rounded-2xl overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-dark-800 text-text-muted font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Agent ID</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Calls Taken</th>
                            <th className="px-6 py-4">Avg Handle Time</th>
                            <th className="px-6 py-4">Quality Score</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-600/30">
                        {agents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-dark-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-primary">{agent.id}</td>
                                <td className="px-6 py-4 font-bold flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs">{agent.name.charAt(0)}</div>
                                    {agent.name}
                                </td>
                                <td className="px-6 py-4">{agent.campaign}</td>
                                <td className="px-6 py-4">{agent.calls}</td>
                                <td className="px-6 py-4">{agent.aht}</td>
                                <td className="px-6 py-4 font-bold text-lg">{agent.score}%</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        agent.status === 'Excellent' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                        agent.status === 'Good' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                        agent.status === 'Average' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                        {agent.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentEvaluation;