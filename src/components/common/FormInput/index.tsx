"use client";

import { cn } from '@/utils';
import React, { ReactElement, forwardRef } from 'react';
import Input from '../Input';

interface IInputProps {
  suffix?: ReactElement | string;
  prefix?: ReactElement | string;
  prefixClassName?: string;
  suffixClassName?: string;
  errorMessage?: string;
  wrapperClassName?: string;
  wrapperClassInput?: string;
  size: 'md' | 'lg';
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
}

const FormInput = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      prefixClassName,
      prefix,
      suffix,
      suffixClassName,
      errorMessage,
      wrapperClassName,
      wrapperClassInput,
      size = 'md',
      ...props
    },
    ref,
  ) => {
    return (
      <section
        className={cn("flex flex-col items-start gap-1 w-full", wrapperClassName)}>
        <section className={cn("border border-divider-secondary rounded", wrapperClassInput)}>
          <Input
            size={size}
            ref={ref}
            prefix={prefix}
            prefixClassName={prefixClassName}
            suffix={suffix}
            suffixClassName={suffixClassName}
            {...props}
          />
        </section>
        {errorMessage ? (
          <div
            className="text-body-12 text-red max-h-0 overflow-hidden transition-all duration-200">
            <div>{errorMessage}</div>
          </div>
        ) : null}
      </section>
    );
  },
);

export default FormInput;
