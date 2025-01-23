'use client';

import * as React from 'react';

import { Minus, Plus } from 'lucide-react';

import { Input } from './Input.component';
import { cn } from './cn';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number, stringValue: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

function NumberInput({
  className,
  onValueChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  ...props
}: NumberInputProps) {
  const [value, setValue] = React.useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || /^-?\d*\.?\d*$/.test(newValue)) {
      setValue(newValue);
      onValueChange?.(Number(newValue), newValue);
    }
  };

  const handleIncrement = () => {
    inputRef.current?.focus();
    const newValue = Math.min(Number(value) + step, max);
    setValue(String(newValue));
    onValueChange?.(newValue, newValue.toString(10));
    inputRef.current?.focus();
  };

  const handleDecrement = () => {
    inputRef.current?.focus();
    const newValue = Math.max(Number(value) - step, min);
    setValue(String(newValue));
    onValueChange?.(newValue, newValue.toString(10));
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleInputChange}
        className={cn('pl-8 pr-8 text-center', className)}
        ref={inputRef}
        {...props}
      />
      <div
        className="absolute left-0 top-0 flex h-full items-center px-3 hover:bg-transparent"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </div>
      <div
        className="absolute right-0 top-0 flex h-full items-center px-3 hover:bg-transparent"
        onClick={handleIncrement}
      >
        <Plus className="h-4 w-4" />
      </div>
    </div>
  );
}

export { NumberInput };
