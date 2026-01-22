import { LogOut, TrendingUp, BarChart3, PieChart, ArrowRight } from 'lucide-react';
import { InvestingChatbot } from './InvestingChatbot';


type InvestorType = 'conservative' | 'balanced' | 'adventurous' | null;

interface DashboardProps {
  user: string | null;
  onLogout: () => void;
  onStartSurvey: () => void;
  investorType: InvestorType;
}

export function Dashboard({ user, onLogout, onStartSurvey, investorType }: DashboardProps) {
  const getInvestorTypeDisplay = () => {
    if (!investorType) return 'Not Set';
    return investorType.charAt(0).toUpperCase() + investorType.slice(1);
  };

  const getInvestorTypeColor = () => {
    switch (investorType) {
      case 'conservative':
        return 'text-blue-400';
      case 'balanced':
        return 'text-purple-400';
      case 'adventurous':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <TrendingUp style={{ width: 24, height: 24, color: '#10b981'}} />
            MyRisk Assistant
          </div>
          <button className="nav-btn" onClick={onLogout}>
            <LogOut style={{ width: 20, height: 20 }} /> Logout
          </button>
        </div>
      </header>

  <main className="dashboard-main">
    <div className="dashboard-card">
      {/* Welcome Section */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            marginBottom: '1rem',
            border: '2px solid rgba(5, 150, 105, 0.3)',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
          }}
        >
          <TrendingUp style={{ width: 40, height: 40, color: '#10b981' }} />
        </div>

        <h1>Welcome to MyRisk Assistant</h1>
        <p>
          Logged in as <span style={{ color: '#10b981', fontWeight: 700 }}>{user}</span>
        </p>
      </div>

      {/* Pre-survey card */}
      {!investorType && (
        <div style={{
          maxWidth: '768px',
          margin: '0 auto 2rem auto',
          padding: '1.5rem',
          borderRadius: '0.625rem',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          background: 'linear-gradient(to right, rgba(30, 64, 175, 0.4), rgba(139, 92, 246, 0.4))'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'white', marginBottom: '1rem',fontSize:'18px'}}>
            <PieChart style={{ width: 24, height: 24, color: '#60a5fa' }} />
            Know Your Investor Type
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
             Understanding your investor profile is the first step toward building a successful investment strategy. 
                  Whether you're a conservative investor seeking steady returns, an aggressive trader looking for high-growth 
                  opportunities, or somewhere in between, knowing your risk tolerance, investment timeline, and financial goals 
                  will help you make informed decisions that align with your unique circumstances. Our pre-survey will help 
                  identify your investor type and provide personalized recommendations tailored to your financial journey.
          </p>
          <button className="button-dash" onClick={onStartSurvey}>
            Take Pre-Survey <ArrowRight style={{ width: 20, height: 20 }} />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <BarChart3 style={{ width: 32, height: 32, color: '#60a5fa', margin: '0 auto 0.75rem auto' }} />
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'white', marginBottom: '0.25rem' }}>$0.00</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Portfolio Value</div>
        </div>

        <div className="card">
          <TrendingUp style={{ width: 32, height: 32, color: '#10b981', margin: '0 auto 0.75rem auto' }} />
          <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'white', marginBottom: '0.25rem' }}>0%</div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Total Returns</div>
        </div>

        <div className="card">
          <PieChart style={{ width: 32, height: 32, color: '#c084fc', margin: '0 auto 0.75rem auto' }} />
          <div className={`text-2xl font-bold mb-1 ${
            investorType === 'conservative' ? 'investor-conservative' :
            investorType === 'balanced' ? 'investor-balanced' :
            investorType === 'adventurous' ? 'investor-adventurous' :
            'investor-default'
          }`} style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            {investorType ? investorType.charAt(0).toUpperCase() + investorType.slice(1) : 'Not Set'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Investor Type</div>
        </div>
      </div>
      
    </div>
    {investorType && (
          <InvestingChatbot investorType={investorType} />
          )}
  </main>
</div>


  );
}