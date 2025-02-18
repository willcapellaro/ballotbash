import React from 'react';
import { cn } from '../utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedHeadline({ children, className }: Props) {
  return (
    <h2 className={cn(className)}>
      {children}
    </h2>
  );
}