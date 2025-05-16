'use client';

import * as React from 'react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <UITooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="font-semibold">{text}</TooltipContent>
    </UITooltip>
  );
}
