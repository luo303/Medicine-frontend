'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatPanel from '@/components/chat-panel';
import KnowledgePanel from '@/components/knowledge-panel';
import SideNav from '@/components/side-nav';
import { getToken } from '@/app/api/auth/token';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className='flex h-screen bg-white dark:bg-black w-screen'>
            {/* 左侧导航栏 */}
            <SideNav />
            
            {/* 主要内容区域 */}
            <div className='flex-1 flex overflow-hidden'>
                {/* 左侧聊天区域 - 占据较大宽度 */}
                <div className='flex-1 flex flex-col overflow-hidden'>
                    <ChatPanel />
                </div>
                
                {/* 右侧知识库文件上传区域 - 固定宽度 */}
                <div className='w-96 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'>
                    <KnowledgePanel />
                </div>
            </div>
        </div>
    );
}
