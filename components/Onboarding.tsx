import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Goal, Environment } from '../types';
import { Activity, Dumbbell, Utensils, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  loading: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, loading }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    gender: Gender.Male,
    activityLevel: ActivityLevel.Sedentary,
    goal: Goal.Recomposition,
    environment: Environment.Gym
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.age && profile.weight && profile.height) {
      onComplete(profile as UserProfile);
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all";
  const labelClass = "block text-sm font-medium text-slate-400 mb-1";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 mb-2">
          BodyRecomp AI
        </h1>
        <p className="text-slate-400">
          Vamos construir seu plano perfeito para queimar gordura e ganhar músculos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-primary animate-pulse">Criando seu protocolo...</p>
            <p className="text-sm text-slate-400 mt-2">Isso pode levar alguns segundos.</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Idade</label>
              <input
                type="number"
                required
                className={inputClass}
                placeholder="Ex: 25"
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Peso (kg)</label>
              <input
                type="number"
                required
                className={inputClass}
                placeholder="Ex: 80"
                onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>Altura (cm)</label>
              <input
                type="number"
                required
                className={inputClass}
                placeholder="Ex: 175"
                onChange={(e) => handleChange('height', parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Gender & Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Gênero</label>
              <select
                className={inputClass}
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              >
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Nível de Atividade</label>
              <select
                className={inputClass}
                value={profile.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
              >
                {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Goal & Environment */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <Activity size={16} /> Objetivo Principal
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {Object.values(Goal).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('goal', g)}
                    className={`p-3 rounded-lg text-sm font-medium border transition-all ${
                      profile.goal === g
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <Dumbbell size={16} /> Ambiente de Treino
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {Object.values(Environment).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => handleChange('environment', e)}
                    className={`p-3 rounded-lg text-sm font-medium border transition-all ${
                      profile.environment === e
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>

           {/* Restrictions */}
           <div>
              <label className={`${labelClass} flex items-center gap-2`}>
                <Utensils size={16} /> Restrições Alimentares ou Lesões
              </label>
              <textarea
                className={`${inputClass} h-24 resize-none`}
                placeholder="Ex: Vegetariano, dor no joelho, alergia a amendoim..."
                onChange={(e) => handleChange('restrictions', e.target.value)}
              />
            </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-400 hover:to-primary text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transform transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Gerar Meu Protocolo <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;