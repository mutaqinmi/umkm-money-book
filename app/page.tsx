"use client";
import ChartAreaGradient from "@/components/chart";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BanknoteArrowDown, BanknoteArrowUp, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [ showNewTransaction, setShowNewTransaction ] = useState(false);

    return <Navbar>
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
            <span className="text-gray-400">Total Saldo</span>
            <span className="font-semibold">Rp.12.000.000</span>
        </div>
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-400">Ringkasan</h2>
            <div className="bg-white h-18 flex justify-between items-center p-4 rounded-lg mb-2 gap-4">
                <div className="h-full w-full flex gap-2">
                    <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500"/></div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Total Pemasukan</span>
                        <span className="font-semibold">Rp.5.000.000</span>
                    </div>
                </div>
                <div className="h-full w-1 bg-gray-400/50"></div>
                <div className="h-full w-full flex gap-2">
                    <div className="h-full flex items-center justify-center bg-red-200 aspect-square rounded-full"><BanknoteArrowUp className="text-red-500"/></div>
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs">Total Pengeluaran</span>
                        <span className="font-semibold">Rp.5.000.000</span>
                    </div>
                </div>
            </div>
            <ChartAreaGradient />
        </div>
        <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-400">Riwayat Transaksi</h2>
            <div className="flex justify-between items-center p-4 h-20 bg-white rounded-lg">
                <div className="h-full flex gap-3">
                    <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500"/></div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Penjualan Harian</span>
                        <span className="text-sm text-gray-400">18 November 2025</span>
                    </div>
                </div>
                <span className="text-green-500 text-sm">+ Rp.200.000</span>
            </div>
        </div>
        <div className="w-15 h-15 rounded-full flex justify-center items-center bg-black text-white absolute right-4 bottom-0" onClick={() => setShowNewTransaction(!showNewTransaction)}><Plus className={cn("transition-all duration-300 ease-in-out", showNewTransaction ? "rotate-45" : "")} /></div>
        {showNewTransaction && <div className="absolute right-4 bottom-18 flex flex-col items-end gap-2">
            <Button size={"lg"}>
                <BanknoteArrowDown />
                <span>Pemasukan</span>
            </Button>
            <Button size={"lg"}>
                <BanknoteArrowUp />
                <span>Pengeluaran</span>
            </Button>
        </div>}
    </Navbar>
}
