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
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { VirtualTable, type ColumnDef } from '@/components/virtual-table';
import { exportToExcel } from '@/lib/excel-export';
import type { Warehouse, StorageLocation } from '@/types/basic-data';

interface WarehousesClientProps {
    warehouses: Warehouse[];
    storageLocations: StorageLocation[];
}

export default function WarehousesClient({ warehouses, storageLocations }: WarehousesClientProps) {
    const [expandedWarehouses, setExpandedWarehouses] = useState<number[]>(warehouses.length > 0 ? [warehouses[0].id] : []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [locationDialogOpen, setLocationDialogOpen] = useState(false);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
    const [exporting, setExporting] = useState(false);

    const toggleWarehouse = (id: number) => {
        setExpandedWarehouses(prev => 
            prev.includes(id) 
                ? prev.filter(w => w !== id)
                : [...prev, id]
        );
    };

    const getLocationsByWarehouse = useMemo(() => {
        const map = new Map<number, StorageLocation[]>();
        storageLocations.forEach(loc => {
            const existing = map.get(loc.warehouseId) || [];
            map.set(loc.warehouseId, [...existing, loc]);
        });
        return map;
    }, [storageLocations]);

    const openLocationDialog = (warehouseId: number) => {
        setSelectedWarehouseId(warehouseId);
        setLocationDialogOpen(true);
    };

    const handleExport = async () => {
        if (warehouses.length === 0) {
            alert('没有可导出的数据');
            return;
        }
        setExporting(true);
        await exportToExcel({
            reportType: 'warehouse',
            reportLabel: '仓库数据',
            rawData: warehouses,
        });
        setExporting(false);
    };

    const locationColumns: ColumnDef<StorageLocation>[] = useMemo(() => [
        {
            key: 'code',
            label: '货位编号',
            width: 120,
            render: (value) => <span className="font-mono text-sm">{value}</span>,
        },
        {
            key: 'description',
            label: '描述',
        },
        {
            key: 'capacity',
            label: '容量',
            width: 100,
            align: 'right',
            render: (value) => <span className="font-mono">{value.toLocaleString()}</span>,
        },
    ], []);

    return (
        <div className="flex flex-col h-full p-6 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">仓库管理</h1>
                    <p className="text-sm text-slate-500">管理仓库及货位信息</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {exporting ? '导出中...' : '导出'}
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                新增仓库
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>新增仓库</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm text-slate-600">仓库编号</label>
                                    <Input className="col-span-3" placeholder="请输入仓库编号" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm text-slate-600">仓库名称 <span className="text-red-500">*</span></label>
                                    <Input className="col-span-3" placeholder="请输入仓库名称" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm text-slate-600">仓库地址</label>
                                    <Input className="col-span-3" placeholder="请输入仓库地址" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right text-sm text-slate-600">负责人</label>
                                    <Input className="col-span-3" placeholder="请输入负责人" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
                                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">保存</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {warehouses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/40 p-8 text-center text-slate-500">
                        暂无仓库数据
                    </div>
                ) : (
                    warehouses.map((warehouse) => {
                        const isExpanded = expandedWarehouses.includes(warehouse.id);
                        const locations = getLocationsByWarehouse.get(warehouse.id) || [];
                        const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);

                        return (
                            <Collapsible
                                key={warehouse.id}
                                open={isExpanded}
                                onOpenChange={() => toggleWarehouse(warehouse.id)}
                            >
                                <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/40 overflow-hidden">
                                    <CollapsibleTrigger asChild>
                                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <svg
                                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-slate-500">{warehouse.code}</span>
                                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{warehouse.name}</span>
                                                    <span className="text-sm text-slate-400">（{warehouse.address}）</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm text-slate-500">
                                                    负责人: <span className="font-medium">{warehouse.manager}</span>
                                                    <span className="mx-2">|</span>
                                                    货位数: <span className="font-medium">{locations.length}</span>
                                                    <span className="mx-2">|</span>
                                                    总容量: <span className="font-medium">{totalCapacity.toLocaleString()}</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                >
                                                    编辑
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={(e) => { e.stopPropagation(); }}
                                                >
                                                    删除
                                                </Button>
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent>
                                        <div className="border-t border-slate-200/60 dark:border-slate-700/40">
                                            {locations.length === 0 ? (
                                                <div className="p-4 text-center text-slate-500 text-sm">暂无货位</div>
                                            ) : (
                                                <div className="h-64">
                                                    <VirtualTable
                                                        columns={locationColumns}
                                                        data={locations}
                                                        rowKey={(item) => item.id}
                                                        emptyText="暂无货位数据"
                                                        showRecordCount={false}
                                                    />
                                                </div>
                                            )}
                                            
                                            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700/30 flex justify-between items-center">
                                                <span className="text-sm text-slate-500">共 {locations.length} 个货位</span>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => openLocationDialog(warehouse.id)}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    新增货位
                                                </Button>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                        );
                    })
                )}
            </div>

            <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>新增货位</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm text-slate-600">货位编号</label>
                            <Input className="col-span-3" placeholder="如: A01-01" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm text-slate-600">描述</label>
                            <Input className="col-span-3" placeholder="请输入描述" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right text-sm text-slate-600">容量</label>
                            <Input className="col-span-3" placeholder="请输入容量" type="number" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>取消</Button>
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">保存</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
