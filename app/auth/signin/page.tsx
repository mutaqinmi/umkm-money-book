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

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
})

export default function Page() {
    const route = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);
    }

    return <div className="m-4 mt-12">
        <div>
            <h1 className="text-2xl font-semibold">Masuk</h1>
            <span className="text-sm text-gray-400">Masuk ke akun Anda.</span>
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
                </FieldGroup>
            </FieldSet>
            <Button type="submit" className="mt-12 w-full">Masuk</Button>
            <div className="w-full mt-2"><span className="text-center block text-sm text-gray-400">atau</span></div>
            <Button variant={"outline"} type="button" className="mt-2 w-full" onClick={() => route.push("/auth/signup")}>Belum Punya Akun? Daftar</Button>
        </form>
    </div>
}