'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import ChatPanel from '@/components/chat-panel';
import KnowledgePanel from '@/components/knowledge-panel';

const checkLogin = async () => {
    const res = await fetch('/api/login');
    const data = await res.json();
    if (data.code === 1) {
        return true;
    } else {
        redirect('/');
    }
}

export default function HomePage() {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <div className='flex h-screen bg-white dark:bg-black w-screen'>
            {/* 左侧聊天区域 */}
            <ChatPanel theme={theme} toggleTheme={toggleTheme} />
            
            {/* 右侧知识库文件上传区域 */}
            <KnowledgePanel />
        </div>
    );
}
