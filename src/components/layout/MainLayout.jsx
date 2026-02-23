import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';

const MainLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-dark-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // if (!user) {
    //     return <Navigate to="/login" replace />;
    // }

    return (
        <div className="min-h-screen bg-dark-900">
            {/* Navbar fixed at top */}
            <Navbar />

            <div className="flex pt-20">
                {/* Sidebar fixed at left (or right if requested, currently left based on image) */}
                <Sidebar className="w-72 hidden md:block" />

                {/* Main Content Area */}
                <main className="flex-1 ml-72 p-8 min-h-[calc(100vh-5rem)] overflow-y-auto transition-all duration-300">
                    {/* 'ml-72' aligns content with the 72 (18rem/288px) sidebar width */}
                    <div className="max-w-8xl mx-auto space-y-6 animate-slide-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
