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
        { href: '/home', label: 'AI 助手', icon: (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
            </svg>
        )},
        { href: '/reports', label: '数据报表', icon: (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
            </svg>
        )},
        { href: '/data-management', label: '数据管理', icon: (
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' />
            </svg>
        )},
    ];

    return (
        <div className={cn(
            'flex flex-col h-full relative',
            'transition-[width] duration-300 ease-in-out',
            collapsed ? 'w-[68px]' : 'w-[240px]'
        )}>
            {/* 背景层 */}
            <div className='absolute inset-0 bg-slate-50/95 dark:bg-slate-900/98 backdrop-blur-xl' />
            
            {/* 右侧装饰线 */}
            <div className='absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-teal-200/30 dark:via-teal-800/20 to-transparent' />

            {/* Logo 区域 */}
            <div className={cn(
                'relative p-4 pb-3 border-b border-slate-200/60 dark:border-slate-700/40',
                'transition-all duration-300 ease-in-out'
            )}>
                <div className='flex items-center justify-between'>
                    <div className={cn(
                        'flex items-center gap-2.5 overflow-hidden transition-all duration-300',
                        collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                    )}>
                        <div className='relative shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-500/15'>
                            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                            </svg>
                            <div className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-sm' />
                        </div>
                        <div className='overflow-hidden'>
                            <h1 className='text-sm font-bold text-slate-800 dark:text-white tracking-tight leading-none'>智能医疗系统</h1>
                            <p className='text-[10px] text-slate-400 mt-0.5 leading-none'>Medical AI Platform</p>
                        </div>
                    </div>

                    {/* 折叠按钮 */}
                    <Button
                        onClick={toggle}
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shrink-0",
                            collapsed ? 'mx-auto' : ''
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
            <nav className='relative flex-1 p-2.5 space-y-1 overflow-y-auto'>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                                'transition-all duration-200 cursor-pointer',
                                isActive
                                    ? 'text-teal-700 dark:text-teal-300 bg-gradient-to-r from-teal-50 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/15 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                            )}
                        >
                            {/* 活跃指示条 */}
                            {isActive && (
                                <span className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-teal-400 to-cyan-400 shadow-sm' />
                            )}

                            {/* 图标容器 */}
                            <span className={cn(
                                'shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200',
                                isActive 
                                    ? 'bg-white dark:bg-slate-800 shadow-sm' 
                                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50'
                            )}>
                                {item.icon}
                            </span>

                            {/* 标签文字 */}
                            <span className={cn(
                                'overflow-hidden whitespace-nowrap transition-all duration-300',
                                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            )}>
                                {item.label}
                            </span>

                            {/* 活跃状态光晕 */}
                            {isActive && !collapsed && (
                                <span className='absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse' />
                            )}
                        </Link>
                    );
                })}
            </nav>
            
            {/* 底部区域 */}
            <div className={cn(
                'relative p-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/40',
                'transition-all duration-300 ease-in-out',
                collapsed ? 'overflow-hidden opacity-0 h-0 p-0 border-none' : 'overflow-visible'
            )}>
                {!collapsed && (
                    <div className='px-2 py-2 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200/50 dark:border-slate-700/30'>
                        <div className='flex items-center gap-2.5'>
                            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                                A
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs font-semibold text-slate-700 dark:text-slate-200 truncate'>管理员</p>
                                <p className='text-[10px] text-slate-400 truncate'>admin@medical.ai</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
