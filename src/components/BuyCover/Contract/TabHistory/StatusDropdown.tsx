import colors from '@/colors';
import Button from '@/components/common/Button';
import ChevronIcon from '@/components/common/Icons/ChevronIcon';
import TickIcon from '@/components/common/Icons/TickIcon';
import Popup from '@/components/common/Popup';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import { cn } from '@/utils';
import { STATE_INSURANCES } from '@/utils/constant';
import React, { useMemo, useState } from 'react';

interface IStatusDropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    afterIcon?: React.ReactNode;
    classContent?: string;
    status?: string;
    handleSetStatus: (asset: string | undefined) => void;
}

const StatusDropdown = React.forwardRef<HTMLButtonElement, IStatusDropdownProps>(({
    className,
    classContent,
    handleSetStatus,
    status,
    ...rest
}, forwardedRef) => {
    const isMobile = useIsMobile();
    const { handleToggle, toggle } = useToggle();

    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const getStatus = useMemo(() => {
        const status = Object.keys(STATE_INSURANCES);
        return ["All", ...status];
    }, []);

    const handleSetSelectedStatus = (status: string) => {
        handleSetStatus(status !== "All" ? status : undefined);
        setSelectedStatus(status);
        handleToggle();
    };

    if (isMobile) {
        return <>
            <p className="my-4 text-title-20">
                Contract status
            </p>

            <section className="mt-3 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[300px]">
                {getStatus.map((status, index) => (
                    <Button size="md" key={status} onClick={() => handleSetSelectedStatus(status)} className={cn("w-full flex items-center justify-between py-2 hover:text-typo-accent hover:bg-background-secondary hover:px-2 transition-all duration-200",
                        selectedStatus === status && "bg-background-secondary text-typo-accent px-2"
                    )}>
                        <span className={cn(selectedStatus === status ? "text-typo-accent" : "text-typo-primary")}>{STATE_INSURANCES[status] || "All"}</span>

                        {
                            selectedStatus === status && <TickIcon className="size-3.5" />
                        }
                    </Button>
                ))}
            </section>
        </>;
    }

    return (
        <Popup
            isOpen={toggle}
            classTrigger=""
            classContent="w-[250px] p-4"
            handleOnChangeStatus={handleToggle}
            content={

                <section className="mt-3 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[300px]">
                    {getStatus.map((status, index) => (
                        <Button size="md" key={status} onClick={() => handleSetSelectedStatus(status)} className={cn("w-full flex items-center justify-between py-2 hover:text-typo-accent hover:bg-background-secondary hover:px-2 transition-all duration-200",
                            selectedStatus === status && "bg-background-secondary text-typo-accent px-2"
                        )}>
                            <span className={cn(selectedStatus === status ? "text-typo-accent" : "text-typo-primary")}>{STATE_INSURANCES[status] || "All"}</span>

                            {
                                selectedStatus === status && <TickIcon className="size-3.5" />
                            }
                        </Button>
                    ))}
                </section>
            }
        >
            <Button
                size="lg"
                variant="outline"
                point={false}
                className="w-[200px]"
                ref={forwardedRef}
                {...rest}
            >
                <section className="w-full flex items-center justify-between gap-2">
                    <div className="!text-body-14">
                        {
                            selectedStatus ? <span className={cn(!toggle ? "text-typo-primary" : "text-typo-accent")}>{STATE_INSURANCES[selectedStatus]}</span> : <span className="text-typo-secondary">Select status</span>
                        }
                    </div>
                    <ChevronIcon
                        className={cn('duration-200 ease-linear transition-all', toggle ? 'rotate-180' : 'rotate-0')}
                        color={toggle ? colors.typo.accent : colors.typo.secondary}
                    />
                </section>
            </Button>
        </Popup >
    );
});

export default StatusDropdown;
