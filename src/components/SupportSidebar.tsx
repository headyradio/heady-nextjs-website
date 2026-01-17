import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, Radio, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DONATION_AMOUNTS = [
  { amount: 5, label: '$5' },
  { amount: 10, label: '$10' },
  { amount: 25, label: '$25' },
  { amount: 50, label: '$50' },
];

export const SupportSidebar = () => {
  const [customAmount, setCustomAmount] = React.useState('');
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDonation = async (amount: number) => {
    setSelectedAmount(amount);
    setIsLoading(true);

    try {
      toast.loading('Creating checkout...', { id: 'checkout' });

      const { data, error } = await supabase.functions.invoke('create-donation-checkout', {
        body: { amount },
      });

      if (error) throw error;

      if (data?.url) {
        toast.success('Redirecting...', { id: 'checkout' });
        setTimeout(() => {
          window.open(data.url, '_blank');
          setIsLoading(false);
        }, 500);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to create checkout', { id: 'checkout' });
      setIsLoading(false);
    }
  };

  const handleCustomDonation = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 1) {
      handleDonation(amount);
    } else {
      toast.error('Please enter at least $1');
    }
  };

  return (
    <Card className="h-full bg-black/60 border border-white/10 backdrop-blur-xl p-6 flex flex-col rounded-2xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-transparent group-hover:bg-white/[0.02] transition-colors duration-500" />
      <TooltipProvider>
      {/* Icon */}
      <div className="flex justify-center mb-4 relative z-10">
        <div className="relative">
          <Radio className="h-10 w-10 text-white" />
          <Heart className="h-5 w-5 text-pink-500 absolute -bottom-1 -right-1 fill-current animate-pulse" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-3 uppercase tracking-tight relative z-10">
        Support HEADY.FM
      </h2>

      {/* Description */}
      <div className="text-center mb-6 flex-1 relative z-10">
        <p className="text-sm text-white/70 leading-relaxed mb-3 font-medium">
          If you love what HEADY.FM brings to your day, please consider making a donation.
        </p>
        <p className="text-xs text-pink-400 font-black uppercase tracking-wide bg-pink-500/10 inline-block px-3 py-1 rounded-full border border-pink-500/20">
          💖 Every $ keeps us ad-free
        </p>
      </div>

      {/* Donation Amounts */}
      <div className="space-y-4 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          {DONATION_AMOUNTS.map(({ amount, label }) => (
            <Button
              key={amount}
              onClick={() => handleDonation(amount)}
              size="sm"
              disabled={isLoading}
              className={`h-12 text-lg font-black border hover:scale-105 transition-all ${
                selectedAmount === amount 
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              {isLoading && selectedAmount === amount ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                label
              )}
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="h-10 text-sm font-bold border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                min="1"
                step="1"
                disabled={isLoading}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-black border-white/10 text-white">
              <p className="font-bold">Any amount helps!</p>
            </TooltipContent>
          </Tooltip>
          <Button
            onClick={handleCustomDonation}
            size="sm"
            disabled={isLoading || !customAmount}
            className="w-full h-10 text-sm font-black bg-emerald-500 hover:bg-emerald-400 text-black border-none hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Donate'
            )}
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-1 text-xs text-white/40">
          <Shield className="h-3 w-3" />
          <span className="font-medium">Secure via Stripe</span>
        </div>
      </div>
      </TooltipProvider>
    </Card>
  );
};
