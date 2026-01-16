import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { PreSurvey } from './components/PreSurvey';

type InvestorType = 'conservative' | 'balanced' | 'adventurous' | null;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [investorType, setInvestorType] = useState<InvestorType>(null);

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowSurvey(false);
    setInvestorType(null);
  };

  const handleStartSurvey = () => {
    setShowSurvey(true);
  };

  const handleBackToDashboard = () => {
    setShowSurvey(false);
  };

  const handleSurveyComplete = (type: InvestorType) => {
    setInvestorType(type);
    setShowSurvey(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : showSurvey ? (
        <PreSurvey user={currentUser} onBack={handleBackToDashboard} onLogout={handleLogout} onComplete={handleSurveyComplete} />
      ) : (
        <Dashboard user={currentUser} onLogout={handleLogout} onStartSurvey={handleStartSurvey} investorType={investorType} />
      )}
    </div>
  );
}