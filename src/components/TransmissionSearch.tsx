import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TransmissionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const TransmissionSearch = ({ 
  value, 
  onChange
}: TransmissionSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
      <Input
        type="text"
        placeholder="Search tracks or artists..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-14 h-14 text-lg font-semibold border-2 border-white/10 rounded-xl bg-white/5 text-white placeholder:text-white/30 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/20 transition-all"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 hover:bg-foreground/10"
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
