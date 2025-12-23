
import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import { AppState, TailoredResult } from './types';
import { tailorResume } from './services/geminiService';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Download,
  Copy,
  RefreshCcw,
  Plus
} from 'lucide-react';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<TailoredResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleTailor = async () => {
    if (!resumeText || !jobText) {
      setError("Please provide both your resume and the job description.");
      return;
    }

    try {
      setStatus(AppState.LOADING);
      setError(null);
      const output = await tailorResume(resumeText, jobText);
      setResult(output);
      setStatus(AppState.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("Failed to tailor resume. Please try again.");
      setStatus(AppState.ERROR);
    }
  };

  const resetForm = () => {
    setStatus(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {status === AppState.IDLE || status === AppState.LOADING || status === AppState.ERROR ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Your Resume</h2>
                </div>
                
                <p className="text-slate-500 text-sm mb-4">
                  Paste your current resume text or upload a .txt file.
                </p>

                <div className="space-y-4">
                  <textarea
                    className="w-full h-64 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-mono"
                    placeholder="Paste your current resume here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                  
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer group">
                      <div className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-4 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Upload Text File</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".txt" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Job Description</h2>
                </div>
                
                <p className="text-slate-500 text-sm mb-4">
                  Paste the requirements for the role you're applying for.
                </p>

                <textarea
                  className="w-full h-64 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Paste the job requirements, responsibilities, and qualifications here..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleTailor}
                disabled={status === AppState.LOADING}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 ${
                  status === AppState.LOADING 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 active:scale-[0.98]'
                }`}
              >
                {status === AppState.LOADING ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin" />
                    <span>Analyzing & Re-writing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Optimize My Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Explainer */}
            <div className="sticky top-24 hidden lg:block">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                    Land your dream job with <span className="text-blue-600">AI precision.</span>
                  </h1>
                  <p className="text-lg text-slate-600">
                    Our AI re-writes your resume to highlight exactly what recruiters are looking for, 
                    using real industry keywords and quantified results.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    "Beat Applicant Tracking Systems (ATS)",
                    "Tailor bullet points to job requirements",
                    "Highlight high-impact keywords automatically",
                    "Maintain a professional, polished tone"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Powered by Gemini 3 Pro</h4>
                      <p className="text-sm text-slate-500">Advanced reasoning for your career</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm italic">
                    "This tool helped me increase my interview rate by 40% in just two weeks of applying." 
                    <br />— Sarah K., Senior Product Manager
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <button 
                  onClick={resetForm}
                  className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium mb-2 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to editor
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Optimization Complete!</h1>
                <p className="text-slate-500">We've tailored your resume to better match the role.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Match Score</p>
                    <p className="text-2xl font-black text-green-700">{result?.matchScore}%</p>
                  </div>
                  <div className="h-10 w-[2px] bg-green-200"></div>
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content: The Tailored Resume */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Preview</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigator.clipboard.writeText(result?.tailoredResume || '')}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-10 bg-white">
                  <div className="prose-resume whitespace-pre-wrap font-serif text-slate-800 leading-relaxed text-sm sm:text-base">
                    {result?.tailoredResume}
                  </div>
                </div>
              </div>

              {/* Sidebar: Insights */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Key AI Optimizations
                  </h3>
                  <ul className="space-y-3">
                    {result?.keyChanges.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm text-slate-600 leading-tight">{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                  <h4 className="font-bold mb-2">Next Steps</h4>
                  <p className="text-sm text-blue-100 mb-4">
                    Review the content for accuracy before sending. Small personal touches can make a big difference.
                  </p>
                  <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                    Save as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-slate-900">ResumeTailor AI</span>
            </div>
            <p className="text-slate-500 text-sm">
              &copy; 2024 ResumeTailor AI. All rights reserved. Built with Gemini 3.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Terms</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
