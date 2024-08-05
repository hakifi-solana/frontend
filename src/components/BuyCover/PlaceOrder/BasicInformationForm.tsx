import { FormValue } from '@/@type/common.type';
import { PairDetail, PeriodChangeRatio } from '@/@type/pair.type';
import colors from '@/colors';
import Button from '@/components/common/Button';
import { Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerPortal, DrawerTitle, DrawerTrigger } from '@/components/common/Drawer/Base';
import CheckIcon from '@/components/common/Icons/CheckIcon';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import Popup from '@/components/common/Popup';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import { informula } from '@/lib/informula';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { cn } from '@/utils';
import { formatNumber } from '@/utils/format';
import { USDT_ADDRESS } from '@/web3/constants';
import { useEffect, useMemo, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useAccount, useBalance } from 'wagmi';

type BasicInformationFormProps = {
    pair: PairDetail;
    setValue: UseFormSetValue<FormValue>;
};

const BasicInformationForm = ({ pair, setValue }: BasicInformationFormProps) => {
    const { handleToggle, toggle } = useToggle();
    const onmounted = useRef(false);
    const { address } = useAccount();
    const usdtBalance = useBalance({
        address,
        token: USDT_ADDRESS,
    });

    const [hedgeClaim, periodUnit, period] = useBuyCoverStore(state => [state.hedgeClaim, state.periodUnit, state.period]);
    const listChangeRatios = useMemo(() => pair.config.listChangeRatios || [], [pair.config.listChangeRatios]);

    const listAvailablePeriod = useMemo(() => {
        try {
            if (hedgeClaim) {
                const list = informula.getAvailablePeriod(hedgeClaim, listChangeRatios) as PeriodChangeRatio[];
                return list;
            }
            return [];
        } catch (error) {
            return [];
        }
    }, [hedgeClaim, listChangeRatios]);

    useEffect(() => {
        if (listAvailablePeriod.length > 0 && !onmounted.current) {
            setValue("periodUnit", listAvailablePeriod[0].periodUnit);
            setValue("period", listAvailablePeriod[0].period);

            onmounted.current = true;
        }
    }, [listAvailablePeriod]);

    const handleChangePeriod = (period: number, periodUnit: string) => {
        setValue("periodUnit", periodUnit);
        setValue("period", period);
        handleToggle();
    };

    const isMobile = useIsMobile();
    return (
        <section className="text-body-14 flex items-center justify-between">
            <section className="text-typo-secondary">Avaiable: <span className="text-typo-primary"> {formatNumber(usdtBalance.data?.formatted)} USDT</span></section>
            <section className="flex items-center text-typo-secondary gap-2">Period:
                {
                    !isMobile ? <Popup
                        classContent="max-w-[180px]"
                        isOpen={toggle}
                        handleOnChangeStatus={handleToggle}
                        content={
                            <>
                                {
                                    listAvailablePeriod.length > 0 ? listAvailablePeriod.map((item, index) => {
                                        return (
                                            <Button size="sm" onClick={() => handleChangePeriod(item.period, item.periodUnit)} key={item.period + index} className="flex gap-2 items-center p-2 hover:bg-grey-2/50 w-full rounded-[10px] transition-all duration-200 ease-linear">
                                                <div className={cn("h-5 flex items-center gap-1 text-body-14", item.period === period && item.periodUnit === periodUnit && "text-typo-accent")}>
                                                    <span>{item.period}</span>
                                                    <span>{item.periodUnit}</span>
                                                </div>

                                                <CheckIcon className={cn("size-4", item.period === period && item.periodUnit === periodUnit ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                            </Button>
                                        );
                                    }) : null
                                }
                            </>
                        }
                    >
                        <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm">
                            <span className={cn(toggle ? "text-typo-accent" : "text-typo-secondary")}> {period} {periodUnit}</span>
                            <ChevronIcon
                                className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                color={toggle ? colors.typo.accent : colors.typo.secondary}
                            />
                        </Button>
                    </Popup> :
                        <Drawer open={toggle} modal={true}>
                            <DrawerTrigger asChild onClick={handleToggle}>
                                <Button size="sm" variant="outline" point={false} className="flex items-center gap-1 !py-1 !px-2 !rounded-sm">
                                    <span className={cn(toggle ? "text-typo-accent" : "text-typo-secondary")}> {period} {periodUnit}</span>
                                    <ChevronIcon
                                        className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                                        color={toggle ? colors.typo.accent : colors.typo.secondary}
                                    />
                                </Button>
                            </DrawerTrigger>
                            <DrawerPortal>
                                <DrawerOverlay className="!z-[41] bg-background-scrim" />
                            </DrawerPortal>
                            <DrawerContent onInteractOutside={handleToggle} className="!z-[60]" overlay={false}>
                                <DrawerHeader>
                                    <div className="flex justify-end items-center">
                                        <CloseIcon onClick={handleToggle} />
                                    </div>
                                    <DrawerTitle className="!text-title-20 text-typo-primary my-4">Period</DrawerTitle>
                                </DrawerHeader>
                                <>
                                    {
                                        listAvailablePeriod.length > 0 ? listAvailablePeriod.map((item, index) => {
                                            return (
                                                <Button size="md" onClick={() => handleChangePeriod(item.period, item.periodUnit)} key={item.period + index} className="flex justify-between items-center py-2 hover:bg-grey-2/50 w-full rounded-[10px] transition-all duration-200 ease-linear">
                                                    <div className={cn("h-5 flex items-center gap-2", item.period === period && item.periodUnit === periodUnit && "text-typo-accent")}>
                                                        <span>{item.period}</span>
                                                        <span>{item.periodUnit}</span>
                                                    </div>

                                                    <CheckIcon className={cn("size-4", item.period === period && item.periodUnit === periodUnit ? 'opacity-100' : 'opacity-0')} color={colors.background.primary} />
                                                </Button>
                                            );
                                        }) : null
                                    }
                                </>

                            </DrawerContent>
                        </Drawer>
                }
            </section>
        </section>
    );
};

export default BasicInformationForm;