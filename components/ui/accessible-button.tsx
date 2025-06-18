'use client';

import { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useAudioDescription } from '@/hooks/use-audio-description';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  audioDescription?: string;
  autoDescribe?: boolean;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, audioDescription, autoDescribe = true, children, ...props }, ref) => {
    const { elementRef, describe } = useAudioDescription();

    const handleFocus = () => {
      if (autoDescribe && audioDescription) {
        describe(audioDescription);
      }
    };

    return (
      <Button
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          if (elementRef) {
            (elementRef as any).current = node;
          }
        }}
        className={cn(className)}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';