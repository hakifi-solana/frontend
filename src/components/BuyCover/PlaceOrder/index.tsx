"use client";

import { PairDetail } from "@/@type/pair.type";
import { STEP } from "@/components/BuyCover/PlaceOrder/Confirmation";
import ConfirmationInsurance from "@/components/BuyCover/PlaceOrder/Confirmation/Wrapper";
import Button from "@/components/common/Button";
import DrawerWrapper from "@/components/common/Drawer";
import { useNotification } from "@/components/common/Notification";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useTicker from "@/hooks/useTicker";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { formatNumber } from "@/utils/format";
import { handleRequest } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ENUM_INSURANCE_SIDE, PERIOD_UNIT } from "hakifi-formula";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useWatch
} from "react-hook-form";
import * as z from "zod";
import FormBuyCover from "./FormBuyCover";
import useBuyCover from "./hooks/useBuyCover";
import usePClaimRange from "./hooks/usePClaimRange";
import { calculateInsuranceParams, getDefaultPClaim } from "./utils";
import useAppStore from "@/stores/app.store";

const Confirmation = dynamic(
  () => import("@/components/BuyCover/PlaceOrder/Confirmation"),
  { ssr: false },
);
const Detail = dynamic(
  () => import("@/components/BuyCover/PlaceOrder/Detail"),
  { ssr: false },
);

type WatcherProps = {
  symbol: string;
  pair: PairDetail;
};

const Watcher = ({ symbol, pair }: WatcherProps) => {
  const values = useWatch();
  const unit = values.unit || "USDT";
  const periodUnit = values.periodUnit || PERIOD_UNIT.DAY;
  const margin = Number(values.margin) || 0;
  const q_covered = Number(values.q_covered) || 0;
  const p_claim = Number(values.p_claim) || 0;
  const period = Number(values.period) || 1;
  const side = values.side as ENUM_INSURANCE_SIDE;
  const ticker = useTicker(symbol);
  const p_open = ticker?.lastPrice || pair.lastPrice || 0;

  const [updateParams] = useBuyCoverStore((state) => [state.updateParams]);

  useEffect(() => {
    let periodChangeRatio: number = 0;
    if (period > 0 && period <= 15) {
      periodChangeRatio =
        pair.config.listChangeRatios[period - 1].periodChangeRatio;
    }

    updateParams({
      unit,
      side,
      margin,
      q_covered,
      p_claim,
      period,
      p_open,
      periodChangeRatio,
      periodUnit,
    });

    if (!p_open || !p_claim || !margin || !q_covered) return;

    const {
      q_claim,
      expiredAt,
      hedge,
      p_cancel,
      p_liquidation,
      p_refund,
      hedgeClaim,
    } = calculateInsuranceParams({
      margin,
      p_claim,
      p_open,
      period,
      periodChangeRatio,
      periodUnit,
      q_covered,
    });

    updateParams({
      hedgeClaim,
      hedge,
      p_cancel,
      p_liquidation,
      p_refund,
      q_claim,
      expiredAt,
    });
  }, [margin, q_covered, p_claim, period, p_open, side, unit, periodUnit]);

  return null;
};

type PlaceOrderProps = {
  symbol: string;
  pair: PairDetail;
};

const PlaceOrder = ({
  symbol,
  pair,
}: PlaceOrderProps) => {
  const { handleOnConfirmBuyCover } = useBuyCover(pair);

  const [
    p_claim,
    q_covered,
    margin,
    period,
    q_claim,
    side,
    periodChangeRatio,
    unit,
    periodUnit,
    openFormBuyCover,
    toggleFormBuyCover
  ] = useBuyCoverStore((state) => [
    state.p_claim,
    state.q_covered,
    state.margin,
    state.period,
    state.q_claim,
    state.side,
    state.periodChangeRatio,
    state.unit,
    state.periodUnit,
    state.openFormBuyCover,
    state.toggleFormBuyCover,
  ]);

  const [startOnboard] = useAppStore(state => [state.startOnboard, state.setStartOnboard]);

  const pClaimRange = usePClaimRange(pair);
  const minPClaim = pClaimRange?.min || 0;
  const maxPClaim = pClaimRange?.max || 0;

  const formSchema = useMemo(() => {
    const invalidPClaim =
      "Minimum: " +
      formatNumber(minPClaim) +
      ", Maximum: " +
      formatNumber(maxPClaim);

    const invalidQCover = "Minimum: " + formatNumber(75) + ", Maximum: " + formatNumber(10000);

    return z.object({
      unit: z.string(),
      side: z.string(),
      q_covered: z.coerce
        .number()
        .min(75, invalidQCover)
        .max(10000, invalidQCover)
        .gt(0, "Cover amount must be greater than 0"),
      p_claim: z.coerce
        .number()
        .min(minPClaim, invalidPClaim)
        .max(maxPClaim, invalidPClaim),
      margin: z.coerce.number(),
      period: z.coerce
        .number()
        .min(1, "Period must be greater than 1")
        .max(15, "Period must be less than 15"),
      periodUnit: z.coerce.string(),
    });
  }, [minPClaim, maxPClaim]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      unit,
      side,
      q_covered,
      p_claim,
      margin,
      period,
      periodUnit,
    },
  });

  useEffect(() => {
    if (!!pClaimRange) {
      const defaultPClaim = getDefaultPClaim({
        max: pClaimRange.max,
        min: pClaimRange.min,
        side,
        periodChangeRatio: periodChangeRatio || 1,
      });
      form.setValue("p_claim", defaultPClaim, { shouldValidate: true });
    }
  }, [side, !!pClaimRange]);

  const notifications = useNotification();

  const [confirm, setConfirm] = useState(false);
  const handleConfirmAction = async () => {
    const [err] = await handleRequest(
      handleOnConfirmBuyCover({ margin: Number(margin) }),
    );
    if (err) {
      console.log(err);
      notifications.error(err.message);
      return;
    }
    if (isMobile) setConfirm(true);
    else handleToggleModalConfirm();
  };

  /**
   * Handle toggle Confirmation Buy cover
   */
  const [toggleModalConfirm, setToggleModalConfirm] = useState(false);
  const handleToggleModalConfirm = useCallback(() => {
    setToggleModalConfirm((status) => {
      return !status;
    });
  }, []);

  /**
   * Handle toggle Insurance Detail
   */
  const [toggleModalDetail, setToggleModalDetail] = useState(false);
  const handleToggleModalDetail = useCallback(() => {
    setToggleModalDetail((status) => {
      return !status;
    });
  }, []);

  /**
   * Handle toggle Form Buy cover mobile
   */

  const handleToggleModalForm = useCallback((side?: string) => {
    if (side) form.setValue("side", side);
    setConfirm(false);
    toggleFormBuyCover(true);
  }, []);

  const isMobile = useIsMobile();

  const [step, setStep] = useState<STEP>(STEP.CONFIRM);

  const handleOnCloseModal = () => {
    setStep(STEP.CONFIRM);
  };

  const handleOnClickOutside = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <FormProvider {...form}>
        <Watcher symbol={symbol} pair={pair} key={pair.symbol} />
        <form onSubmit={form.handleSubmit(handleConfirmAction)}>
          {/* Buy cover form  */}
          {!isMobile && <FormBuyCover
            pair={pair}
            pClaimRange={pClaimRange}
            form={form}
            handleConfirmAction={handleConfirmAction}
            handleToggleModalDetail={handleToggleModalDetail}
          />}

          {isMobile && (
            <DrawerWrapper
              isOpen={openFormBuyCover}
              handleOpenChange={() => toggleFormBuyCover(!openFormBuyCover)}
              handleClickOutside={(e) => handleOnClickOutside(e)}
              content={
                <>
                  {
                    !confirm ? <FormBuyCover
                      pair={pair}
                      pClaimRange={pClaimRange}
                      form={form}
                      handleConfirmAction={handleConfirmAction}
                      handleToggleModalDetail={handleToggleModalDetail}
                    /> :
                      <ConfirmationInsurance
                        onCloseModal={handleOnCloseModal}
                        pair={pair}
                        setStep={setStep}
                        step={step}
                      />
                  }
                </>
              }
            />
          )}
        </form>
      </FormProvider>
      {isMobile && (
        <>
          <section className="bg-background-tertiary sticky bottom-0 flex items-center gap-3 p-4">
            <Button
              onClick={() => handleToggleModalForm(ENUM_INSURANCE_SIDE.BULL)}
              size="lg"
              className="!bg-positive-label text-typo-primary flex-1 justify-center"
              variant="primary"
            >
              BULL
            </Button>
            <Button
              onClick={() => handleToggleModalForm(ENUM_INSURANCE_SIDE.BEAR)}
              size="lg"
              className="!bg-negative-label text-typo-primary flex-1 justify-center"
              variant="primary"
            >
              BEAR
            </Button>
          </section>
        </>
      )}

      <Confirmation
        pair={pair}
        isOpen={toggleModalConfirm}
        handleCloseModal={handleToggleModalConfirm}
      />
      <Detail
        isOpen={toggleModalDetail}
        handleCloseModal={handleToggleModalDetail}
      />
    </>
  );
};

export default PlaceOrder;
