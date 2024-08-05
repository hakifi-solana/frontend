"use client";

import { FormValue } from "@/@type/common.type";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import useToggle from "@/hooks/useToggle";
import { formatNumber } from "@/utils/format";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { forwardRef, useMemo, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

const PClaimSlider = dynamic(() => import("./Slider"), { ssr: false });

type ClaimInputProps = Omit<InputNumberProps & {
    onChange: (value?: number) => void;
    errorMessage?: string;
    setValue: UseFormSetValue<FormValue>;
    min: number;
    max: number;
}, "label" | "size">;

const ClaimInput = forwardRef<HTMLInputElement, ClaimInputProps>(
    ({ value, onChange, setValue, min, max, ...props }, forwardRef) => {
        const { toggle, handleToggle } = useToggle();

        const { symbol } = useParams();

        const [ticker, setTicker] = useState<Ticker | null>(null);
        useTickerSocket(symbol, setTicker);
        const p_market = useMemo(() => ticker?.lastPrice, [ticker]);
        const descriptionMessage =  "Minimum: " + formatNumber(min) + ", Maximum: " + formatNumber(max);
        
        return (
            <>
                <FormInputNumber
                    ref={forwardRef}
                    extraLabel={
                        <section className="text-typo-accent flex items-center gap-2">
                            <ToggleSwitch onChange={handleToggle} defaultValue={toggle} /> %
                        </section>
                    }
                    min={min}
                    max={max}
                    suffix="USDT"
                    placeholder="P-Claim"
                    tooltip="P-Claim"
                    size="lg"
                    label="P-Claim"
                    disabled={toggle}
                    value={value}
                    onChange={(values) => onChange(values.floatValue || 0)}
                    wrapperClassInput="items-center"
                    labelClassName="border-b border-dashed border-typo-secondary"
                    descriptionMessage={descriptionMessage}
                    {...props}
                />

                {
                    toggle && !!p_market && <section className="mt-2">
                        <PClaimSlider
                            min={min}
                            max={max}
                            p_market={p_market}
                            onChange={onChange}
                        />
                    </section>
                }
            </>
        );
    },
);

export default ClaimInput;
