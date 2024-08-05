import { FormValue } from "@/@type/common.type";
import { PairDetail } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import ContractIcon from "@/components/common/Icons/ContractIcon";
import TooltipCustom from "@/components/common/Tooltip";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useAppStore from "@/stores/app.store";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { USDT_ADDRESS } from "@/web3/constants";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { memo, useMemo } from "react";
import { Controller, UseFormReturn, useFormState } from "react-hook-form";
import { useAccount, useBalance } from "wagmi";
import BasicInformationForm from "./BasicInformationForm";
import ClaimInput from "./ClaimInput";
import CoverAmountInput from "./CoverAmountInput";
import MarginInput from "./MarginInput";
import ModeInput from "./ModeInput";

type FormBuyCoverProps = {
  pair: PairDetail;
  pClaimRange: {
    min: number;
    max: number;
  } | null;
  form: UseFormReturn<FormValue>;
  handleToggleModalDetail: () => void;
  handleConfirmAction: () => void;
};

const FormBuyCover = ({ pClaimRange, pair, form, handleToggleModalDetail, handleConfirmAction }: FormBuyCoverProps) => {
  const isMobile = useIsMobile();
  const { address } = useAccount();
  const toggleConnectWalletModal = useAppStore(
    (state) => state.toggleConnectWalletModal,
  );

  const [
    p_claim,
    q_covered,
    margin,
    period,
    q_claim,
    side,
  ] = useBuyCoverStore((state) => [
    state.p_claim,
    state.q_covered,
    state.margin,
    state.period,
    state.q_claim,
    state.side,
  ]);

  const profit = q_claim ? q_claim - margin : 0;

  const modalTitle = useMemo(() => {
    const expect = side === ENUM_INSURANCE_SIDE.BULL ? "Bull" : "Bear";
    return expect;
  }, [side]);

  const usdtBalance = useBalance({
    address,
    token: USDT_ADDRESS,
  });
  const balance = usdtBalance.data ? parseFloat(usdtBalance.data.formatted) : 0;
  const { isValid } = useFormState({
    control: form.control,
  });

  const isDisableBuyCover = useMemo(() => {

    return balance === 0 || !isValid;
  }, [balance, isValid]);

  const marginRangeValidate = useMemo(() => {
    const minMargin = balance === 0 ? 0 : q_covered * 0.02;
    const maxMargin = balance > q_covered * 0.1 ? q_covered * 0.1 : balance;
    if (margin < minMargin) return `Margin must be greater than ${minMargin}`;
    if (margin > maxMargin) return `Margin must be less than ${maxMargin}`;

  }, [q_covered, balance, margin]);

  return (
    <>

      <section data-tour="place-order" className="flex flex-col gap-6 mt-5">
        {
          !isMobile ? <Controller
            name="side"
            render={({ field }) => <ModeInput {...field} />}
          /> : <p className="text-title-24">
            <span
              className={cn(
                side === ENUM_INSURANCE_SIDE.BULL
                  ? "text-positive-label"
                  : "text-negative-label",
              )}
            >
              {modalTitle}
            </span>{" "}
            Insurance contract
          </p>
        }

        <BasicInformationForm pair={pair} setValue={form.setValue} />

        <section className="grid grid-cols-2 gap-3">
          <Controller
            name="q_covered"
            render={({ field, fieldState }) => (
              <CoverAmountInput
                {...field}
                setValue={form.setValue}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="margin"
            render={({ field, fieldState }) => (
              <MarginInput
                {...field}
                setValue={form.setValue}
                errorMessage={marginRangeValidate}
              />
            )}
          />
        </section>

        <Controller
          name="p_claim"
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <ClaimInput
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              min={pClaimRange?.min || 0}
              max={pClaimRange?.max || 0}
              setValue={form.setValue}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </section>

      <section data-tour="confirm-order" className="mt-6">
        <section className="border-divider-primary rounded border">
          <section className="bg-background-secondary text-body-14 text-typo-accent rounded-t p-3">
            Buy cover benefit
          </section>
          <section className="flex flex-col gap-4 px-3 py-4">
            <section className="flex items-center justify-between">
              <div className="flex items-start gap-1">
                <CheckIcon />
                <TooltipCustom
                  content={""}
                  titleClassName="text-typo-primary"
                  title={
                    <p className="border-typo-secondary text-body-14 text-typo-secondary border-b border-dashed">
                      Claim amount
                    </p>
                  }
                  showArrow={true}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-body-12 bg-background-primary text-typo-primary rounded-sm px-1 py-0.5">
                  +{q_claim ? formatNumber((q_claim / margin) * 100) : 0}%
                </p>
                <p className="text-body-14 text-typo-primary">
                  {q_claim ? formatNumber(q_claim) : "-"} USDT
                </p>
              </div>
            </section>
            <section className="flex items-center justify-between">
              <div className="flex items-start gap-1">
                <CheckIcon />
                <TooltipCustom
                  content={""}
                  titleClassName="text-typo-primary"
                  title={
                    <p className="border-typo-secondary text-body-14 text-typo-secondary border-b border-dashed">
                      Benefit
                    </p>
                  }
                  showArrow={true}
                />
              </div>
              <p className="text-body-14 text-typo-primary">
                Save {formatNumber(profit)} USDT
              </p>
            </section>
          </section>
        </section>

        {/* Submit button */}
        {address ? (
          <Button
            variant="primary"
            size="lg"
            type="submit"
            disabled={isDisableBuyCover}
            onClick={form.handleSubmit(handleConfirmAction)}
            className={cn(
              "my-4 w-full justify-center",
              side === ENUM_INSURANCE_SIDE.BULL &&
              "hover:!bg-positive-label hover:!text-typo-primary",
              side === ENUM_INSURANCE_SIDE.BEAR &&
              "hover:!bg-negative-label hover:!text-typo-primary",
            )}
          >
            Buy cover
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={() => toggleConnectWalletModal(true)}
            className="my-4 w-full justify-center"
          >
            Connect wallet
          </Button>
        )}

        <div className="flex items-center gap-1 mt-6">
          <ContractIcon />
          <Button
            size="md"
            className="border-typo-secondary text-typo-secondary border-b border-dashed"
            onClick={handleToggleModalDetail}
          >
            Insurance contract information
          </Button>
        </div>
      </section>
    </>
  );
};

export default memo(FormBuyCover);
