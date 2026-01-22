import { useState } from 'react';
import axios from 'axios';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { PreSurvey } from './components/PreSurvey';

type InvestorType = 'conservative' | 'balanced' | 'adventurous' | null;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [investorType, setInvestorType] = useState<InvestorType>(null);

  const handleLogin = async (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
    localStorage.setItem("loggedInEmail", email);
    //await checkSurvey(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowSurvey(false);
    setInvestorType(null);
   // localStorage.removeItem("loggedInEmail");
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

  // const checkSurvey = async (email: string): Promise<void> => {
  //   try {
  //     const res = await axios.get(`http://localhost:3001/api/survey/${email}`);
  //     if (res.data.survey) {
  //       setInvestorType(
  //         res.data.survey.risk_category === "Aggressive"
  //           ? "adventurous"
  //           : res.data.survey.risk_category === "Moderate"
  //             ? "balanced"
  //             : "conservative"
  //       );
  //       setShowSurvey(false); // skip survey
  //     } else {
  //       setShowSurvey(true);
  //     }
  //   } catch (err) {
  //     setShowSurvey(true); // no survey found, show survey
  //   }
  // }

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