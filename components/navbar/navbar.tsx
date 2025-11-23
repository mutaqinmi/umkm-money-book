import { ArrowUpRight, LogOut, MenuIcon, UserIcon, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavbar } from "./useNavbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserAvatar from "../user-avatar/user-avatar";

interface NavbarProps {
    children: React.ReactNode;
    title: string;
}

export default function Navbar({ children, title }: NavbarProps) {
    const route = useRouter();
    const { isOpen, toggleNavbar } = useNavbar();

    const userSignout = async () => {
        await axios.get("/api/auth/signout", {
            withCredentials: true,
        })
        .then(response => {
            if(response.status === 200){
                route.push("/auth/signin");
            }
        })
        .catch(error => {
            console.log("There was an error!", error.message);
        });
    }

    return <div className="w-full h-full fixed top-0">
        <div className="w-full p-4 bg-white flex justify-between items-center">
            <div className="flex gap-4 items-center">
                <MenuIcon onClick={() => toggleNavbar()} />
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserAvatar />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex justify-between" onClick={() => route.push("/akun")}>
                        <span>Profil</span>
                        <UserIcon />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex text-red-500 justify-between" onClick={() => userSignout()}>
                        <span>Keluar</span>
                        <LogOut className="text-red-500" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className={cn(
            "h-full w-3/4 fixed top-0 left-0 z-50 bg-white transition-all duration-300 ease-in-out p-4",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Menu</span>
                <X onClick={() => toggleNavbar()} />
            </div>
            <span className="mt-8 inline-block text-sm text-gray-400">Beranda</span>
            <ul className="mt-2">
                <li>
                    <Link className="py-3 flex items-center justify-between" onClick={() => toggleNavbar()} href={"/"}>
                        <span>Dashboard</span>
                        <ArrowUpRight className="text-gray-400" />
                    </Link>
                </li>
            </ul>
            <span className="mt-6 inline-block text-sm text-gray-400">Keuangan</span>
            <ul className="mt-2">
                <li>
                    <Link className="py-3 flex items-center justify-between" onClick={() => toggleNavbar()} href={"/pemasukan"}>
                        <span>Pemasukan</span>
                        <ArrowUpRight className="text-gray-400" />
                    </Link>
                </li>
                <li>
                    <Link className="py-3 flex items-center justify-between" onClick={() => toggleNavbar()} href={"/pengeluaran"}>
                        <span>Pengeluaran</span>
                        <ArrowUpRight className="text-gray-400" />
                    </Link>
                </li>
            </ul>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-32">
            {children}
        </div>
    </div>
}