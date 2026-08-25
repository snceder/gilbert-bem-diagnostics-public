import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Edit3, 
  Lightbulb, 
  Sparkles, 
  Target, 
  Building2, 
  Layers
} from 'lucide-react';
import { BEM_CELL_DEFINITIONS, BRANCHING_QUESTIONS } from '../data/bemQuestions';
import { AssessmentMetadata, FeasibilityReport } from '../types';
import { calculateBEMReport } from '../utils/bemCalculator';

interface QuestionnaireProps {
  metadata: AssessmentMetadata;
  answers: Record<number, number>;
  notes?: Record<number, string>;
  isSampleCase?: boolean;
  onMetadataChange: (metadata: AssessmentMetadata) => void;
  onAnswerChange: (questionId: number, choiceIndex: number) => void;
  onNoteChange: (questionId: number, note: string) => void;
  onComplete: () => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({
  metadata,
  answers,
  notes = {},
  isSampleCase,
  onMetadataChange,
  onAnswerChange,
  onNoteChange,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showMetadataForm, setShowMetadataForm] = useState(!metadata.clientName);

  const currentQuestion = BRANCHING_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === BRANCHING_QUESTIONS.length - 1;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / BRANCHING_QUESTIONS.length) * 100);

  // Calculate live report preview
  const rawLiveReport: FeasibilityReport = calculateBEMReport(metadata, answers);
  const liveReport: FeasibilityReport = answeredCount === 0 ? {
    ...rawLiveReport,
    environmentDeficitScore: 0,
    personDeficitScore: 0,
    nonTrainingFeasibilityScore: 0,
    trainingOnlyFailureRisk: 0,
    pipIndex: 1.0,
    gunToHeadTestPassed: false
  } : rawLiveReport;
  const selectedChoice = answers[currentQuestion.id];

  const handleChoiceSelect = (index: number) => {
    onAnswerChange(currentQuestion.id, index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < BRANCHING_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-['Work_Sans','Source_Sans_Pro',sans-serif] text-[#1E293B]">
      
      {/* 1. Client Context Header / Form Toggle */}
      <div className="bg-white border border-stone-300/80 rounded-2xl p-5 shadow-xs text-[#1E293B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-[#183153] shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {isSampleCase && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4C542]/20 text-[#183153] border border-[#F4C542] tracking-wide">
                    SAMPLE CASE STUDY
                  </span>
                )}
                <h2 className="text-lg font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">
                  {metadata.clientName || 'Unspecified Client'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B4B4A]/10 text-[#1B4B4A] border border-[#1B4B4A]/25">
                  {metadata.targetRole || 'Target Role'}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                <strong className="text-[#183153]">Issue:</strong> {metadata.performanceIssueDescription || 'No performance description provided.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMetadataForm(!showMetadataForm)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-[#FAF6EF] hover:bg-stone-200 text-[#183153] px-3 py-2 rounded-xl border border-stone-300 transition-colors shrink-0 self-start md:self-center cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#1B4B4A]" />
            <span>{showMetadataForm ? 'Hide Details' : 'Edit Case Details'}</span>
          </button>
        </div>

        {/* Collapsible Metadata Form */}
        {showMetadataForm && (
          <div className="mt-5 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Client / Company Name
              </label>
              <input
                type="text"
                value={metadata.clientName}
                onChange={(e) => onMetadataChange({ ...metadata, clientName: e.target.value })}
                placeholder="e.g., Acuity Financial"
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Department / Business Unit
              </label>
              <input
                type="text"
                value={metadata.department}
                onChange={(e) => onMetadataChange({ ...metadata, department: e.target.value })}
                placeholder="e.g., Customer Operations"
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={metadata.targetRole}
                onChange={(e) => onMetadataChange({ ...metadata, targetRole: e.target.value })}
                placeholder="e.g., Tier 1 Support Specialists"
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Performance Gap Description &amp; Client's Initial Request
              </label>
              <input
                type="text"
                value={metadata.performanceIssueDescription}
                onChange={(e) => onMetadataChange({ ...metadata, performanceIssueDescription: e.target.value })}
                placeholder="e.g., High compliance error rates on calls. Client requested 3-day training course."
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Assessed By (Consultant Name)
              </label>
              <input
                type="text"
                value={metadata.assessedBy}
                onChange={(e) => onMetadataChange({ ...metadata, assessedBy: e.target.value })}
                placeholder="e.g., Jane Doe, HPT Lead"
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Progress Tracker Bar */}
      <div className="bg-white border border-stone-300/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#183153]">
              Question {currentQuestionIndex + 1} of {BRANCHING_QUESTIONS.length}
            </span>
            <span className="text-xs text-stone-500">
              ({progressPercent}% Complete)
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-300">
          <div 
            className="h-full bg-gradient-to-r from-[#183153] via-[#1B4B4A] to-[#F4C542] rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / BRANCHING_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Step Buttons Quick Navigation */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {BRANCHING_QUESTIONS.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#183153] text-white font-bold shadow-xs ring-2 ring-[#F4C542]' 
                    : isAnswered 
                    ? 'bg-[#1B4B4A]/10 text-[#1B4B4A] border border-[#1B4B4A]/30' 
                    : 'bg-[#FAF6EF] text-stone-500 border border-stone-300 hover:text-stone-800'
                }`}
              >
                {isAnswered && !isCurrent && <CheckCircle2 className="w-3 h-3 text-[#1B4B4A]" />}
                <span>Q{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Question Layout + Live Score Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Question Panel (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-stone-300/80 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Question Header & Category Name Subtitle */}
            <div>
              <div className="mb-1">
                <span className="text-xs font-bold text-[#1B4B4A] tracking-wider uppercase">
                  {BEM_CELL_DEFINITIONS[currentQuestion.cellKey].name}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153] tracking-tight leading-snug">
                {currentQuestion.title}
              </h2>
              <p className="text-base text-[#1E293B] mt-2 font-medium">
                {currentQuestion.question}
              </p>
            </div>

            {/* Context Tip & Why It Matters Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF6EF] p-4 rounded-xl border border-stone-300/80">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#183153]">Gilbert Diagnostic Tip</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{currentQuestion.contextTip}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 border-t sm:border-t-0 sm:border-l border-stone-300/80 pt-3 sm:pt-0 sm:pl-3">
                <Target className="w-4 h-4 text-[#1B4B4A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#183153]">Why This Impacts ROI</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{currentQuestion.whyItMatters}</p>
                </div>
              </div>
            </div>

            {/* Answer Choices List */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#183153] uppercase tracking-wider">
                Select Observed Condition:
              </label>

              {currentQuestion.choices.map((choice, index) => {
                const isSelected = selectedChoice === index;

                let severityBg = 'border-stone-300 hover:border-stone-400 bg-white';
                if (isSelected) {
                  severityBg = 'border-[#1B4B4A] bg-[#FAF6EF] ring-2 ring-[#1B4B4A]/30 shadow-xs';
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(index)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${severityBg}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'border-[#1B4B4A] bg-[#1B4B4A]' : 'border-stone-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-[#183153] block">
                        {choice.text}
                      </span>
                      {choice.subtext && (
                        <p className="text-xs text-stone-600 mt-1 leading-normal">
                          {choice.subtext}
                        </p>
                      )}
                      {isSelected && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {choice.severityTag && (
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${
                              choice.severityTag === 'Optimal'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : choice.severityTag === 'Minor Friction'
                                ? 'bg-blue-50 text-blue-900 border-blue-300'
                                : choice.severityTag === 'Moderate Deficit'
                                ? 'bg-amber-50 text-amber-950 border-amber-300'
                                : 'bg-rose-50 text-rose-950 border-rose-300'
                            }`}>
                              {choice.severityTag}
                            </span>
                          )}
                          {choice.passesGunToHead && (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#1B4B4A]/10 border border-[#1B4B4A]/25 text-[11px] font-bold text-[#1B4B4A]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4B4A]" />
                              <span>Mager-Pipe Skill Test Passed: Non-Training Problem</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Notes Field */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#183153] mb-1">
                Notes &amp; Specific Evidence (Optional)
              </label>
              <textarea
                rows={2}
                value={notes[currentQuestion.id] || ''}
                onChange={(e) => onNoteChange(currentQuestion.id, e.target.value)}
                placeholder="e.g., Spoke with shift lead; staff confirmed they skip step 3 because software takes 45 seconds to load..."
                className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl p-3 text-xs text-[#1E293B] focus:outline-none focus:border-[#1B4B4A]"
              />
            </div>

            {/* Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                  currentQuestionIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                    : 'bg-white hover:bg-stone-100 border-stone-300 text-[#183153]'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                disabled={selectedChoice === undefined}
                className={`inline-flex items-center gap-2 text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer ${
                  selectedChoice === undefined
                    ? 'opacity-50 cursor-not-allowed bg-stone-200 text-stone-400 border border-stone-300'
                    : isLastQuestion
                    ? 'bg-[#F4C542] hover:bg-[#e0b438] text-[#183153]'
                    : 'bg-[#183153] hover:bg-[#12253f] text-white'
                }`}
              >
                <span>{isLastQuestion ? 'View Performance Diagnosis' : 'Next Question'}</span>
                {isLastQuestion ? <Sparkles className="w-4 h-4 text-[#183153]" /> : <ArrowRight className="w-4 h-4 text-[#F4C542]" />}
              </button>
            </div>

          </div>
        </div>

        {/* Real-Time Live Scoring Sidebar (Right 1 col) */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-300/80 rounded-2xl p-5 shadow-xs text-[#1E293B] sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1B4B4A]" />
                <h2 className="text-sm font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">Live BEM Diagnostic</h2>
              </div>
              <span className="text-[11px] font-semibold text-stone-500">
                {answeredCount}/10 Answered
              </span>
            </div>

            {/* Level 1 vs Level 2 Live Bar */}
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#183153]">Environment Deficit</span>
                  <span className="text-[#183153] font-bold">{liveReport.environmentDeficitScore}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="h-full bg-[#F4C542] transition-all duration-300"
                    style={{ width: `${liveReport.environmentDeficitScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#1B4B4A]">Person Deficit (Skills)</span>
                  <span className="text-[#1B4B4A] font-bold">{liveReport.personDeficitScore}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="h-full bg-[#183153] transition-all duration-300"
                    style={{ width: `${liveReport.personDeficitScore}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onComplete}
              disabled={answeredCount === 0}
              className="w-full mt-5 py-2.5 px-4 bg-[#183153] hover:bg-[#12253f] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>View Performance Diagnosis</span>
              <ChevronRight className="w-4 h-4 text-[#F4C542]" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
