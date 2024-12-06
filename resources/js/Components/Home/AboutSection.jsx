import React from 'react'

function AboutSection({ aboutRef }) {
    return (
        <>
            <section ref={aboutRef} className="bg-gray-900 text-white">
                <div className="max-w-screen px-4 py-8 items-center h-full sm:px-6 sm:py-12 lg:px-8 lg:py-20">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold sm:text-4xl">Apa yang membuat kami spesial?</h2>
                        <p className="mt-4 text-gray-300">
                            Maung Laundry Menawarkan pelayanan yang akan memuaskan pelanggan.
                        </p>
                    </div>
                    <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>

                            <div>
                                <h2 className="text-lg font-bold">Layanan Cepat dan Efisien</h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kami memahami pentingnya waktu Anda. Dengan proses cuci dan pengembalian cepat, Maung Laundry memastikan pakaian Anda kembali dalam kondisi terbaik tanpa mengganggu aktivitas Anda.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>

                            <div>
                                <h2 className="text-lg font-bold">Perawatan Pakaian Profesional</h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kami menggunakan teknologi dan produk berkualitas tinggi untuk merawat setiap jenis kain. Pakaian Anda akan dicuci dan disetrika dengan perhatian khusus agar tetap awet dan nyaman dipakai.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>

                            <div>
                                <h2 className="text-lg font-bold">Layanan Antar-Jemput</h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kenyamanan ekstra dari Maung Laundry adalah layanan antar-jemput. Cukup hubungi kami dan nikmati layanan praktis ini tanpa harus keluar rumah. (syarat dan ketentuan berlaku).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>

                            <div>
                                <h2 className="text-lg font-bold">Harga Terjangkau Deskripsi</h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kami percaya bahwa layanan berkualitas tidak harus mahal. Maung Laundry menawarkan harga yang kompetitif untuk berbagai jenis layanan cuci dan perawatan pakaian.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>

                            <div>
                                <h2 className="text-lg font-bold">Kepuasan Pelanggan Utama </h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kepuasan Anda adalah prioritas kami. Tim kami selalu siap membantu dan memastikan pengalaman laundry Anda menyenangkan dan sesuai harapan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                    <path
                                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                    ></path>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                                    ></path>
                                </svg>
                            </span>
                            <div>
                                <h2 className="text-lg font-bold">Inovasi dan Layanan Terbaru</h2>

                                <p className="mt-1 text-sm text-gray-300">
                                    Kami selalu mengikuti perkembangan teknologi terbaru dalam perawatan pakaian, memberikan layanan seperti cuci kering dan perawatan khusus lainnya untuk memenuhi kebutuhan pelanggan yang semakin beragam.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutSection