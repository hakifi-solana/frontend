
import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import DataTable from '@/components/common/DataTable';
import TwoWayArrowIcon from '@/components/common/Icons/TwoWayArrowIcon';
import ClipboardIcon from '@/components/common/Icons/ClipboardIcon';
import { useNotification } from '@/components/common/Notification';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import useWalletStore from '@/stores/wallet.store';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import { copyToClipboard } from '@/utils/helper';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { MouseEvent, useMemo, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import TickerWrapper from '../../Favorites/TickerWrapper';
import { CloseButton, DateExpiredWrapper, PriceExpiredWrapper, QClaimWrapper, TooltipHeaderWrapper } from '../utils';
import FilterWrapper from './Filter';
import MobileRecord from './MobileRecord';

const TabOpening = () => {
    const { address } = useAccount();
    const [
        currentPage,
        setPagination,
        insurancesOpening,
        totalOpening,
        toggleDetailModal,
        setInsuranceSelected,
        toggleCloseModal,
    ] = useInsuranceStore((state) => [
        state.currentPage,
        state.setPagination,
        state.insurancesOpening,
        state.totalOpening,
        state.toggleDetailModal,
        state.setInsuranceSelected,
        state.toggleCloseModal,
    ]);
    const notifications = useNotification();
    const handleOnClickInsurance = (data: Insurance) => {
        toggleDetailModal();
        setInsuranceSelected(data);
    };

    const [sorting, setSorting] = useState<SortingState>([]);
    const isLogging = useWalletStore((state) => state.isLogging);

    const handleCloseAction = (
        e: MouseEvent<HTMLButtonElement>,
        data: Insurance,
    ) => {
        e.stopPropagation();
        e.preventDefault();
        setInsuranceSelected(data);
        toggleCloseModal();
    };

    const copyTooltipRef = useRef<any>();
    const handleCopy = (e: MouseEvent<HTMLButtonElement>, str: string) => {
        e.stopPropagation();
        e.preventDefault();
        copyToClipboard(str);
        copyTooltipRef.current?.toggle(true);

        notifications.success('Copied');
    };
    const isMobile = useIsMobile();
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
                                side === ENUM_INSURANCE_SIDE.BULL ? 'bg-positive-label' : 'text-negative-label',
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
                            <TwoWayArrowIcon sort={isSort} />
                        </Button>
                    );
                },
                meta: {
                    width: 145,
                },
                cell: ({ row }) => (
                    <DateExpiredWrapper
                        expired={row.getValue('expiredAt')}
                        isCooldown={true}
                    />
                ),
            },
            {
                accessorKey: 'p_open',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <TooltipHeaderWrapper
                            title="P-Open"
                            tooltip="P-Open"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}
                            suffix={<TwoWayArrowIcon sort={isSort} />}
                        />
                    );
                },
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <div className="text-primary-3">
                        {formatNumber(row.getValue('p_open'))}
                    </div>
                ),
            },
            {
                accessorKey: 'p_claim',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <TooltipHeaderWrapper
                            title="P-Claim"
                            tooltip="P-Claim"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}
                            suffix={<TwoWayArrowIcon sort={isSort} />}
                        />
                    );
                },
                meta: {
                    width: 107,
                },
                cell: ({ row }) => (
                    <div className="text-primary-3">
                        {formatNumber(row.getValue('p_claim'))}
                    </div>
                ),
            },
            {
                accessorKey: 'p_market',
                header: () => (
                    <TooltipHeaderWrapper
                        title="P-Market"
                        tooltip="P-Market"
                    />
                ),
                meta: {
                    width: 115,
                },
                cell: ({ row }) => (
                    <TickerWrapper
                        jump
                        symbol={`${row.getValue('asset')}USDT`}
                        decimal={8}
                    />
                ),
            },
            {
                accessorKey: 'p_liquidation',
                header: () => (
                    <TooltipHeaderWrapper
                        title="P-Expire"
                        tooltip="P-Expire"
                    />
                ),
                meta: {
                    width: 150,
                },
                cell: ({ row }) => (
                    <PriceExpiredWrapper
                        pExpired={row.getValue('p_liquidation')}
                        symbol={`${row.getValue('asset')}USDT`}
                    />
                ),
            },
            {
                accessorKey: 'q_claim',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <TooltipHeaderWrapper
                            title="Claim amount"
                            tooltip="Claim amount"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}
                            suffix={<TwoWayArrowIcon sort={isSort} />}
                        />
                    );
                },
                meta: {
                    width: 210,
                },
                cell: ({ row }) => (
                    <QClaimWrapper
                        qClaim={row.getValue('q_claim')}
                        margin={row.getValue('margin')}
                    />
                ),
            },
            {
                accessorKey: 'margin',
                header: ({ column }) => {
                    const isSort =
                        typeof column.getIsSorted() === 'boolean'
                            ? ''
                            : column.getIsSorted() === 'asc'
                                ? false
                                : true;
                    return (
                        <TooltipHeaderWrapper
                            title="Margin"
                            tooltip="Margin"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === 'asc');
                            }}
                            suffix={<TwoWayArrowIcon sort={isSort} />}
                        />
                    );
                },
                meta: {
                    width: 90,
                },
                cell: ({ row }) => (
                    <div className="text-primary-3">
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
                            suffix={<TwoWayArrowIcon sort={isSort} className="size-3.5" />}
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
                accessorKey: 'id',
                header: "Hash ID",
                meta: {
                    width: 150,
                },
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-1">
                            <div className="text-primary-3">{row.getValue('id')}</div>
                            <Button
                                size="md"
                                className=""
                                onClick={(e) => handleCopy(e, row.getValue('id'))}>
                                <ClipboardIcon height={20} width={20} />
                            </Button>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'action',
                header: '',
                cell: ({ row }) => (
                    <CloseButton
                        onClick={(e) => handleCloseAction(e, row.original)}
                        symbol={`${row.getValue('asset')}USDT`}
                        pCancel={row.getValue('p_cancel') as number}
                        pClaim={row.getValue('p_claim')}
                        title="Close"
                        state={row.original.state as string}
                        side={row.getValue('side')}
                    />
                ),
                meta: {
                    fixed: 'left',
                    width: 97,
                },
            },
            {
                accessorKey: 'p_cancel',
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

    return (
        <>
            <FilterWrapper sorting={sorting} />

            {
                !isMobile ? <DataTable
                    columns={columns}
                    data={insurancesOpening}
                    total={totalOpening}
                    onChangePagination={setPagination}
                    onClickRow={handleOnClickInsurance}
                    sorting={sorting}
                    setSorting={setSorting}
                /> : (
                    <section className="mt-5 px-4 flex flex-col gap-4">
                        {
                            insurancesOpening.map(insurance => {
                                return (
                                    <MobileRecord key={insurance.id} data={insurance} onShowDetail={handleOnClickInsurance} />
                                );
                            })
                        }
                        {Math.floor(totalOpening / 10) > currentPage && (
                            <Button size="md" className="mt-5" onClick={() => setPagination(currentPage + 1)}>
                                Load more
                            </Button>
                        )}
                    </section>
                )
            }


        </>
    );
};

export default TabOpening;