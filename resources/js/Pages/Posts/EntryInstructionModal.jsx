import React, { memo } from "react";
import { Slide, Fade } from "react-awesome-reveal";

const EntryInstructionModal = memo(({ isOpen, onClose, logo }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Slide direction="down">
        <div className="bg-white w-full max-w-2xl lg:max-w-3xl mx-auto xl:pt-6 lg:pt-[20%] md:pt-[50%] sm:pt-[30%] pt-[180%] pt p-6 sm:p-8 md:p-8 rounded-md shadow-md flex flex-col items-center justify-center overflow-y-scroll max-h-[calc(100vh-1rem)]">
          <div className="flex flex-col items-center">
            <img
              src={logo}
              className="w-36 h-auto object-contain mb-4"
              alt="Logo maung"
            />
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center">
              Gunakan Fitur ini dengan Bijaksana
            </h3>
          </div>
          <Fade>
            <ul className="list-decimal text-sm sm:text-base">
              <li>Kejujuran dalam Penginputan Kuantitas:</li>
              <ul className="list-disc ml-4">
                <li>
                  Customer wajib memastikan jumlah pakaian yang dimasukkan sudah
                  ditimbang atau dihitung dengan akurat.
                </li>
                <li>
                  Data yang dimasukkan harus mencerminkan jumlah pakaian yang
                  sebenarnya, tanpa ada pengurangan atau penambahan yang tidak
                  sesuai.
                </li>
              </ul>
              <li>Pencegahan Penyalahgunaan Fitur:</li>
              <ul className="list-disc ml-4">
                <li>
                  Fitur input transaksi hanya boleh digunakan untuk transaksi
                  yang valid dan nyata.
                </li>
                <li>
                  Penggunaan fitur untuk sekadar bersenang-senang, coba-coba,
                  atau iseng tidak diperbolehkan. Hal ini bertujuan untuk
                  menjaga integritas dan keakuratan data transaksi.
                </li>
              </ul>
              <li>Verifikasi Data oleh Petugas Laundry:</li>
              <ul className="list-disc ml-4">
                <li>
                  Petugas laundry berhak untuk memverifikasi jumlah dan jenis
                  pakaian yang terdaftar dalam transaksi.
                </li>
                <li>
                  Jika ditemukan ketidaksesuaian antara jumlah yang dilaporkan
                  dengan hasil timbangan aktual, transaksi dapat dibatalkan
                  atau dilakukan koreksi.
                </li>
              </ul>
              <li>Tanggung Jawab Customer:</li>
              <ul className="list-disc ml-4">
                <li>
                  Customer bertanggung jawab penuh atas keakuratan data
                  transaksi yang diinput. Kesalahan akibat penginputan yang
                  disengaja atau tidak teliti dapat mengakibatkan sanksi atau
                  pembatasan penggunaan fitur.
                </li>
                <li>
                  Customer harus melaporkan jika ada perubahan jumlah atau jenis
                  pakaian sebelum transaksi diproses.
                </li>
              </ul>
            </ul>
          </Fade>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Ya saya telah membaca.
            </button>
          </div>
        </div>
      </Slide>
    </div>
  );
});

export default EntryInstructionModal;