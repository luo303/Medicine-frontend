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
import type { Manufacturer } from '@/types/basic-data';

interface ManufacturersClientProps {
    manufacturers: Manufacturer[];
}

export default function ManufacturersClient({ manufacturers }: ManufacturersClientProps) {
    const [searchName, setSearchName] = useState('');
    const [selectedCity, setSelectedCity] = useState('全部');
    const [selectedGmp, setSelectedGmp] = useState('全部');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const cities = useMemo(() => {
        const citySet = new Set<string>();
        manufacturers.forEach(item => {
            if (item.city) {
                citySet.add(item.city);
            }
        });
        return ['全部', ...Array.from(citySet).sort()];
    }, [manufacturers]);

    const filteredData = useMemo(() => {
        return manufacturers.filter(item => {
            const matchName = item.name.includes(searchName);
            const matchCity = selectedCity === '全部' || item.city === selectedCity;
            const matchGmp = selectedGmp === '全部' || 
                (selectedGmp === '是' && item.is_gmp) || 
                (selectedGmp === '否' && !item.is_gmp);
            return matchName && matchCity && matchGmp;
        });
    }, [manufacturers, searchName, selectedCity, selectedGmp]);

    const handleExport = async () => {
        if (filteredData.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        setExporting(true);
        await exportToExcel({
            reportType: 'manufacturer',
            reportLabel: '生产企业数据',
            rawData: filteredData,
        });
        setExporting(false);
    };

    const columns: ColumnDef<Manufacturer>[] = useMemo(() => [
        {
            key: 'approval_no',
            label: '批准号',
            width: 120,
            render: (value) => <span className="font-mono text-sm">{value}</span>,
        },
        {
            key: 'name',
            label: '企业名称',
            render: (value) => <span className="font-medium">{value}</span>,
        },
        {
            key: 'city',
            label: '城市',
            width: 80,
        },
        {
            key: 'address',
            label: '地址',
        },
        {
            key: 'phone',
            label: '电话',
            width: 130,
            render: (value) => <span className="font-mono text-sm">{value}</span>,
        },
        {
            key: 'is_gmp',
            label: 'GMP',
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
            width: 120,
            align: 'center',
            render: (_, item) => (
                <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                        编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        删除
                    </Button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="flex flex-col h-full p-6 space-y-4">
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">生产企业管理</h1>
                    <p className="text-sm text-slate-500">管理药品生产企业信息</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            新增企业
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>新增生产企业</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">企业批准号</label>
                                <Input className="col-span-3" placeholder="请输入批准号" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">企业名称 <span className="text-red-500">*</span></label>
                                <Input className="col-span-3" placeholder="请输入企业名称" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">所在城市</label>
                                <Input className="col-span-3" placeholder="请输入城市" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">地址</label>
                                <Input className="col-span-3" placeholder="请输入详细地址" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">邮政编码</label>
                                <Input className="col-span-3" placeholder="请输入邮政编码" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">联系电话</label>
                                <Input className="col-span-3" placeholder="请输入联系电话" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label className="text-right text-sm text-slate-600">GMP认证</label>
                                <div className="col-span-3 flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gmp" defaultChecked className="w-4 h-4 text-teal-500" />
                                        <span className="text-sm">是</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="gmp" className="w-4 h-4 text-teal-500" />
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
                        <span className="text-sm text-slate-600 dark:text-slate-400">企业名称：</span>
                        <Input 
                            className="w-40" 
                            placeholder="请输入" 
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">城市：</span>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map(city => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">GMP认证：</span>
                        <Select value={selectedGmp} onValueChange={setSelectedGmp}>
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
                        <Button variant="outline" size="sm" onClick={() => { setSearchName(''); setSelectedCity('全部'); setSelectedGmp('全部'); }}>重置</Button>
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
                    emptyText="暂无企业数据"
                />
            </div>
        </div>
    );
}
