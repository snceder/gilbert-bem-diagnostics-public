import React, { useState } from 'react';
import { Award, BookOpen, FileText, FolderOpen, RotateCcw, Trash2, X, AlertTriangle, Sparkles } from 'lucide-react';
import { AssessmentMetadata, SavedCase } from '../types';

interface HeaderProps {
  currentCaseId: string;
  currentMetadata?: AssessmentMetadata;
  presetCases: SavedCase[];
  savedCases: SavedCase[];
  onSelectCase: (caseId: string) => void;
  onDeleteCase?: (caseId: string) => void;
  onClearAllCases?: () => void;
  onNewAssessment: () => void;
  onOpenModelInfo: () => void;
  onOpenSavedModal: () => void;
  isReportView: boolean;
  onToggleView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaseId,
  currentMetadata,
  presetCases,
  savedCases,
  onSelectCase,
  onDeleteCase,
  onClearAllCases,
  onNewAssessment,
  onOpenModelInfo,
  isReportView,
  onToggleView,
}) => {
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  const isPreset = presetCases.some((c) => c.id === currentCaseId);
  const isSaved = savedCases.some((c) => c.id === currentCaseId);
  const isUnsavedNew = !isPreset && !isSaved;

  const handleSelectChange = (val: string) => {
    if (val === '__CLEAR_ALL__') {
      setShowClearModal(true);
      return;
    }
    onSelectCase(val);
  };

  const handleConfirmDeleteCurrent = () => {
    if (onDeleteCase && isSaved) {
      onDeleteCase(currentCaseId);
    }
    setShowClearModal(false);
  };

  const handleConfirmClearAll = () => {
    if (onClearAllCases) {
      onClearAllCases();
    }
    setShowClearModal(false);
  };

  return (
    <>
      <header className="bg-[#183153] border-b border-[#0f223d] text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & App Title - Icon has no background */}
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[#F4C542] shrink-0" />
            <div>
              <h1 className="font-['Fraunces','Book_Antiqua',serif] font-bold text-base sm:text-lg text-white tracking-tight leading-none">
                Gilbert BEM Performance Diagnostics
              </h1>
            </div>
          </div>

          {/* Center: Case Selector Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0f223d]/80 rounded-lg p-1.5 border border-slate-700/60">
            <FolderOpen className="w-4 h-4 text-[#F4C542] ml-1 shrink-0" />
            <span className="text-xs text-slate-300 font-medium hidden md:inline">Case:</span>
            <select
              value={currentCaseId}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-2 max-w-[180px] md:max-w-[240px] truncate"
            >
              {isUnsavedNew && (
                <optgroup label="Active Assessment">
                  <option value={currentCaseId} className="bg-[#183153] text-white">
                    {currentMetadata?.clientName || 'New Client Project'} - {currentMetadata?.targetRole || 'Assessment'}
                  </option>
                </optgroup>
              )}
              <optgroup label="Sample Case Studies (Examples)">
                {presetCases.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#183153] text-white">
                    {c.id === currentCaseId && currentMetadata
                      ? `[Sample] ${currentMetadata.clientName || 'Untitled'} - ${currentMetadata.targetRole || 'Assessment'}`
                      : `[Sample] ${c.metadata.clientName} - ${c.metadata.targetRole}`}
                  </option>
                ))}
              </optgroup>
              {savedCases.length > 0 && (
                <optgroup label="Custom Assessments">
                  {savedCases.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#183153] text-white">
                      {c.id === currentCaseId && currentMetadata
                        ? `${currentMetadata.clientName || 'Untitled'} - ${currentMetadata.targetRole || 'Assessment'}`
                        : `${c.metadata.clientName || 'Untitled'} - ${c.metadata.targetRole || 'Assessment'}`}
                    </option>
                  ))}
                </optgroup>
              )}
              {savedCases.length > 0 && (
                <optgroup label="── Clear Saved Cases ──">
                  <option value="__CLEAR_ALL__" className="bg-[#183153] text-rose-300 font-semibold">
                    Clear Custom Cases...
                  </option>
                </optgroup>
              )}
            </select>

            {(savedCases.length > 0 || isSaved) && (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="p-1 text-slate-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                title="Clear saved cases"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenModelInfo}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-[#F4C542] px-2.5 py-1.5 rounded-lg hover:bg-[#0f223d] transition-colors cursor-pointer"
              title="Learn about Gilbert's BEM Theory"
            >
              <BookOpen className="w-4 h-4 text-[#F4C542]" />
              <span className="hidden sm:inline">BEM Model Info</span>
            </button>

            {isReportView ? (
              <button
                onClick={onToggleView}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[#1B4B4A] hover:bg-[#153b3a] border border-[#2b6d6c]/40 px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span>Edit Answers</span>
              </button>
            ) : (
              <button
                onClick={onToggleView}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#1B4B4A] hover:bg-[#153b3a] border border-[#2b6d6c]/40 px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#F4C542]" />
                <span>View Diagnosis</span>
              </button>
            )}

            <button
              onClick={onNewAssessment}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183153] bg-[#F4C542] hover:bg-[#e0b438] px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#183153]" />
              <span className="hidden sm:inline">New Assessment</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Clear Cases Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 font-['Work_Sans','Source_Sans_Pro',sans-serif]">
          <div className="bg-[#FAF6EF] text-[#1E293B] border border-stone-300 rounded-2xl max-w-md w-full p-6 shadow-xl relative space-y-5">
            
            <button
              onClick={() => setShowClearModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-amber-700">
              <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
              <div>
                <h3 className="text-base font-bold font-['Fraunces','Book_Antiqua',serif] text-[#183153]">
                  Clear Saved Custom Cases
                </h3>
                <p className="text-xs text-stone-500">
                  Manage custom assessments saved in local storage
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              You currently have <strong className="text-[#183153]">{savedCases.length} custom assessment(s)</strong> stored. Clearing custom cases will remove them from the dropdown list. Preset benchmark cases will remain available.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              {isSaved && (
                <button
                  type="button"
                  onClick={handleConfirmDeleteCurrent}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-700" />
                  <span>Delete Currently Selected Assessment</span>
                </button>
              )}

              {savedCases.length > 0 && (
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="w-full py-2.5 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                  <span>Clear All Custom Assessments ({savedCases.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="w-full py-2 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
