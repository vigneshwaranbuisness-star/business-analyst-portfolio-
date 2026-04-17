import * as React from 'react';
import { Shield, Lock as LockIcon, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full bg-[#F5F7FB] flex flex-col items-center justify-between py-12 px-6 overflow-x-hidden selection:bg-blue-500/30">
      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Shield Icon Header */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-[#E8EDFD] flex items-center justify-center shadow-sm">
            <Shield className="text-[#0052CC] w-10 h-10 fill-[#0052CC]" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black text-[#003B95] tracking-tight uppercase leading-none">Curator</h1>
            <p className="text-zinc-600 font-semibold tracking-tight text-lg">{subtitle}</p>
          </div>
        </div>

        {/* The Form (Children) */}
        <div className="w-full">
          {children}
        </div>
      </div>

      {/* Security Features Bottom Bar */}
      <div className="w-full max-w-4xl mt-16 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="bg-[#EBF1FF]/40 border border-[#E1E8F6] rounded-[40px] p-8 md:p-10 flex flex-col items-center gap-8 shadow-sm">
          <div className="w-16 h-1.5 bg-zinc-200 rounded-full mb-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[
              { icon: Shield, title: 'ISO 27001 COMPLIANT', bg: 'bg-white' },
              { icon: LockIcon, title: 'AES-256 ENCRYPTED', bg: 'bg-white' },
              { icon: Shield, title: 'MULTI-FACTOR ENABLED', bg: 'bg-white' },
            ].map((feature, i) => (
              <div 
                key={i} 
                className={cn(
                  feature.bg,
                  "p-6 rounded-3xl border border-zinc-100 flex flex-col items-center gap-4 text-center group hover:border-[#0052CC]/30 transition-all shadow-sm"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8EDFD] flex items-center justify-center text-[#0052CC]">
                  <feature.icon className="w-5 h-5 fill-[#0052CC]" />
                </div>
                <h3 className="text-[11px] font-black text-zinc-700 tracking-[0.1em] leading-tight max-w-[100px] uppercase">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
