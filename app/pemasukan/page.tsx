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
import { Home, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
    const route = useRouter();

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
        <h2 className="text-xl font-semibold text-gray-400">Daftar Transaksi</h2>
        <div>
            <TransactionItem />
        </div>
        <div className="w-15 h-15 rounded-full flex justify-center items-center bg-black text-white absolute right-4 bottom-0" onClick={() => route.push("/pemasukan/tambah")}><Plus /></div>
    </Navbar>
}