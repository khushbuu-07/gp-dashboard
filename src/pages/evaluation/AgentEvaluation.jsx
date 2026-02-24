import React, { useMemo } from 'react';
import { UserCheck } from 'lucide-react';
import Table from '../../components/common/Table';

const AgentEvaluation = () => {
    const agents = [
        { id: 'AGT-001', name: 'Sarah Miller', campaign: 'Inbound Tech', calls: 145, aht: '4m 30s', score: 92, status: 'Excellent' },
        { id: 'AGT-002', name: 'John Doe', campaign: 'Outbound Sales', calls: 89, aht: '6m 15s', score: 78, status: 'Average' },
        { id: 'AGT-003', name: 'Emily Davis', campaign: 'Inbound Tech', calls: 160, aht: '4m 10s', score: 95, status: 'Excellent' },
        { id: 'AGT-004', name: 'Michael Brown', campaign: 'Customer Support', calls: 110, aht: '5m 00s', score: 85, status: 'Good' },
        { id: 'AGT-005', name: 'Jessica Wilson', campaign: 'Outbound Sales', calls: 75, aht: '7m 20s', score: 65, status: 'Poor' },
    ];

    const columnDefs = useMemo(() => [
        {
            headerName: 'Agent ID',
            field: 'id',
            width: 120,
            cellRenderer: (params) => <span className="font-mono text-primary">{params.value}</span>
        },
        {
            headerName: 'Name',
            field: 'name',
            flex: 1.5,
            cellRenderer: (params) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-xs font-bold text-text-primary border border-dark-600">
                        {params.value.charAt(0)}
                    </div>
                    <span className="font-bold text-text-primary">{params.value}</span>
                </div>
            )
        },
        { headerName: 'Campaign', field: 'campaign', flex: 1 },
        { headerName: 'Calls Taken', field: 'calls', width: 120 },
        { headerName: 'Avg Handle Time', field: 'aht', width: 150 },
        {
            headerName: 'Quality Score',
            field: 'score',
            width: 140,
            cellRenderer: (params) => <span className="font-black text-lg text-primary">{params.value}%</span>
        },
        {
            headerName: 'Status',
            field: 'status',
            width: 140,
            cellRenderer: (params) => {
                const colors = {
                    Excellent: 'bg-green-500/10 text-green-500 border-green-500/20',
                    Good: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    Average: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    Poor: 'bg-red-500/10 text-red-500 border-red-500/20'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[params.value] || 'bg-dark-700 text-gray-400'}`}>
                        {params.value}
                    </span>
                );
            }
        }
    ], []);

    return (
        <div className="space-y-6 pt-6 animate-fade-in text-text-primary h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex justify-between items-end border-b border-dark-600 pb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Agent Evaluation</h1>
                    <p className="text-text-muted text-sm">Performance metrics and quality scores for agents.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Table rowData={agents} columnDefs={columnDefs} />
            </div>
        </div>
    );
};

export default AgentEvaluation;