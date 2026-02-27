import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-white tracking-wide">Domain RAG</h2>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <NavLink
                    to="/police"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                    }
                >
                    Police Intelligence
                </NavLink>

                <NavLink
                    to="/insurance"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                    }
                >
                    Insurance Advisory
                </NavLink>

                {/* Optional link back to main app */}
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                    }
                >
                    Main App
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;
