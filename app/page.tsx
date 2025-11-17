"use client";
import ChartAreaGradient from "@/components/chart";
import { BanknoteArrowDown, BanknoteArrowUp, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [ showNewTransaction, setShowNewTransaction ] = useState(false);

    return <div className="p-8">
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
            <span className="text-gray-400">Total Saldo</span>
            <span className="font-semibold">Rp. 12.000.000</span>
        </div>
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Ringkasan</h2>
            <div className="bg-white h-20 flex justify-between items-center p-4 rounded-lg mb-2 gap-4">
                <div className="h-full w-full flex gap-2">
                    <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500"/></div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Total Pemasukan</span>
                        <span className="font-semibold text-lg">Rp. 5.000.000</span>
                    </div>
                </div>
                <div className="h-full w-1 bg-gray-400/25"></div>
                <div className="h-full w-full flex gap-2">
                    <div className="h-full flex items-center justify-center bg-red-200 aspect-square rounded-full"><BanknoteArrowUp className="text-red-500"/></div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Total Pengeluaran</span>
                        <span className="font-semibold text-lg">Rp. 5.000.000</span>
                    </div>
                </div>
            </div>
            <ChartAreaGradient />
        </div>
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Riwayat Transaksi</h2>
            <div className="flex justify-between items-center p-4 h-20 bg-white rounded-lg">
                <div className="h-full flex gap-3">
                    <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500"/></div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Penjualan Harian</span>
                        <span className="text-sm text-gray-400">18 November 2025</span>
                    </div>
                </div>
                <span className="text-green-500">+ Rp. 200.000</span>
            </div>
        </div>
        <div className="w-15 h-15 rounded-full flex justify-center items-center bg-black text-white absolute right-8 bottom-8" onClick={() => setShowNewTransaction(!showNewTransaction)}><Plus className={showNewTransaction ? "rotate-45" : ""} /></div>
        {showNewTransaction && <div className="absolute right-8 bottom-26 flex flex-col items-end gap-2">
            <div className="px-4 py-3 bg-black w-fit text-white rounded-lg flex gap-2 items-center">
                <BanknoteArrowDown />
                <span>Pemasukan</span>
            </div>
            <div className="px-4 py-3 bg-black w-fit text-white rounded-lg flex gap-2 items-center">
                <BanknoteArrowUp />
                <span>Pengeluaran</span>
            </div>
        </div>}
    </div>
}
