import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import * as Icons from "react-icons/vsc";

const MobileBottomBar = ({ links, onLogout }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.profile);

    return (
        <div className="fixed  bottom-0 left-0 w-full  bg-richblack-900 z-20 flex justify-around py-4">
            {links.map((link) => {
                if (link.type && user?.accountType !== link.type) return null;

                const Icon = Icons[link.icon] || (() => <span className="text-red-500">Icon not found</span>);
                const isActive = location.pathname === link.path;

                return (
                    <NavLink
                        key={link.id}
                        to={link.path}
                        className={`flex flex-col items-center justify-center text-sm font-medium ${
                            isActive ? "text-yellow-50 border-b-4 pt-1  border-b-yellow-50"  : "text-richblack-300"
                        } transition-all duration-200`}
                    >

                        <Icon className="text-xl" />
                        <span className="truncate max-w-[4.55rem] text-center">{link.name}</span>

                    </NavLink>
                );
            })}
            <button
                onClick={onLogout}
                className="flex flex-col items-center justify-center text-sm font-medium text-richblack-300 transition-all duration-200"
            >
                <Icons.VscSignOut className="text-xl" />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default MobileBottomBar;
