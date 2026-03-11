import * as React from 'react';
import { Transaction, TransactionType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import Analytics from './components/Analytics';
import Insights from './components/Insights';
import Files from './components/Files';
import About from './components/About';
import Settings from './components/Settings';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TransactionForm from './components/TransactionForm';
import { Button } from './components/Button';
import { Plus } from 'lucide-react';

// Mock User type for local mode
interface LocalUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default function App() {
  const [user, setUser] = React.useState<LocalUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSignup, setIsSignup] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | undefined>();

  // Initialize from localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('sb_user');
    const savedTransactions = localStorage.getItem('sb_transactions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
    }
    
    setLoading(false);
  }, []);

  // Sync transactions to localStorage
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('sb_transactions', JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const handleLogin = async (values: any) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      uid: 'local-user-123',
      email: values.email,
      displayName: values.email.split('@')[0],
    };
    
    setUser(newUser);
    localStorage.setItem('sb_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      uid: 'local-user-123',
      email: values.email,
      displayName: values.email.split('@')[0],
    };
    
    setUser(newUser);
    localStorage.setItem('sb_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      uid: 'local-user-123',
      email: 'demo@example.com',
      displayName: 'Demo User',
    };
    
    setUser(newUser);
    localStorage.setItem('sb_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('sb_user');
    setActiveTab('dashboard');
  };

  const handleAddTransaction = (type: TransactionType) => {
    setTransactionType(type);
    setEditingTransaction(undefined);
    setIsTransactionFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionType(transaction.type);
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleTransactionSubmit = async (values: any) => {
    if (!user) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...t, ...values, id: t.id, userId: user.uid, date: new Date(values.date).toISOString() } : t));
    } else {
      const newTransaction: Transaction = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        userId: user.uid,
        date: new Date(values.date).toISOString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
    
    setIsTransactionFormOpen(false);
    setLoading(false);
  };

  if (loading && !user) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4">
        {isSignup ? (
          <SignupForm 
            onSignup={handleSignup} 
            onGoogleSignup={handleGoogleAuth} 
            onToggleLogin={() => setIsSignup(false)} 
            isLoading={loading}
          />
        ) : (
          <LoginForm 
            onLogin={handleLogin} 
            onGoogleLogin={handleGoogleAuth} 
            onToggleSignup={() => setIsSignup(true)} 
            isLoading={loading}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="pl-64 min-h-screen">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} user={user as any} />
        
        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onQuickAdd={handleTransactionSubmit}
              isLoading={loading}
            />
          )}
          {activeTab === 'income' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">Income Sources</h2>
                <Button glow className="gap-2 h-11 px-6 font-bold uppercase tracking-widest" onClick={() => handleAddTransaction('income')}>
                  <Plus className="w-4 h-4" />
                  Add Income
                </Button>
              </div>
              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'income')} 
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          )}
          {activeTab === 'expenses' && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white tracking-tight">Expense Tracking</h2>
                <Button glow variant="danger" className="gap-2 h-11 px-6 font-bold uppercase tracking-widest" onClick={() => handleAddTransaction('expense')}>
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </div>
              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'expense')} 
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Transaction History</h2>
              <TransactionTable 
                transactions={transactions} 
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h2>
              <Analytics transactions={transactions} />
            </div>
          )}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Business Insights</h2>
              <Insights transactions={transactions} />
            </div>
          )}
          {activeTab === 'files' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Document Management</h2>
              <Files />
            </div>
          )}
          {activeTab === 'about' && (
            <About />
          )}
          {activeTab === 'settings' && (
            <Settings transactions={transactions} />
          )}
        </div>
      </main>

      {isTransactionFormOpen && (
        <TransactionForm 
          type={transactionType} 
          initialData={editingTransaction}
          onClose={() => setIsTransactionFormOpen(false)}
          onSubmit={handleTransactionSubmit}
          isLoading={loading}
        />
      )}
    </div>
  );
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', userId: 'demo-123', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: '2024-03-10T00:00:00Z' },
  { id: '2', userId: 'demo-123', type: 'expense', amount: 1200, category: 'Rent', description: 'Office Rent', date: '2024-03-05T00:00:00Z' },
  { id: '3', userId: 'demo-123', type: 'income', amount: 1500, category: 'Freelance', description: 'Web Design Project', date: '2024-03-08T00:00:00Z' },
  { id: '4', userId: 'demo-123', type: 'expense', amount: 450, category: 'Bills', description: 'Cloud Services', date: '2024-03-07T00:00:00Z' },
  { id: '5', userId: 'demo-123', type: 'expense', amount: 200, category: 'Food', description: 'Team Lunch', date: '2024-03-09T00:00:00Z' },
];
