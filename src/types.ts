/**
 * Types for Gilbert's Behavior Engineering Model (BEM) Diagnostic App
 */

export type BEMCellKey = 
  | 'cell1_data'        // Information, Expectations & Feedback
  | 'cell2_resources'   // Instruments, Tools & Environment
  | 'cell3_incentives'  // Incentives & Consequences
  | 'cell4_skills'      // Knowledge & Skills (Training)
  | 'cell5_capacity'    // Cognitive / Physical Capacity
  | 'cell6_motives';    // Motives & Value Alignment

export type BEMCategory = 'environment' | 'person';

export interface BEMCellDefinition {
  key: BEMCellKey;
  number: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  category: BEMCategory;
  description: string;
  gilbertQuote: string;
  typicalDeficitExamples: string[];
}

export interface QuestionChoice {
  id: string;
  text: string;
  subtext?: string;
  // Impact mapping to BEM cell deficits (0 = no deficit, 10 = severe deficit)
  cellImpacts: Partial<Record<BEMCellKey, number>>;
  // Flags if this response proves the gun-to-the-head test (i.e. performer CAN do it if incentivized/instructed)
  passesGunToHead?: boolean;
  // Dynamic branching instruction: next question ID or list of question IDs to skip
  skipQuestionIds?: number[];
  severityTag: 'Optimal' | 'Minor Friction' | 'Moderate Deficit' | 'Severe Bottleneck';
}

export interface BranchingQuestion {
  id: number;
  cellKey: BEMCellKey;
  cellNumber: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  question: string;
  contextTip: string;
  whyItMatters: string;
  choices: QuestionChoice[];
  // Conditional rendering check based on previous answers
  condition?: (answers: Record<number, number>) => boolean;
}

export interface AssessmentMetadata {
  clientName: string;
  department: string;
  targetRole: string;
  performanceIssueDescription: string;
  assessedBy: string;
  assessmentDate: string;
  targetMetrics?: string;
}

export interface UserAnswer {
  questionId: number;
  choiceIndex: number;
  notes?: string;
}

export interface CellScoreDetail {
  key: BEMCellKey;
  name: string;
  category: BEMCategory;
  rawScore: number;
  maxScore: number;
  deficitPercentage: number; // 0 to 100%
  severity: 'Optimal' | 'Minor Risk' | 'Moderate Deficit' | 'Critical Failure';
  recommendationFocus: string;
}

export interface RecommendedIntervention {
  id: string;
  cellKey: BEMCellKey;
  title: string;
  type: 'non-training' | 'training' | 'hybrid';
  categoryName: string;
  description: string;
  rationale: string;
  effortLevel: 'Low' | 'Medium' | 'High';
  impactLevel: 'High' | 'Very High' | 'Transformational';
  estimatedCostMultiplier: string; // e.g. "0.1x of Training"
  implementationTime: string; // e.g. "1-2 Weeks"
}

export interface ClientObjectionStrategy {
  id: string;
  objectionTitle: string;
  clientQuote: string;
  dataDrivenCounter: string;
  gilbertPrinciple: string;
  recommendedTalkingPoint: string;
}

export interface FeasibilityReport {
  metadata: AssessmentMetadata;
  answers: Record<number, number>;
  environmentDeficitScore: number; // 0-100%
  personDeficitScore: number;      // 0-100%
  overallDeficitScore: number;     // 0-100%
  
  cellScores: Record<BEMCellKey, CellScoreDetail>;
  
  // Potential for Improving Performance (PIP) index, e.g. 1.2 to 3.5
  pipIndex: number;
  pipInterpretation: string;
  
  // Feasibility Indices
  nonTrainingFeasibilityScore: number; // 0-100 (higher means non-training intervention is super viable)
  trainingFeasibilityScore: number;    // 0-100 (higher means training is actually effective)
  trainingOnlyFailureRisk: number;     // 0-100% risk that sending to training will fail
  
  gunToHeadTestPassed: boolean;
  gunToHeadSummary: string;
  
  primaryBottleneckCell: BEMCellDetail;
  secondaryBottleneckCell?: BEMCellDetail;
  
  interventions: RecommendedIntervention[];
  objectionPlaybook: ClientObjectionStrategy[];
  executiveSummaryText: string;
}

export interface BEMCellDetail extends CellScoreDetail {
  number: number;
}

export interface SavedCase {
  id: string;
  updatedAt: string;
  metadata: AssessmentMetadata;
  answers: Record<number, number>;
  notes?: Record<number, string>;
  isPreset?: boolean;
}

export interface AiMemoResponse {
  executiveMemo: string;
  clientTalkingPoints: string[];
  keyRiskWarnings: string[];
}
