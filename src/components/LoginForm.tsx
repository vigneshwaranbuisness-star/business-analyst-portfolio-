import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/src/lib/utils';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { Shield, Mail, Chrome, Fingerprint, Eye, Apple } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (values: LoginFormValues) => void;
  onGoogleLogin: () => void;
  onToggleSignup: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleLogin, onToggleSignup, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
        <div className="space-y-6">
          <div className="relative group">
            <Input 
              label="Email Address" 
              placeholder="name@company.com" 
              className="h-16 px-6 bg-white border-zinc-100 rounded-[20px] text-zinc-900 placeholder:text-zinc-300 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-lg shadow-sm"
              labelClassName="text-[11px] font-black text-zinc-400 uppercase tracking-[0.1em] mb-3 ml-1"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          
          <div className="relative group">
            <div className="flex justify-between items-center mb-3 px-1">
              <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.1em]">Password</label>
              <button type="button" className="text-[11px] font-black text-[#0052CC] uppercase tracking-[0.05em] hover:text-blue-700 transition-colors">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" 
                className={cn(
                  "w-full h-16 px-6 bg-white border border-zinc-100 rounded-[20px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-2xl tracking-widest shadow-sm pr-14",
                  errors.password && "border-rose-500 focus:ring-rose-500/10 focus:border-rose-500"
                )}
                {...register('password')}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <Shield className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-bold text-rose-500 mt-2 ml-4">{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            type="button"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#E8EDFD] text-[#003B95] text-xs font-black uppercase tracking-widest hover:bg-[#E1E8FA] transition-all shadow-sm group"
          >
            <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Use Biometrics
          </button>

          <Button 
            type="submit" 
            className="w-full h-20 bg-[#0052CC] hover:bg-[#0047b3] text-white rounded-[24px] text-lg font-black tracking-tight shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all" 
            disabled={isLoading}
          >
            {isLoading ? 'Decrypting Access...' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
          <span className="bg-[#F5F7FB] px-8 text-zinc-400">Secure Gateway</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-16 gap-3 border-white bg-white rounded-[20px] shadow-sm hover:bg-zinc-50 border-transparent" onClick={onGoogleLogin} type="button">
          <div className="w-6 h-6 flex items-center justify-center bg-zinc-100 rounded flex-shrink-0">
             <Chrome className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-sm font-black text-zinc-700 uppercase tracking-tight">Google</span>
        </Button>
        <Button variant="outline" className="h-16 gap-3 border-white bg-[#2D2E32] rounded-[20px] shadow-sm hover:bg-[#202124] border-transparent" type="button">
          <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">iOS</span>
          <span className="text-sm font-black text-white uppercase tracking-tight ml-[-4px]">Apple</span>
        </Button>
      </div>

      <div className="text-center pt-8">
        <p className="text-sm text-zinc-500 font-bold">
          New to Curator?{' '}
          <button 
            onClick={onToggleSignup}
            className="text-[#0052CC] font-black hover:underline transition-all uppercase tracking-tight ml-1"
          >
            Establish Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
