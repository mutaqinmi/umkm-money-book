"use client";
import ChartAreaGradient from "@/components/chart";
import Navbar from "@/components/navbar/navbar";
import { TransactionItem } from "@/components/transaction-item/transaction-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { transactions } from "@/src/db/schema";
import axios from "axios";
import { BanknoteArrowDown, BanknoteArrowUp, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface chartData {
    totalTransactions: [
        {
            date: string;
            transactionType: string;
            total: number;
        }
    ],
    chart: [
        {
            date: string;
            income: number;
            expense: number;
        }
    ]
}

export default function Page() {
    const route = useRouter();
    const [showNewTransaction, setShowNewTransaction] = useState(false);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [transactionHistoryList, setTransactionHistoryList] = useState<transactions[]>([]);
    const [chartData, setChartData] = useState<chartData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userInfo, transactionHistory, chartData] = await Promise.all([
                    axios.get("/api/user", {
                        withCredentials: true,
                    }),
                    axios.get("/api/transactions", {
                        withCredentials: true,
                    }),
                    axios.get("/api/transactions/charts", {
                        withCredentials: true,
                    })
                ])

                if (userInfo.status === 200) {
                    setBalance(userInfo.data.user.balance);
                }

                if (transactionHistory.status === 200) {
                    setTransactionHistoryList(transactionHistory.data.data);
                }

                if (chartData.status === 200) {
                    setChartData(chartData.data.data);
                }
            } catch (error) {
                toast.error("Terjadi kesalahan, silahkan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return <Navbar title="Dashboard">
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
            <span className="text-gray-400">Total Saldo</span>
            {
                loading
                    ?
                    <Skeleton className="h-6 w-24" />
                    :
                    <span className="font-semibold">Rp.{Intl.NumberFormat('id-ID').format(balance)}</span>
            }
        </div>
        <div className="mt-6">
            <h2 className="text-lg font-semibold">Ringkasan</h2>
            <span className="text-sm text-gray-400 mb-2 inline-block">Menampilkan ringkasan keuangan sebulan terakhir.</span>
            {
                loading
                    ?
                        <Skeleton className="h-20 w-full bg-gray-200 mb-2" />
                    :
                        <div className="bg-white h-18 flex justify-between items-center p-4 rounded-lg mb-2 gap-4">
                            <div className="h-full w-full flex gap-2">
                                <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500" /></div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs">Total Pemasukan</span>
                                    <span className="font-semibold">Rp.{Intl.NumberFormat('id-ID').format(chartData?.totalTransactions.find(t => t.transactionType === "pemasukan")?.total || 0)}</span>
                                </div>
                            </div>
                            <div className="h-full w-1 bg-gray-400/50"></div>
                            <div className="h-full w-full flex gap-2">
                                <div className="h-full flex items-center justify-center bg-red-200 aspect-square rounded-full"><BanknoteArrowUp className="text-red-500" /></div>
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-xs">Total Pengeluaran</span>
                                    <span className="font-semibold">Rp.{Intl.NumberFormat('id-ID').format(chartData?.totalTransactions.find(t => t.transactionType === "pengeluaran")?.total || 0)}</span>
                                </div>
                            </div>
                        </div>
            }
            {
                loading
                    ?
                        <Skeleton className="h-48 w-full bg-gray-200" />
                    :
                        chartData && <ChartAreaGradient chartData={chartData.chart} />
            }
        </div>
        <div className="mt-6">
            <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
            {transactionHistoryList.length ? <span className="text-sm text-gray-400 mb-2">Menampilkan {transactionHistoryList.length} riwayat transaksi terakhir.</span> : null}
            {
                loading
                    ?
                    <div className="mt-2 flex flex-col gap-2">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <Skeleton key={index} className="h-24 w-full bg-gray-200" />
                        ))}
                    </div>
                    :
                    transactionHistoryList.length
                        ?
                        transactionHistoryList.map((transaction) => (
                            <TransactionItem key={transaction.id} transaction={transaction} />
                        ))
                        :
                        <span className="text-gray-400 text-center block my-4">Belum ada riwayat transaksi</span>
            }
        </div>
        <div className="w-15 h-15 rounded-full flex justify-center items-center bg-black text-white absolute right-4 bottom-0" onClick={() => setShowNewTransaction(!showNewTransaction)}><Plus className={cn("transition-all duration-300 ease-in-out", showNewTransaction ? "rotate-45" : "")} /></div>
        {showNewTransaction && <div className="absolute right-4 bottom-18 flex flex-col items-end gap-2">
            <Button size={"lg"} onClick={() => route.push("/pemasukan/tambah")}>
                <BanknoteArrowDown />
                <span>Pemasukan</span>
            </Button>
            <Button size={"lg"} onClick={() => route.push("/pengeluaran/tambah")}>
                <BanknoteArrowUp />
                <span>Pengeluaran</span>
            </Button>
        </div>}
    </Navbar>
}
