'use client';
import SideNav from '@/components/side-nav';

export default function ReportsPage() {
    return (
        <div className='flex h-screen bg-white dark:bg-black w-screen'>
            {/* 左侧导航栏 */}
            <SideNav />
            
            {/* 主要内容区域 */}
            <div className='flex-1 flex items-center justify-center overflow-hidden'>
                <div className='text-center'>
                    <div className='text-6xl mb-4'>📊</div>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                        数据报表
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400'>
                        页面开发中...
                    </p>
                </div>
            </div>
        </div>
    );
}
