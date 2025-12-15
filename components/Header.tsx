import React from 'react';
import { Dumbbell } from 'lucide-react';

const Header: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
          <div className="bg-gradient-to-tr from-primary to-blue-500 p-2 rounded-lg">
             <Dumbbell className="text-slate-900" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            BodyRecomp<span className="text-primary">AI</span>
          </span>
        </div>
        <nav>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Novo Protocolo
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;