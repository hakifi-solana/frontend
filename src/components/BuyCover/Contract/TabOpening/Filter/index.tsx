import Button from '@/components/common/Button';
import { DateRangePicker } from '@/components/common/Calendar/DateRangPicker';
import FormInput from '@/components/common/FormInput';
import CalendarIcon from '@/components/common/Icons/CalendarIcon';
import FilterIcon from '@/components/common/Icons/FilterIcon';
import SearchIcon from '@/components/common/Icons/SearchIcon';
import useDebounce from '@/hooks/useDebounce';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import { cn } from '@/utils';
import { SortingState } from '@tanstack/react-table';
import { endOfDay, format, startOfDay } from "date-fns";
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useAccount } from 'wagmi';
import useToggle from '@/hooks/useToggle';
import Mobile from './Mobile';
import AssetDropdown from '../../Components/AssetsDropdown';

type FilterWrapperProps = {
    sorting: SortingState;
};

const FilterWrapper = ({ sorting }: FilterWrapperProps) => {
    const isMobile = useIsMobile();
    const [asset, setAsset] = useState<string | undefined>(undefined);
    const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
    const [expireTime, setExpireTime] = useState<DateRange | undefined>(undefined);

    const [searchTX, setSetsearchTX] = useState('');
    const debouncedValue = useDebounce(searchTX, 500);
    const onChangeSearchTX = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setSetsearchTX(e.currentTarget.value);
    }, []);
    const { symbol } = useParams();

    const { isConnected, address } = useAccount();
    const [currentPage, getInsuranceOpening, hideOtherSymbol] = useInsuranceStore(state => [
        state.currentPage,
        state.getInsuranceOpening,
        state.hideOtherSymbol
    ]);

    const { closedFrom, closedTo } = useMemo(() => {
        if (expireTime) {
            const closedFrom = startOfDay(expireTime.from || new Date());
            const closedTo = expireTime.to && expireTime.from?.getTime() !== expireTime.to?.getTime() ? endOfDay(expireTime.to) : endOfDay(expireTime?.from || new Date());
            return {
                closedFrom,
                closedTo
            };
        }
        return {
            closedFrom: undefined,
            closedTo: undefined
        };
    }, [expireTime]);

    const { createdFrom, createdTo } = useMemo(() => {
        if (openTime) {
            const createdFrom = startOfDay(openTime.from || new Date());
            const createdTo = openTime.to && openTime.from?.getTime() !== openTime.to?.getTime() ? endOfDay(openTime.to) : endOfDay(openTime.from || new Date());

            return {
                createdFrom,
                createdTo
            };
        }
        return {
            createdFrom: undefined,
            createdTo: undefined
        };
    }, [openTime]);

    useEffect(() => {
        if (address && isConnected) {
            const assetFilter = hideOtherSymbol ? (symbol as string).split('USDT')[0] : (asset || "");
            getInsuranceOpening({
                page: Number(currentPage || 1),
                sort: sorting.map(item => `${item.desc ? '-' : ''}${item.id}`).join('') || undefined,
                q: debouncedValue || undefined,
                closedFrom,
                closedTo,
                createdFrom,
                createdTo,
                asset: assetFilter
            });
        }

    }, [address,
        currentPage,
        isConnected,
        sorting,
        debouncedValue,
        openTime,
        expireTime,
        hideOtherSymbol,
        asset
    ]);

    const { toggle, handleToggle } = useToggle();

    if (isMobile) {
        return <>
            <div className="flex items-center gap-3 px-4 mt-5">
                <FormInput
                    size="lg"
                    value={searchTX}
                    onChange={onChangeSearchTX}
                    wrapperClassInput="w-full"
                    suffixClassName="!border-none !py-0"
                    placeholder="Search by Hash ID"
                    prefix={<SearchIcon className="size-4" />}
                />
                <Button size="md" onClick={handleToggle} variant="outline" point={false} className="h-10 flex items-center justify-center">
                    <FilterIcon />
                </Button>
            </div>


            <Mobile
                isOpen={toggle}
                handleOpenStatusChange={handleToggle}
                handleChangeAsset={(asset: string) => setAsset(asset)}
                handleChangeOpenTime={setOpenTime}
                handleChangeExpireTime={setExpireTime}
            />

        </>;
    }

    return (
        <div className="flex items-center gap-4 px-5 py-6">
            <section>
                <p className="text-body-16 text-typo-primary">Asset</p>
                <section className="mt-2">
                    <AssetDropdown asset={asset} handleSetAsset={(asset: string) => setAsset(asset)} classContent="!w-full"
                    />
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">T-Start</p>
                <section className="mt-2">
                    <DateRangePicker onChange={setOpenTime} range={openTime}>
                        <Button variant="outline" point={false} size="lg" className="group w-[150px]">
                            <section className="flex items-center justify-between w-full text-body-14">
                                <div className="text-ellipsis overflow-hidden max-w-20">
                                    {openTime?.from ? (
                                        openTime.to ? (
                                            <>
                                                {format(openTime.from, "LLL dd, y")} -{" "}
                                                {format(openTime.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(openTime.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span className="text-typo-secondary group-hover:text-typo-accent">Select time</span>
                                    )}
                                </div>

                                <CalendarIcon
                                    className={cn("group-hover:[&>path]:fill-background-primary")}
                                />
                            </section>
                        </Button>
                    </DateRangePicker>
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">T-Expire</p>
                <section className="mt-2">
                    <DateRangePicker onChange={setExpireTime} range={expireTime}>
                        <Button variant="outline" point={false} size="lg" className="group w-[150px]">
                            <section className="flex items-center justify-between w-full text-body-14">
                                <div className="text-ellipsis overflow-hidden max-w-20">
                                    {expireTime?.from ? (
                                        expireTime.to ? (
                                            <>
                                                {format(expireTime.from, "LLL dd, y")} -{" "}
                                                {format(expireTime.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(expireTime.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span className="text-typo-secondary group-hover:text-typo-accent">Select time</span>
                                    )}
                                </div>

                                <CalendarIcon
                                    className={cn("group-hover:[&>path]:fill-background-primary")}
                                />
                            </section>
                        </Button>
                    </DateRangePicker>
                </section>
            </section>
            <section>
                <p className="text-body-16 text-typo-primary">Search</p>
                <section className="mt-2">
                    <FormInput
                        size="lg"
                        value={searchTX}
                        onChange={onChangeSearchTX}
                        suffixClassName="!border-none !py-0"
                        placeholder="Search by Hash ID"
                        prefix={<SearchIcon className="size-4" />}
                    />
                </section>
            </section>
        </div>
    );
};

export default FilterWrapper;