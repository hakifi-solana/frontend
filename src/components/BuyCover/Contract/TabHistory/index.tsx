
import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import ArrowUpDownIcon from '@/components/common/Icons/ArrowUpDownIcon';
import ExternalLinkIcon from '@/components/common/Icons/ExternalLinkIcon';
import Tag from '@/components/common/Tag';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import useWalletStore from '@/stores/wallet.store';
import { cn } from '@/utils';
import { MODE, STATUS_DEFINITIONS } from '@/utils/constant';
import { formatNumber } from '@/utils/format';
import { shortenHexString } from '@/utils/helper';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import Image from 'next/image';
import { MouseEvent, MouseEventHandler, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { DateExpiredWrapper, PnlWrapper, TooltipHeaderWrapper } from '../utils';
import FilterWrapper from './Filter';
import MobileRecord from './MobileRecord';

const TabHistory = () => {
    const [
        setPagination,
        insurancesHistory,
        totalHistory,
        toggleDetailModal,
        setInsuranceSelected,
    ] = useInsuranceStore((state) => [
        state.setPagination,
        state.insurancesHistory,
        state.totalHistory,
        state.toggleDetailModal,
        state.setInsuranceSelected,
    ]);

    const isLogging = useWalletStore((state) => state.isLogging);
    const { address } = useAccount();

    const [sorting, setSorting] = useState<SortingState>([]);

    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const columns: ColumnDef<Insurance>[] = useMemo(
        () => [
            {
                accessorKey: 'asset',
                header: "Pair",
                cell: ({ row }) => {
                    const token = row.getValue('token') as {
                        attachment: string;
                        name: string;
                    };
                    return (
                        <div className="text-body-12 flex items-center gap-2">
                            <Image
                                src={token.attachment}
                                width={24}
                                height={24}
                                alt="token"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-typo-primary">{row.getValue('asset')}</span>/
                                <span>USDT</span>
                            </div>
                        </div>
                    );
                },
                meta: {
                    width: 120,
                },
            },
            {
                accessorKey: 'side',
                header: "Side",
                meta: {
                    width: 100,
                },
                cell: ({ row }) => {
                    const side = row.getValue('side') as string;
                    return (
                        <div
                            className={cn(
                                "text-body-12 text-typo-primary p-1 text-center rounded-sm",
                                side === MODE.BULL ? 'bg-positive-label' : 'text-negative-label',
                            )}>
                            {side}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'expiredAt',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <Button
                            size="sm"
                            className="flex items-start gap-2"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}>
                            T-Expire
                            <ArrowUpDownIcon sort={isSort} height={14} width={14} />
                        </Button>
                    );
                },
                meta: {
                    width: 185,
                },
                cell: ({ row }) => (
                    <DateExpiredWrapper
                        expired={row.getValue('expiredAt')}
                        isCooldown={false}
                    />
                ),
            },
            {
                accessorKey: 'pnl',
                header: 'PnL',
                meta: {
                    width: 180,
                },
                cell: ({ row }) => (
                    <PnlWrapper
                        margin={row.getValue('margin')}
                        q_claim={row.getValue('q_claim')}
                        state={row.getValue('state')}
                    />
                ),
            },
            {
                accessorKey: 'margin',
                header: ({ column }) => {
                    const isSort = typeof column.getIsSorted() === 'boolean' ? "" : column.getIsSorted() === 'asc' ? false : true;
                    return <TooltipHeaderWrapper title="Margin" tooltip="Margin" onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }} suffix={<ArrowUpDownIcon className="ml-2" sort={isSort} />} />;
                },
                meta: {
                    width: 90,
                },
                cell: ({ row }) => (
                    <div className="text-typo-primary">
                        {formatNumber(row.getValue('margin'))}
                    </div>
                ),
            },
            {
                accessorKey: 'q_covered',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <TooltipHeaderWrapper
                            title="Cover amount"
                            tooltip="Cover amount"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}
                            suffix={<ArrowUpDownIcon height={14} width={14} sort={isSort} />}
                        />
                    );
                },
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <div className="text-primary-3">
                        {formatNumber(row.getValue('q_covered'))}
                    </div>
                ),
            },
            {
                accessorKey: 'state',
                header: "Status",
                cell: ({ row }) => {
                    const { variant, title } = STATUS_DEFINITIONS[row.getValue('state') as string];
                    return <Tag
                        variant={variant}
                        text={title}
                    />;
                },
                meta: {
                    width: 160,
                },
            },
            {
                accessorKey: 'txhash',
                header: 'TxH',
                meta: {
                    width: 150,
                    onCellClick: (data: Insurance) => {

                    }
                },
                cell: ({ row }) => {
                    return (
                        <div className="text-support-white flex items-center gap-2 underline" onClick={(e) => handleOnScan(e, row.getValue('txhash'))}>
                            {row.getValue('txhash') ? shortenHexString(row.getValue('txhash') as string, 5, 4) : null}
                            <ExternalLinkIcon />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'q_claim',
                header: '',
                meta: {
                    show: false,
                },
            },
            {
                accessorKey: 'token',
                header: '',
                meta: {
                    show: false,
                },
            },
        ],
        [isLogging, address],
    );

    const handleOnScan = (event: MouseEvent<HTMLDivElement>, txh: string) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(process.env.NEXT_PUBLIC_CHAIN_SCAN + '/' + txh, '_blank');
    };

    const isMobile = useIsMobile();
    return (
        <>
            <FilterWrapper sorting={sorting} />

            {
                !isMobile ? <DataTable
                    columns={columns}
                    data={insurancesHistory}
                    total={totalHistory}
                    onChangePagination={setPagination}
                    onClickRow={handleOnClickInsurance}
                    sorting={sorting}
                    setSorting={setSorting}
                /> : (
                    <section className="mt-5 px-4 flex flex-col gap-4">
                        {
                            insurancesHistory.map(insurance => {
                                return (
                                    <MobileRecord key={insurance.id} data={insurance} onShowDetail={handleOnClickInsurance} />
                                );
                            })
                        }
                    </section>
                )
            }
        </>
    );
};

export default TabHistory;