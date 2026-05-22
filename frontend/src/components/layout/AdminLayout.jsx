import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { usePermissionSync } from '../../hooks/usePermissionSync';

const AdminLayout = ({ children, title }) => {
    // Sinkronisasi permissions dari server secara otomatis
    usePermissionSync();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F0F2F8] flex">
            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
                {/* Navbar */}
                <Navbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Content */}
                <main className="mt-16 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-64px)] w-full max-w-full overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

