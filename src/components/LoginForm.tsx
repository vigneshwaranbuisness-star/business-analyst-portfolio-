import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { TrendingUp, Mail, Lock, Github, Chrome } from 'lucide-react';

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

  return (
    <Card className="w-full max-w-md p-8 bg-zinc-950 border-zinc-900 shadow-2xl">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 mb-2">
          <TrendingUp className="text-white w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
        <p className="text-sm text-zinc-500 font-medium tracking-tight">Enter your credentials to access your dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
        <div className="relative group">
          <Mail className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Email Address" 
            placeholder="name@company.com" 
            className="pl-10"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>
        
        <div className="relative group">
          <Lock className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            className="pl-10"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-zinc-950" />
            <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">Remember me</span>
          </label>
          <button type="button" className="text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest">
            Forgot Password?
          </button>
        </div>

        <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-900"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-zinc-950 px-4 text-zinc-600">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button variant="outline" className="h-11 gap-2 border-zinc-900 hover:border-zinc-700" onClick={onGoogleLogin} type="button">
          <Chrome className="w-4 h-4" />
          Google
        </Button>
        <Button variant="outline" className="h-11 gap-2 border-zinc-900 hover:border-zinc-700" type="button">
          <Github className="w-4 h-4" />
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500 font-medium">
        Don't have an account?{' '}
        <button 
          onClick={onToggleSignup}
          className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest"
        >
          Sign Up
        </button>
      </p>
    </Card>
  );
};

export default LoginForm;
