import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { usePermissionSync } from '../../hooks/usePermissionSync';

const AdminLayout = ({ children, title }) => {
    // Sinkronisasi permissions dari server secara otomatis
    // (detect perubahan hak akses oleh superadmin tanpa perlu login ulang)
    usePermissionSync();

    return (
        <div className="min-h-screen bg-[#F0F2F8] flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Navbar */}
                <Navbar title={title} />

                {/* Content */}
                <main className="mt-16 p-8 overflow-y-auto min-h-[calc(100vh-64px)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

