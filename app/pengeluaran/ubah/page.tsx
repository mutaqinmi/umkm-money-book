"use client";
import Navbar from "@/components/navbar/navbar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Save, Scaling, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

const formSchema = z.object({
    receiptImage: z.instanceof(File).optional()
        .refine((file) => [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ].includes(file?.type || ""), "Hanya menerima file gambar (jpeg, jpg, png, webp)")
        .optional(),
    name: z.string().min(1, "Masukkan nama transaksi"),
    price: z.string().min(1, "Masukkan nominal pemasukan"),
    description: z.string().optional(),
})

function EditTransactionForm() {
    const transactionID = useSearchParams().get("transaction_id");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: "",
            description: "",
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/transactions?transaction_id=${transactionID}`, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    form.reset({
                        name: response.data.data[0].name,
                        price: response.data.data[0].price.toString(),
                        description: response.data.data[0].description || "",
                    });

                    if (response.data.data[0].receiptImage) {
                        setImagePreview(`${"/uploads/receipts/"}${response.data.data[0].receiptImage}` || null);
                    }
                }
            } catch (error) {
                console.error("Error fetching transaction:", error);
            }
        }

        if (transactionID) {
            fetchData();
        }
    }, [transactionID, form]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("transactionID", transactionID || "");
        formData.append("name", data.name);
        formData.append("price", data.price.toString());
        formData.append("description", data.description || "");

        await axios.put("/api/transactions", formData, {
            withCredentials: true,
        })
            .then(response => {
                if (response.status === 200) {
                    toast.success("Berhasil mengubah pengeluaran");
                    history.back();
                }
            })
            .catch((error: AxiosError) => {
                console.error("Error submitting form:", error.message);
            });
    }

    return <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
            <h2 className="font-semibold text-xl">Ubah Data Pengeluaran</h2>
        </div>
        <FieldSet className="mt-4">
            <FieldGroup>
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">Nama Transaksi</FieldLabel>
                            <Input {...field} id="name" type="text" autoComplete="off" placeholder="Belanja Bulanan" />
                            {fieldState.invalid && (
                                <span className="text-sm text-red-500 mt-1">{fieldState.error?.message}</span>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="price">Jumlah Transaksi</FieldLabel>
                            <div className="relative">
                                <Input {...field} id="price" type="number" autoComplete="off" placeholder="5.000.000" className="pl-9" />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 font-semibold">Rp.</span>
                            </div>
                            {fieldState.invalid && (
                                <span className="text-sm text-red-500 mt-1">{fieldState.error?.message}</span>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">Catatan<span className="text-gray-400">(opsional)</span></FieldLabel>
                            <Textarea {...field} id="description" placeholder="Catatan" />
                            {fieldState.invalid && (
                                <span className="text-sm text-red-500 mt-1">{fieldState.error?.message}</span>
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>
            {imagePreview && (
                <div className="w-full h-30 relative">
                    <Image unoptimized src={imagePreview} alt="Preview Gambar" width={200} height={200} className="w-full h-full rounded-lg object-cover" />
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
                                    <Image unoptimized src={imagePreview} alt="Preview Gambar" width={200} height={200} className="w-full h-full rounded-lg object-cover" />
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
            <div className="w-full flex gap-2 justify-end items-center">
                <Button type="button" variant={"outline"} className="w-fit mt-4 flex gap-1 items-center" onClick={() => history.back()}>
                    <X />
                    <span>Batal</span>
                </Button>
                <Button type="submit" className="w-fit mt-4 flex gap-1 items-center">
                    <Save />
                    <span>Simpan</span>
                </Button>
            </div>
        </FieldSet>
    </form>
}

export default function Page() {
    return <Navbar title="Pengeluaran">
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/"><Home size={16} /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/pengeluaran">Pengeluaran</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/pengeluaran/ubah">Ubah</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <Suspense>
            <EditTransactionForm />
        </Suspense>
    </Navbar>
}