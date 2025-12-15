import React from 'react';
import { Meal, MacroTarget } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Flame, Droplet, Wheat, Dumbbell } from 'lucide-react';

interface NutritionViewProps {
  nutritionPlan: Meal[];
  macros: MacroTarget;
}

const NutritionView: React.FC<NutritionViewProps> = ({ nutritionPlan, macros }) => {
  const data = [
    { name: 'Proteína', value: macros.protein * 4, grams: macros.protein, color: '#10b981' }, // 4 cal/g
    { name: 'Carbos', value: macros.carbs * 4, grams: macros.carbs, color: '#3b82f6' },    // 4 cal/g
    { name: 'Gordura', value: macros.fats * 9, grams: macros.fats, color: '#f59e0b' },     // 9 cal/g
  ];

  const totalCal = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Macros Summary Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="text-orange-500" /> Metas Diárias
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="h-48 w-full md:w-1/3">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${value} kcal`, 'Energia']}
                  />
                  <Legend />
                </PieChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Dumbbell size={18} /> <span className="font-semibold">Proteína</span>
                </div>
                <p className="text-2xl font-bold text-white">{macros.protein}g</p>
                <p className="text-xs text-slate-500">Construtor Muscular</p>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Wheat size={18} /> <span className="font-semibold">Carboidratos</span>
                </div>
                <p className="text-2xl font-bold text-white">{macros.carbs}g</p>
                <p className="text-xs text-slate-500">Combustível</p>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Droplet size={18} /> <span className="font-semibold">Gorduras</span>
                </div>
                <p className="text-2xl font-bold text-white">{macros.fats}g</p>
                <p className="text-xs text-slate-500">Saúde Hormonal</p>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <Flame size={18} /> <span className="font-semibold">Calorias</span>
                </div>
                <p className="text-2xl font-bold text-white">{macros.calories}</p>
                <p className="text-xs text-slate-500">Meta Total</p>
             </div>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-300 ml-1">Sugestão de Cardápio</h3>
        {nutritionPlan.map((meal, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
            <div className="bg-slate-800/60 p-3 px-4 flex justify-between items-center">
              <h4 className="font-bold text-white">{meal.name}</h4>
              <span className="text-sm text-slate-400 font-mono">{meal.totalCalories} kcal</span>
            </div>
            <div className="p-4 divide-y divide-slate-800">
              {meal.items.map((item, i) => (
                <div key={i} className="py-2 first:pt-0 last:pb-0 flex justify-between items-start">
                  <div>
                    <p className="text-slate-200 font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.quantity}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>P:{item.protein}g C:{item.carbs}g G:{item.fats}g</div>
                    <div className="text-slate-400 font-mono mt-0.5">{item.calories} kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionView;