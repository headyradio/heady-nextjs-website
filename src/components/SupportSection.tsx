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

const IMPACT_MESSAGES: Record<number, string> = {
  5: '☕ One coffee = 1 day of server costs',
  10: '🎵 Powers 2 days of streaming',
  25: '💫 Covers 1 week of bandwidth',
  50: '🌟 Supports us for half a month',
};

export const SupportSection = () => {
  const [customAmount, setCustomAmount] = React.useState('');
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDonation = async (amount: number) => {
    setSelectedAmount(amount);
    setIsLoading(true);

    try {
      toast.loading('Creating secure checkout...', { id: 'checkout' });

      const { data, error } = await supabase.functions.invoke('create-donation-checkout', {
        body: { amount },
      });

      if (error) throw error;

      if (data?.url) {
        toast.success('Redirecting to secure payment...', { id: 'checkout' });
        // Small delay for user feedback before redirect
        setTimeout(() => {
          // Use location.href for better mobile compatibility
          window.location.href = data.url;
        }, 500);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to create checkout. Please try again.', { id: 'checkout' });
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
    <section id="support-section" className="relative py-12 md:py-16 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
      <div className="absolute bottom-0 right-0 w-full h-2 bg-secondary" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Card className="border border-white/10 bg-black/60 backdrop-blur-xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
          {/* Subtle gradient glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-1000" />
          
          <TooltipProvider>
          {/* Icon */}
          <div className="flex justify-center mb-8 relative z-10">
            <div className="relative">
              <Radio className="h-16 w-16 text-white" />
              <Heart className="h-8 w-8 text-pink-500 absolute -bottom-2 -right-2 fill-current animate-pulse" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-black text-center text-white mb-6 uppercase tracking-tight drop-shadow-lg">
            Support HEADY.FM
          </h2>

          {/* Description */}
          <div className="max-w-3xl mx-auto text-center mb-10 relative z-10">
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
              If you love what HEADY.FM brings to your day, please consider making a donation. 
              Your support directly helps cover streaming costs and keeps our community thriving, 
              independent, and ad-free.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20">
               <Heart className="w-4 h-4 text-pink-500 fill-current" />
               <span className="text-pink-400 font-bold text-sm tracking-wide uppercase">Every $ keeps us ad-free</span>
            </div>
          </div>

          {/* Donation Amounts */}
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {DONATION_AMOUNTS.map(({ amount, label }) => (
                <Tooltip key={amount}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleDonation(amount)}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      size="lg"
                      disabled={isLoading}
                      className={`h-20 text-2xl font-black transition-all duration-300 ${
                        selectedAmount === amount 
                          ? 'bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30 hover:scale-105'
                      }`}
                    >
                      {isLoading && selectedAmount === amount ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <>
                          {label}
                          {amount === 25 && (
                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-black text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wide shadow-lg border-2 border-black">
                              Popular
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-black border-white/10 text-white">
                    <p className="font-bold">{IMPACT_MESSAGES[amount]}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                       <Input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="h-14 pl-8 text-lg font-bold border-2 border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20 rounded-xl"
                        min="1"
                        step="1"
                        disabled={isLoading}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black border-white/10 text-white">
                    <p className="font-bold">Any amount helps keep us ad-free!</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                onClick={handleCustomDonation}
                size="lg"
                disabled={isLoading || !customAmount}
                className="h-14 px-8 text-lg font-black bg-emerald-500 hover:bg-emerald-400 text-black border-none rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Donate'
                )}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-white/40">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure payment powered by Stripe</span>
            </div>
          </div>
          </TooltipProvider>
        </Card>
      </div>
    </section>
  );
};
