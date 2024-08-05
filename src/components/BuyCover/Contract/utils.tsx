import useTicker from '@/hooks/useTicker';
import { formatNumber } from '@/utils/format';
import { addMinutes, format } from 'date-fns';
import { MouseEvent, ReactNode, memo, useMemo } from 'react';
import Countdown from 'react-countdown';
// import { InsuranceInformation } from './Detail';
import Button from '@/components/common/Button';
import TooltipCustom from '@/components/common/Tooltip';
import { cn } from '@/utils';
import { differenceTime, inRange } from '@/utils/helper';
import { ENUM_INSURANCE_SIDE } from 'hakifi-formula';
import { InsuranceInformation } from './Detail';
import { STATE_INSURANCES } from '@/utils/constant';

export type CountdownType = {
  date: Date;
  onEnded?: () => void;
};

export const CountdownWrapper = memo(({ date, onEnded }: CountdownType) => {
  const renderTimer = ({ days, hours, minutes, seconds }: any) => {
    const formatTime = (time: string | number) => {
      return time.toString().padStart(2, '0');
    };
    return (
      <>
        {days}&nbsp;Days&nbsp;
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </>
    );
  };
  return (
    <>
      <Countdown
        date={date}
        onComplete={onEnded}
        renderer={({ days, hours, minutes, seconds }) =>
          renderTimer({ days, hours, minutes, seconds })
        }
      />
    </>
  );
});

export const PriceExpiredWrapper = memo(
  ({ pExpired, symbol }: { pExpired: number; symbol: string; }) => {
    const ticker = useTicker(symbol);
    const value: number = Number(ticker?.lastPrice) ?? 0;
    const percentPExpire = useMemo(
      () => (value - pExpired) / value,
      [pExpired, value],
    );

    return (
      <div className="flex items-center space-x-1">
        <span className="text-primary-3">{formatNumber(pExpired)}</span>
        <span className={pExpired > value ? 'text-positive-label' : 'text-negative-label'}>
          ({formatNumber(Math.abs(percentPExpire) * 100, 2)}%)
        </span>
      </div>
    );
  },
);

type DateExpiredWrapperProps = {
  expired: Date;
  isCooldown?: boolean;
};
export const DateExpiredWrapper = memo(
  ({ expired, isCooldown = false }: DateExpiredWrapperProps) => {
    const onCompleted = () => {
      console.log('Completed');
    };

    if (isCooldown)
      return (
        <div className="text-primary-3">
          <CountdownWrapper date={expired} onEnded={onCompleted} />
        </div>
      );
    return `${format(new Date(expired), 'dd/MM/yyyy')} - ${format(
      new Date(expired),
      'hh:mm',
    )}`;
  },
);

type CloseButtonProps = {
  pCancel: number;
  pClaim: number;
  symbol: string;
  className?: string;
  title: string;
  side?: ENUM_INSURANCE_SIDE;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  state?: string;
};
export const CloseButton = memo(
  ({
    pCancel,
    pClaim,
    symbol,
    className,
    title,
    onClick,
    side,
    state,
  }: CloseButtonProps) => {
    const ticker = useTicker(symbol);
    const value: number = Number(ticker?.lastPrice) ?? 0;
    const isClose = state === 'AVAILABLE' ? inRange(value, pCancel, pClaim) : false;
    const { p_floor, p_ceil } = useMemo(() => {
      if (side === ENUM_INSURANCE_SIDE.BULL) {
        return {
          p_floor: formatNumber(pCancel),
          p_ceil: formatNumber(pClaim),
        };
      }
      return {
        p_floor: formatNumber(pClaim),
        p_ceil: formatNumber(pCancel),
      };
    }, [side]);
    return (
      <Button
        size="lg"
        onClick={onClick}
        disabled={!isClose}
        variant="primary"
        className={cn('px-4 py-1 w-full justify-center', className)}>
        <span className="">{title}</span>
      </Button>
    );
  },
);

type PnlWrapperProps = {
  state: string;
  q_claim: number;
  margin: number;
};
export const PnlWrapper = memo(
  ({ state, q_claim, margin }: PnlWrapperProps) => {
    const getPnl = useMemo(() => {
      switch (state) {
        case 'CLAIM_WAITING':
        case 'CLAIMED': {
          const pnl = formatNumber(Number(q_claim) - Number(margin));
          const ratio = formatNumber((Number(pnl) / Number(margin)) * 100);

          return {
            pnl,
            ratio,
          };
        }

        case 'EXPIRED':
        case 'LIQUIDATED': {
          return {
            pnl: margin * -1,
            ratio: -100,
          };
        }

        // case 'REFUNDED':
        // case 'CANCELED':
        // case 'INVALID':
        // case 'REFUND_WAITING': {
        //   return {
        //     pnl: 0,
        //     ratio: 0
        //   };
        // }

        default:
          return {
            pnl: 0,
            ratio: 0,
          };
      }
    }, [state, q_claim, margin]);

    return (
      <div
        className={cn(
          'text-body-14',
          Number(getPnl.ratio) >= 0 ? 'text-positive' : 'text-negative',
        )}>
        {getPnl.pnl} USDT ({Number(getPnl.ratio) >= 0 ? '+' : ''}
        {getPnl.ratio}%)
      </div>
    );
  },
);

export const TimeAgoInsurance = ({
  insurance,
  className,
}: {
  insurance: InsuranceInformation;
  className?: string;
}) => {
  const waiting = STATE_INSURANCES.CLAIM_WAITING === insurance?.state;
  const timer = insurance?.updatedAt
    ? new Date(insurance?.updatedAt)
    : new Date(0);
  if (!timer) return null;
  const ts = waiting ? addMinutes(timer, 15) : timer;
  const { days, hours, minutes, seconds }: any = differenceTime(ts, waiting);
  const unit = () => {
    if (days > 0) return 'days';
    if (hours > 0) return 'hours';
    if (minutes > 0) return 'minutes';
    return 'seconds';
  };

  return (
    <div className={cn(className)}>
      <span>
        {
          (days || hours || minutes || seconds) +
          ' ' +
          String(unit()).toLowerCase()
        }
      </span>
      <span>
        {
          waiting ? " left" : " ago"
        }
      </span>
    </div>
  );
};

type QClaimProps = {
  qClaim: number;
  margin: number;
};

export const QClaimWrapper = ({ qClaim, margin }: QClaimProps) => {
  const r_claim = useMemo(() => {
    if (margin) {
      return formatNumber((qClaim / margin) * 100, 2);
    }
    return 0;
  }, []);
  return (
    <div className="flex items-center ">
      <span className="flex items-center text-primary-3">
        {formatNumber(qClaim)} USDT
      </span>
      <span className="text-positive">({r_claim}%)</span>
    </div>
  );
};

type TooltipHeaderWrapperProps = {
  title: string;
  tooltip: string;
  onClick?: () => void;
  suffix?: ReactNode;
  className?: string;
};
export const TooltipHeaderWrapper = ({
  title,
  tooltip,
  onClick,
  suffix,
  className = '',
}: TooltipHeaderWrapperProps) => {
  return (
    <TooltipCustom
      content={tooltip}
      placement="top"
      titleClassName="text-typo-secondary"
      title={<div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onClick}
          className="flex items-center border-b border-dashed border-divider-secondary">
          <span className={className}> {title}</span>
        </Button>
        {suffix && suffix}
      </div>}
      showArrow={true}
    />);
};
