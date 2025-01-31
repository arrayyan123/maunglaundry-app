import ColorCustomizer from '@/Components/AdminDashboard/ColorCustomizer';
import Notification from '@/Components/AdminDashboard/Notification';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { useState, useEffect } from 'react';
import { Fade } from 'react-awesome-reveal';

const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');
const logout = getImageByName('Admin-Person-cartoon');

export default function AuthenticatedLayoutInbox({ header, children }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isSidebarSmaller, setIsSidebarSmaller] = useState(true);
    const [activeSection, setActiveSection] = useState("notes");
    const [time, setTime] = useState(new Date());
    const [showLogOutModal, setShowLogOutModal] = useState(false);
    const [sidebarColor, setSidebarColor] = useState('#1a202c');
    const [topBarColor, setTopBarColor] = useState('#1a202c');
    const [showCustomizer, setShowCustomizer] = useState(false);

    useEffect(() => {
        const storedSidebarColor = localStorage.getItem('sidebarColor');
        const storedTopBarColor = localStorage.getItem('topBarColor');

        if (storedSidebarColor) setSidebarColor(storedSidebarColor);
        if (storedTopBarColor) setTopBarColor(storedTopBarColor);
    }, []);

    const handleSidebarColorChange = (color) => {
        setSidebarColor(color);
        localStorage.setItem('sidebarColor', color);
    };

    const handleTopBarColorChange = (color) => {
        setTopBarColor(color);
        localStorage.setItem('topBarColor', color);
    };

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
                style={{ backgroundColor: sidebarColor }}
                className={`${isSidebarExpanded ? "w-64" : "w-16"
                    } ${isSidebarSmaller ? "md:translate-x-0 translate-x-[-100%]" : "translate-x-0"} text-white flex flex-col block transition-all duration-300`}
            >
                <div
                    className={`p-4 border-b border-blue-700 flex items-center justify-between ${isSidebarExpanded ? "space-x-8" : "space-x-1"
                        }`}
                >
                    <span
                        className={`${isSidebarExpanded ? "block" : "hidden"
                            } font-semibold text-lg flex flex-row items-center space-x-3`}
                    >
                        <img src={logo} className="h-9 w-auto" />
                        <h1>Dashboard</h1>
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
                            <NavLink href={route('customer-transaction')} active={route().current('customer-transaction')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="bag-add"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Customer & Transaction
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
                        <li>
                            <NavLink href={route('content.manage')} active={route().current('content.manage')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="newspaper"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Content Management
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink href={route('service-prices.index')} active={route().current('service-prices.index')}>
                                <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                    <IonIcon className='text-[20px]' name="cart"></IonIcon>
                                    <span
                                        className={`${isSidebarExpanded ? "block" : "hidden"
                                            } text-sm`}
                                    >
                                        Service Management
                                    </span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    <div
                        className={`${isSidebarExpanded ? "p-2" : "p-2"
                            }`}
                    >
                        <button onClick={() => setShowCustomizer(true)} className="w-full bg-blue-500 hover:bg-blue-gray-800 py-2 rounded text-white flex items-center text-sm">
                            <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                <IonIcon className='text-[20px]' name="color-fill"></IonIcon>
                                <span
                                    className={`${isSidebarExpanded ? "block" : "hidden"
                                        } text-sm`}
                                >
                                    Customize Theme
                                </span>
                            </div>
                        </button>
                    </div>
                </nav>
                <div
                    className={`${isSidebarExpanded ? "p-4" : "p-2"
                        } border-t border-blue-700`}
                >
                    <button onClick={() => setShowLogOutModal(true)} className="w-full bg-blue-gray-800 hover:bg-blue-gray-900 py-2 rounded text-white flex items-center text-sm">
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
                </div>
            </aside>
            {/* Page Content */}
            <div className={`${isSidebarSmaller ? "absolute md:relative left-0 top-0 w-full h-screen" : "relative"
                } flex-1 flex flex-col overflow-hidden`}>
                <header
                    style={{ backgroundColor: topBarColor }}
                    className="flex items-center justify-around shadow px-4 py-10 sm:px-6">
                    <div className='flex sm:flex-row items-center sm:space-x-9 flex-col sm:space-y-0 space-y-4 w-full'>
                        <div className='flex items-center space-x-4 sm:space-x-6 w-full'>
                            <div className='mt-1 md:hidden block'>
                                <button onClick={() => setIsSidebarSmaller(!isSidebarSmaller)}>
                                    <span>
                                        <IonIcon className={`text-2xl transform transition-transform duration-500 text-white ${isSidebarSmaller ? "rotate-90" : "rotate-0"
                                            }`} name={isSidebarSmaller ? "arrow-up-circle" : "arrow-back-circle"}></IonIcon>
                                    </span>                                </button>
                            </div>
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
                <main className="flex-1 lg:h-svh h-0 overflow-y-auto">
                    {children}
                </main>
            </div>
            {showLogOutModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <Fade>
                        <div className="bg-white p-6 h-auto w-96 flex flex-col items-center justify-center rounded-md shadow-md">
                            <img src={logout} className='w-56 h-auto' alt="sad log out" />
                            <h3 className="text-lg font-semibold mb-4">Anda ingin Log Out ?</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowLogOutModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Tidak
                                </button>
                                <Link href={route('logout')} method="post">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Ya
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </Fade>
                </div>
            )}

            {showCustomizer && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg motion motion-preset-shrink">
                        <ColorCustomizer
                            setSidebarColor={handleSidebarColorChange}
                            setTopBarColor={handleTopBarColorChange}
                        />
                        <button
                            onClick={() => setShowCustomizer(false)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
