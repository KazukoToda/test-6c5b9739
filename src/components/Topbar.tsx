use client

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaChartBar, FaClipboardList, FaUser, FaQuestionCircle, FaBars, FaTimes } from 'react-icons/fa';

const Topbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#2C3E50] text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/dashboard" className="text-xl font-bold">
                    DX診断サポート
                </Link>

                <div className="hidden md:flex space-x-4">
                    <Link href="/dashboard" className="hover:text-[#3498DB] transition-colors">
                        <FaHome className="inline mr-1" />
                        ダッシュボード
                    </Link>
                    <Link href="/new-diagnostic" className="hover:text-[#3498DB] transition-colors">
                        <FaChartBar className="inline mr-1" />
                        新規診断
                    </Link>
                    <Link href="/improvement-plans" className="hover:text-[#3498DB] transition-colors">
                        <FaClipboardList className="inline mr-1" />
                        改善計画
                    </Link>
                    <Link href="/help-support" className="hover:text-[#3498DB] transition-colors">
                        <FaQuestionCircle className="inline mr-1" />
                        ヘルプ
                    </Link>
                </div>

                <div className="hidden md:block">
                    <Link href="/account-settings" className="hover:text-[#3498DB] transition-colors">
                        <FaUser className="inline mr-1" />
                        アカウント
                    </Link>
                </div>

                <button className="md:hidden" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="md:hidden mt-4">
                    <Link href="/dashboard" className="block py-2 hover:bg-[#3498DB] transition-colors">
                        <FaHome className="inline mr-2" />
                        ダッシュボード
                    </Link>
                    <Link href="/new-diagnostic" className="block py-2 hover:bg-[#3498DB] transition-colors">
                        <FaChartBar className="inline mr-2" />
                        新規診断
                    </Link>
                    <Link href="/improvement-plans" className="block py-2 hover:bg-[#3498DB] transition-colors">
                        <FaClipboardList className="inline mr-2" />
                        改善計画
                    </Link>
                    <Link href="/help-support" className="block py-2 hover:bg-[#3498DB] transition-colors">
                        <FaQuestionCircle className="inline mr-2" />
                        ヘルプ
                    </Link>
                    <Link href="/account-settings" className="block py-2 hover:bg-[#3498DB] transition-colors">
                        <FaUser className="inline mr-2" />
                        アカウント
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Topbar;