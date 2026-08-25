import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Questionnaire } from './components/Questionnaire';
import { ReportDashboard } from './components/ReportDashboard';
import { GilbertModelInfoModal } from './components/GilbertModelInfoModal';
import { PRESET_CASES } from './data/presetCases';
import { AssessmentMetadata, FeasibilityReport, SavedCase } from './types';
import { calculateBEMReport } from './utils/bemCalculator';

const LOCAL_STORAGE_SAVED_KEY = 'gilbert_bem_saved_cases_v1';

export default function App() {
  // Active state
  const [currentCaseId, setCurrentCaseId] = useState<string>(PRESET_CASES[0].id);
  const [metadata, setMetadata] = useState<AssessmentMetadata>(PRESET_CASES[0].metadata);
  const [answers, setAnswers] = useState<Record<number, number>>(PRESET_CASES[0].answers);
  const [notes, setNotes] = useState<Record<number, string>>({});

  // View toggle: 'questionnaire' vs 'report'
  const [viewMode, setViewMode] = useState<'questionnaire' | 'report'>('questionnaire');

  // Modals state
  const [isModelInfoOpen, setIsModelInfoOpen] = useState<boolean>(false);

  // Saved user cases
  const [savedCases, setSavedCases] = useState<SavedCase[]>(() => {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  // Save cases to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedCases));
    } catch (e) {
      console.error('Failed to save cases to local storage', e);
    }
  }, [savedCases]);

  // Handle switching preset/saved cases
  const handleSelectCase = (caseId: string) => {
    const preset = PRESET_CASES.find(c => c.id === caseId);
    if (preset) {
      setCurrentCaseId(preset.id);
      setMetadata(preset.metadata);
      setAnswers(preset.answers);
      setNotes(preset.notes || {});
      setViewMode('report');
      return;
    }

    const saved = savedCases.find(c => c.id === caseId);
    if (saved) {
      setCurrentCaseId(saved.id);
      setMetadata(saved.metadata);
      setAnswers(saved.answers);
      setNotes(saved.notes || {});
      setViewMode('report');
    }
  };

  // Start a fresh diagnostic assessment
  const handleNewAssessment = () => {
    const newId = `custom_${Date.now()}`;
    const newMeta: AssessmentMetadata = {
      clientName: 'New Assessment',
      department: 'Operations',
      targetRole: 'Frontline Staff',
      performanceIssueDescription: 'Describe the performance gap or observed challenge here...',
      assessedBy: 'Lead Performance Consultant',
      assessmentDate: new Date().toISOString().split('T')[0],
      targetMetrics: 'Quality & Accuracy Target'
    };

    setCurrentCaseId(newId);
    setMetadata(newMeta);
    setAnswers({});
    setNotes({});
    setViewMode('questionnaire');
  };

  // Save current assessment
  const handleSaveCurrentAssessment = () => {
    const existingIndex = savedCases.findIndex(c => c.id === currentCaseId);
    const newCase: SavedCase = {
      id: currentCaseId,
      updatedAt: new Date().toISOString(),
      metadata,
      answers,
      notes
    };

    if (existingIndex >= 0) {
      const updated = [...savedCases];
      updated[existingIndex] = newCase;
      setSavedCases(updated);
    } else {
      setSavedCases([newCase, ...savedCases]);
    }
  };

  // Answer change handler
  const handleAnswerChange = (questionId: number, choiceIndex: number) => {
    setAnswers(prev => {
      const updated = { ...prev, [questionId]: choiceIndex };
      return updated;
    });
  };

  // Note change handler
  const handleNoteChange = (questionId: number, note: string) => {
    setNotes(prev => ({ ...prev, [questionId]: note }));
  };

  // Generate report object
  const report: FeasibilityReport = calculateBEMReport(metadata, answers);

  // Delete single saved case
  const handleDeleteCase = (caseIdToDelete: string) => {
    setSavedCases(prev => prev.filter(c => c.id !== caseIdToDelete));
    if (currentCaseId === caseIdToDelete) {
      const defaultPreset = PRESET_CASES[0];
      setCurrentCaseId(defaultPreset.id);
      setMetadata(defaultPreset.metadata);
      setAnswers(defaultPreset.answers);
      setNotes(defaultPreset.notes || {});
      setViewMode('report');
    }
  };

  // Clear all saved custom cases
  const handleClearAllCases = () => {
    setSavedCases([]);
    if (!PRESET_CASES.some(p => p.id === currentCaseId)) {
      const defaultPreset = PRESET_CASES[0];
      setCurrentCaseId(defaultPreset.id);
      setMetadata(defaultPreset.metadata);
      setAnswers(defaultPreset.answers);
      setNotes(defaultPreset.notes || {});
      setViewMode('report');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#1E293B] flex flex-col font-['Work_Sans','Source_Sans_Pro',sans-serif] selection:bg-[#F4C542]/40 selection:text-[#183153]">
      
      {/* App Navigation Header */}
      <Header
        currentCaseId={currentCaseId}
        currentMetadata={metadata}
        presetCases={PRESET_CASES}
        savedCases={savedCases}
        onSelectCase={handleSelectCase}
        onDeleteCase={handleDeleteCase}
        onClearAllCases={handleClearAllCases}
        onNewAssessment={handleNewAssessment}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
        onOpenSavedModal={() => {}}
        isReportView={viewMode === 'report'}
        onToggleView={() => {
          if (viewMode === 'questionnaire') {
            handleSaveCurrentAssessment();
            setViewMode('report');
          } else {
            setViewMode('questionnaire');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {viewMode === 'questionnaire' ? (
          <Questionnaire
            key={currentCaseId}
            metadata={metadata}
            answers={answers}
            notes={notes}
            isSampleCase={PRESET_CASES.some(c => c.id === currentCaseId)}
            onMetadataChange={setMetadata}
            onAnswerChange={handleAnswerChange}
            onNoteChange={handleNoteChange}
            onComplete={() => {
              handleSaveCurrentAssessment();
              setViewMode('report');
            }}
          />
        ) : (
          <ReportDashboard
            key={currentCaseId}
            report={report}
            isSampleCase={PRESET_CASES.some(c => c.id === currentCaseId)}
            onEditAnswers={() => setViewMode('questionnaire')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF6EF] border-t border-stone-300/80 text-stone-600 text-xs py-4 px-6 text-center print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-[#183153]">
            Gilbert BEM Performance Diagnostic &copy; 2026 | Human Performance Technology (HPT)
          </span>
          <span className="text-stone-500">
            Based on Thomas Gilbert (1978) &amp; Mager &amp; Pipe (1970)
          </span>
        </div>
      </footer>

      {/* Gilbert BEM Educational Model Info Modal */}
      <GilbertModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
      />

    </div>
  );
}
