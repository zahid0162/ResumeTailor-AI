
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              ResumeTailor AI
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How it works</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
