import React from 'react';
import { X, BookOpen, Award, Lightbulb } from 'lucide-react';

interface GilbertModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GilbertModelInfoModal: React.FC<GilbertModelInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-['Work_Sans','Source_Sans_Pro',sans-serif]">
      <div className="bg-[#FAF6EF] border border-stone-300 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl text-[#1E293B] overflow-hidden">
        
        {/* Header - Icon has no background */}
        <div className="p-5 border-b border-stone-300 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#183153] shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">
                Thomas Gilbert’s Behavior Engineering Model (BEM)
              </h2>
              <p className="text-xs text-stone-500">
                Human Performance Technology (HPT) Foundational Framework
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#1E293B] leading-relaxed bg-[#FAF6EF]">
          
          {/* Core Theorem */}
          <div className="bg-white p-5 rounded-xl border border-stone-300/80 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold font-['Fraunces','Book_Antiqua',serif] text-[#183153] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F4C542]" />
              <span>Gilbert’s Fundamental Model of Worthy Performance</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              According to Thomas F. Gilbert's Behavior Engineering Model, worthy performance occurs when human accomplishment exceeds the cost of the behavior required to produce it. In practice, workplace accomplishments are heavily constrained by environmental supports (information, resources, incentives) rather than an individual’s willingness or capacity to learn.
            </p>
            <p className="text-xs text-stone-500 pt-1">
              — Conceptual summary adapted from Thomas F. Gilbert, <em>Human Competence: Engineering Worthy Performance</em> (1978)
            </p>
          </div>

          {/* The 6 Cells Matrix Explanation */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-['Fraunces','Book_Antiqua',serif] font-bold text-[#183153]">
              The 6 Cells of Performance Causes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-white border border-[#F4C542]/70 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#183153] block">Cell 1: Information / Expectations</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are expectations clear? Do performers receive immediate, non-punitive feedback on their work?
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#1B4B4A]/40 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#1B4B4A] block">Cell 4: Knowledge &amp; Skills</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Do performers possess procedural understanding? Have they practiced the specific task?
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#F4C542]/70 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#183153] block">Cell 2: Resources &amp; Tools</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are software, equipment, materials, and time allocation streamlined and functional?
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#1B4B4A]/40 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#1B4B4A] block">Cell 5: Capacity &amp; Load</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Is task complexity matched to human cognitive bandwidth and physical stamina?
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#F4C542]/70 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#183153] block">Cell 3: Incentives &amp; Consequences</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are financial/non-financial rewards aligned with quality? Is good performance punished with extra work?
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#1B4B4A]/40 rounded-xl space-y-1">
                <span className="text-xs font-bold text-[#1B4B4A] block">Cell 6: Motives &amp; Alignment</span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Do performers find intrinsic value in the task and align with company mission?
                </p>
              </div>
            </div>
          </div>

          {/* Why Non-Training Feasibility Matters */}
          <div className="bg-white p-5 rounded-xl border border-stone-300/80 space-y-2 shadow-xs">
            <h4 className="text-sm font-bold font-['Fraunces','Book_Antiqua',serif] text-[#1B4B4A] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#F4C542]" />
              <span>Why 80%+ of Performance Barriers Are Environmental</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              Empirical HPT studies show that when client executives report a "performance issue", they default to requesting classroom training. However, in 80-85% of cases, performers already know <em>how</em> to do the job, but are blocked by ambiguous standards, buggy software, unrealistic time pressures, or counterproductive incentives.
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              This diagnostic application uses Gilbert's scoring algorithm to quantify these barriers, giving consultants rock-solid data to defend non-training interventions to skeptical client stakeholders.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-300 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FAF6EF] hover:bg-stone-200 text-[#183153] text-xs font-bold rounded-xl border border-stone-300 transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
