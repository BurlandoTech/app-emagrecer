import React from 'react';
import { WorkoutSession } from '../types';
import { Timer, Zap, CheckCircle2 } from 'lucide-react';

interface WorkoutViewProps {
  workoutPlan: WorkoutSession[];
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ workoutPlan }) => {
  if (!workoutPlan || workoutPlan.length === 0) return null;

  // For this simplified version, we show the first session generated
  const session = workoutPlan[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{session.dayName}</h2>
            <p className="text-primary font-medium">{session.focus}</p>
          </div>
          <div className="bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-700">
             <span className="text-slate-400 text-sm flex items-center gap-2">
                <Timer size={16} /> Aquecimento
             </span>
             <p className="text-slate-200 text-sm mt-1">{session.warmup}</p>
          </div>
        </div>

        <div className="space-y-3">
          {session.exercises.map((exercise, idx) => (
            <div key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-slate-900 transition-colors group">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                {idx + 1}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-white text-lg">{exercise.name}</h3>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <Zap size={14} className="text-yellow-500" />
                  {exercise.notes}
                </p>
              </div>
              <div className="flex-shrink-0 flex gap-4 text-sm font-mono text-slate-300 bg-slate-800/80 p-2 rounded-lg">
                <div className="text-center min-w-[3rem]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Séries</div>
                  <div className="font-bold">{exercise.sets}</div>
                </div>
                <div className="w-px bg-slate-700"></div>
                <div className="text-center min-w-[3rem]">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reps</div>
                  <div className="font-bold">{exercise.reps}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {session.cardio && (
           <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
             <h4 className="text-blue-400 font-bold flex items-center gap-2 mb-1">
                <CheckCircle2 size={18} /> Cardio Final
             </h4>
             <p className="text-blue-100/80 text-sm">{session.cardio}</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutView;