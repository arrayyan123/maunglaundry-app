import Notification from '@/Components/AdminDashboard/Notification';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { useState, useEffect } from 'react';

const images = import.meta.glob('/public/assets/Images/*.png', { eager: true });

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}.png`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');

export default function AuthenticatedLayoutInbox({ header, children }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState("notes");
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    const { user } = usePage().props.auth;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md md:hidden block transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                            <div className='space-x-3 scale-100 hover:scale-110 transition-all ease-in-out duration-300 flex flex-row items-center'>
                                <p>Dashboard</p>
                                <IonIcon className='text-[20px]' name="build-outline"></IonIcon>
                            </div>
                        </NavLink>
                        <NavLink href={route('admin.report')} active={route().current('admin.report')}>
                            <div className='space-x-3 scale-100 hover:scale-110 transition-all ease-in-out duration-300 flex flex-row items-center'>
                                <p>Laporan</p>
                                <IonIcon className='text-[20px]' name="cash-outline"></IonIcon>
                            </div>

                        </NavLink>
                        <NavLink href={route('diagram.page')} active={route().current('diagram.page')}>
                            <div className='space-x-3 scale-100 hover:scale-110 transition-all ease-in-out duration-300 flex flex-row items-center'>
                                <p>Chart Penjualan</p>
                                <IonIcon className='text-[20px]' name="bar-chart-outline"></IonIcon>
                            </div>

                        </NavLink>
                        <NavLink href={route('inbox.admin')} active={route().current('inbox.admin')}>
                            <div className='space-x-3 scale-100 hover:scale-110 transition-all ease-in-out duration-300 flex flex-row items-center'>
                                <p>Inbox</p>
                                <IonIcon className='text-[20px]' name="chatbox-outline"></IonIcon>
                            </div>
                        </NavLink>
                        <NavLink href="#">
                            Coming Soon
                        </NavLink>
                        <NavLink href="#">
                            Coming Soon
                        </NavLink>
                    </nav>
                </div>
            </aside>
            <aside
                className={`${isSidebarExpanded ? "w-64" : "w-16"
                    } bg-blue-400 text-white flex flex-col md:block hidden transition-all duration-300`}
            >
                <div
                    className={`p-4 border-b border-blue-700 flex items-center justify-between ${isSidebarExpanded ? "space-x-8" : "space-x-1"
                        }`}
                >
                    <span
                        className={`${isSidebarExpanded ? "block" : "hidden"
                            } font-semibold text-lg`}
                    >
                        Dashboard
                    </span>
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="text-white flex items-center mx-auto"
                    >
                        <IonIcon name={isSidebarExpanded ? "arrow-down-circle-outline" : "menu-outline"} className={`text-2xl transform transition-transform duration-500 ${isSidebarExpanded ? "rotate-90" : "rotate-0"
                            }`} />
                    </button>
                </div>
                <nav className="flex-1 p-0">
                    <ul className="space-y-2">
                        <li>
                            <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="build"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Dashboard
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href={route('admin.report')} active={route().current('admin.report')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="cash"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Laporan
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href={route('diagram.page')} active={route().current('diagram.page')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="stats-chart"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Chart Penjualan
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href={route('inbox.admin')} active={route().current('inbox.admin')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="chatbox"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Inbox
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div
                    className={`${isSidebarExpanded ? "p-4" : "p-2"
                        } border-t border-blue-700`}
                >
                    <Link href={route('logout')} method="post">
                        <button className="w-full bg-blue-700 py-2 rounded text-white hover:bg-blue-600 flex items-center text-sm">
                            <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                <IonIcon className='text-[20px]' name="log-out-outline"></IonIcon>
                                <span
                                    className={`${isSidebarExpanded ? "block" : "hidden"
                                        } text-sm`}
                                >
                                    Logout
                                </span>
                            </div>
                        </button>
                    </Link>
                </div>
            </aside>
            {/* Page Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-around bg-blue-400 shadow px-4 py-10 sm:px-6">
                    <div className='flex sm:flex-row items-center sm:space-x-9 flex-col sm:space-y-0 space-y-4 w-full'>
                        <div className='flex items-center space-x-4 sm:space-x-6 w-full'>
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-white hover:text-gray-200 md:hidden block flex items-center focus:outline-none"
                            >
                                <IonIcon name="menu-outline" className='text-[25px]' />
                            </button>

                            {header && (
                                <div className="text-lg font-semibold flex items-center text-gray-900 truncate">{header}</div>
                            )}
                            <Notification />
                            <div className='md:block hidden'>
                                <div className="text-center text-gray-800 flex flex-row items-center space-x-4">
                                    <div className="text-[15px] text-white font-medium">{formatDate(time)}</div>
                                    <div className="text-[15px] text-white font-bold">{formatTime(time)}</div>
                                </div>
                            </div>
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
                <main className="flex-1 lg:h-svh h-0 lg:overflow-y-hidden overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
