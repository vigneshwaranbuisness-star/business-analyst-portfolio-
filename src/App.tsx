import * as React from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Transaction, TransactionType, CategoryInfo, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './types';
import { subscribeToTransactions, addTransaction, updateTransaction, deleteTransaction as deleteTransactionFromDb, testConnection } from './services/dataService';
import { login as fbLogin, signup as fbSignup, loginWithGoogle, logout as fbLogout } from './services/authService';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import Analytics from './components/Analytics';
import CalendarView from './components/CalendarView';
import Insights from './components/Insights';
import Files from './components/Files';
import About from './components/About';
import Support from './components/Support';
import Settings from './components/Settings';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { AuthLayout } from './components/AuthLayout';
import TransactionForm from './components/TransactionForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Plus } from 'lucide-react';
import { cn } from './lib/utils';

// ... (imports remain)

export default function App() {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAuthReady, setIsAuthReady] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(false);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [incomeCategories, setIncomeCategories] = React.useState<CategoryInfo[]>(INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] = React.useState<CategoryInfo[]>(EXPENSE_CATEGORIES);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = React.useState<Transaction | undefined>();

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  // Close sidebar on mobile when tab changes
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  // Initialize Firebase Auth
  React.useEffect(() => {
    testConnection();
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Firestore sync
  React.useEffect(() => {
    if (user?.uid) {
      const unsubscribeData = subscribeToTransactions(user.uid, (data) => {
        setTransactions(data);
      });
      return () => unsubscribeData();
    } else {
      setTransactions([]);
    }
  }, [user]);

  // Load categories from localStorage (kept per user preference for customization)
  React.useEffect(() => {
    const savedIncomeCats = localStorage.getItem('sb_income_categories');
    const savedExpenseCats = localStorage.getItem('sb_expense_categories');
    
    if (savedIncomeCats) {
      setIncomeCategories(JSON.parse(savedIncomeCats));
    }
    if (savedExpenseCats) {
      setExpenseCategories(JSON.parse(savedExpenseCats));
    }
  }, []);

  // Sync categories to localStorage
  React.useEffect(() => {
    localStorage.setItem('sb_income_categories', JSON.stringify(incomeCategories));
    localStorage.setItem('sb_expense_categories', JSON.stringify(expenseCategories));
  }, [incomeCategories, expenseCategories]);

  const handleUpdateProfile = () => {
    toast.error('Profile updates integrated with Firebase Auth settings coming soon.');
  };

  const handleAddCategory = (type: TransactionType, name: string) => {
    const newCat: CategoryInfo = { 
      label: name, 
      iconName: 'Plus', 
      color: 'text-zinc-500' 
    };
    if (type === 'income') {
      setIncomeCategories(prev => [...prev.filter(c => c.label !== 'Other'), newCat, prev.find(c => c.label === 'Other')!]);
    } else {
      setExpenseCategories(prev => [...prev.filter(c => c.label !== 'Other'), newCat, prev.find(c => c.label === 'Other')!]);
    }
  };

  const handleDeleteCategory = (type: TransactionType, label: string) => {
    if (label === 'Other') return;
    if (type === 'income') {
      setIncomeCategories(prev => prev.filter(c => c.label !== label));
    } else {
      setExpenseCategories(prev => prev.filter(c => c.label !== label));
    }
  };

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      await fbLogin(values);
      toast.success('Access Decrypted');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      await fbSignup(values);
      toast.success('Identity Established');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Access Granted');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fbLogout();
      setActiveTab('dashboard');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  const handleClearData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Local Categories',
      description: 'Are you sure you want to reset your category preferences to defaults?',
      variant: 'danger',
      onConfirm: () => {
        setIncomeCategories(INCOME_CATEGORIES);
        setExpenseCategories(EXPENSE_CATEGORIES);
        localStorage.removeItem('sb_income_categories');
        localStorage.removeItem('sb_expense_categories');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        toast.success('Categories Reset');
      }
    });
  };

  const handleDeleteAccount = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Deactivate Account',
      description: 'Please contact support to permanently delete your account and associated cloud data.',
      variant: 'danger',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
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
    try {
      await deleteTransactionFromDb(id);
      toast.success('Entry Expunged');
    } catch (error) {
      toast.error('Deletion failed');
    }
  };

  const handleTransactionSubmit = async (values: any, stayOpen: boolean = false) => {
    if (!user) return;

    setLoading(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          ...values,
          date: new Date(values.date).toISOString()
        });
        toast.success('Vault Record Updated');
      } else {
        await addTransaction({
          ...values,
          userId: user.uid,
          date: new Date(values.date).toISOString(),
        });
        toast.success('New Entry Vaulted');
      }
      
      if (!stayOpen) {
        setIsTransactionFormOpen(false);
      }
    } catch (error) {
      // Error handled by service / toast
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) {
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
    return isSignup ? (
      <AuthLayout 
        title="Establish Account" 
        subtitle="Create your high-security vault credentials"
      >
        <SignupForm 
          onSignup={handleSignup} 
          onGoogleSignup={handleGoogleAuth} 
          onToggleLogin={() => setIsSignup(false)} 
          isLoading={loading}
        />
      </AuthLayout>
    ) : (
      <AuthLayout 
        title="Professional Access" 
        subtitle="Enter the high-security vault"
      >
        <LoginForm 
          onLogin={handleLogin} 
          onGoogleLogin={handleGoogleAuth} 
          onToggleSignup={() => setIsSignup(true)} 
          isLoading={loading}
        />
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 mesh-bg flex flex-col lg:flex-row">
      <div className={cn(
        "fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 transition-opacity lg:hidden",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={cn(
        "fixed lg:sticky inset-y-0 left-0 transition-all duration-300 z-50 lg:z-auto top-0 h-screen",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <Header 
          title={activeTab === 'insights' ? 'Smart Analysis' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
          user={user as any} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-8 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <Dashboard 
              transactions={transactions} 
              incomeCategories={incomeCategories}
              expenseCategories={expenseCategories}
              onAddTransaction={handleAddTransaction}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onQuickAdd={handleTransactionSubmit}
              onViewInsights={() => setActiveTab('insights')}
              isLoading={loading}
            />
          )}
          {activeTab === 'income' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Income Sources</h2>
                    <p className="text-xs text-zinc-500 font-medium">Manage and monitor your revenue streams</p>
                  </div>
                  <Button glow className="w-full sm:w-auto gap-2 h-11 px-6 font-bold uppercase tracking-widest group" onClick={() => handleAddTransaction('income')}>
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    New Income
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(() => {
                    const income = transactions.filter(t => t.type === 'income');
                    const total = income.reduce((acc, t) => acc + t.amount, 0);
                    const avg = income.length > 0 ? total / income.length : 0;
                    const topCat = income.reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>);
                    const top = Object.entries(topCat).sort((a,b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

                    return (
                      <>
                        <Card className="p-4 bg-emerald-500/5 border-emerald-500/10">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Received</p>
                          <p className="text-2xl font-bold text-emerald-500 tracking-tight">₹{total.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-zinc-900/50">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Average Income</p>
                          <p className="text-2xl font-bold text-white tracking-tight">₹{Math.round(avg).toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-zinc-900/50">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Top Source</p>
                          <p className="text-lg font-bold text-white tracking-tight truncate">{top}</p>
                        </Card>
                      </>
                    );
                  })()}
                </div>
              </div>

              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'income')} 
                incomeCategories={incomeCategories}
                expenseCategories={expenseCategories}
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction}
                defaultFilter="income"
                hideFilters
              />
            </div>
          )}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Expense Tracking</h2>
                    <p className="text-xs text-zinc-500 font-medium">Track and categorize your spending habits</p>
                  </div>
                  <Button glow variant="danger" className="w-full sm:w-auto gap-2 h-11 px-6 font-bold uppercase tracking-widest group" onClick={() => handleAddTransaction('expense')}>
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    New Expense
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(() => {
                    const expenses = transactions.filter(t => t.type === 'expense');
                    const total = expenses.reduce((acc, t) => acc + t.amount, 0);
                    const avg = expenses.length > 0 ? total / expenses.length : 0;
                    const topCat = expenses.reduce((acc, t) => {
                      acc[t.category] = (acc[t.category] || 0) + t.amount;
                      return acc;
                    }, {} as Record<string, number>);
                    const top = Object.entries(topCat).sort((a,b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

                    return (
                      <>
                        <Card className="p-4 bg-rose-500/5 border-rose-500/10">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Spent</p>
                          <p className="text-2xl font-bold text-rose-500 tracking-tight">₹{total.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-zinc-900/50">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Average Expense</p>
                          <p className="text-2xl font-bold text-white tracking-tight">₹{Math.round(avg).toLocaleString()}</p>
                        </Card>
                        <Card className="p-4 bg-zinc-900/50">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Main Category</p>
                          <p className="text-lg font-bold text-white tracking-tight truncate">{top}</p>
                        </Card>
                      </>
                    );
                  })()}
                </div>
              </div>

              <TransactionTable 
                transactions={transactions.filter(t => t.type === 'expense')} 
                incomeCategories={incomeCategories}
                expenseCategories={expenseCategories}
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
                defaultFilter="expense"
                hideFilters
              />
            </div>
          )}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Transaction History</h2>
              <TransactionTable 
                transactions={transactions} 
                incomeCategories={incomeCategories}
                expenseCategories={expenseCategories}
                onEdit={handleEditTransaction} 
                onDelete={handleDeleteTransaction} 
              />
            </div>
          )}
          {activeTab === 'calendar' && (
            <CalendarView 
              transactions={transactions} 
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h2>
              <Analytics 
                transactions={transactions} 
                expenseCategories={expenseCategories} 
                onNextPage={() => setActiveTab('insights')}
              />
            </div>
          )}
          {activeTab === 'insights' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Business Insights</h2>
              <Insights 
                transactions={transactions} 
                onViewDetailedReport={() => setActiveTab('analytics')}
              />
            </div>
          )}
          {activeTab === 'files' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Document Management</h2>
              <Files />
            </div>
          )}
          {activeTab === 'support' && (
            <Support />
          )}
          {activeTab === 'about' && (
            <About />
          )}
          {activeTab === 'settings' && (
            <Settings 
              user={user}
              transactions={transactions} 
              incomeCategories={incomeCategories}
              expenseCategories={expenseCategories}
              onUpdateProfile={handleUpdateProfile}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onClearData={handleClearData}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </main>
      </div>

      {isTransactionFormOpen && (
        <TransactionForm 
          type={transactionType} 
          incomeCategories={incomeCategories}
          expenseCategories={expenseCategories}
          initialData={editingTransaction}
          onClose={() => setIsTransactionFormOpen(false)}
          onSubmit={handleTransactionSubmit}
          isLoading={loading}
        />
      )}

      <ConfirmationModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
      <Toaster position="bottom-right" />
    </div>
  );
}

// Application entry point finalized with Firebase integration
