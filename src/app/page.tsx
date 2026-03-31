'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/app/api/auth/token';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (token) {
            router.push('/home');
        } else {
            router.push('/login');
        }
    }, [router]);
}
