import * as React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Globe, 
  Twitter, 
  Github, 
  Linkedin,
  Send,
  LifeBuoy,
  FileQuestion,
  BookOpen
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const Support: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Construct mailto link to actually send the email via client
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:vigneshwaran.buisness@gmail.com?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      value: 'vigneshwaran.buisness@gmail.com',
      desc: 'Get a response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      value: 'Available 24/7',
      desc: 'Chat with our support team',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (555) 000-0000',
      desc: 'Mon-Fri, 9am - 6pm EST',
      action: 'Call Now'
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'Documentation',
      desc: 'Detailed guides on how to use all features'
    },
    {
      icon: FileQuestion,
      title: 'Help Center',
      desc: 'Frequently asked questions and troubleshooting'
    },
    {
      icon: LifeBuoy,
      title: 'Community Forum',
      desc: 'Connect with other users and share tips'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Support & Contact</h2>
        <p className="text-sm text-zinc-500 font-medium">We're here to help you with any questions or issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {contactMethods.map((method, i) => (
          <Card key={i} className="p-6 bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <method.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{method.title}</h3>
                <p className="text-xs text-zinc-500">{method.desc}</p>
              </div>
            </div>
            {method.title === 'Email Support' ? (
              <a 
                href={`mailto:${method.value}`}
                className="block text-lg font-bold text-white mb-6 tracking-tight hover:text-emerald-500 transition-colors"
              >
                {method.value}
              </a>
            ) : (
              <p className="text-lg font-bold text-white mb-6 tracking-tight">{method.value}</p>
            )}
            <Button 
              variant="outline" 
              className="w-full font-bold uppercase tracking-widest text-[10px] h-9"
              onClick={() => {
                if (method.title === 'Email Support') {
                  window.location.href = `mailto:${method.value}`;
                } else if (method.title === 'Phone Support') {
                  window.location.href = `tel:${method.value.replace(/\s+/g, '')}`;
                }
              }}
            >
              {method.action}
            </Button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-8 bg-zinc-950 border-zinc-900">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Send us a Message</h3>
          </div>

          {submitted ? (
            <div className="py-12 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
              <p className="text-zinc-500 max-w-md">Thank you for reaching out. Our team will get back to you as soon as possible.</p>
              <Button 
                variant="ghost" 
                className="mt-6 font-bold uppercase tracking-widest text-xs"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="name" placeholder="John Doe" required />
                <Input label="Email Address" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <Input label="Subject" name="subject" placeholder="How can we help?" required />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Message</label>
                <textarea 
                  name="message"
                  className="w-full min-h-[150px] rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>
              <Button 
                type="submit" 
                glow 
                className="w-full md:w-auto px-8 h-12 font-bold uppercase tracking-widest"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-zinc-950 border-zinc-900">
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Helpful Resources</h3>
            <div className="space-y-4">
              {resources.map((res, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all">
                    <res.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{res.title}</p>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{res.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-zinc-950 border-zinc-900">
            <h3 className="text-lg font-bold text-white mb-6 tracking-tight">Connect with Us</h3>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Globe].map((Icon, i) => (
                <button 
                  key={i} 
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-emerald-500 hover:border-emerald-500/20 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-zinc-600 font-medium leading-relaxed">
              Follow us for the latest updates, financial tips, and community news.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
