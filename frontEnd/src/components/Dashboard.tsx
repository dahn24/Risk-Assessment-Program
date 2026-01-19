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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <span className="font-semibold text-white">InvestorHub</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-4 border-2 border-emerald-500/30">
              <TrendingUp className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome to InvestorHub
            </h1>
            <p className="text-slate-300">
              Logged in as <span className="font-medium text-emerald-400">{user}</span>
            </p>
          </div>

          {!investorType ? (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-700/30">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-blue-400" />
                  Know Your Investor Type
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Understanding your investor profile is the first step toward building a successful investment strategy. 
                  Whether you're a conservative investor seeking steady returns, an aggressive trader looking for high-growth 
                  opportunities, or somewhere in between, knowing your risk tolerance, investment timeline, and financial goals 
                  will help you make informed decisions that align with your unique circumstances. Our pre-survey will help 
                  identify your investor type and provide personalized recommendations tailored to your financial journey.
                </p>
                <button
                  onClick={onStartSurvey}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                >
                  Take Pre-Survey
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">$0.00</div>
              <div className="text-sm text-slate-400">Portfolio Value</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">0%</div>
              <div className="text-sm text-slate-400">Total Returns</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 text-center">
              <PieChart className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className={`text-2xl font-bold mb-1 ${getInvestorTypeColor()}`}>{getInvestorTypeDisplay()}</div>
              <div className="text-sm text-slate-400">Investor Type</div>
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