import React, { useState } from 'react';
import { UserProfile, GeneratedPlan } from './types';
import { generatePlan } from './services/geminiService';
import Onboarding from './components/Onboarding';
import NutritionView from './components/NutritionView';
import WorkoutView from './components/WorkoutView';
import CoachChat from './components/CoachChat';
import Header from './components/Header';
import { LayoutDashboard, Utensils } from 'lucide-react';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition'>('workout');

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    try {
      const generatedPlan = await generatePlan(userProfile);
      setPlan(generatedPlan);
    } catch (error) {
      alert("Houve um erro ao gerar seu plano. Verifique sua chave API e tente novamente.");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setPlan(null);
    setActiveTab('workout');
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
           <Onboarding onComplete={handleOnboardingComplete} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary selection:text-slate-900">
      <Header onReset={handleReset} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-white">Olá, Atleta.</h1>
          <p className="text-slate-400 max-w-3xl">{plan.summary}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl mb-8 w-full max-w-md border border-slate-800">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'workout'
                ? 'bg-slate-800 text-primary shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard size={18} />
            Treino
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'nutrition'
                ? 'bg-slate-800 text-blue-400 shadow-sm ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Utensils size={18} />
            Nutrição
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'workout' ? (
            <WorkoutView workoutPlan={plan.workoutPlan} />
          ) : (
            <NutritionView nutritionPlan={plan.nutritionPlan} macros={plan.macros} />
          )}
        </div>
      </main>

      <CoachChat plan={plan} />
    </div>
  );
};

export default App;