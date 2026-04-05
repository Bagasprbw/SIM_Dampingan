import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * AppLayout — wraps every protected page with Sidebar + Navbar.
 * Usage: wrap your page component with <AppLayout title="...">
 */
const AppLayout = ({ children, title }) => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar title={title} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
