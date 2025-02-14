import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        
        fetchUser();
    }, []);

    return { user };
}