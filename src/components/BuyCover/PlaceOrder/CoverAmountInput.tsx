"use client";

import { FormValue } from "@/@type/common.type";
import colors from "@/colors";
import Button from "@/components/common/Button";
import FormInputNumber, { InputNumberProps } from "@/components/common/FormInput/InputNumber";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import Popup from "@/components/common/Popup";
import useToggle from "@/hooks/useToggle";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { useParams } from "next/navigation";
import { forwardRef, memo, useCallback, useMemo, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

type CoverAmountInputProps = Omit<InputNumberProps & {
  onChange: (value?: number) => void;
  errorMessage?: string;
  setValue: UseFormSetValue<FormValue>;
}, "label" | "size">;
const Suffix = memo(({ setValue }: { setValue: UseFormSetValue<FormValue>; }) => {
  const [selected, setSelected] = useState("USDT");
  const { toggle, handleToggle } = useToggle();
  const changeAsset = useCallback((value: string) => {
    setSelected(value);
    handleToggle();

    setValue("unit", value);
  }, []);
  const { symbol } = useParams();

  const { baseAsset, quoteAsset } = useMemo(() => {
    return {
      baseAsset: `${symbol.toString().split("USDT")[0]}`,
      quoteAsset: "USDT",
    };
  }, [symbol]);

  return (
    <Popup
      classTrigger="min-w-[54px] cursor-pointer"
      isOpen={toggle}
      handleOnChangeStatus={handleToggle}
      content={
        <section className="flex flex-col items-start gap-2 border-primary-1 p-4">
          <Button
            size="md"
            className={cn(
              "flex items-center justify-between outline-none w-full gap-2 hover:text-typo-accent",
              selected === quoteAsset ? "text-typo-accent" : "text-typo-secondary",
            )}
            onClick={() => changeAsset(quoteAsset)}>
            <div>{quoteAsset}</div>
            {selected === quoteAsset ? (
              <CheckIcon color={colors.typo.accent} className="size-4" />
            ) : null}
          </Button>
          <Button
            size="md"
            className={cn(
              "flex items-center justify-between outline-none w-full gap-2 hover:text-typo-accent",
              selected === baseAsset ? "text-typo-accent" : "text-typo-secondary",
            )}
            onClick={() => changeAsset(baseAsset)}>
            <div>{baseAsset}</div>
            {selected === baseAsset ? (
              <CheckIcon color={colors.typo.accent} className="size-4" />
            ) : null}
          </Button>
        </section>
      }>
      <div className="text-body-14 flex items-center">
        <span className={cn("mr-1 min-w-[30px] text-right", toggle && "text-typo-accent")}>{selected}</span>
        <ChevronIcon
          className={cn(
            "transition-all duration-200 ease-linear",
            toggle ? "rotate-180" : "rotate-0",
          )}
          color={toggle ? colors.typo.accent : colors.typo.secondary}
        />
      </div>
    </Popup>
  );
});

const CoverAmountInput = forwardRef<HTMLInputElement, CoverAmountInputProps>(
  ({ value, onChange, setValue, ...props }, forwardRef) => {
    const descriptionMessage = "Min: " + formatNumber(75) + ", Max: " + formatNumber(10000);
    return (
      <FormInputNumber
        ref={forwardRef}
        suffix={<Suffix setValue={setValue} />}
        placeholder="Q-Cover"
        tooltip="Q-Cover"
        size="lg"
        label="Q-Cover"
        value={value}
        onChange={(values) => {
          if (values.floatValue) {
            setValue("margin", values.floatValue * 0.05, { shouldValidate: true });
          } else {
            setValue("margin", 0, { shouldValidate: true });
          }
          onChange(values.floatValue || 0);
        }}
        wrapperClassLabel="border-b border-dashed border-typo-secondary"
        descriptionMessage={descriptionMessage}
        {...props}
      />
    );
  },
);

export default CoverAmountInput;
