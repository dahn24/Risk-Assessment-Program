import React, { useState } from 'react';
import axios from "axios";
import { LogOut, ArrowLeft, CheckCircle, ClipboardList } from 'lucide-react';

/**
 * Define the possible investor categories
 */
type InvestorType = 'conservative' | 'balanced' | 'adventurous';

interface PreSurveyProps {
  user?: string | null;
  onBack?: () => void;
  onLogout?: () => void;
  onComplete?: (type: InvestorType) => void;
}

/**
 * Main App component for Vite entry point.
 */
export default function App() {
  const handleComplete = (type: InvestorType) => {
    console.log("Survey finished! Result:", type);
  };

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleBack = () => {
    console.log("Navigating back to dashboard");
  };

  return (
    <PreSurvey 
      user="Student Learner" 
      onComplete={handleComplete} 
      onLogout={handleLogout} 
      onBack={handleBack} 
    />
  );
}

/**
 * PreSurvey Component: Handles the quiz logic and UI
 */
export function PreSurvey({ user, onBack, onLogout, onComplete }: PreSurveyProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);
  const [investorType, setInvestorType] = useState<InvestorType | null>(null);

  const questions = [
    {
      id: 0,
      question: "What are you prioritizing? ",
      type: 'radio',
      options: [
        { text: "Avoiding losses", score: 1 *3.3 },
        { text: "A balance of growth and stability", score: 2*3.3 },
        { text: "Long-term growth taking in the short-term risks", score: 3 *3.3 }
      ]
    },
    {
      id: 1,
      question: "When do you expect to need most of this money?",
      type: 'slider',
      min: 1,
      max: 10,
      labels: { min: "1 year", max: "10+ years" },
      unit: 'years'
    },
    {
      id: 2,
      question: "How stable is your income that you will be using to invest with?",
      type: 'slider',
      min: 0,
      max: 10,
      labels: { min: "Unstable", max: "Very stable" }
    },
    {
      id: 3,
      question: "How would you feel if your investment dropped 20% in a year?",
      type: 'radio',
      options: [
        { text: "I would want to reduce the risk immediately", score: 1 *3.30 },
        { text: "I would stay invested but feel uneasy", score: 2*3.3 },
        { text: "I would see it as normal and stay on course", score:  3 *3.3 }
      ]
    },
    {
      id: 4,
      question: "What aligns with your goals?",
      type: 'radio',
      options: [
        { text: "I prefer steady progress, even if its slow", score: 1 *3.3 },
        { text: "I’m okay with ups and downs if the results are better", score: 2*3.3 },
        { text: "I’m comfortable with large swings if the long-term potential is higher", score:  3 *3.3 }
      ]
    }
  ];

  const calculateType = (ans: Record<number, number>): InvestorType => {
    let score = 0;
    let totalPossible = 0;

    questions.forEach((q, idx) => {
      const val = ans[idx];
      if (val === undefined) return;
      if (q.type === 'radio') {
        score += val;
        totalPossible += 2;
      } else {
        const normalized = ((val - (q.min || 0)) / ((q.max || 10) - (q.min || 0))) * 3;
        score += normalized;
        totalPossible += 2;
      }
    });

    const percent = (score / totalPossible) * 100;
    if (percent <= 33) return 'conservative';
    if (percent <= 66) return 'balanced';
    return 'adventurous';
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      return;
    }

    // 1) MAP ANSWERS TO MODEL INPUT
    const payload = {
      risk_comfort: answers[0],
      time_horizon: answers[1],
      income_stability: answers[2],
      loss_tolerance: answers[3],
      growth_preference: answers[4],
    };

    try {
      // 2) SEND TO NODE BACKEND
      console.log("Sending payload:", payload);

      const res = await axios.post(
        "http://localhost:3001/api/survey/submit",
        payload
      );

      // 3) GET RISK CATEGORY FROM BACKEND RESPONSE
      const risk_category = res.data.survey.risk_category;

      // 4) MAP TO UI LABELS
      setInvestorType(
        risk_category === "Aggressive"
          ? "adventurous"
          : risk_category === "Moderate"
            ? "balanced"
            : "conservative"
      );

      setCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again.");
    }
  };

  

  // Inline styles for basic layout without external CSS dependencies
  const styles = {
    container: { fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#333' },
    card: { background: '#f9f9f9', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    button: { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold' },
    nextBtn: { backgroundColor: '#10b981', color: 'white' },
    backBtn: { backgroundColor: '#ccc', color: '#333', marginRight: '10px' },
    radioOption: { display: 'block', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', textAlign: 'left', width: '100%' },
    selectedOption: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
    progressBar: { height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' },
    progressFill: (p: number) => ({ height: '100%', width: `${p}%`, background: '#10b981', transition: 'width 0.3s' })
  };

  // Result Screen
  if (completed && investorType) {
    return (
      <div style={styles.container}>
        <div style={styles.card as any}>
          <CheckCircle color="#10b981" size={48} />
          <h1>You're all set!</h1>
          <p>Your profile is: <strong>{investorType.toUpperCase()}</strong></p>
          <p>Based on your answers, we've identified the best investment strategy for you.</p>
          <button 
            style={{...styles.button, ...styles.nextBtn}}
            onClick={() => onComplete?.(investorType)}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={styles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardList color="#10b981" />
          <span style={{ fontWeight: 'bold' }}>Investor Quiz</span>
        </div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <main style={styles.card as any}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginBottom: '15px' }}>
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div style={styles.progressBar}>
          <div style={styles.progressFill(progress) as any} />
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>{q.question}</h2>

        <div style={{ marginBottom: '30px' }}>
          {q.type === 'radio' ? (
            q.options?.map((opt, i) => (
              <button
                key={i}
                style={{
                  ...styles.radioOption,
                  ...(answers[currentQuestion] === opt.score ? styles.selectedOption : {})
                } as any}
                onClick={() => setAnswers({...answers, [currentQuestion]: opt.score})}
              >
                {opt.text}
              </button>
            ))
          ) : (
            <div>
              <input
                type="range"
                min={q.min}
                max={q.max}
                style={{ width: '100%' }}
                value={answers[currentQuestion] ?? q.min}
                onChange={(e) => setAnswers({...answers, [currentQuestion]: Number(e.target.value)})}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#666', fontSize: '14px' }}>
                <span>{q.labels?.min}</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>{answers[currentQuestion] ?? q.min} {q.unit || ''}</span>
                <span>{q.labels?.max}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            style={styles.backBtn}
            onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
            disabled={currentQuestion === 0}
          >
            Back
          </button>
          <button
            style={{...styles.button, ...styles.nextBtn}}
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
}