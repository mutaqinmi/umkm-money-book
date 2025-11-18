import { BanknoteArrowDown, Edit, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

export function TransactionItem() {
    return <Dialog>
        <DialogTrigger asChild>
            <div className="flex justify-between items-center p-4 h-20 bg-white rounded-lg my-2">
                <div className="h-full flex gap-3">
                    <div className="h-full flex items-center justify-center bg-green-200 aspect-square rounded-full"><BanknoteArrowDown className="text-green-500" /></div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Penjualan Harian</span>
                        <span className="text-sm text-gray-400">18 November 2025</span>
                    </div>
                </div>
                <span className="text-green-500 text-sm">+ Rp.200.000</span>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="text-start">
                <DialogTitle>Detail Transaksi</DialogTitle>
                <DialogDescription>ID: #TRX20251118</DialogDescription>
            </DialogHeader>
            <div className="w-full border-t border-t-gray-400 border-dashed"></div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Tanggal Transaksi</span>
                    <span className="font-semibold">18 November 2025</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Jenis Transaksi</span>
                    <Badge variant={"secondary"} className="bg-green-200 text-green-600">Pemasukan</Badge>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Nama Transaksi</span>
                    <span className="font-semibold">Penjualan Harian</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Total Transaksi</span>
                    <span className="font-semibold">Rp.200.000</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Catatan</span>
                    <span className="font-semibold">-</span>
                </div>
            </div>
            <DialogFooter>
                <div className="flex gap-2 justify-end items-center">
                    <Button variant={"outline"} className="w-fit text-red-500">
                        <Trash />
                        <span>Hapus</span>
                    </Button>
                    <Button className="w-fit">
                        <Edit />
                        <span>Edit</span>
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}