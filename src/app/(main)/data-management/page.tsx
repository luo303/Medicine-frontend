export default function DataManagementPage() {
    const features = [
        {
            icon: (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                </svg>
            ),
            title: '数据导入',
            description: '支持批量导入药品、企业、供应商等多维度数据'
        },
        {
            icon: (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
            ),
            title: '数据审核',
            description: '智能校验数据完整性与合规性，自动标记异常记录'
        },
        {
            icon: (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' />
                </svg>
            ),
            title: '分类管理',
            description: '灵活的标签体系与分类规则，支持多级目录结构'
        },
    ];

    return (
        <div className='flex h-full items-center justify-center p-6 overflow-hidden relative' style={{ background: 'var(--report-surface)' }}>
            <div className='absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-teal-400/5 blur-[100px]' />
            <div className='absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-cyan-400/5 blur-[80px]' />

            <div className='relative z-10 max-w-lg w-full text-center'>
                <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 mb-6 ring-1 ring-slate-200/60 dark:ring-slate-700/40 shadow-lg shadow-slate-200/30 dark:shadow-black/20'>
                    <div className='relative'>
                        <svg className='w-10 h-10 text-teal-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.3} d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' />
                        </svg>
                        <div className='absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-slate-800 animate-pulse' />
                    </div>
                </div>

                <h1 className='text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2'>数据管理中心</h1>
                <p className='text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed'>
                    集中管理所有医疗数据的导入、审核、分类与维护
                </p>

                <div className='grid grid-cols-3 gap-3 mb-8'>
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className='group relative p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:shadow-teal-500/5 hover:-translate-y-0.5'
                        >
                            <div className='inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20 text-teal-600 dark:text-teal-400 mb-3 group-hover:shadow-sm transition-all duration-300 group-hover:scale-105'>
                                {feature.icon}
                            </div>
                            <h3 className='text-xs font-bold text-slate-700 dark:text-slate-200 mb-1'>{feature.title}</h3>
                            <p className='text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2'>{feature.description}</p>
                            
                            <div className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                        </div>
                    ))}
                </div>

                <div className='inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30'>
                    <div className='relative flex-shrink-0'>
                        <span className='flex h-2 w-2'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-2 w-2 bg-amber-500'></span>
                        </span>
                    </div>
                    <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>功能开发中，敬请期待</span>
                </div>
            </div>
        </div>
    );
}
