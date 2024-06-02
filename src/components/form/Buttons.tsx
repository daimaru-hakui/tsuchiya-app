'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type SubmitButtonProps = {
  className?: string;
  text?: string;
};

export function SubmitButton({ className = '', text = "sumit" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className={`capitalize ${className}`} size='lg' >
      {pending ? <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait...
      </> : text}
    </Button>
  );
}