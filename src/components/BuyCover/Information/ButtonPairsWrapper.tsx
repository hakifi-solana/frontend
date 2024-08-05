import { MarketPair } from '@/@type/pair.type';
import { GetPairsParams } from '@/apis/pair.api';
import colors from '@/colors';
import SearchIcon from '@/components/common/Icons/SearchIcon';
import Popup from '@/components/common/Popup';
import useMarketPair from '@/hooks/useMarketPair';
import useSorting from '@/hooks/useSorting';
import useToggle from '@/hooks/useToggle';
import debounce from 'lodash.debounce';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Button from '@/components/common/Button';
import DrawerWrapper from '@/components/common/Drawer';
import ArrowUpDownIcon from '@/components/common/Icons/ArrowUpDownIcon';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import GuideIcon from '@/components/common/Icons/GuideIcon';
import Input from '@/components/common/Input';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/utils';
import TokenItem from './TokenItem';
import TwoWayArrowIcon from '@/components/common/Icons/TwoWayArrowIcon';

interface IButtonChangePairProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    afterIcon?: React.ReactNode;
    symbol: string;
    marketPairs: MarketPair[];
}

const ButtonPairsWrapper = React.forwardRef<HTMLButtonElement, IButtonChangePairProps>(({
    className,
    symbol,
    marketPairs,
    ...rest
}, forwardedRef) => {
    const { toggle, handleToggle } = useToggle();
    const [searchKey, setSetsearchKey] = useState('');
    const { getMarketPairAsync } = useMarketPair();

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSetsearchKey(value);

        debounce(() => {
            page.current = 0;
            getAllPair({ isReset: true, q: value });
        }, 300)();
    };
    const { getSort, handleSortFunc, sorting } = useSorting();
    const [pairs, setPairs] = useState<MarketPair[]>([]);
    const page = useRef<number>(0);

    const getAllPair = async ({ isReset = false, ...rest }: GetPairsParams & { isReset?: boolean; }) => {
        const sort = sorting.map(item => {
            if (item.desc === '') return '';
            return `${item.desc ? '-' : ''}${item.field}`;
        }).join('') || undefined;

        const response = await (getMarketPairAsync({ marketPairs, page: page.current, sort, ...rest }));
        setPairs(response);
        ++page.current;
    };

    useEffect(() => {
        page.current = 0;
        getAllPair({ isReset: true });
        return () => {
            page.current = 0;
        };
    }, [sorting]);

    const isMobile = useIsMobile();
    if (isMobile) {
        return <section className="flex flex-col gap-1" data-tour="market">
            <DrawerWrapper
                isOpen={toggle}
                handleOpenChange={handleToggle}
                content={
                    <>
                        <p className="my-4 text-title-20 text-center">
                            Trading pair
                        </p>
                        <section className="">
                            <section className="border border-divider-secondary rounded-sm py-1 px-2">
                                <Input
                                    size="md"
                                    value={searchKey}
                                    onChange={handleOnChange}
                                    suffixClassName="!border-none !py-0"
                                    placeholder="Search pair"
                                    suffix={<SearchIcon className="size-4" />}
                                />
                            </section>
                            <section className="mt-3 flex items-center gap-6">
                                <Button size="sm" onClick={() => handleSortFunc('symbol')} className="w-[140px] text-typo-secondary flex items-center gap-1">Trading pairs <ArrowUpDownIcon sort={getSort("symbol")?.desc} className="size-3" /></Button>
                                <section className="flex-2 flex items-center gap-8">
                                    <Button size="sm" onClick={() => handleSortFunc('last_price')} className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end">Last price <ArrowUpDownIcon sort={getSort("last_price")?.desc} className="size-3" /></Button>
                                    <Button size="sm" onClick={() => handleSortFunc('price_change')} className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end">24h Change <ArrowUpDownIcon sort={getSort("price_change")?.desc} className="size-3" /></Button>
                                </section>
                            </section>
                            <section className="mt-1 flex flex-col gap-3 -mr-4 pr-4 custom-scroll overflow-y-auto max-h-[300px]">
                                {pairs.map((pair, index) => (
                                    <TokenItem key={`${pair.id}-${index}`} pair={pair} />
                                ))}
                            </section>
                        </section>
                    </>
                }
            >
                <Button
                    size="lg"
                    className={
                        cn("flex flex-col items-start", className)
                    }
                    ref={forwardedRef}
                    {...rest}
                >
                    <section className="flex items-center gap-2">
                        <div className="text-title-20 sm:text-title-24">
                            <span className={cn(!toggle ? "text-typo-primary" : "text-typo-accent")}>{symbol.split('USDT')[0]}</span> <span className={!toggle ? "text-typo-secondary" : "text-typo-accent"}> / USDT</span>
                        </div>
                        <ChevronIcon
                            className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                            color={toggle ? colors.typo.accent : colors.typo.secondary}
                        />
                    </section>
                </Button>
            </DrawerWrapper>
            <div className="text-body-12 w-full text-typo-secondary flex items-center justify-start gap-2">
                DeFi Insurance <GuideIcon />
            </div>
        </section>;
    }

    return (
        <section className="flex flex-col gap-1"  data-tour="market">
            <Popup
                isOpen={toggle}
                classTrigger=""
                classContent="max-w-[560px] p-4"
                handleOnChangeStatus={handleToggle}
                sideOffset={-2}
                content={
                    <section className="">
                        <section className="border border-divider-secondary rounded-sm py-1 px-2">
                            <Input
                                size="md"
                                value={searchKey}
                                onChange={handleOnChange}
                                suffixClassName="!border-none !py-0"
                                placeholder="Search pair"
                                suffix={<SearchIcon className="size-4" />}
                            />
                        </section>
                        <section className="mt-3 flex items-center gap-6">
                            <Button size="sm" onClick={() => handleSortFunc('symbol')} className="w-[140px] text-typo-secondary flex items-center gap-1">Trading pairs <TwoWayArrowIcon sort={getSort("symbol")?.desc} className="size-3" /></Button>
                            <section className="flex-2 flex items-center gap-8">
                                <Button size="sm" onClick={() => handleSortFunc('last_price')} className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end">Last price <TwoWayArrowIcon sort={getSort("last_price")?.desc} className="size-3" /></Button>
                                <Button size="sm" onClick={() => handleSortFunc('price_change')} className="w-[90px] text-right text-typo-secondary flex items-center gap-1 justify-end">24h Change <TwoWayArrowIcon sort={getSort("price_change")?.desc} className="size-3" /></Button>
                            </section>
                        </section>
                        <section className="mt-3 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[300px]">
                            {pairs.map((pair, index) => (
                                <TokenItem key={`${pair.id}-${index}`} pair={pair} />
                            ))}
                        </section>
                    </section>
                }
            >

                <Button
                    size="lg"
                    className={
                        cn("flex flex-col items-start", className)
                    }
                    ref={forwardedRef}
                    {...rest}
                >
                    <section className="flex items-center gap-2">
                        <div className="text-title-20 sm:text-title-24">
                            <span className={cn(!toggle ? "text-typo-primary" : "text-typo-accent")}>{symbol.split('USDT')[0]}</span> <span className={!toggle ? "text-typo-secondary" : "text-typo-accent"}> / USDT</span>
                        </div>
                        <ChevronIcon
                            className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                            color={toggle ? colors.typo.accent : colors.typo.secondary}
                        />
                    </section>
                </Button>

            </Popup>
            <div className="text-body-12 w-full text-typo-secondary flex items-center justify-start gap-2">
                DeFi Insurance <GuideIcon />
            </div>
        </section>
    );
});

export default ButtonPairsWrapper;
