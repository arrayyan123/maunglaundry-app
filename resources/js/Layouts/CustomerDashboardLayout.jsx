import { Link, usePage } from '@inertiajs/react';
import IonIcon from '@reacticons/ionicons';
import { useState, useEffect } from 'react';
import { Fade, Zoom } from 'react-awesome-reveal';
import { Dropdown } from "flowbite-react";
import NavLink from '@/Components/NavLink';
import ColorCustomizer from '@/Components/AdminDashboard/ColorCustomizer';


const pngImages = import.meta.glob("/public/assets/Images/*.png", { eager: true });
const webpImages = import.meta.glob("/public/assets/Images/*.webp", { eager: true });
const images = { ...pngImages, ...webpImages };

const getImageByName = (name) => {
    const matchingImage = Object.keys(images).find((path) => path.includes(`${name}`));
    return matchingImage ? images[matchingImage].default || images[matchingImage] : null;
};

const logo = getImageByName('Logo_maung');
const logout = getImageByName('Admin-Person-cartoon');
const tutorial = getImageByName('questioning_person')

function CustomerDashboardLayout({ header, children, handleClickStart }) {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isSidebarSmaller, setIsSidebarSmaller] = useState(true);
    const [activeSection, setActiveSection] = useState("notes");
    const [time, setTime] = useState(new Date());
    const [showLogOutModal, setShowLogOutModal] = useState(false);
    const [showTutorialModal, setShowTutorialModal] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [transactions, setTransactions] = useState([]);
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

    const fetchTransactions = async (customerId) => {
        try {
            const response = await axios.get(`/api/admin/transactions/${customerId}`);
            setTransactions(response.data.transaction);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
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

    const handleTutorialButton = () => {
        setShowTutorialModal(false);
        handleClickStart();
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("customer-token");
        if (!storedToken) {
            window.location.href = "/customer/login";
        } else {
            const storedCustomer = localStorage.getItem("customer-data");
            if (storedCustomer) {
                const customer = JSON.parse(storedCustomer);
                setCustomerData(customer);
                fetchTransactions(customer.id);
            }
        }
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("customer-token");
        localStorage.removeItem("customer-data");
        window.location.href = "/customer/login";
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${isSidebarExpanded ? "w-64" : "w-16"
                    } ${isSidebarSmaller ? "md:translate-x-0 translate-x-[-100%]" : "translate-x-0"} bg-gray-900 text-white flex flex-col block transition-all duration-300`}
                style={{ backgroundColor: sidebarColor, maxHeight: '100vh', overflowY: 'auto' }}
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
                            <NavLink href={route('customer.dashboard')} active={route().current('customer.dashboard')}>
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
                            {customerData && (
                                <NavLink href={route('customer.transactionpage')} active={route().current('customer.transactionpage')}>
                                    <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                        <IonIcon className='text-[20px]' name="bag-add"></IonIcon>
                                        <span
                                            className={`${isSidebarExpanded ? "block" : "hidden"
                                                } text-sm`}
                                        >
                                            Add Transaction
                                        </span>

                                    </div>
                                </NavLink>
                            )}
                        </li>
                        <li>
                            {customerData && (
                                <NavLink href={route('customer.report')} active={route().current('customer.report')}>
                                    <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                        <IonIcon className='text-[20px]' name="cash"></IonIcon>
                                        <span
                                            className={`${isSidebarExpanded ? "block" : "hidden"
                                                } text-sm`}
                                        >
                                            Laporan Transaksi Anda
                                        </span>

                                    </div>
                                </NavLink>
                            )}
                        </li>
                        <li>
                            {customerData && (
                                <NavLink href={route('customer.graph')} active={route().current('customer.graph')}>
                                    <div className='py-2 px-4 rounded cursor-pointer text-white flex items-center gap-4'>
                                        <IonIcon className='text-[20px]' name="stats-chart"></IonIcon>
                                        <span
                                            className={`${isSidebarExpanded ? "block" : "hidden"
                                                } text-sm`}
                                        >
                                            Perkembangan Anda
                                        </span>
                                    </div>
                                </NavLink>
                            )}
                        </li>
                        <li>
                            {customerData && (
                                <NavLink href={route('customer.inbox')} active={route().current('customer.inbox')}>
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
                            )}
                        </li>
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
                    </ul>
                </nav>
                {/* <div className={`bg-white mx-auto my-2 w-56 h-60 rounded-xl ${isSidebarExpanded ? "block" : "hidden"}`}>
                    <Fade>
                        <div className='flex flex-col items-center justify-center space-y-2'>
                            <img src={tutorial} className='w-24 h-24' alt="" />
                            <h1 className='text-black text-center'>butuh tutorial untuk menggunakan<br /> dashboardnya?</h1>
                            <button
                                onClick={() => setShowTutorialModal(true)}
                                className='bg-blue-400 transition-all scale-100 hover:scale-110 ease-in-out px-4 py-2 rounded-xl'>
                                <span className='flex flex-row space-x-2 items-center'>
                                    <p>Ya saya butuh</p>
                                    <IonIcon className='hover:animate-spin' name="accessibility"></IonIcon>
                                </span>
                            </button>
                        </div>
                    </Fade>
                </div> */}
                <div
                    className={`${isSidebarExpanded ? "p-4" : "p-2"
                        } border-t border-blue-700`}
                >
                    <button onClick={() => setShowLogOutModal(true)} className="w-full bg-blue-gray-600 hover:bg-blue-gray-800 py-2 rounded text-white flex items-center text-sm">
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
                    className="flex items-center justify-around bg-gray-900 shadow px-4 py-10 sm:px-6"
                    style={{ backgroundColor: topBarColor }}
                >
                    <div className='flex sm:flex-row items-center sm:space-x-9 flex-col sm:space-y-0 space-y-4 w-full'>
                        <div className='flex items-center space-x-4 sm:space-x-6 w-full'>
                            <div className='mt-1 md:hidden block'>
                                <button onClick={() => setIsSidebarSmaller(!isSidebarSmaller)}>
                                    <span>
                                        <IonIcon className={`text-2xl transform transition-transform duration-500 text-white ${isSidebarSmaller ? "rotate-90" : "rotate-0"
                                            }`} name={isSidebarSmaller ? "arrow-up-circle" : "arrow-back-circle"}></IonIcon>
                                    </span>
                                </button>
                            </div>
                            {header && (
                                <div className="text-lg font-semibold flex items-center text-gray-900 truncate">{header}</div>
                            )}
                            <div className='md:block hidden'>
                                <div className="text-center text-gray-800 flex flex-row items-center space-x-4">
                                    <div className="text-[15px] text-white font-medium">{formatDate(time)}</div>
                                    <div className="text-[15px] text-white font-bold">{formatTime(time)}</div>
                                </div>
                            </div>
                        </div>
                        <div className=''>
                            {customerData && (
                                <Dropdown renderTrigger={() =>
                                    <span className="text-sm text-white hover:text-gray-200 cursor-pointer flex flex-row items-center space-x-1">
                                        <p>{customerData.name}</p>
                                        <IonIcon className='text-[20px]' name='chevron-down'></IonIcon>
                                    </span>}>
                                    <Zoom>
                                        <Dropdown.Item onClick={() => (window.location.href = `/customer/edit-profile`)}>Profile</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowLogOutModal(true)}>Sign out</Dropdown.Item>
                                    </Zoom>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </header>
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto md:px-4 px-4 sm:p-4">
                    {children}
                </main>
            </div>
            {showTutorialModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <Fade>
                        <div className="bg-white p-6 h-auto w-96 flex flex-col items-center justify-center rounded-md shadow-md">
                            <img src={tutorial} className='w-56 h-auto' alt="sad log out" />
                            <h3 className="text-lg font-semibold mb-4">Anda ingin Tutorial</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowTutorialModal(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Tidak
                                </button>
                                <button
                                    onClick={handleTutorialButton}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Ya
                                </button>
                            </div>
                        </div>
                    </Fade>
                </div>
            )}
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
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Ya
                                </button>
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

export default CustomerDashboardLayout