import * as React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md p-0 overflow-hidden bg-zinc-950 border-zinc-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg bg-emerald-500/10 text-emerald-500",
              variant === 'danger' && "bg-rose-500/10 text-rose-500"
            )}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="p-6 bg-zinc-900/50 flex flex-col sm:flex-row gap-3">
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="flex-1 font-bold uppercase tracking-widest text-[10px]"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 font-bold uppercase tracking-widest text-[10px] text-zinc-500"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>
      </Card>
    </div>
  );
};
