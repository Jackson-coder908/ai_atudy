import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, getRecentActivities } from '../api/api';
import { Layers, Cpu, BookOpen, ChevronRight, Sparkles, Brain } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, actData] = await Promise.all([
          getDashboardSummary(),
          getRecentActivities()
        ]);
        setSummary(sumData);
        setActivities(actData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'bookOpen': return BookOpen;
      case 'layers': return Layers;
      case 'cpu': return Cpu;
      default: return Sparkles;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full px-md md:px-lg lg:px-xxl py-xl">
      <div className="max-w-container-max mx-auto w-full">
        {/* Welcome Section */}
        <section className="mb-xxl mt-4 animate-in fade-in duration-200">
          <h1 className="text-display-lg text-on-surface mb-2 tracking-tight">
            Welcome back, Alex
          </h1>
          <p className="text-body-lg text-secondary">
            Continue your research or review your recent flashcards.
          </p>
        </section>

        {/* Quick Action Cards (Bento-ish Grid) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xxl">
          {/* Card 1: Review Flashcards */}
          <div 
            onClick={() => navigate('/flashcards')}
            className="research-card bg-surface rounded-xl p-6 flex flex-col cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-200">
                <Layers className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-[#F1F5F9] text-secondary text-label-sm rounded uppercase tracking-wider font-semibold">
                Due
              </span>
            </div>
            <h3 className="text-headline-sm text-on-surface mb-1 font-bold">Review Flashcards</h3>
            <p className="text-body-sm text-secondary mb-6">
              {loading ? '...' : `${summary?.dueToday || 0} cards due today`}
            </p>
            <div className="mt-auto">
              <button className="btn-primary w-full py-2 px-4 text-label-md font-medium shadow-sm">
                Start Review Session
              </button>
            </div>
          </div>

          {/* Card 2: AI Research */}
          <div 
            onClick={() => navigate('/assistant')}
            className="research-card bg-surface rounded-xl p-6 flex flex-col cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-[#4F46E5] group-hover:text-white transition-colors duration-200">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-[#F1F5F9] text-secondary text-label-sm rounded uppercase tracking-wider font-semibold">
                Draft
              </span>
            </div>
            <h3 className="text-headline-sm text-on-surface mb-1 font-bold">AI Research</h3>
            <p className="text-body-sm text-secondary mb-6">Start a new session</p>
            <div className="mt-auto">
              <button className="w-full py-2 px-4 border border-[#E2E8F0] text-on-surface hover:bg-[#4F46E5]/5 transition-colors duration-200 rounded-lg text-label-md font-medium">
                Open Assistant
              </button>
            </div>
          </div>

          {/* Card 3: AI Quiz Generator */}
          <div 
            onClick={() => navigate('/quiz')}
            className="research-card bg-surface rounded-xl p-6 flex flex-col cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200">
                <Brain className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-[#F1F5F9] text-secondary text-label-sm rounded uppercase tracking-wider font-semibold">
                Quiz
              </span>
            </div>
            <h3 className="text-headline-sm text-on-surface mb-1 font-bold">Quiz Generator</h3>
            <p className="text-body-sm text-secondary mb-6">Generate interactive MCQs</p>
            <div className="mt-auto">
              <button className="w-full py-2 px-4 border border-[#E2E8F0] text-on-surface hover:bg-primary/5 transition-colors duration-200 rounded-lg text-label-md font-medium">
                Create Quiz
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="animate-in fade-in duration-300 delay-150">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-headline-md text-on-surface font-bold">Recent Activity</h2>
            <button 
              onClick={() => alert('View All history logs (feature mockup).')} 
              className="text-label-md text-primary hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-4 space-y-4">
                <div className="h-10 bg-surface-container rounded animate-pulse" />
                <div className="h-10 bg-surface-container rounded animate-pulse" />
                <div className="h-10 bg-surface-container rounded animate-pulse" />
              </div>
            ) : activities.length > 0 ? (
              activities.map((act, index) => {
                const IconComp = getIconComponent(act.icon);
                return (
                  <div
                    key={act.id}
                    onClick={() => navigate(act.icon === 'layers' ? '/flashcards' : '/assistant')}
                    className={`flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors cursor-pointer ${
                      index < activities.length - 1 ? 'border-b border-[#E2E8F0]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        act.icon === 'layers' ? 'bg-[#4F46E5]/10 text-[#4F46E5]' : 'bg-surface-container-high text-secondary'
                      }`}>
                        <IconComp className="w-5 h-5 stroke-[2px]" />
                      </div>
                      <div>
                        <h4 className="text-label-md font-semibold text-on-surface">{act.title}</h4>
                        <p className="text-label-sm text-secondary mt-0.5">{act.type} • {act.detail}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-outline" />
                  </div>
                );
              })
            ) : (
              <div className="p-lg text-center text-secondary text-body-md">
                No recent activity.
              </div>
            )}
          </div>
        </section>

        {/* Extra breathing room at bottom for mobile layout padding compatibility */}
        <div className="h-24 lg:h-12" />
      </div>
    </div>
  );
}
