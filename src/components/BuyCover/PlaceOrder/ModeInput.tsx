import { Tabs, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { cn } from "@/utils";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import { forwardRef } from "react";

interface IModeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ModeInput = forwardRef<HTMLDivElement, IModeInputProps>(
  ({ value, onChange }, forwardRef) => {
    return (
      <Tabs
        ref={forwardRef}
        defaultValue={value}
        className="w-full"
        onValueChange={onChange}
      >
        <TabsList className="grid w-full grid-cols-2 border border-divider-secondary rounded">

          <TabsTrigger
            value={ENUM_INSURANCE_SIDE.BULL}
            className={cn(
              "!text-tab-16 rounded uppercase py-2",
              value === ENUM_INSURANCE_SIDE.BULL ?
                "text-typo-primary bg-positive-label" : "bg-transparent text-typo-secondary",
            )}>
            Bull
          </TabsTrigger>


          <TabsTrigger
            value={ENUM_INSURANCE_SIDE.BEAR}
            className={cn(
              "!text-tab-16 rounded uppercase py-2",
              value === ENUM_INSURANCE_SIDE.BEAR ?
                "text-typo-primary bg-negative-label" : "bg-transparent text-typo-secondary",
            )}>
            Bear
          </TabsTrigger>

        </TabsList>
      </Tabs>
    );
  },
);

export default ModeInput;
