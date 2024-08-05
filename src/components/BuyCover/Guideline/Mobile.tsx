import colors from '@/colors';
import { cn } from '@/utils';
import range from 'lodash/range';

import Button from '@/components/common/Button';
import ArrowIcons from '@/components/common/Icons/ArrowIcon';
import CloseIcon from '@/components/common/Icons/CloseIcon';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useBuyCoverStore from '@/stores/buy-cover.store';
import { useEffect, useMemo, useRef, useState } from 'react';
import Tour, { ReactourStep, ReactourStepContentArgs } from 'reactour';

type GuidelineProps = {
    start: boolean;
    setStart: (b: boolean) => void;
};
const Mobile = ({ start, setStart }: GuidelineProps) => {

    const isMobile = useIsMobile();
    const [step, setStep] = useState(0);
    const refGuide = useRef<any>(null);

    const onClose = (e: boolean) => {
        if (!e) {
            setTimeout(
                () => {
                    if (refGuide.current.state.current === tourConfig.length - 1) {
                        setStart(false);
                    } else {
                        refGuide.current.nextStep();
                    }
                },
                refGuide.current.state.current === 1 ? 500 : 0,
            );
        } else {
            setStart(false);
        }
    };

    const getCurrentStep = (step: number) => {
        if (step === 2) {
            window.scrollTo(0, 0);
        }
        setStep(step);
    };

    const tourConfig: ReactourStep[] = useMemo(
        () => [
            {
                selector: '[data-tour="market"]',
                content: (props: ReactourStepContentArgs) => (
                    <Content title="Asset" {...props} onClose={onClose}>
                        Choose your asset
                    </Content>
                ),
                position: 'bottom',
            },
            {
                selector: '[data-tour="chart"]',
                content: (props: ReactourStepContentArgs) => (
                    <Content title="Chart" {...props} onClose={onClose}>
                        View price milestones related to your contracts. You can expand/collapse the chart if needed
                    </Content>
                ),
                position: 'right',
            },
            {
                selector: '[data-tour="place-order"]',
                content: (props: ReactourStepContentArgs) => (
                    <Content title="Input contract information" {...props} onClose={onClose}>
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
                    </Content>
                ),
                position: isMobile ? 'bottom' : 'left',
            },
            {
                selector: '[data-tour="confirm-order"]',
                content: (props: ReactourStepContentArgs) => (
                    <Content title="Follow and customize other terms of insurance contracts" {...props} onClose={onClose}>
                        <ul className="list-disc pl-4">
                            <li>
                                Margin - Contract margin value
                            </li>
                            <li>
                                Claim Amount (Claim Ratio) - Total amount of insurance payout received when touching Claim Price and Insurance payout ratio compared to initial deposit
                            </li>
                        </ul>
                    </Content>
                ),
                position: isMobile ? 'top' : 'left',
            },
            {
                selector: '[data-tour="tab-covered"]',
                highlightedSelectors: ['[data-tour="tab-covered2"]'],
                content: (props: ReactourStepContentArgs) => (
                    <Content title="Follow the progress of insurance contracts" {...props} onClose={onClose}>
                        Track progress and view contract details in the Contract History and Avalable Contracts sections.
                    </Content>
                ),
                position: 'top',
            },
        ],
        [isMobile],
    );

    const { toggleFormBuyCover } = useBuyCoverStore();
    useEffect(() => {
        toggleFormBuyCover([2, 3].includes(step));
    }, [step]);

    const currentPosition = useMemo(() => tourConfig[step].position, [refGuide?.current?.state?.current, tourConfig]);

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            className={cn('reactour_hakifi', currentPosition)}
            rounded={6}
            startAt={0}
            maskSpace={4}
            disableInteraction
            disableKeyboardNavigation
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            ref={refGuide}
            maskClassName="guideline"
            accentColor={colors.background.tertiary}
            inViewThreshold={isMobile ? 0 : 100}
        />
    );
};

const Content = ({
    title, children, step, onClose, goTo
}: any) => {
    const steps = 5;

    return (
        <div className="relative sm:w-[410px] w-[350px]">
            <div id={`guideline-step-${step}`} className="flex flex-col gap-5 bg-background-tertiary p-5 rounded ">
                <div className="flex items-center justify-between space-x-4">
                    {step > 0 ? (
                        <Button size="lg" onClick={() => goTo(step - 2)}>
                            <ArrowIcons className="rotate-180" />
                        </Button>
                    ) : (
                        <div />
                    )}

                    <Button size="lg" id="close" onClick={() => onClose(true)}>
                        <CloseIcon />
                    </Button>
                </div>
                <div className="">
                    <div className="text-title-24 text-typo-primary">{title}</div>
                    <div className="text-typo-secondary text-body-16 overflow-y-auto custom-scroll mt-3">{children}</div>
                </div>
                <section className="flex justify-between items-center">
                    <div className="flex space-x-1 w-full">
                        {range(steps).map((index) => (
                            <div key={index} className={cn("max-w-6 w-full h-1 rounded",
                                step > index ? "bg-background-primary" : "bg-background-quaternary"
                            )} />
                        ))}
                    </div>
                    {
                        step !== steps ? <Button size="lg" variant="primary" className="px-11" id="next" onClick={() => onClose(step === steps)}>
                            Next
                        </Button> : <Button variant="primary" point={true} size="lg" className="px-11" id="close" onClick={() => onClose(step === steps)}>
                            Done
                        </Button>
                    }
                </section>
            </div>
        </div>
    );
};

export default Mobile;
