"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { ReactElement, forwardRef, useState } from "react";
import {
  InputAttributes,
  NumericFormat,
  OnValueChange,
} from "react-number-format";
import TooltipCustom from "../Tooltip";
import { CloudCog } from "lucide-react";

export type InputNumberProps = {
  label: ReactElement | string;
  extraLabel?: ReactElement;
  suffix?: ReactElement | string;
  wrapperClassInput?: string;
  labelClassName?: string;
  wrapperClassLabel?: string;
  className?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  warning?: boolean;
  errorMessage?: string;
  placeholder?: string;
  descriptionMessage?: string;
  value?: string | number;
  defaultValue?: string | number;
  decimal?: number;
  onChange?: OnValueChange;
  onBlur?: InputAttributes["onBlur"];
  onFocus?: InputAttributes["onFocus"];
  size: "md" | "lg";
  min?: number;
  max?: number;
  tooltip?: string;
  disabled?: boolean;
};

const FormInputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      disabled = false,
      tooltip,
      label,
      size,
      extraLabel,
      suffix,
      wrapperClassInput,
      labelClassName,
      wrapperClassLabel,
      className,
      prefixClassName,
      placeholder,
      suffixClassName,
      errorMessage,
      warning,
      descriptionMessage,
      onBlur,
      onFocus,
      value,
      defaultValue,
      decimal = 2,
      onChange,
      min,
      max,
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [_focus, setFocus] = useState(false);

    const _handleOnFocus: InputAttributes["onFocus"] = (e) => {
      console.log("focus");
      setFocus(true);
      if (onFocus) onFocus(e);
    };
    const _handleOnBlur: InputAttributes["onBlur"] = (e) => {
      setFocus(false);
      if (onBlur) onBlur(e as any);
    };

    return (
      <section className="text-typo-primary flex flex-col items-start justify-between ">
        <section
          className={cn("flex w-full justify-between", wrapperClassInput)}
        >
          <TooltipCustom
            content={tooltip || ""}
            titleClassName="text-typo-primary"
            title={
              <div
                className={cn(
                  "border-typo-secondary border-b border-dashed",
                  labelClassName,
                )}
              >
                {label}
              </div>
            }
            showArrow={true}
          />
          <section>{extraLabel}</section>
        </section>
        {/* <section className={cn("",
                    size === "md" && "text-body-14",
                    size === "lg" && "text-body-16",
                    wrapperClassLabel
                )}>
                    {label}
                </section> */}
        <section
          className={cn(
            "border-divider-secondary mt-2 flex w-full rounded border bg-transparent px-2",
            size === "md" && "h-10",
            size === "lg" && "h-12",
            errorMessage && "border-negative",
            warning && "border-warning",
            wrapperClassInput,
          )}
        >
          <section className="flex w-full items-center justify-between">
            <NumericFormat
              disabled={disabled}
              defaultValue={defaultValue}
              onFocus={_handleOnFocus}
              onBlur={_handleOnBlur}
              thousandSeparator=","
              getInputRef={ref}
              decimalScale={decimal}
              className={cn(
                "text-typo-primary placeholder:text-typo-secondary w-full bg-transparent text-left focus:outline-none",
                size === "md" && "text-body-12",
                size === "lg" && "text-body-14 ",
                className,
              )}
              placeholder={placeholder}
              value={value}
              onValueChange={onChange}
              min={min}
              max={max}
            />
            {suffix && (
              <div className="text-body-14 text-typo-secondary whitespace-nowrap">
                {suffix}
              </div>
            )}
          </section>
        </section>
        {errorMessage ? (
          <div
            className={cn(
              "!text-negative-label overflow-hidden text-ellipsis whitespace-nowrap transition-all duration-200 pt-1",
              size === "md" && "text-body-12",
              size === "lg" && "text-body-14",
              isMobile && "text-body-12",
            )}
          >
            {errorMessage}
          </div>
        ) :
          <div
            className={cn(
              "!text-typo-secondary max-h-0 overflow-hidden transition-all duration-200 pt-1",
              size === "md" && "text-body-12",
              size === "lg" && "text-body-14",
              isMobile && "text-body-12",
              !errorMessage && descriptionMessage && "!max-h-max ",
            )}
          >
            {descriptionMessage}
          </div>}
      </section>
    );
  },
);

export default FormInputNumber;
