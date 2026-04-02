'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Loader2, FileBox, LayoutList, Eye, AlertCircle, Maximize2, Minimize2, Search, X } from 'lucide-react';
import { useNavStore } from '@/store/nav-store';
import {
    getManufacturers,
    getDrugs,
    getMedicalInstitutions,
    getPurchaseOrders,
    getSalesOrders,
    getPurchaseStorages,
    getSalesOutbounds,
    getInventory,
    type Manufacturer,
    type Drug,
    type MedicalInstitution,
    type PurchaseOrder,
    type SalesOrder,
    type PurchaseStorage,
    type SalesOutbound,
    type Inventory,
} from '@/lib/reports';

// 报表类型定义
type ReportType = 
    | 'manufacturer'
    | 'drug'
    | 'institution'
    | 'purchase'
    | 'sales'
    | 'purchase_storage'
    | 'sales_outbound'
    | 'inventory';

// 报表配置
const REPORT_CONFIG: Record<ReportType, { label: string; icon: string; description: string }> = {
    manufacturer: { label: '企业药品供应厂商情况表', icon: '🏭', description: '查看所有合作的药品生产企业及供应商详细信息' },
    drug: { label: '企业经营药品目录表', icon: '💊', description: '管理企业当前经营的所有药品种类及规格详情' },
    institution: { label: '企业药品销售机构目录表', icon: '🏥', description: '查看所有合作的医疗机构、医院及终端药店信息' },
    purchase: { label: '企业药品采购表', icon: '📦', description: '追踪企业药品的采购订单、金额明细及完成状态' },
    sales: { label: '企业药品销售表', icon: '💰', description: '查看药品的销售记录、销售额分析及出库进度' },
    purchase_storage: { label: '企业药品采购入库表', icon: '📥', description: '管理采购药品的入库记录、货位分配及检验信息' },
    sales_outbound: { label: '企业药品销售出库表', icon: '📤', description: '追踪销售药品的出库记录、出库数量及经办人信息' },
    inventory: { label: '企业药品库存表', icon: '📋', description: '实时监控各仓库的药品库存余量、批次及效期状态' },
};

// 表格通用样式
const thClass = "px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-gray-100 bg-gray-100/80 dark:bg-slate-800 whitespace-nowrap border-b-2 border-gray-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm";
const tdClass = "px-6 py-4 text-sm text-gray-800 dark:text-gray-300 whitespace-nowrap";
const trClass = "border-b border-gray-100 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors bg-white dark:bg-slate-900/50 even:bg-gray-50/50 dark:even:bg-slate-800/30";

// 详情项组件
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className='bg-gray-50/80 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all hover:shadow-sm hover:border-blue-100 dark:hover:border-blue-900/50'>
        <Label className='text-xs text-gray-500 dark:text-gray-400 mb-1.5 block'>{label}</Label>
        <div className='text-sm font-medium text-gray-900 dark:text-gray-100 wrap-break-word'>{value || '-'}</div>
    </div>
);

// 布尔值徽章组件
const BooleanBadge = ({ value, trueText = '是', falseText = '否' }: { value: boolean, trueText?: string, falseText?: string }) => (
    <Badge 
        variant="outline" 
        className={value 
            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
    >
        {value ? trueText : falseText}
    </Badge>
);

// 状态徽章组件
const StatusBadge = ({ status }: { status: string }) => {
    const isSuccess = status === 'completed' || status === '全部出库' || status === '全部入库';
    const isWarning = status === '部分出库' || status === '部分入库' || status === '已审核';
    
    return (
        <Badge 
            variant="outline"
            className={isSuccess ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                      isWarning ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 
                      'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}
        >
            {status}
        </Badge>
    );
};

// 操作按钮组件
const ActionButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        variant='ghost'
        size='sm'
        className='text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 h-8 px-3'
        onClick={onClick}
    >
        <Eye className="w-4 h-4 mr-1.5" />
        详情
    </Button>
);

export default function ReportsPage() {
    const router = useRouter();
    const { collapsed, setCollapsed } = useNavStore();
    const [activeReport, setActiveReport] = useState<ReportType>('manufacturer');
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [error, setError] = useState<string>('');

    // 数据状态
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [institutions, setInstitutions] = useState<MedicalInstitution[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
    const [purchaseStorages, setPurchaseStorages] = useState<PurchaseStorage[]>([]);
    const [salesOutbounds, setSalesOutbounds] = useState<SalesOutbound[]>([]);
    const [inventory, setInventory] = useState<Inventory[]>([]);

    // 筛选状态
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const renderFilters = () => {
        return (
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="搜索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[200px] h-9 pl-9 pr-8 bg-gray-50 dark:bg-slate-800 border-none focus-visible:ring-1"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* 根据不同报表显示不同的状态筛选 */}
                {['manufacturer', 'drug', 'institution', 'purchase', 'sales'].includes(activeReport) && (
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className='w-[140px] h-9 bg-gray-50 dark:bg-slate-800 border-none focus:ring-1'>
                            <SelectValue placeholder="所有状态" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">所有状态</SelectItem>
                            {activeReport === 'manufacturer' && (
                                <>
                                    <SelectItem value="gmp">是 GMP</SelectItem>
                                    <SelectItem value="non-gmp">非 GMP</SelectItem>
                                </>
                            )}
                            {activeReport === 'drug' && (
                                <>
                                    <SelectItem value="rx">处方药</SelectItem>
                                    <SelectItem value="otc">非处方药</SelectItem>
                                </>
                            )}
                            {activeReport === 'institution' && (
                                <>
                                    <SelectItem value="specialized">专科医院</SelectItem>
                                    <SelectItem value="general">综合医院</SelectItem>
                                </>
                            )}
                            {(activeReport === 'purchase' || activeReport === 'sales') && (
                                <>
                                    <SelectItem value="全部入库">全部入库</SelectItem>
                                    <SelectItem value="全部出库">全部出库</SelectItem>
                                    <SelectItem value="部分入库">部分入库</SelectItem>
                                    <SelectItem value="部分出库">部分出库</SelectItem>
                                    <SelectItem value="已审核">已审核</SelectItem>
                                    <SelectItem value="待审核">待审核</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                )}
            </div>
        );
    };

    // 切换报表时清空筛选条件
    useEffect(() => {
        setSearchQuery('');
        setStatusFilter('all');
    }, [activeReport]);

    // 加载数据
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            loadData(activeReport);
        } else {
            setError('请先登录');
            const timer = setTimeout(() => {
                router.push('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [activeReport, router]);

    const loadData = async (reportType: ReportType) => {
        setLoading(true);
        setError('');
        try {
            switch (reportType) {
                case 'manufacturer':
                    const manufacturerData = await getManufacturers();
                    setManufacturers(manufacturerData);
                    break;
                case 'drug':
                    const drugData = await getDrugs();
                    setDrugs(drugData);
                    break;
                case 'institution':
                    const institutionData = await getMedicalInstitutions();
                    setInstitutions(institutionData);
                    break;
                case 'purchase':
                    const purchaseData = await getPurchaseOrders();
                    setPurchaseOrders(purchaseData);
                    break;
                case 'sales':
                    const salesData = await getSalesOrders();
                    setSalesOrders(salesData);
                    break;
                case 'purchase_storage':
                    const purchaseStorageData = await getPurchaseStorages();
                    setPurchaseStorages(purchaseStorageData);
                    break;
                case 'sales_outbound':
                    const salesOutboundData = await getSalesOutbounds();
                    setSalesOutbounds(salesOutboundData);
                    break;
                case 'inventory':
                    const inventoryData = await getInventory();
                    setInventory(inventoryData);
                    break;
            }
        } catch (error: any) {
            console.error('加载数据失败:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                router.push('/login');
            } else if (error.response?.status === 404) {
                setError('接口不存在，请检查后端服务');
            } else {
                setError('加载数据失败，请稍后重试');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (item: any) => {
        setSelectedItem(item);
        setDetailDialogOpen(true);
    };

    const renderEmptyState = () => (
        <div className='flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50/30 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 m-4'>
            <div className='p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4 border border-gray-100 dark:border-gray-700'>
                <FileBox className='w-8 h-8 text-blue-400 dark:text-blue-500 opacity-80' />
            </div>
            <p className='text-base font-medium text-gray-900 dark:text-gray-100'>暂无数据</p>
            <p className='text-sm mt-1.5 text-gray-500'>当前报表分类下没有找到任何记录</p>
        </div>
    );

    // 渲染不同的表格
    const renderTable = () => {
        switch (activeReport) {
            case 'manufacturer': return renderManufacturerTable();
            case 'drug': return renderDrugTable();
            case 'institution': return renderInstitutionTable();
            case 'purchase': return renderPurchaseTable();
            case 'sales': return renderSalesTable();
            case 'purchase_storage': return renderPurchaseStorageTable();
            case 'sales_outbound': return renderSalesOutboundTable();
            case 'inventory': return renderInventoryTable();
            default: return null;
        }
    };

    // 1. 企业药品供应厂商情况表
    const renderManufacturerTable = () => {
        const filteredData = manufacturers.filter(item => 
            searchQuery === '' || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.approval_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.city.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(item => 
            statusFilter === 'all' || 
            (statusFilter === 'gmp' && item.is_gmp) || 
            (statusFilter === 'non-gmp' && !item.is_gmp)
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>企业批准号</th>
                        <th className={thClass}>企业名称</th>
                        <th className={thClass}>所在城市</th>
                        <th className={thClass}>地址</th>
                        <th className={thClass}>邮政编码</th>
                        <th className={thClass}>联系电话</th>
                        <th className={thClass}>是否 GMP</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.approval_no} className={trClass}>
                            <td className={tdClass}>{item.approval_no}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span></td>
                            <td className={tdClass}>{item.city}</td>
                            <td className={tdClass}>{item.address}</td>
                            <td className={tdClass}>{item.postal_code}</td>
                            <td className={tdClass}>{item.phone}</td>
                            <td className={tdClass}><BooleanBadge value={item.is_gmp} /></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 2. 企业经营药品目录表
    const renderDrugTable = () => {
        const filteredData = drugs.filter(item => 
            searchQuery === '' || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.approval_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(item => 
            statusFilter === 'all' || 
            (statusFilter === 'rx' && item.is_prescription) || 
            (statusFilter === 'otc' && !item.is_prescription)
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>药品批准号</th>
                        <th className={thClass}>药品名称</th>
                        <th className={thClass}>学名</th>
                        <th className={thClass}>型号</th>
                        <th className={thClass}>规格</th>
                        <th className={thClass}>是否处方药</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.approval_no} className={trClass}>
                            <td className={tdClass}>{item.approval_no}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span></td>
                            <td className={tdClass}>{item.scientific_name}</td>
                            <td className={tdClass}>{item.model}</td>
                            <td className={tdClass}>{item.specification}</td>
                            <td className={tdClass}><BooleanBadge value={item.is_prescription} trueText="处方药" falseText="非处方药" /></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 3. 企业药品销售机构目录表
    const renderInstitutionTable = () => {
        const filteredData = institutions.filter(item => 
            searchQuery === '' || 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.approval_no.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(item => 
            statusFilter === 'all' || 
            (statusFilter === 'specialized' && item.is_specialized) || 
            (statusFilter === 'general' && !item.is_specialized)
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>机构批准号</th>
                        <th className={thClass}>机构名称</th>
                        <th className={thClass}>地址</th>
                        <th className={thClass}>邮政编码</th>
                        <th className={thClass}>联系电话</th>
                        <th className={thClass}>是否专科医院</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.approval_no} className={trClass}>
                            <td className={tdClass}>{item.approval_no}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span></td>
                            <td className={tdClass}>{item.address}</td>
                            <td className={tdClass}>{item.postal_code}</td>
                            <td className={tdClass}>{item.phone}</td>
                            <td className={tdClass}><BooleanBadge value={item.is_specialized} /></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 4. 企业药品采购表
    const renderPurchaseTable = () => {
        const filteredData = purchaseOrders.filter(item => 
            searchQuery === '' || 
            item.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.manufacturer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.purchaser.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(item => 
            statusFilter === 'all' || 
            item.status === statusFilter
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>采购单号</th>
                        <th className={thClass}>采购日期</th>
                        <th className={thClass}>企业批准号</th>
                        <th className={thClass}>企业名称</th>
                        <th className={thClass}>总金额</th>
                        <th className={thClass}>采购员</th>
                        <th className={thClass}>状态</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.order_no} className={trClass}>
                            <td className={tdClass}>{item.order_no}</td>
                            <td className={tdClass}>{formatDate(item.order_date)}</td>
                            <td className={tdClass}>{item.manufacturerApprovalNo}</td>
                            <td className={tdClass}>{item.manufacturer_name}</td>
                            <td className={tdClass}><span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(item.total_amount)}</span></td>
                            <td className={tdClass}>{item.purchaser}</td>
                            <td className={tdClass}><StatusBadge status={item.status} /></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 5. 企业药品销售表
    const renderSalesTable = () => {
        const filteredData = salesOrders.filter(item => 
            searchQuery === '' || 
            item.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.salesperson.toLowerCase().includes(searchQuery.toLowerCase())
        ).filter(item => 
            statusFilter === 'all' || 
            item.status === statusFilter
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>销售单号</th>
                        <th className={thClass}>销售日期</th>
                        <th className={thClass}>机构批准号</th>
                        <th className={thClass}>机构名称</th>
                        <th className={thClass}>总金额</th>
                        <th className={thClass}>销售员</th>
                        <th className={thClass}>状态</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.order_no} className={trClass}>
                            <td className={tdClass}>{item.order_no}</td>
                            <td className={tdClass}>{formatDate(item.sales_date)}</td>
                            <td className={tdClass}>{item.institutionApprovalNo}</td>
                            <td className={tdClass}>{item.institution_name}</td>
                            <td className={tdClass}><span className="font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(item.total_amount)}</span></td>
                            <td className={tdClass}>{item.salesperson}</td>
                            <td className={tdClass}><StatusBadge status={item.status} /></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 6. 企业药品采购入库表
    const renderPurchaseStorageTable = () => {
        const filteredData = purchaseStorages.filter(item => 
            searchQuery === '' || 
            item.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.warehouse_code.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>仓号</th>
                        <th className={thClass}>货位号</th>
                        <th className={thClass}>采购单号</th>
                        <th className={thClass}>入库日期</th>
                        <th className={thClass}>企业批准号</th>
                        <th className={thClass}>药品批准号</th>
                        <th className={thClass}>药品名称</th>
                        <th className={thClass}>入库数量</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className={trClass}>
                            <td className={tdClass}>{item.warehouse_code}</td>
                            <td className={tdClass}>{item.location_code}</td>
                            <td className={tdClass}>{item.orderNo}</td>
                            <td className={tdClass}>{formatDate(item.storage_date)}</td>
                            <td className={tdClass}>{item.manufacturerApprovalNo}</td>
                            <td className={tdClass}>{item.drugApprovalNo}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.drug_name}</span></td>
                            <td className={tdClass}><span className="font-semibold text-blue-600 dark:text-blue-400">{item.quantity}</span></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 7. 企业药品销售出库表
    const renderSalesOutboundTable = () => {
        const filteredData = salesOutbounds.filter(item => 
            searchQuery === '' || 
            item.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.warehouse_code.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>仓号</th>
                        <th className={thClass}>货位号</th>
                        <th className={thClass}>销售单号</th>
                        <th className={thClass}>出库日期</th>
                        <th className={thClass}>机构批准号</th>
                        <th className={thClass}>企业批准号</th>
                        <th className={thClass}>药品批准号</th>
                        <th className={thClass}>药品名称</th>
                        <th className={thClass}>出库数量</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className={trClass}>
                            <td className={tdClass}>{item.warehouse_code}</td>
                            <td className={tdClass}>{item.location_code}</td>
                            <td className={tdClass}>{item.orderNo}</td>
                            <td className={tdClass}>{formatDate(item.outbound_date)}</td>
                            <td className={tdClass}>{item.institutionApprovalNo}</td>
                            <td className={tdClass}>{item.manufacturerApprovalNo}</td>
                            <td className={tdClass}>{item.drugApprovalNo}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.drug_name}</span></td>
                            <td className={tdClass}><span className="font-semibold text-blue-600 dark:text-blue-400">{item.quantity}</span></td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 8. 企业药品库存表
    const renderInventoryTable = () => {
        const filteredData = inventory.filter(item => 
            searchQuery === '' || 
            item.drug_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.batch_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.warehouse_code.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredData.length === 0) return renderEmptyState();
        return (
            <table className='w-full border-collapse'>
                <thead>
                    <tr>
                        <th className={thClass}>仓号</th>
                        <th className={thClass}>货位号</th>
                        <th className={thClass}>批次号</th>
                        <th className={thClass}>药品批准号</th>
                        <th className={thClass}>药品名称</th>
                        <th className={thClass}>库存数量</th>
                        <th className={thClass}>最后更新</th>
                        <th className={thClass}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className={trClass}>
                            <td className={tdClass}>{item.warehouse_code}</td>
                            <td className={tdClass}>{item.location_code}</td>
                            <td className={tdClass}>{item.batch_no}</td>
                            <td className={tdClass}>{item.drugApprovalNo}</td>
                            <td className={tdClass}><span className="font-medium text-gray-900 dark:text-gray-100">{item.drug_name}</span></td>
                            <td className={tdClass}><span className="font-bold text-blue-600 dark:text-blue-400">{item.quantity}</span></td>
                            <td className={tdClass}>{formatDate(item.last_update)}</td>
                            <td className={tdClass}><ActionButton onClick={() => handleViewDetail(item)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    // 渲染详情对话框内容
    const renderDetailContent = () => {
        if (!selectedItem) return null;

        switch (activeReport) {
            case 'manufacturer':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="企业批准号" value={selectedItem.approval_no} />
                        <DetailItem label="企业名称" value={selectedItem.name} />
                        <DetailItem label="所在城市" value={selectedItem.city} />
                        <DetailItem label="地址" value={selectedItem.address} />
                        <DetailItem label="邮政编码" value={selectedItem.postal_code} />
                        <DetailItem label="联系电话" value={selectedItem.phone} />
                        <DetailItem label="是否 GMP" value={<BooleanBadge value={selectedItem.is_gmp} />} />
                    </div>
                );
            case 'drug':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="药品批准号" value={selectedItem.approval_no} />
                        <DetailItem label="药品名称" value={selectedItem.name} />
                        <DetailItem label="学名" value={selectedItem.scientific_name} />
                        <DetailItem label="型号" value={selectedItem.model} />
                        <DetailItem label="规格" value={selectedItem.specification} />
                        <DetailItem label="是否处方药" value={<BooleanBadge value={selectedItem.is_prescription} trueText="处方药" falseText="非处方药" />} />
                    </div>
                );
            case 'institution':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="机构批准号" value={selectedItem.approval_no} />
                        <DetailItem label="机构名称" value={selectedItem.name} />
                        <DetailItem label="地址" value={selectedItem.address} />
                        <DetailItem label="邮政编码" value={selectedItem.postal_code} />
                        <DetailItem label="联系电话" value={selectedItem.phone} />
                        <DetailItem label="是否专科医院" value={<BooleanBadge value={selectedItem.is_specialized} />} />
                    </div>
                );
            case 'purchase':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="采购单号" value={selectedItem.order_no} />
                        <DetailItem label="采购日期" value={formatDate(selectedItem.order_date)} />
                        <DetailItem label="企业批准号" value={selectedItem.manufacturerApprovalNo} />
                        <DetailItem label="企业名称" value={selectedItem.manufacturer_name} />
                        <DetailItem label="总金额" value={<span className="text-blue-600 font-semibold">{formatCurrency(selectedItem.total_amount)}</span>} />
                        <DetailItem label="采购员" value={selectedItem.purchaser} />
                        <DetailItem label="状态" value={<StatusBadge status={selectedItem.status} />} />
                        <DetailItem label="创建时间" value={formatDate(selectedItem.create_time)} />
                    </div>
                );
            case 'sales':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="销售单号" value={selectedItem.order_no} />
                        <DetailItem label="销售日期" value={formatDate(selectedItem.sales_date)} />
                        <DetailItem label="机构批准号" value={selectedItem.institutionApprovalNo} />
                        <DetailItem label="机构名称" value={selectedItem.institution_name} />
                        <DetailItem label="总金额" value={<span className="text-blue-600 font-semibold">{formatCurrency(selectedItem.total_amount)}</span>} />
                        <DetailItem label="销售员" value={selectedItem.salesperson} />
                        <DetailItem label="状态" value={<StatusBadge status={selectedItem.status} />} />
                        <DetailItem label="创建时间" value={formatDate(selectedItem.create_time)} />
                    </div>
                );
            case 'purchase_storage':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="仓号" value={selectedItem.warehouse_code} />
                        <DetailItem label="货位号" value={selectedItem.location_code} />
                        <DetailItem label="采购单号" value={selectedItem.orderNo} />
                        <DetailItem label="入库日期" value={formatDate(selectedItem.storage_date)} />
                        <DetailItem label="企业批准号" value={selectedItem.manufacturerApprovalNo} />
                        <DetailItem label="药品批准号" value={selectedItem.drugApprovalNo} />
                        <DetailItem label="药品名称" value={selectedItem.drug_name} />
                        <DetailItem label="入库数量" value={<span className="font-bold text-blue-600">{selectedItem.quantity}</span>} />
                        <DetailItem label="采购员" value={selectedItem.purchaser} />
                        <DetailItem label="检验员" value={selectedItem.inspector} />
                        <DetailItem label="保管员" value={selectedItem.keeper} />
                    </div>
                );
            case 'sales_outbound':
                return (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <DetailItem label="仓号" value={selectedItem.warehouse_code} />
                        <DetailItem label="货位号" value={selectedItem.location_code} />
                        <DetailItem label="销售单号" value={selectedItem.orderNo} />
                        <DetailItem label="出库日期" value={formatDate(selectedItem.outbound_date)} />
                        <DetailItem label="机构批准号" value={selectedItem.institutionApprovalNo} />
                        <DetailItem label="企业批准号" value={selectedItem.manufacturerApprovalNo} />
                        <DetailItem label="药品批准号" value={selectedItem.drugApprovalNo} />
                        <DetailItem label="药品名称" value={selectedItem.drug_name} />
                        <DetailItem label="出库数量" value={<span className="font-bold text-blue-600">{selectedItem.quantity}</span>} />
                        <DetailItem label="销售员" value={selectedItem.salesperson} />
                        <DetailItem label="检验员" value={selectedItem.inspector} />
                        <DetailItem label="保管员" value={selectedItem.keeper} />
                    </div>
                );
            case 'inventory':
                return (
                    <div className='space-y-6'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <DetailItem label="仓号" value={selectedItem.warehouse_code} />
                            <DetailItem label="货位号" value={selectedItem.location_code} />
                            <DetailItem label="批次号" value={selectedItem.batch_no} />
                            <DetailItem label="药品批准号" value={selectedItem.drugApprovalNo} />
                            <DetailItem label="药品名称" value={selectedItem.drug_name} />
                            <DetailItem label="库存数量" value={<span className="text-blue-600 dark:text-blue-400 font-bold text-base">{selectedItem.quantity}</span>} />
                            <DetailItem label="生产日期" value={formatDate(selectedItem.production_date)} />
                            <DetailItem label="有效期至" value={formatDate(selectedItem.expiry_date)} />
                            <DetailItem label="最后更新" value={formatDate(selectedItem.last_update)} />
                        </div>
                        {selectedItem.warehouse && (
                            <div className='border-t border-gray-100 dark:border-gray-800 pt-6'>
                                <h4 className='text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
                                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                    仓库详细信息
                                </h4>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <DetailItem label="仓库名称" value={selectedItem.warehouse.name} />
                                    <DetailItem label="管理员" value={selectedItem.warehouse.manager} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <pre className='text-sm p-4 bg-gray-50 rounded-lg overflow-auto'>{JSON.stringify(selectedItem, null, 2)}</pre>;
        }
    };

    return (
        <div className='h-full flex flex-col p-4 lg:p-6 bg-gray-50/30 dark:bg-black/50 overflow-hidden'>
            {/* 顶部控制栏：合并标题和下拉选择 */}
            <div className='mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm'>
                <div className='flex items-center gap-3'>
                    <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <LayoutList className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Select
                            value={activeReport}
                            onValueChange={(value) => setActiveReport(value as ReportType)}
                        >
                            <SelectTrigger className='w-[240px] h-9 bg-gray-50 dark:bg-slate-800 border-none focus:ring-1 focus:ring-blue-500'>
                                <SelectValue placeholder="选择报表类型" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(REPORT_CONFIG).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <span>{config.icon}</span>
                                            <span className="font-medium text-sm">{config.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* 页面结构调整控制按钮 (折叠/展开侧边栏) */}
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-9 flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border-none hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                    title={collapsed ? "恢复侧边栏" : "沉浸式看表"}
                >
                    {collapsed ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    <span className="hidden sm:inline text-sm">{collapsed ? "退出沉浸模式" : "沉浸式看表"}</span>
                </Button>
            </div>

            {/* 数据展示区 */}
            <Card className='flex-1 min-h-0 overflow-hidden border border-gray-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-900 flex flex-col rounded-xl'>
                <CardHeader className="py-3 px-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xl">{REPORT_CONFIG[activeReport].icon}</span>
                            <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
                                {REPORT_CONFIG[activeReport].label}
                            </CardTitle>
                        </div>
                        {/* 动态筛选区域 */}
                        {renderFilters()}
                    </div>
                </CardHeader>
                <CardContent className='p-0 overflow-auto flex-1 relative bg-white dark:bg-[#0f172a]'>
                    {error ? (
                        <div className='flex flex-col items-center justify-center h-64 gap-4 bg-red-50/30 dark:bg-red-900/10 m-4 rounded-xl border border-red-100 dark:border-red-900/30'>
                            <AlertCircle className="w-10 h-10 text-red-500" />
                            <div className='text-red-600 dark:text-red-400 font-medium'>{error}</div>
                            {error.includes('登录') && (
                                <Button onClick={() => router.push('/login')} variant="outline" className="mt-2">
                                    去登录
                                </Button>
                            )}
                        </div>
                    ) : loading ? (
                        <div className='flex flex-col items-center justify-center h-64'>
                            <Loader2 className='w-8 h-8 animate-spin text-blue-500 mb-4' />
                            <div className='text-sm text-gray-500 font-medium'>数据加载中，请稍候...</div>
                        </div>
                    ) : (
                        <div className='overflow-x-auto min-h-[400px]'>
                            {renderTable()}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 详情对话框 */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className='max-w-3xl gap-0 p-0 overflow-hidden bg-white dark:bg-gray-900 border-none shadow-2xl rounded-2xl'>
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <span className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg shadow-sm">
                                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </span>
                            数据详情
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        {renderDetailContent()}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
