import * as React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Transaction } from '@/src/types';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb,
  ArrowRight,
  Brain,
  Loader2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { GoogleGenAI } from "@google/genai";

interface InsightsProps {
  transactions: Transaction[];
  onViewDetailedReport?: () => void;
}

const Insights: React.FC<InsightsProps> = ({ transactions, onViewDetailedReport }) => {
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const profit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  const generateAIInsight = async () => {
    if (transactions.length === 0) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const summary = transactions.map(t => ({
        type: t.type,
        amount: t.amount,
        category: t.category,
        date: t.date,
        description: t.description
      })).slice(0, 50); // Send recent 50 for context

      const prompt = `As a senior business analyst, analyze the following transaction data and provide a concise, professional recommendation for business growth and cost optimization. Focus on identifying trends and actionable insights.
      
      Summary Stats:
      Total Income: ₹${totalIncome}
      Total Expense: ₹${totalExpense}
      Net Profit: ₹${profit}
      Profit Margin: ${profitMargin.toFixed(2)}%
      
      Recent Transactions: ${JSON.stringify(summary)}
      
      Provide the response in clear, professional English. Max 3 sentences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAiInsight(response.text || "Unable to generate insights at this time.");
    } catch (error) {
      console.error("AI Insight Generation Failed:", error);
      setAiInsight("Unable to connect to intelligence engine. Please check your data and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (transactions.length > 0 && !aiInsight) {
      generateAIInsight();
    }
  }, [transactions.length]);

  const insights = [
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      description: profitMargin > 20 ? 'Your business is highly profitable.' : 'Consider optimizing expenses to improve margin.',
      icon: TrendingUp,
      variant: profitMargin > 20 ? 'success' : 'warning',
    },
    {
      title: 'Top Expense',
      value: transactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount)[0]?.category || 'N/A',
      description: 'This category accounts for the largest portion of your costs.',
      icon: AlertCircle,
      variant: 'danger',
    },
    {
      title: 'Financial Health',
      value: profit > 0 ? 'Healthy' : 'Critical',
      description: profit > 0 ? 'You are generating more than you spend.' : 'Your expenses exceed your income.',
      icon: CheckCircle2,
      variant: profit > 0 ? 'success' : 'danger',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, i) => (
          <Card key={i} className="relative overflow-hidden group border-zinc-800 bg-zinc-950/50">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                'p-3 rounded-xl border transition-colors duration-300',
                insight.variant === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                insight.variant === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                'bg-rose-500/10 text-rose-500 border-rose-500/20'
              )}>
                <insight.icon className="w-6 h-6" />
              </div>
              <Badge variant={insight.variant as any}>{insight.title}</Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{insight.value}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">{insight.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 bg-zinc-950 border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Brain className="w-64 h-64 text-emerald-500" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                AI Smart Analysis
              </div>
              {isGenerating && (
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing...
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-white tracking-tight">AI-Powered Strategic Insights</h2>
            
            <div className="min-h-[100px] flex flex-col justify-center">
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-900 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-zinc-900 rounded-full w-1/2 animate-pulse" />
                  <div className="h-4 bg-zinc-900 rounded-full w-2/3 animate-pulse" />
                </div>
              ) : aiInsight ? (
                <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                  {aiInsight}
                </p>
              ) : (
                <p className="text-zinc-500 italic">
                  Add some transactions to generate personalized business insights.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-zinc-900">
              <button 
                onClick={onViewDetailedReport}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all group shadow-lg shadow-emerald-900/20"
              >
                View All Analysis Options
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={generateAIInsight}
                disabled={isGenerating || transactions.length === 0}
                className="px-6 py-3 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Insights;
