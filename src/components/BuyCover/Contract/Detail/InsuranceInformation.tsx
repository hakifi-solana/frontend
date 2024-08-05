"use client";

import Tag from "@/components/common/Tag";
import TagStatus from "@/components/common/TagStatus";
import TooltipCustom from "@/components/common/Tooltip";
import useTicker from "@/hooks/useTicker";
import { cn } from "@/utils";
import { STATE_INSURANCES, STATUS_DEFINITIONS } from "@/utils/constant";
import { formatNumber, formatTime } from "@/utils/format";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { useMemo } from "react";
import { InsuranceInformation } from ".";
import TickerWrapper from "../../Favorites/TickerWrapper";
import { PnlWrapper, TimeAgoInsurance } from "../utils";

type InsuranceProps = {
    insurance: InsuranceInformation;
    className?: string;
};

export const OpeningInsurance = ({ insurance, className }: InsuranceProps) => {
    const ticker = useTicker(`${insurance.asset}USDT`);
    const p_market = ticker?.lastPrice || 0;

    const qclaim_ratio = useMemo(() => {
        if (insurance.q_claim && insurance.margin)
            return formatNumber((insurance.q_claim / insurance.margin) * 100);
        return 0;
    }, [insurance]);

    const pclaim_ratio = useMemo(() => {
        if (insurance.p_claim)
            return {
                ratio: formatNumber(Math.abs((p_market - insurance.p_claim) / p_market) * 100),
                isIncrease: insurance.p_claim > p_market
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance, p_market]);

    const pexpire_ratio = useMemo(() => {
        if (insurance.p_liquidation)
            return {
                ratio: formatNumber(Math.abs((p_market - insurance.p_liquidation) / p_market) * 100),
                isIncrease: insurance.p_liquidation > p_market
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_liquidation, p_market]);

    return <section className={cn("flex flex-col gap-4", className)}>
        <div className="flex items-center justify-between">
            <div className="text-typo-secondary text-body-14">Status</div>

            <Tag
                variant={STATUS_DEFINITIONS[insurance.status].variant}
                text={STATUS_DEFINITIONS[insurance.status].title}
            />
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Cover amount</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Cover amount</p>}
                showArrow={true}
            />

            <div className="text-typo-primary">{formatNumber(insurance.q_covered)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Contract</div>
            <div className={cn("text-body-14", insurance.side === ENUM_INSURANCE_SIDE.BULL ? "text-positive-label" : "text-negative-label")}>{insurance.side}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Margin</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Margin</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.margin)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Period</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Period</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{insurance.period} {insurance.periodUnit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Open time</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Open time</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.openTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Expire time</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Expire time</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.expireTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Open price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Open price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_open)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Market price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Market price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">
                <TickerWrapper jump symbol={`${insurance.asset}${insurance.unit}`} suffix={insurance.unit} showPercent={false} />
            </div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Claim price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Claim price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_claim)} {insurance.unit} <span className={cn(pclaim_ratio.isIncrease ? "text-green" : "text-red")}>({pclaim_ratio.ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Claim amount</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Claim amount</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.q_claim)} {insurance.unit} <span className="text-green">({qclaim_ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Refund price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Refund price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_refund)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Expire price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Expire price</p>}
                showArrow={true}
            />

            <div className="text-typo-primary">{formatNumber(insurance.p_liquidation)} {insurance.unit} <span className={cn(pexpire_ratio.isIncrease ? "text-green" : "text-red")}>({pexpire_ratio.ratio}%)</span></div>
        </div>
    </section>;
};

export const HistoryInsurance = ({ insurance, className }: InsuranceProps) => {
    const qclaim_ratio = useMemo(() => {
        if (insurance.q_claim && insurance.margin)
            return formatNumber((insurance.q_claim / insurance.margin) * 100);
        return 0;
    }, [insurance]);

    const pclaim_ratio = useMemo(() => {
        if (insurance.p_claim && insurance.p_close)
            return {
                ratio: formatNumber(Math.abs((insurance.p_close - insurance.p_claim) / insurance.p_close) * 100),
                isIncrease: insurance.p_claim > insurance.p_close
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_close, insurance.p_claim]);

    const pexpire_ratio = useMemo(() => {
        if (insurance.p_liquidation && insurance.p_close)
            return {
                ratio: formatNumber(Math.abs((insurance.p_close - insurance.p_liquidation) / insurance.p_close) * 100),
                isIncrease: insurance.p_liquidation > insurance.p_close
            };
        return {
            ratio: 0,
            isIncrease: true
        };
    }, [insurance.p_liquidation, insurance.p_close]);

    return <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Expire</div>
            <TimeAgoInsurance insurance={insurance} className="text-typo-primary" />
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Status</div>
            <TagStatus
                status={insurance.status}
            />
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Reason</div>
            <div className="text-typo-primary">{insurance.invalidReason}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Cover amount</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Cover amount</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.q_covered)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">Expect</div>
            <div className={cn("text-body-14", insurance.side === ENUM_INSURANCE_SIDE.BULL ? "text-positive-label" : "text-negative-label")}>{insurance.side}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Margin</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Margin</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.margin)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Period</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Period</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{insurance.period} {insurance.periodUnit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Open time</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Open time</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.openTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Expire time</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Expire in</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.expireTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Close time</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Close time</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatTime(insurance.expireTime)}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Open price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Open price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_open)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Close price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Close price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_close)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Claim price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Claim price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_claim)} {insurance.unit} <span className={cn(pclaim_ratio.isIncrease ? "text-green" : "text-red")}>({pclaim_ratio.ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Claim amount</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Claim amount</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.q_claim)} {insurance.unit} <span className="text-green">({qclaim_ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Refund price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Refund price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_refund)} {insurance.unit}</div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <TooltipCustom
                content={<p>Expire price</p>}
                title={<p className="text-typo-secondary border-b border-dashed border-divider-secondary">Expire price</p>}
                showArrow={true}
            />
            <div className="text-typo-primary">{formatNumber(insurance.p_liquidation)} {insurance.unit} <span className={cn(pexpire_ratio.isIncrease ? "text-green" : "text-red")}>({pexpire_ratio.ratio}%)</span></div>
        </div>
        <div className="flex items-center justify-between text-body-14">
            <div className="text-typo-secondary text-body-14">PnL</div>
            <PnlWrapper margin={insurance.margin as number} q_claim={insurance.q_claim as number} state={insurance.state as string} />
        </div>
    </section>;
};