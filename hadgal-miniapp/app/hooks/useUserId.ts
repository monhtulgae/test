"use client"; 
import { useEffect, useState } from "react"; 
export function useUserId() { 
    const [userId, setUserId] = useState<string | null>(null); 
    useEffect(() => { 
        let existing = localStorage.getItem("userId"); 
        if (!existing) { 
            existing = "123"; 
            localStorage.setItem("userId", existing); 
        } 
        setUserId(existing); 
    }, []); 
    return userId; 
}