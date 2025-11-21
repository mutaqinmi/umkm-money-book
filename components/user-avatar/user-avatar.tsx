import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserAvatar({ children, className }: { children?: React.ReactNode, className?: string }) {
    const [ profilePicture, setProfilePicture ] = useState<string | undefined>(undefined);
    const [ nameFallback, setNameFallback ] = useState<string>("");

    const userInfo = async () => {
        await axios.get("/api/user", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if(response.status === 200){
                setProfilePicture(response.data.user.profileImage || null);
                setNameFallback((response.data.user.name as string).split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase());
            }
        })
        .catch(error => {
            console.log("There was an error!", error.message);
        });
    }

    useEffect(() => {
        userInfo();
    }, []);

    return <Avatar className={className}>
        <AvatarImage src={profilePicture} />
        <AvatarFallback>{nameFallback}</AvatarFallback>
        {children}
    </Avatar>
}