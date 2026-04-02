'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavStore } from '@/store/nav-store';

export default function SideNav() {
    const pathname = usePathname();
    const { collapsed, toggle } = useNavStore();
    
    const navItems = [
        { href: '/home', label: 'AI 助手', icon: '💬' },
        { href: '/reports', label: '数据报表', icon: '📊' },
        { href: '/data-management', label: '数据管理', icon: '🗄️' },
    ];

    return (
        <div className={cn(
            'flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
            'transition-[width] duration-300 ease-in-out',
            collapsed ? 'w-16' : 'w-64'
        )}>
            {/* Logo 区域 */}
            <div className={cn(
                'p-4 border-b border-gray-200 dark:border-gray-800',
                'transition-[overflow] duration-300 ease-in-out',
                collapsed ? 'overflow-hidden' : ''
            )}>
                <div className='flex items-center justify-between'>
                    <div className={cn(
                        'transition-all duration-300 ease-in-out overflow-hidden',
                        collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                    )}>
                        <h1 className='text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap'>
                            智能医疗系统
                        </h1>
                    </div>
                    <Button
                        onClick={toggle}
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-8 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shrink-0",
                            collapsed ? 'px-2 mx-auto' : 'px-2'
                        )}
                        title={collapsed ? '展开导航栏' : '收起导航栏'}
                    >
                        {collapsed ? (
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 5l7 7-7 7M5 5l7 7-7 7' />
                            </svg>
                        ) : (
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 19l-7-7 7-7m8 14l-7-7 7-7' />
                            </svg>
                        )}
                    </Button>
                </div>
            </div>
            
            {/* 导航菜单 */}
            <nav className='flex-1 p-2 space-y-2'>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium',
                                'transition-colors duration-200',
                                isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            <span className='text-xl shrink-0 w-8 flex items-center justify-center'>
                                {item.icon}
                            </span>
                            <span className={cn(
                                'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-3'
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            
            {/* 底部占位 */}
            <div className={cn(
                'p-4 border-t border-gray-200 dark:border-gray-800',
                'transition-[overflow,height,padding] duration-300 ease-in-out',
                collapsed ? 'overflow-hidden h-0 p-0 border-none' : 'overflow-visible'
            )}>
                {/* 可以放用户信息或设置 */}
            </div>
        </div>
    );
}
