import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { 
  Building2, 
  RotateCcw, 
  CheckCircle2, 
  Send, 
  Layers,
  Sparkles,
  User,
  Mail,
  MessageSquare
} from 'lucide-react';
import { FeasibilityReport, BEMCellKey } from '../types';
import { BEM_CELL_DEFINITIONS } from '../data/bemQuestions';

interface ReportDashboardProps {
  report: FeasibilityReport;
  isSampleCase?: boolean;
  onEditAnswers: () => void;
}

export const ReportDashboard: React.FC<ReportDashboardProps> = ({
  report,
  isSampleCase,
  onEditAnswers,
}) => {
  const [formState, handleFormSubmit] = useForm('mqpzrpqr');

  const {
    metadata,
    environmentDeficitScore,
    personDeficitScore,
    cellScores,
    answers,
  } = report;

  // Compute headline verdict string
  const verdict = `${environmentDeficitScore}% Environmental Factors vs. ${personDeficitScore}% Individual / Skill Factors`;

  // Determine implicated cells (name only, from BEM_CELL_DEFINITIONS, no ranking/weighting)
  const sortedCellKeys = (Object.keys(cellScores) as BEMCellKey[])
    .filter((key) => (cellScores[key]?.rawScore ?? 0) > 0)
    .sort((a, b) => cellScores[b].deficitPercentage - cellScores[a].deficitPercentage);

  const significantDeficitKeys = sortedCellKeys.filter(
    (key) => cellScores[key].deficitPercentage >= 25
  );

  const implicatedKeys = significantDeficitKeys.length > 0
    ? significantDeficitKeys
    : sortedCellKeys.slice(0, 2);

  const implicatedCells = implicatedKeys.map(
    (key) => BEM_CELL_DEFINITIONS[key]?.name || key
  );

  // Base64 encode { answers, verdict, implicatedCells } safely
  const sessionPayload = {
    answers,
    verdict,
    implicatedCells,
  };

  const encodedSessionData = (() => {
    try {
      const jsonStr = JSON.stringify(sessionPayload);
      return btoa(
        encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } catch {
      return btoa(JSON.stringify(sessionPayload));
    }
  })();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-['Work_Sans','Source_Sans_Pro',sans-serif] text-[#1E293B]">
      
      {/* Context Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-300/80 shadow-xs">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-[#183153] shrink-0" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isSampleCase && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F4C542]/20 text-[#183153] border border-[#F4C542] tracking-wide">
                  SAMPLE CASE STUDY
                </span>
              )}
              <h2 className="text-base font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">
                {metadata.clientName || 'Diagnostic Assessment'}
              </h2>
              {metadata.targetRole && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B4B4A]/10 text-[#1B4B4A] border border-[#1B4B4A]/25">
                  {metadata.targetRole}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isSampleCase
                ? 'Example benchmark scenario for illustration purposes only'
                : '10-Point Performance Intake Complete'}
            </p>
          </div>
        </div>

        <button
          id="adjust-answers-btn"
          onClick={onEditAnswers}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183153] bg-[#FAF6EF] hover:bg-stone-200 border border-stone-300 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#1B4B4A]" />
          <span>Adjust Answers</span>
        </button>
      </div>

      {/* 1. Headline Verdict Card */}
      <div id="diagnostic-verdict-card" className="bg-white border-2 border-[#183153] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153]">
          <Layers className="w-4 h-4 text-[#F4C542]" />
          <span>Performance Diagnosis Verdict</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153] leading-tight">
            {environmentDeficitScore >= personDeficitScore ? (
              <>
                <span className="text-[#183153]">{environmentDeficitScore}%</span> of performance barriers stem from <span className="underline decoration-[#F4C542] decoration-4 underline-offset-4">Environmental Factors</span>
              </>
            ) : (
              <>
                <span className="text-[#183153]">{personDeficitScore}%</span> of performance barriers stem from <span className="underline decoration-[#1B4B4A] decoration-4 underline-offset-4">Individual Skill Factors</span>
              </>
            )}
          </h1>
          <p className="text-sm text-stone-600 mt-2 font-medium">
            Verdict: <span className="font-bold text-[#183153]">{verdict}</span>
          </p>
        </div>

        {/* Visual Ratio Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#183153]">Environmental Factors ({environmentDeficitScore}%)</span>
            <span className="text-[#1B4B4A]">Individual / Skill Factors ({personDeficitScore}%)</span>
          </div>
          <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex border border-stone-300 p-0.5">
            <div 
              className="h-full bg-[#F4C542] rounded-l-full transition-all duration-500" 
              style={{ width: `${Math.max(5, environmentDeficitScore)}%` }} 
            />
            <div 
              className="h-full bg-[#183153] rounded-r-full transition-all duration-500" 
              style={{ width: `${Math.max(5, personDeficitScore)}%` }} 
            />
          </div>
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>Information, Tools &amp; Incentives</span>
            <span>Knowledge, Capacity &amp; Motives</span>
          </div>
        </div>
      </div>

      {/* 2. Implicated BEM Cells (Name Only, No Ranking/Weighting, No Fix Attached) */}
      <div id="implicated-cells-section" className="bg-white border border-stone-300/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">
            Most Implicated BEM Factor{implicatedCells.length > 1 ? 's' : ''}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Key areas where systemic or individual friction was identified in your assessment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {implicatedCells.map((cellName) => (
            <div
              key={cellName}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF6EF] border border-stone-300 text-sm font-semibold text-[#183153]"
            >
              <span className="w-2 h-2 rounded-full bg-[#1B4B4A]" />
              <span>{cellName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Single Methodology Sentence (Citing Gilbert 1978 and Mager & Pipe 1970) */}
      <div id="methodology-sentence-box" className="bg-white/80 border border-stone-300/80 rounded-2xl p-5 text-xs text-stone-700 leading-relaxed">
        <p>
          This diagnostic applies the behavioral engineering and performance analysis methodology established by Thomas Gilbert (1978) and Robert Mager &amp; Peter Pipe (1970) to identify whether workplace performance gaps stem from systemic environmental friction or individual skill deficits.
        </p>
      </div>

      {/* 4. Consultation CTA & Formspree Booking Form */}
      <div id="consultation-booking-section" className="bg-white border-2 border-[#1B4B4A]/50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* CTA Copy */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4B4A]/10 text-[#1B4B4A] border border-[#1B4B4A]/25 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C542]" />
            <span>Consultation &amp; Action Plan</span>
          </div>
          <p className="text-base sm:text-lg font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153] leading-snug">
            Knowing what's broken isn't the same as knowing how to fix it cost-effectively. Book a Diagnostic Consultation to get the full, prioritized intervention plan for your team.
          </p>
        </div>

        {/* Formspree Form or Succeeded State */}
        {formState.succeeded ? (
          <div id="booking-success-message" className="bg-stone-50 border border-stone-300 rounded-xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#1B4B4A] mx-auto" />
            <h3 className="text-base font-bold font-['Fraunces','Book_Antiqua',serif] text-[#183153]">
              Thanks — we'll follow up to schedule your Diagnostic Consultation.
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              We have received your diagnostic data and will review the implicated factors to prepare your personalized consultation.
            </p>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Required Disclosure Line Above Form */}
            <p className="text-xs text-stone-600 italic bg-[#FAF6EF] p-3 rounded-xl border border-stone-300">
              Your answers above will be included so we can prepare for your consultation.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Hidden input field named "sessionData" containing base64-encoded JSON */}
              <input type="hidden" name="sessionData" value={encodedSessionData} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#183153] mb-1.5">
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1B4B4A]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#1B4B4A] focus:ring-1 focus:ring-[#1B4B4A] transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#183153] mb-1.5">
                    Work Email <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1B4B4A]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="jane@company.com"
                      className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#1B4B4A] focus:ring-1 focus:ring-[#1B4B4A] transition-all"
                    />
                  </div>
                  <ValidationError 
                    prefix="Email" 
                    field="email" 
                    errors={formState.errors} 
                    className="text-rose-700 text-xs mt-1 block"
                  />
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label htmlFor="notes" className="block text-xs font-bold text-[#183153] mb-1.5">
                  Additional Context or Questions (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-[#1B4B4A]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Tell us about your team size, timing, or specific performance goals..."
                    className="w-full bg-[#FAF6EF] border border-stone-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#1B4B4A] focus:ring-1 focus:ring-[#1B4B4A] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="submit-consultation-btn"
                type="submit"
                disabled={formState.submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#183153] hover:bg-[#12253f] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{formState.submitting ? 'Submitting Request...' : 'Book Diagnostic Consultation'}</span>
                <Send className="w-4 h-4 text-[#F4C542]" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};
