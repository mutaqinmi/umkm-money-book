"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.email(),
    nama: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords tidak cocok",
    path: ["confirmPassword"],
});

export default function Page() {
    const route = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            nama: "",
            password: "",
            confirmPassword: "",
        }
    })

    const userSignup = async (email: string, name: string, password: string) => {
        await axios.post("/api/auth/signup", {
            email,
            name,
            password
        }, {
            withCredentials: true,
        })
        .then(response => {
            if(response.status === 201){
                toast.success(`Halo, selamat datang di UMKM Money Book, ${response.data.user.name}!`);
                route.push("/");
            }
        })
        .catch((error: AxiosError) => {
            console.error("There was an error!", error.message);
        })
    }

    const onSubmit = (data: z.infer<typeof formSchema>) => userSignup(data.email, data.nama, data.password); 

    return <div className="m-4 mt-12">
        <div>
            <h1 className="text-2xl font-semibold">Daftar</h1>
            <span className="text-sm text-gray-400">Buat akun baru Anda.</span>
        </div>
        <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input {...field} id="email" type="email" autoComplete="off" placeholder="johndoe@domain.com" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="nama"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="nama">Nama</FieldLabel>
                                <Input {...field} id="nama" type="text" autoComplete="off" placeholder="John Doe" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                                <div className="relative">
                                    <Input {...field} id="password" type={showPassword ? "text" : "password"} autoComplete="off" placeholder="••••••••" />
                                    {showPassword ? <Eye className="absolute top-1/2 right-4 -translate-y-1/2" size={18} onClick={() => setShowPassword(!showPassword)} /> : <EyeOff className="absolute top-1/2 right-4 -translate-y-1/2" size={18} onClick={() => setShowPassword(!showPassword)} />}
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmPassword">Konfirmasi Kata Sandi</FieldLabel>
                                <div className="relative">
                                    <Input {...field} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="off" placeholder="••••••••" />
                                    {showConfirmPassword ? <Eye className="absolute top-1/2 right-4 -translate-y-1/2" size={18} onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <EyeOff className="absolute top-1/2 right-4 -translate-y-1/2" size={18} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </FieldSet>
            <Button type="submit" className="mt-12 w-full">Daftar</Button>
            <div className="w-full mt-2"><span className="text-center block text-sm text-gray-400">atau</span></div>
            <Button variant={"outline"} type="button" className="mt-2 w-full" onClick={() => route.push("/auth/signin")}>Sudah Punya Akun? Masuk</Button>
        </form>
    </div>
}