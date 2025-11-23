import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserAvatar({ children, className }: { children?: React.ReactNode, className?: string }) {
    const [ profilePicture, setProfilePicture ] = useState<string | undefined>(undefined);
    const [ nameFallback, setNameFallback ] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/user", {
                    withCredentials: true,
                })
                
                if(response.status === 200){
                    setProfilePicture(response.data.user.profileImage || null);
                    setNameFallback((response.data.user.name as string).split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchData();
    }, []);

    return <Avatar className={className}>
        <AvatarImage src={profilePicture} />
        <AvatarFallback>{nameFallback}</AvatarFallback>
        {children}
    </Avatar>
}