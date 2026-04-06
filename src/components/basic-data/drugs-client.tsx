'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { VirtualTable, type ColumnDef } from '@/components/virtual-table';
import { exportToExcel } from '@/lib/excel-export';
import type { Drug } from '@/types/basic-data';

interface DrugsClientProps {
    drugs: Drug[];
}

export default function DrugsClient({ drugs }: DrugsClientProps) {
    const [searchName, setSearchName] = useState('');
    const [searchId, setSearchId] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState('全部');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const filteredData = useMemo(() => {
        return drugs.filter(item => {
            const matchName = item.name.includes(searchName);
            const matchId = item.approval_no.includes(searchId);
            const matchPrescription = selectedPrescription === '全部' || 
                (selectedPrescription === '是' && item.is_prescription) || 
                (selectedPrescription === '否' && !item.is_prescription);
            return matchName && matchId && matchPrescription;
        });
    }, [drugs, searchName, searchId, selectedPrescription]);

    const handleExport = async () => {
        if (filteredData.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        setExporting(true);
        await exportToExcel({
            reportType: 'drug',
            reportLabel: '药品目录数据',
            rawData: filteredData,
        });
        setExporting(false);
    };

    const columns: ColumnDef<Drug>[] = useMemo(() => [
        {
            key: 'approval_no',
            label: '批准号',
            width: 120,
            render: (value) => <span className="font-mono text-sm">{value}</span>,
        },
        {
            key: 'name',
            label: '药品名称',
            render: (value) => <span className="font-medium">{value}</span>,
        },
        {
            key: 'scientific_name',
            label: '学名',
            render: (value) => <span className="text-slate-500">{value}</span>,
        },
        {
            key: 'model',
            label: '型号',
            width: 100,
            render: (value) => <span className="font-mono text-sm">{value}</span>,
        },
        {
            key: 'specification',
            label: '规格',
            width: 120,
        },
        {
            key: 'is_prescription',
            label: '处方药',
            width: 80,
            align: 'center',
            render: (value) => value ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    是
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    否
                </span>
            ),
        },
        {
            key: 'actions',
            label: '操作',
            width: 80,
            align: 'center',
            render: (_, item) => (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                    编辑
                </Button>
            ),
        },
    ], []);

    return (
        <div className="flex flex-col h-full p-6 space-y-4">
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">药品目录管理</h1>
                    <p className="text-sm text-slate-500">管理药品基础信息</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新增药品
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>新增药品</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">批准号</label>
                                <Input className="col-span-3" placeholder="请输入批准号" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">药品名称 <span className="text-red-500">*</span></label>
                                <Input className="col-span-3" placeholder="请输入药品名称" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">学名</label>
                                <Input className="col-span-3" placeholder="请输入学名" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">型号</label>
                                <Input className="col-span-3" placeholder="请输入型号" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">规格</label>
                                <Input className="col-span-3" placeholder="请输入规格" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">处方药</label>
                                <div className="col-span-3 flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="prescription" className="w-4 h-4 text-teal-500" />
                                        <span className="text-sm">是</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="prescription" defaultChecked className="w-4 h-4 text-teal-500" />
                                        <span className="text-sm">否</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">保存</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/40 flex-shrink-0">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">药品名称：</span>
                        <Input 
                            className="w-40" 
                            placeholder="请输入" 
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">批准号：</span>
                        <Input 
                            className="w-32" 
                            placeholder="请输入" 
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">处方药：</span>
                        <Select value={selectedPrescription} onValueChange={setSelectedPrescription}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="全部">全部</SelectItem>
                                <SelectItem value="是">是</SelectItem>
                                <SelectItem value="否">否</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button variant="outline" size="sm" onClick={() => { setSearchName(''); setSearchId(''); setSelectedPrescription('全部'); }}>重置</Button>
                        <Button variant="outline" size="sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            批量导入
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {exporting ? '导出中...' : '导出'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden">
                <VirtualTable
                    columns={columns}
                    data={filteredData}
                    rowKey={(item) => item.approval_no}
                    emptyText="暂无药品数据"
                />
            </div>
        </div>
    );
}
