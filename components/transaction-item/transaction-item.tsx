import { BanknoteArrowDown, BanknoteArrowUp, Edit, Scaling, Trash } from "lucide-react";
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
import { transactions } from "@/src/db/schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TransactionItem({ transaction }: { transaction: transactions }) {
    const route = useRouter();
    const deleteTransaction = async (transactionID: string) => {
        await axios.delete(`/api/transactions?transaction_id=${transactionID}`)
            .then(response => {
                if(response.status === 200) {
                    toast.success("Transaksi berhasil dihapus!");
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error("There was an error deleting the transaction!", error);
            });
    }

    return <Dialog>
        <DialogTrigger asChild>
            <div className="flex justify-between items-center p-4 h-20 bg-white rounded-lg my-2">
                <div className="h-full flex gap-3">
                    <div className={cn(
                        "h-full flex items-center justify-center aspect-square rounded-full",
                        transaction.transactionType === "pemasukan" ? "bg-green-200 text-green-500" : "",
                        transaction.transactionType === "pengeluaran" ? "bg-red-200 text-red-500" : ""
                    )}>{transaction.transactionType === "pemasukan" ? <BanknoteArrowDown /> : <BanknoteArrowUp />}</div>
                    <div className="flex flex-col">
                        <span className="font-semibold">{transaction.name}</span>
                        <span className="text-sm text-gray-400">{transaction.date}</span>
                    </div>
                </div>
                <span className={cn(
                    "text-sm",
                    transaction.transactionType === "pemasukan" ? "text-green-500" : "",
                    transaction.transactionType === "pengeluaran" ? "text-red-500" : ""
                )}>{transaction.transactionType === "pemasukan" ? "+" : "-"} Rp.{Intl.NumberFormat('id-ID').format(transaction.price)}</span>
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader className="text-start">
                <DialogTitle>Detail Transaksi</DialogTitle>
                <DialogDescription>ID: {transaction.id}</DialogDescription>
            </DialogHeader>
            <div className="w-full border-t border-t-gray-400 border-dashed"></div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Tanggal Transaksi</span>
                    <span className="font-semibold">{transaction.date}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Jenis Transaksi</span>
                    <Badge variant={"secondary"} className={cn(
                        transaction.transactionType === "pemasukan" ? "bg-green-100 text-green-800" : "",
                        transaction.transactionType === "pengeluaran" ? "bg-red-100 text-red-800" : ""
                    )}>{transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Nama Transaksi</span>
                    <span className="font-semibold">{transaction.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Total Transaksi</span>
                    <span className="font-semibold">Rp.{Intl.NumberFormat('id-ID').format(transaction.price)}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-gray-400">Catatan</span>
                    <span className="font-semibold">{transaction.description || "-"}</span>
                </div>
                {transaction.receiptImage && <div className="w-full h-30 relative">
                    <Image src={`/uploads/receipts/${transaction.receiptImage}`} alt="Preview Gambar" width={200} height={200} unoptimized className="w-full h-full rounded-lg object-cover" />
                    <div className="w-full h-full bg-black/50 absolute top-0 left-0 z-10 rounded-lg flex items-center justify-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant={"ghost"} size={"icon-lg"} className="text-white" onClick={() => { }}>
                                    <Scaling />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Preview Gambar</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    <Image src={`/uploads/receipts/${transaction.receiptImage}`} alt="Preview Gambar" width={200} height={200} unoptimized className="w-full h-full rounded-lg object-cover" />
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>}
            </div>
            <DialogFooter>
                <div className="flex gap-2 justify-between items-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant={"outline"} className="w-fit text-red-500">
                                <Trash />
                                <span>Hapus</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Transaksi yang dihapus akan hilang secara permanen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTransaction(transaction.id)}>Hapus</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button className="w-fit" onClick={() => route.push(`/${transaction.transactionType}/ubah?transaction_id=${transaction.id}`)}>
                        <Edit />
                        <span>Edit</span>
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}