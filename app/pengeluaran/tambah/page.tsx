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
import { Focus, Home, Save, Scaling, Trash, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
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

export default function Page() {
    const route = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [ imageScanLoading, setImageScanLoading ] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: "",
            description: "",
        }
    });

    const compressImage = (file: File, maxWidth: number = 800): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 with quality compression
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const ocrImage = async (file: string) => {
        try {
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(file);
            await worker.terminate();

            const totalRegex = /TOTAL[:\s]*[=]?\s*(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/i;
            const match = text.match(totalRegex);
            
            if (match && match[1]) {
                const totalAmount = match[1].replace(/[.,]/g, ''); // Remove dots and commas
                
                form.setValue('price', totalAmount);
            }
        } catch(e) {
            console.log(e);
            toast.error("Gagal memindai gambar");
        }
    }

    const handleImagePreview = async (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            onChange(file);

            const reader = new FileReader();
            reader.onloadend = async () => {
                setImageScanLoading(true);
                const compressedDataUrl = await compressImage(file);
                await ocrImage(compressedDataUrl);
                setImagePreview(reader.result as string);
                setImageScanLoading(false);
            }
            reader.readAsDataURL(file);
        } else {
            onChange(undefined);
            setImagePreview(null);
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("transactionType", "pengeluaran");
        formData.append("name", data.name);
        formData.append("price", data.price.toString());
        formData.append("description", data.description || "");
        if (data.receiptImage) {
            formData.append("receiptImage", data.receiptImage);
        }

        await axios.post("/api/transactions", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then(response => {
            if(response.status === 201){
                toast.success("Berhasil menambahkan pengeluaran");
                route.push("/pengeluaran");
            }
        })
        .catch((error: AxiosError) => {
            console.error("Error submitting form:", error.message);
        });
    }

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
                    <BreadcrumbLink href="/pengeluaran/tambah">Tambah</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl">Tambah Data Pengeluaran</h2>
                <FieldSet>
                    <Controller
                        name="receiptImage"
                        control={form.control}
                        render={({ field: { value, onChange, ...field }, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="receiptImage">
                                    <div className="bg-black text-white p-3 rounded-lg">
                                        <Focus size={16} />
                                    </div>
                                </FieldLabel>
                                <Input {...field} id="receiptImage" type="file" accept="image/*" className="hidden" onChange={(e) => handleImagePreview(e.target.files?.[0], onChange)} />
                            </Field>
                        )}
                    />
                </FieldSet>
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
                                <Input {...field} id="price" type="number" autoComplete="off" placeholder="5000000" />
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
                        <Image src={imagePreview} alt="Preview Gambar" width={200} height={200} className="w-full h-full rounded-lg object-cover" />
                        <div className="w-full h-full bg-black/50 absolute top-0 left-0 z-10 rounded-lg flex items-center justify-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button type="button" variant={"ghost"} size={"icon-lg"} className="text-white" onClick={() => {}}>
                                        <Scaling />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Preview Gambar</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                        <Image src={imagePreview} alt="Preview Gambar" width={200} height={200} className="w-full h-full rounded-lg object-cover" />
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                            <Button type="button" variant={"ghost"} size={"icon-lg"} className="text-white" onClick={() => {
                                setImagePreview(null);
                                form.setValue("receiptImage", undefined);
                            }}>
                                <Trash />
                            </Button>
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
        {imageScanLoading && <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-white gap-2">
            <Spinner />
            <span>Memproses gambar ...</span>
        </div>}
    </Navbar>
}