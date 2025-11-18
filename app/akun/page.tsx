"use client";
import Navbar from "@/components/navbar/navbar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Edit, Eye, EyeOff, Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords tidak cocok",
    path: ["confirmPassword"],
});

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }

    return <Navbar title="Akun">
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/"><Home size={16} /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/akun">Akun</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <form>
            <label htmlFor="profilePicture">
                <Avatar className="w-30 h-30 m-auto relative">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                    <div className="w-full h-full bg-black/50 absolute top-0 left-0 z-10 rounded-lg flex items-center justify-center gap-2 text-white">
                        <Edit />
                    </div>
                </Avatar>
            </label>
            <input type="file" id="profilePicture" className="hidden"/>
        </form>
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-1">
                <span className="text-gray-400">Nama</span>
                <span className="font-semibold">Muhammad Ilham Mutaqin</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-gray-400">Email</span>
                <span className="font-semibold">mutaqinmi2586@gmail.com</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-gray-400 mb-2">Kata Sandi</span>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldSet>
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Kata Sandi Baru</FieldLabel>
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
                                        <FieldLabel htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</FieldLabel>
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
                    <Button type="submit" className="mt-4 w-full">Ubah Kata Sandi</Button>
                </form>
            </div>
        </div>
    </Navbar>
}