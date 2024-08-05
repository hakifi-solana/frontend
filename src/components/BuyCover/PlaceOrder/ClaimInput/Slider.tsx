import colors from "@/colors";
import useDebounce from "@/hooks/useDebounce";
import { informula } from "@/lib/informula";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { SIDE } from "@/utils/constant";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import ceil from 'lodash/ceil';
import floor from 'lodash/floor';
import inRange from 'lodash/inRange';
import round from 'lodash/round';
import SliderWrapper from "rc-slider";
import { useEffect, useMemo, useState } from "react";

const PADDING_SLIDER = {
    MIN: 26,
    MAX: 70,
};

type PClaimSliderProps = {
    p_market: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
};

const PClaimSlider = ({ min, max, onChange, p_market }: PClaimSliderProps) => {
    const { side, p_claim, periodChangeRatio } = useBuyCoverStore();

    const ratios = useMemo(() => {
        if (!p_market) return { min: 0, max: 0 };
        if (side === ENUM_INSURANCE_SIDE.BEAR) {
            return {
                min: informula.calculateHedge(Math.abs(max - p_market), p_market),
                max: informula.calculateHedge(Math.abs(min - p_market), p_market),
            };
        }
        return {
            min: informula.calculateHedge(Math.abs(min - p_market), p_market),
            max: informula.calculateHedge(Math.abs(max - p_market), p_market),
        };
    }, [min, max, p_market, side]);
    const rmin = ceil(ratios.min * 100, 1);
    const rmax = floor(ratios.max * 100, 1);
    const getRClaim = (p_claim?: number) => {
        if (!p_claim) {
            return side === ENUM_INSURANCE_SIDE.BEAR ? ratios.max : ratios.min;
        }
        const rclaim = p_market ? informula.calculateHedge(Math.abs(p_claim - p_market), p_market) : 0;
        return side === ENUM_INSURANCE_SIDE.BEAR ? ceil(rclaim, 3) : floor(rclaim, 3);
    };

    const [ratioClaim, setRatioClaim] = useState(getRClaim(p_claim));

    useEffect(() => {
        if (!!periodChangeRatio && p_claim && !inRange(p_claim, min, max)) {
            setRatioClaim(ceil(ratios.min, 3));
        }
    }, [periodChangeRatio]);

    const debouncedRClaim = useDebounce(ratioClaim, 100);

    useEffect(() => {
        if (!p_market || !debouncedRClaim) return;
        const negative = side === ENUM_INSURANCE_SIDE.BEAR ? -1 : 1;
        onChange(p_market + negative * debouncedRClaim * p_market);
    }, [p_market, debouncedRClaim, side]);

    const onChangeRatio = (value: number) => {
        let ratioClaim = value / 100;
        if (ratioClaim < ratios.min) ratioClaim = ratios.min;
        else if (ratioClaim > ratios.max) ratioClaim = ratios.max;
        setRatioClaim(ratioClaim);
    };

    let rstyleMin = (rmin / rmax) * 100;
    if (rstyleMin < PADDING_SLIDER.MIN) {
        rstyleMin = PADDING_SLIDER.MIN;
    } else if (rstyleMin > PADDING_SLIDER.MAX) {
        rstyleMin = PADDING_SLIDER.MAX;
    }

    const negative = useMemo(() => side === ENUM_INSURANCE_SIDE.BEAR ? -1 : 1, [side]);
    const marks = useMemo(() => {
        return {
            [rmin]: negative * rmin + '%',
            [rmax]: {
                label: negative * rmax + '%',
                style: {
                    transform: 'unset',
                    left: 'unset',
                    right: -6,
                },
            },
            [ratioClaim * 100]: {
                label: round(negative * ratioClaim * 100, 1) + '%',
                style: {
                    color: colors.typo.accent,
                    fontWeight: 600,
                    // background: colors.support.white,
                    zIndex: 1,
                    padding: '0 2px',
                },
            },
        };
    }, [negative, ratioClaim, rmin, rmax]);

    return (
        <div className="relative pt-5 pb-1.5 mb-5">
            <div className="flex">
                <div style={{ width: `${rstyleMin}%` }} className="flex items-center">
                    <div className="h-3 w-1 rounded bg-background-quaternary absolute border-1 border-typo-tertiary left-1" />
                    <div className="h-1 flex-1 bg-background-quaternary" />
                </div>
                <div style={{ width: `${100 - rstyleMin}%` }} className="relative pr-1.5 p-claim-slider">
                    <SliderWrapper
                        defaultValue={round(negative * ratioClaim * 100, 1)}
                        min={rmin}
                        max={rmax}
                        marks={marks}
                        step={0.1}
                        allowCross={false}
                        railStyle={
                            {
                                backgroundColor: colors.support.slider, height: 4, opacity: 0.2, width: '101.5%',
                            }
                        }
                        trackStyle={
                            {
                                backgroundColor: colors.background.primary, height: 4, color: colors.typo.accent,
                            }
                        }
                        handleStyle={{
                            width: 20,
                            height: 20,
                            backgroundColor: colors.background.primary,
                            top: 2,
                            opacity: 1,
                            zIndex: 2,
                            boxShadow: 'none',
                            borderRadius: 0
                        }}
                        dotStyle={
                            {
                                width: 4, height: 12, bottom: -4, backgroundColor: colors.support.slider, borderColor: colors.support.slider, borderWidth: 1, borderRadius: 1
                            }
                        }
                        value={ratioClaim * 100}
                        onChange={(value) => onChangeRatio(value as number)}
                    />
                </div>
            </div>
            <div className="absolute bottom-0 translate-y-full text-body-14 text-typo-secondary">P-Market</div>
            <div style={{ left: `${rstyleMin}%` }} className="absolute bottom-0 translate-y-full -translate-x-1/2 text-body-14 text-typo-secondary">
                P-Claim {side === ENUM_INSURANCE_SIDE.BEAR ? 'max' : 'min'}
            </div>
            <div className="absolute bottom-0 right-0 translate-y-full text-body-14 text-typo-secondary">
                P-Claim {side === ENUM_INSURANCE_SIDE.BEAR ? 'min' : 'max'}
            </div>
        </div>
    );
};

export default PClaimSlider;