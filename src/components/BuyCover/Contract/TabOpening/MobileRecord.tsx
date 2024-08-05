import { Insurance } from '@/@type/insurance.type';
import Button from '@/components/common/Button';
import ClipboardIcon from '@/components/common/Icons/ClipboardIcon';
import { useNotification } from '@/components/common/Notification';
import { Separator } from '@/components/common/Separator';
import TooltipCustom from '@/components/common/Tooltip';
import { cn } from '@/utils';
import { copyToClipboard } from '@/utils/helper';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import Image from 'next/image';
import { MouseEvent, useMemo, useRef } from 'react';
import { DateExpiredWrapper, PriceExpiredWrapper, QClaimWrapper } from '../utils';
import { formatNumber } from '@/utils/format';
import TickerWrapper from '../../Favorites/TickerWrapper';

type RecordProps = {
    data: Insurance;
    onShowDetail: (data: Insurance) => void;
};

const MobileRecord = ({ data, onShowDetail }: RecordProps) => {
    const { asset, token, side, expiredAt, id, p_open, p_claim, p_liquidation, q_claim, margin, q_covered } = useMemo(() => data, [data]);
    const copyTooltipRef = useRef<any>();
    const notifications = useNotification();
    const handleCopy = (e: MouseEvent<HTMLButtonElement>, str: string) => {
        e.stopPropagation();
        e.preventDefault();
        copyToClipboard(str);
        copyTooltipRef.current?.toggle(true);

        notifications.success('Copied');
    };
    return (
        <section onClick={() => onShowDetail(data)} className="flex flex-col border border-divider-secondary p-3 rounded">
            <section className="flex items-center justify-between">
                <div className="text-body-12 flex items-center gap-2">
                    <Image
                        src={token.attachment}
                        width={24}
                        height={24}
                        alt="token"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-typo-primary">{data.asset}</span>
                        <span className="text-typo-secondary">/ USDT</span>
                    </div>
                </div>
                <div
                    className={cn(
                        "!text-body-12 text-typo-primary py-2 px-3 text-center rounded-sm",
                        side === ENUM_INSURANCE_SIDE.BULL ? 'bg-positive-label' : 'text-negative-label',
                    )}>
                    {side}
                </div>
            </section>
            <Separator className="my-3" />
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Expire time</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Expire time</p>}
                        showArrow={true}
                    />
                    <DateExpiredWrapper
                        expired={new Date(expiredAt)}
                        isCooldown={true}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <p className="text-typo-secondary border-b border-dashed border-divider-secondary">HashID</p>
                    <div className="flex items-center gap-1">
                        <div className="text-primary-3">{id}</div>
                        <Button
                            size="md"
                            className=""
                            onClick={(e) => handleCopy(e, id)}>
                            <ClipboardIcon height={20} width={20} />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Open price</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">P-Open</p>}
                        showArrow={true}
                    />
                    <p className="text-primary-3">
                        {formatNumber(p_open)}
                    </p>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Claim price</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">P-Claim</p>}
                        showArrow={true}
                    />
                    <p className="text-primary-3">
                        {formatNumber(p_claim)}
                    </p>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Market price</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">P-Market</p>}
                        showArrow={true}
                    />
                    <TickerWrapper
                        jump
                        symbol={`${asset}USDT`}
                        decimal={8}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Expire price</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">P-Expire</p>}
                        showArrow={true}
                    />
                    <PriceExpiredWrapper
                        pExpired={p_liquidation}
                        symbol={`${asset}USDT`}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Claim amount</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Claim amount</p>}
                        showArrow={true}
                    />
                    <QClaimWrapper
                        qClaim={q_claim}
                        margin={margin}
                    />
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Margin</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Margin</p>}
                        showArrow={true}
                    />
                    <p>
                        {formatNumber(margin)}
                    </p>
                </div>
                <div className="flex items-center justify-between text-body-12">
                    <TooltipCustom
                        content={<p>Cover amount</p>}
                        title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Cover amount</p>}
                        showArrow={true}
                    />
                    <p>{formatNumber(q_covered)}</p>
                </div>
            </section>
        </section>
    );
};

export default MobileRecord;