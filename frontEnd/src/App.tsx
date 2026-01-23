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

  // ✅ CHANGED: environment variable for Node backend
  const nodeApi = import.meta.env.VITE_NODE_API_URL

  const handleLogin = async (email: string) => {
    setIsLoggedIn(true);
    setCurrentUser(email);
    localStorage.setItem("loggedInEmail", email);
    await checkSurvey(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowSurvey(false);
    setInvestorType(null);
    localStorage.removeItem("loggedInEmail");
  };

  const handleStartSurvey = () => {
    setShowSurvey(true);
  };

  const handleBackToDashboard = () => {
    setShowSurvey(false);
  };

  // Called when survey finishes
  const handleSurveyComplete = async (surveyData: any) => {
    try {
      const res = await axios.post(`${nodeApi}/survey/submit`, {
        email: currentUser,
        ...surveyData, // send all survey fields
      });

      const predicted = res.data.survey.risk_category;

      setInvestorType(
        predicted === "Aggressive"
          ? "adventurous"
          : predicted === "Moderate"
          ? "balanced"
          : "conservative"
      );
      setShowSurvey(false);
    } catch (err) {
      console.error("Survey submission failed", err);
      alert("Something went wrong submitting your survey. Please try again.");
    }
  };

  // Check if user already has a survey
  const checkSurvey = async (email: string) => {
    try {
      const res = await axios.get(`${nodeApi}/survey/${email}`);
      if (res.data.survey) {
        const predicted = res.data.survey.risk_category;
        setInvestorType(
          predicted === "Aggressive"
            ? "adventurous"
            : predicted === "Moderate"
            ? "balanced"
            : "conservative"
        );
        setShowSurvey(false); // skip survey
      } else {
        setShowSurvey(true); // show survey if none found
      }
    } catch (err) {
      console.warn("No survey found, showing survey");
      setShowSurvey(true);
    }
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