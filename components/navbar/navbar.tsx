import { ArrowUpRight, LogOut, MenuIcon, UserIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface NavbarProps {
    children: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
    const { isOpen, toggleNavbar } = useNavbar();

    return <div className="h-full fixed top-0">
        <div className="w-full p-4 bg-white flex justify-between items-center">
            <div className="flex gap-4">
                <MenuIcon onClick={() => toggleNavbar()} />
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex justify-between">
                        <span>Profil</span>
                        <UserIcon />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex text-red-500 justify-between">
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
            <span className="mt-8 inline-block text-sm text-gray-400">Keuangan</span>
            <ul className="mt-2">
                <li>
                    <Link className="py-3 flex items-center justify-between" href={"/pemasukan"}>
                        <span>Pemasukan</span>
                        <ArrowUpRight className="text-gray-400"/>
                    </Link>
                </li>
                <li>
                    <Link className="py-3 flex items-center justify-between" href={"/pengeluaran"}>
                        <span>Pengeluaran</span>
                        <ArrowUpRight className="text-gray-400"/>
                    </Link>
                </li>
            </ul>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
}