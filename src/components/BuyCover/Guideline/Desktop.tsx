import colors from '@/colors';
import { cn } from '@/utils';
import range from 'lodash/range';
import Joyride, { ACTIONS, CallBackProps, EVENTS, ORIGIN, Placement, STATUS, TooltipRenderProps } from 'react-joyride';

import Button from '@/components/common/Button';
import ArrowIcons from '@/components/common/Icons/ArrowIcon';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import useBuyCoverStore from '@/stores/buy-cover.store';

type GuidelineProps = {
    start: boolean;
    setStart: (b: boolean) => void;
};

const Desktop = ({ start, setStart }: GuidelineProps) => {
    const steps = [
        {
            target: '[data-tour="market"]',
            content: "Choose your asset",
            title: "Asset",
            placement: 'bottom' as Placement,
            disableBeacon: true
        },
        {
            target: '[data-tour="chart"]',
            content: 'View price milestones related to your contracts. You can expand/collapse the chart if needed',
            title: "Chart",
            placement: 'right-start' as Placement,
            disableBeacon: true,
        },
        {
            target: '[data-tour="place-order"]',
            content: (
                <ul className="list-disc pl-4 text-typo-secondary">
                    <li>
                        Cover Amount - Amount of assets to be covered.
                    </li>
                    <li>
                        Claim Price - The covered price
                    </li>
                    <li>
                        Period - number of contract days
                    </li>
                </ul>
            ),
            title: "Input contract information",
            placement: "bottom" as Placement,
            disableBeacon: true
        },
        {
            target: '[data-tour="confirm-order"]',
            content: (
                <ul className="list-disc pl-4">
                    <li>
                        Margin - Contract margin value
                    </li>
                    <li>
                        Claim Amount (Claim Ratio) - Total amount of insurance payout received when touching Claim Price and Insurance payout ratio compared to initial deposit
                    </li>
                </ul>
            ),
            title: "Follow and customize other terms of insurance contracts",
            placement: "bottom" as Placement,
            disableBeacon: true
        },
        {
            target: '[data-tour="tab-covered"]',
            content: "Track progress and view contract details in the Contract History and Avalable Contracts sections.",
            title: "Follow the progress of insurance contracts",
            placement: 'top' as Placement,
            disableBeacon: true
        },
    ];

    const handleJoyrideCallback = async (data: CallBackProps) => {
        const { action, index, origin, status, type, controlled } = data;

        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        const eventsStatuses: string[] = [EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND];

        if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
            // do something
        }
        if (type === EVENTS.STEP_BEFORE) {
            console.log(index);
        }

        if (eventsStatuses.includes(type)) {
            // Update state to advance the tour

        } else if (finishedStatuses.includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            setStart(false);
            // handleToggle();
        }
    };

    return <Joyride
        callback={handleJoyrideCallback}
        tooltipComponent={Content}
        run={start}
        continuous
        scrollOffset={100}
        scrollDuration={100}
        showProgress
        showSkipButton
        steps={steps}
        styles={{
            options: {
                zIndex: 10000,
                arrowColor: colors.background.tertiary,
                backgroundColor: colors.background.tertiary,
                textColor: colors.typo.primary,

                spotlightShadow: colors.background.tertiary,
            },

        }}
        floaterProps={{
            styles: {

                arrow: {
                    length: 9,
                    spread: 18,
                }
            }

        }}
    />;
};

const Content = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
}: TooltipRenderProps) => {
    const steps = 5;

    return (
        <div className="relative sm:w-[410px] w-[350px]">
            <div id={`guideline-step-${index}`} className="flex flex-col gap-5 bg-background-tertiary p-5 rounded ">
                <div className="flex items-center justify-between space-x-4">
                    {index > 0 ? (
                        <Button size="lg" {...backProps}>
                            <ArrowIcons className="rotate-180" />
                        </Button>
                    ) : (
                        <div />
                    )}

                    <Button size="lg" id="close" {...closeProps}>
                        <CloseIcon />
                    </Button>
                </div>
                <div className="">
                    <div className="text-title-24 text-typo-primary">{step.title}</div>
                    <div className="text-typo-secondary text-body-16 overflow-y-auto custom-scroll mt-3">{step.content}</div>
                </div>
                <section className="flex justify-between items-center">
                    <div className="flex space-x-1 w-full">
                        {range(steps).map((step) => (
                            <div key={step} className={cn("max-w-6 w-full h-1 rounded",
                                step <= index ? "bg-background-primary" : "bg-background-quaternary"
                            )} />
                        ))}
                    </div>
                    {
                        index !== steps - 1 ? <Button size="lg" variant="primary" className="px-11" id="next" {...primaryProps}>
                            Next
                        </Button> : <Button variant="primary" point={true} size="lg" className="px-11" id="close" {...closeProps}>
                            Done
                        </Button>
                    }
                </section>
            </div>
        </div>
    );
};

export default Desktop;
