"use client";
import Navbar from "@/components/navbar/navbar";
import { TransactionItem } from "@/components/transaction-item/transaction-item";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { transactions } from "@/src/db/schema";
import axios from "axios";
import { Home, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const route = useRouter();
    const [ loading, setLoading ] = useState(true);
    const [ transactionList, setTransactionList ] = useState<transactions[]>([]);
    const [ dataLimit, setDataLimit ] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/transactions?transaction_type=pemasukan&limit=${dataLimit}`, {
                    withCredentials: true,
                })

                if(response.status === 200){
                    setTransactionList(response.data.data);
                }
            } catch (error) {
                console.log("There was an error!", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [dataLimit]);

    return <Navbar title="Pemasukan">
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/"><Home size={16} /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/pemasukan">Pemasukan</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-xl font-semibold">Daftar Transaksi <span className="text-gray-400">({transactionList.length})</span></h2>
        <div>
            {
                loading
                    ?
                        <div className="mt-2 flex flex-col gap-2">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <Skeleton key={index} className="h-24 w-full bg-gray-200" />
                            ))}
                        </div>
                    :
                        transactionList.length
                            ?
                                <div>
                                    {transactionList.map((transaction) => (
                                        <TransactionItem key={transaction.id} transaction={transaction} />
                                    ))}
                                    {transactionList.length >= dataLimit && <Button variant={"outline"} className="w-full" onClick={() => setDataLimit((prev) => prev + 10)}>Tampilkan Lebih Banyak</Button>}
                                </div>
                            :
                                <span className="text-gray-400 text-center block my-4">Belum ada riwayat transaksi</span>
            }
        </div>
        <div className="w-15 h-15 rounded-full flex justify-center items-center bg-black text-white absolute right-4 bottom-0" onClick={() => route.push("/pemasukan/tambah")}><Plus /></div>
    </Navbar>
}
