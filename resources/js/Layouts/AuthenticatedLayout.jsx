import Notification from '@/Components/AdminDashboard/Notification';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { useState } from 'react';

const images = import.meta.glob('/public/assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

export default function AuthenticatedLayout({ header, children }) {
    const { user } = usePage().props.auth;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        <Link href="/" className="flex items-center space-x-3">
                            <img src={logo} className="h-9 w-auto" />
                            <span className="ml-2 text-xl font-semibold">Dashboard</span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col px-4 py-6 space-y-2">
                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </NavLink>
                        <NavLink href={route('admin.report')} active={route().current('admin.report')}>
                            Report
                        </NavLink>
                        <NavLink href={route('diagram.page')} active={route().current('diagram.page')}>
                            Chart Penjualan
                        </NavLink>
                        <NavLink href="#">
                            Inbox
                        </NavLink>
                        <NavLink href="#">
                            Users
                        </NavLink>
                        <NavLink href="#">
                            Products
                        </NavLink>
                    </nav>
                </div>
            </aside>

            {/* Page Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between bg-blue-400 shadow px-4 py-10 sm:px-6">
                    <div className='flex sm:flex-row items-center sm:space-x-9 flex-col sm:space-y-0 space-y-4'>
                        <div className='flex flex-row item-center space-x-6'>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className=" text-white hover:text-gray-200 items-center focus:outline-none"
                            >
                                <IonIcon name="menu-outline" className='text-[25px]'></IonIcon>
                            </button>

                            {header && (
                                <div className="text-lg font-semibold text-gray-900 truncate">{header}</div>
                            )}
                            <Notification />
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center text-sm font-medium text-white hover:text-gray-200 focus:outline-none">
                                    {user.name}
                                    <svg
                                        className="ml-1 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
