'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export default function SideNav() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    
    const navItems = [
        { href: '/home', label: 'AI 助手', icon: '💬' },
        { href: '/reports', label: '数据报表', icon: '📊' },
        { href: '/data-management', label: '数据管理', icon: '🗄️' },
    ];

    return (
        <div className='flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64'>
            {/* Logo 区域 */}
            <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-lg font-bold text-gray-900 dark:text-white'>
                            智能医疗系统
                        </h1>
                    </div>
                    <Button
                        onClick={toggleTheme}
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        title={theme === 'dark' ? '切换到亮色' : '切换到暗色'}
                    >
                        {theme === 'dark' ? (
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                            </svg>
                        ) : (
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                            </svg>
                        )}
                    </Button>
                </div>
            </div>
            
            {/* 导航菜单 */}
            <nav className='flex-1 p-4 space-y-2'>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <span className='text-xl'>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            
            {/* 底部占位 */}
            <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
                {/* 可以放用户信息或设置 */}
            </div>
        </div>
    );
}
