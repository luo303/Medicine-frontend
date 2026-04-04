'use client';

import { memo, useState, useEffect } from 'react';
import { List, type RowComponentProps } from 'react-window';

export interface ColumnDef<T = any> {
    key: string;
    label: string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
}

interface VirtualTableProps<T = any> {
    columns: ColumnDef<T>[];
    data: T[];
    rowKey: (item: T) => string | number;
    onRowClick?: (item: T) => void;
    className?: string;
    thClass?: string;
    tdClass?: string;
    trClass?: string;
    rowHeight?: number;
}

const ROW_HEIGHT = 52;

function VirtualRow<T>({
    index,
    style,
    columns,
    data,
    onRowClick,
    tdClass,
    trClass,
    ariaAttributes,
}: RowComponentProps<{
    columns: ColumnDef<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    tdClass: string;
    trClass: string;
}> & { ariaAttributes?: any }) {
    const item = data[index];
    if (!item) return null;

    return (
        <div style={{ ...style, position: 'absolute' }} {...ariaAttributes}>
            <div
                role="row"
                className={`${trClass} flex flex-row items-center gap-2 px-2 w-full h-full`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
                {columns.map((col) => {
                    const value = (item as Record<string, any>)[col.key];
                    return (
                        <div key={col.key} role="cell" className={`${tdClass} flex-1 min-w-0 flex items-center`}>
                            <div className="w-full truncate">
                                {col.render ? col.render(value, item, index) : value ?? ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MemoVirtualRow = memo(VirtualRow) as typeof VirtualRow;

function VirtualTableInner<T extends Record<string, any>>({
    columns,
    data,
    rowKey,
    onRowClick,
    className,
    thClass,
    tdClass,
    trClass,
    rowHeight = ROW_HEIGHT,
}: VirtualTableProps<T>) {
    const [mounted, setMounted] = useState(false);
    const [listHeight, setListHeight] = useState(400);

    useEffect(() => {
        setMounted(true);
        setListHeight(Math.max(window.innerHeight - 320, 300));
    }, []);

    if (data.length === 0) return null;

    const defaultThClass =
        thClass ||
        'px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/95 dark:bg-slate-800/95 whitespace-nowrap border-slate-200 dark:border-slate-700/60 sticky top-0 z-20 backdrop-blur-sm';
    const defaultTdClass =
        tdClass ||
        'px-4 py-3 text-[13px] text-slate-800 dark:text-slate-200 whitespace-nowrap';
    const defaultTrClass =
        trClass ||
        'border-b border-slate-100/60 dark:border-slate-800/40 transition-all duration-150 hover:bg-teal-50/80 dark:hover:bg-teal-950/25 report-row-enter';

    // 确保 rowHeight 是 number 类型
    const numericRowHeight = typeof rowHeight === 'number' ? rowHeight : ROW_HEIGHT;

    return (
        <div className={`w-full flex flex-col ${className || ''}`}>
            {/* 表头 */}
            <div className={`flex flex-row bg-slate-50/95 dark:bg-slate-800/95 overflow-y-scroll scrollbar-invisible`}>
                <div className='grow flex flex-row items-center gap-2 px-2 py-1'>
                    {columns.map((col) => (
                        <div key={col.key} className={`${defaultThClass} flex-1 min-w-0 truncate`}>
                            {col.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* 数据体：虚拟列表 */}
            {mounted && (
                <div className='overflow-hidden' style={{ height: listHeight }}>
                    <List
                        className="scrollbar-custom"
                        style={{ overflowY: 'scroll' }}
                        rowComponent={MemoVirtualRow}
                        rowCount={data.length}
                        rowHeight={numericRowHeight}
                        rowProps={{
                            columns,
                            data,
                            onRowClick,
                            tdClass: defaultTdClass,
                            trClass: defaultTrClass,
                        }}
                        overscanCount={8}
                    />
                </div>
            )}
        </div>
    );
}

export const VirtualTable = memo(VirtualTableInner) as typeof VirtualTableInner;
