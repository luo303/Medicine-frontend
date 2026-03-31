'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import ChatPanel from '@/components/chat-panel';
import KnowledgePanel from '@/components/knowledge-panel';
import { getToken } from '@/app/api/auth/token';

export default function HomePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className='flex h-screen bg-white dark:bg-black w-screen'>
            {/* 左侧聊天区域 */}
            <ChatPanel theme={theme} toggleTheme={toggleTheme} />
            
            {/* 右侧知识库文件上传区域 */}
            <KnowledgePanel />
        </div>
    );
}
