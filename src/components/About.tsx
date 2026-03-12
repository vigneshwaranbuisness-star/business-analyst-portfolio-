import * as React from 'react';
import { Card } from './Card';
import { 
  Shield, 
  Zap, 
  BarChart3, 
  FileText, 
  Database, 
  Globe,
  Github,
  Twitter,
  Mail,
  Linkedin
} from 'lucide-react';
import { Button } from './Button';

const About: React.FC = () => {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            Smart Business <span className="text-emerald-500">Analysis</span> Dashboard
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">
            A professional-grade financial management tool designed for modern entrepreneurs. 
            Track every dollar, gain deep business insights, and manage your documents 
            with a focus on privacy and performance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button glow className="h-12 px-8 font-bold uppercase tracking-widest">Get Started</Button>
            <Button variant="outline" className="h-12 px-8 font-bold uppercase tracking-widest">Documentation</Button>
          </div>
        </div>
      </div>

      {/* Developer Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-2">
          <div className="relative aspect-square rounded-full overflow-hidden border-4 border-zinc-800 group shadow-2xl shadow-emerald-500/10 max-w-[320px] mx-auto lg:mx-0">
            <img 
              src="/profile.jpg" 
              alt="R. Vigneshwaran" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Vigneshwaran";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="mt-8 text-center lg:text-left">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-[0.3em] mb-2">Lead Developer</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">R. Vigneshwaran</h3>
            <p className="text-sm text-zinc-500 font-medium mt-1">DSCET Student • Tech Enthusiast</p>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            Open for Collaboration
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Crafting Digital Excellence at <span className="text-emerald-500">DSCET</span>
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed font-light">
            I specialize in building high-performance web applications using modern technologies. 
            My focus is on creating seamless user experiences that combine aesthetic design with 
            robust technical architecture.
          </p>
          <div className="flex items-center gap-6 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">10+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Projects Built</span>
            </div>
            <div className="w-px h-10 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">3+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Languages</span>
            </div>
            <div className="w-px h-10 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">DSCET</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Education</span>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3">Core Expertise</p>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React.js', 'Node.js', 'Tailwind CSS', 'TypeScript', 'Vite'].map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:border-emerald-500/50 hover:text-emerald-500 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 bg-zinc-950 border-zinc-900 hover:border-emerald-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Your data stays in your browser. We use local storage to ensure your financial 
            information never leaves your device unless you choose to sync it.
          </p>
        </Card>

        <Card className="p-8 bg-zinc-950 border-zinc-900 hover:border-emerald-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Real-time Analysis</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Instant calculations and live updates. See your profit margins, expense ratios, 
            and growth trends as soon as you enter a transaction.
          </p>
        </Card>

        <Card className="p-8 bg-zinc-950 border-zinc-900 hover:border-emerald-500/30 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Deep Insights</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Advanced analytics that go beyond simple tracking. Understand your business 
            patterns with category breakdowns and temporal analysis.
          </p>
        </Card>
      </div>

      {/* Tech Stack Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Built with Modern Tech</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'React 18', desc: 'Modern UI' },
            { icon: Database, label: 'LocalStorage', desc: 'Secure Storage' },
            { icon: FileText, label: 'Tailwind CSS', desc: 'Utility-first' },
            { icon: BarChart3, label: 'Recharts', desc: 'Data Viz' },
          ].map((tech) => (
            <div key={tech.label} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col items-center text-center">
              <tech.icon className="w-6 h-6 text-zinc-500 mb-3" />
              <p className="text-sm font-bold text-white mb-1">{tech.label}</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Social */}
      <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Let's Connect</h3>
          <p className="text-zinc-500 text-sm">Interested in collaboration or have a question? Reach out anytime.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500"
            onClick={() => window.open('https://www.linkedin.com/in/vigneshwaran5442', '_blank')}
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500"
            onClick={() => window.open('https://github.com', '_blank')}
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500"
            onClick={() => window.open('https://twitter.com', '_blank')}
            title="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500"
            onClick={() => window.location.href = 'mailto:vigneshwaran.buisness@gmail.com'}
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
        <div>© 2024 Smart Business Analysis Dashboard • Version 2.1.0</div>
        <div className="text-[9px] tracking-[0.3em] text-zinc-700">
          Designed by <span className="underline underline-offset-4 decoration-emerald-500/50">R.VIGNESHWARAN</span>
        </div>
      </div>
    </div>
  );
};

export default About;
