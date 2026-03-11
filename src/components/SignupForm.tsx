import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { TrendingUp, Mail, Lock, User, Github, Chrome } from 'lucide-react';

const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSignup: (values: SignupFormValues) => void;
  onGoogleSignup: () => void;
  onToggleLogin: () => void;
  isLoading?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onGoogleSignup, onToggleLogin, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <Card className="w-full max-w-md p-8 bg-zinc-950 border-zinc-900 shadow-2xl">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20 mb-2">
          <TrendingUp className="text-white w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
        <p className="text-sm text-zinc-500 font-medium tracking-tight">Join Smart Analysis and manage your finances</p>
      </div>

      <form onSubmit={handleSubmit(onSignup)} className="space-y-4">
        <div className="relative group">
          <User className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            className="pl-10"
            {...register('displayName')}
            error={errors.displayName?.message}
          />
        </div>

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

        <div className="relative group">
          <Lock className="absolute left-3 top-9 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors z-10" />
          <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            className="pl-10"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest mt-4" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-900"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
          <span className="bg-zinc-950 px-4 text-zinc-600">Or sign up with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Button variant="outline" className="h-11 gap-2 border-zinc-900 hover:border-zinc-700" onClick={onGoogleSignup} type="button">
          <Chrome className="w-4 h-4" />
          Google
        </Button>
        <Button variant="outline" className="h-11 gap-2 border-zinc-900 hover:border-zinc-700" type="button">
          <Github className="w-4 h-4" />
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500 font-medium">
        Already have an account?{' '}
        <button 
          onClick={onToggleLogin}
          className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors uppercase tracking-widest"
        >
          Sign In
        </button>
      </p>
    </Card>
  );
};

export default SignupForm;
