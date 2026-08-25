import { BEM_CELL_DEFINITIONS, BRANCHING_QUESTIONS } from '../data/bemQuestions';
import {
  AssessmentMetadata,
  BEMCellDetail,
  BEMCellKey,
  CellScoreDetail,
  ClientObjectionStrategy,
  FeasibilityReport,
  RecommendedIntervention
} from '../types';

export function calculateBEMReport(
  metadata: AssessmentMetadata,
  answers: Record<number, number>
): FeasibilityReport {
  // 1. Initialize Cell Accumulators
  const rawScores: Record<BEMCellKey, number> = {
    cell1_data: 0,
    cell2_resources: 0,
    cell3_incentives: 0,
    cell4_skills: 0,
    cell5_capacity: 0,
    cell6_motives: 0
  };

  const maxPossibleScores: Record<BEMCellKey, number> = {
    cell1_data: 0,
    cell2_resources: 0,
    cell3_incentives: 0,
    cell4_skills: 0,
    cell5_capacity: 0,
    cell6_motives: 0
  };

  let gunToHeadPassed = false;

  // Calculate maximum potential impact per cell across all questions
  BRANCHING_QUESTIONS.forEach(q => {
    // Find max impact each choice could have contributed
    const cellMaxes: Partial<Record<BEMCellKey, number>> = {};
    q.choices.forEach(choice => {
      Object.entries(choice.cellImpacts).forEach(([cell, val]) => {
        const k = cell as BEMCellKey;
        if (!cellMaxes[k] || (val ?? 0) > (cellMaxes[k] ?? 0)) {
          cellMaxes[k] = val ?? 0;
        }
      });
    });

    Object.entries(cellMaxes).forEach(([cell, maxVal]) => {
      maxPossibleScores[cell as BEMCellKey] += maxVal;
    });

    // Process selected answer
    const selectedIndex = answers[q.id];
    if (selectedIndex !== undefined && q.choices[selectedIndex]) {
      const choice = q.choices[selectedIndex];
      if (choice.passesGunToHead) {
        gunToHeadPassed = true;
      }

      Object.entries(choice.cellImpacts).forEach(([cell, val]) => {
        rawScores[cell as BEMCellKey] += val ?? 0;
      });
    }
  });

  // 2. Build Cell Score Details
  const cellScores: Record<BEMCellKey, CellScoreDetail> = {
    cell1_data: createCellDetail('cell1_data', rawScores.cell1_data, maxPossibleScores.cell1_data),
    cell2_resources: createCellDetail('cell2_resources', rawScores.cell2_resources, maxPossibleScores.cell2_resources),
    cell3_incentives: createCellDetail('cell3_incentives', rawScores.cell3_incentives, maxPossibleScores.cell3_incentives),
    cell4_skills: createCellDetail('cell4_skills', rawScores.cell4_skills, maxPossibleScores.cell4_skills),
    cell5_capacity: createCellDetail('cell5_capacity', rawScores.cell5_capacity, maxPossibleScores.cell5_capacity),
    cell6_motives: createCellDetail('cell6_motives', rawScores.cell6_motives, maxPossibleScores.cell6_motives)
  };

  // 3. Level Aggregation
  const envPctAvg = (
    cellScores.cell1_data.deficitPercentage +
    cellScores.cell2_resources.deficitPercentage +
    cellScores.cell3_incentives.deficitPercentage
  ) / 3;

  const personPctAvg = (
    cellScores.cell4_skills.deficitPercentage +
    cellScores.cell5_capacity.deficitPercentage +
    cellScores.cell6_motives.deficitPercentage
  ) / 3;

  // Overall Deficit Score (weighted calculation model: 65% Environment, 35% Person)
  const environmentDeficitScore = Math.min(100, Math.round(envPctAvg));
  const personDeficitScore = Math.min(100, Math.round(personPctAvg));
  const overallDeficitScore = Math.min(100, Math.round(environmentDeficitScore * 0.65 + personDeficitScore * 0.35));

  // 4. PIP (Potential for Improving Performance) Index
  // Base 1.0 + deficit multiplier
  const pipIndex = parseFloat((1.0 + (overallDeficitScore / 100) * 1.85).toFixed(2));
  let pipInterpretation = 'Moderate improvement potential through process fine-tuning.';
  if (pipIndex >= 2.2) {
    pipInterpretation = 'Massive performance upside! Exemplary performers produce over 2x current average due to heavy environmental bottlenecks.';
  } else if (pipIndex >= 1.6) {
    pipInterpretation = 'Significant performance improvement potential achievable by addressing environmental friction.';
  }

  // 5. Feasibility & Risk Indices
  // Non-Training Feasibility: High environment deficit + Gun-to-head pass = Non-training intervention is ultra feasible
  let nonTrainingFeasibilityScore = Math.min(98, Math.round(environmentDeficitScore * 0.8 + (gunToHeadPassed ? 20 : 5)));
  if (nonTrainingFeasibilityScore < 30) nonTrainingFeasibilityScore = 35;

  // Training Feasibility: If environment deficit is high, training alone has LOW feasibility
  let trainingFeasibilityScore = Math.max(8, Math.round(100 - (environmentDeficitScore * 0.85) - (gunToHeadPassed ? 15 : 0)));
  
  // Training Only Failure Risk
  const trainingOnlyFailureRisk = Math.min(96, Math.max(15, Math.round(100 - trainingFeasibilityScore)));

  // 6. Identify Bottlenecks
  const sortedCells = Object.values(cellScores).sort((a, b) => b.deficitPercentage - a.deficitPercentage);
  const primaryCell = sortedCells[0];
  const secondaryCell = sortedCells[1].deficitPercentage > 20 ? sortedCells[1] : undefined;

  const primaryBottleneckCell: BEMCellDetail = {
    ...primaryCell,
    number: BEM_CELL_DEFINITIONS[primaryCell.key].number
  };

  const secondaryBottleneckCell: BEMCellDetail | undefined = secondaryCell ? {
    ...secondaryCell,
    number: BEM_CELL_DEFINITIONS[secondaryCell.key].number
  } : undefined;

  // 7. Generate Interventions & Objections
  const interventions = generateRecommendedInterventions(cellScores, gunToHeadPassed);
  const objectionPlaybook = generateObjectionPlaybook(cellScores, environmentDeficitScore, gunToHeadPassed);

  // 8. Gun-to-Head Summary Text
  const gunToHeadSummary = gunToHeadPassed
    ? 'Passes Mager-Pipe / Gilbert Gun-to-the-Head test. Performers already possess the skill and capability to perform when incentivized. Training will yield near ZERO return on investment until environmental barriers are removed.'
    : 'Fails Gun-to-the-Head test. Performers currently lack procedural fluency or cognitive bandwidth. A hybrid approach combining job aids with targeted practice is recommended.';

  // Executive Summary text
  const executiveSummaryText = `Assessment of ${metadata.targetRole} in ${metadata.department} reveals that ${environmentDeficitScore}% of performance barriers stem from Environmental Factors (Information, Tools, Incentives) rather than a lack of individual skill (${personDeficitScore}% Person Deficit). Implementing non-training interventions carries a ${nonTrainingFeasibilityScore}% feasibility rating, whereas relying solely on training carries a ${trainingOnlyFailureRisk}% risk of failure.`;

  return {
    metadata,
    answers,
    environmentDeficitScore,
    personDeficitScore,
    overallDeficitScore,
    cellScores,
    pipIndex,
    pipInterpretation,
    nonTrainingFeasibilityScore,
    trainingFeasibilityScore,
    trainingOnlyFailureRisk,
    gunToHeadTestPassed: gunToHeadPassed,
    gunToHeadSummary,
    primaryBottleneckCell,
    secondaryBottleneckCell,
    interventions,
    objectionPlaybook,
    executiveSummaryText
  };
}

function createCellDetail(key: BEMCellKey, rawScore: number, maxScore: number): CellScoreDetail {
  const def = BEM_CELL_DEFINITIONS[key];
  const maxVal = Math.max(1, maxScore);
  const pct = Math.min(100, Math.round((rawScore / maxVal) * 100));

  let severity: 'Optimal' | 'Minor Risk' | 'Moderate Deficit' | 'Critical Failure' = 'Optimal';
  if (pct >= 65) severity = 'Critical Failure';
  else if (pct >= 40) severity = 'Moderate Deficit';
  else if (pct >= 15) severity = 'Minor Risk';

  let recommendationFocus = 'Maintain current operating standard.';
  if (pct >= 40) {
    switch (key) {
      case 'cell1_data':
        recommendationFocus = 'Deploy 1-page visual job aids, explicit SOP checklists, and daily real-time dashboard feedback.';
        break;
      case 'cell2_resources':
        recommendationFocus = 'Streamline software UI/UX, automate copy-paste tasks, and adjust realistic handle times.';
        break;
      case 'cell3_incentives':
        recommendationFocus = 'Align KPIs to reward quality, eliminate "punished good performance", and establish non-monetary recognition.';
        break;
      case 'cell4_skills':
        recommendationFocus = 'Design micro-practice scenarios and interactive decision trees rather than multi-day lectures.';
        break;
      case 'cell5_capacity':
        recommendationFocus = 'Reduce cognitive load via inline system prompts, audit shift lengths, and adjust task complexity.';
        break;
      case 'cell6_motives':
        recommendationFocus = 'Communicate purpose/impact of task, engage performers in workflow design, and restore leadership trust.';
        break;
    }
  }

  return {
    key,
    name: def.name,
    category: def.category,
    rawScore,
    maxScore: maxVal,
    deficitPercentage: pct,
    severity,
    recommendationFocus
  };
}

function generateRecommendedInterventions(
  cellScores: Record<BEMCellKey, CellScoreDetail>,
  gunToHeadPassed: boolean
): RecommendedIntervention[] {
  const list: RecommendedIntervention[] = [];

  // Cell 1: Info / Job Aids
  if (cellScores.cell1_data.deficitPercentage >= 25) {
    list.push({
      id: 'int_cell1_job_aids',
      cellKey: 'cell1_data',
      title: 'Interactive Job Aids & Decision Tree Checklists',
      type: 'non-training',
      categoryName: 'Environmental Support (Cell 1)',
      description: 'Replace reliance on human memory with single-screen visual quick reference guides and embedded system pop-up checklists.',
      rationale: 'HPT Synthesis: Information at the point of work substantially reduces operational human error without requiring classroom training.',
      effortLevel: 'Low',
      impactLevel: 'Transformational',
      estimatedCostMultiplier: '0.05x of Training',
      implementationTime: '1-2 Weeks'
    });
    list.push({
      id: 'int_cell1_feedback_dashboard',
      cellKey: 'cell1_data',
      title: 'Real-Time Performance Feedback Loop',
      type: 'non-training',
      categoryName: 'Environmental Support (Cell 1)',
      description: 'Implement daily automated feedback summary widgets so performers immediately see accuracy and throughput.',
      rationale: 'Feedback loops allow self-correction before bad execution becomes an ingrained habit.',
      effortLevel: 'Medium',
      impactLevel: 'High',
      estimatedCostMultiplier: '0.15x of Training',
      implementationTime: '2-3 Weeks'
    });
  }

  // Cell 2: Resources & Tools
  if (cellScores.cell2_resources.deficitPercentage >= 25) {
    list.push({
      id: 'int_cell2_tool_friction',
      cellKey: 'cell2_resources',
      title: 'Workflow Streamlining & System UI Fixes',
      type: 'non-training',
      categoryName: 'Environmental Support (Cell 2)',
      description: 'Automate repetitive copy-paste fields, fix system latency, and streamline multi-app navigation.',
      rationale: 'HPT Synthesis: Eliminating technical and process friction directly increases throughput capacity without requiring changes in workforce skill.',
      effortLevel: 'Medium',
      impactLevel: 'Very High',
      estimatedCostMultiplier: '0.3x of Training',
      implementationTime: '3-4 Weeks'
    });
  }

  // Cell 3: Incentives
  if (cellScores.cell3_incentives.deficitPercentage >= 25) {
    list.push({
      id: 'int_cell3_incentive_realignment',
      cellKey: 'cell3_incentives',
      title: 'Incentive Structure & Quality Recognition Realignment',
      type: 'non-training',
      categoryName: 'Environmental Support (Cell 3)',
      description: 'Eliminate "punished good performance" (where top performers receive more work without extra pay) and tie rewards to accuracy.',
      rationale: 'Behavior aligns instantly with rewards. Correcting bad incentives yields immediate behavioral shift.',
      effortLevel: 'Low',
      impactLevel: 'Transformational',
      estimatedCostMultiplier: '0.1x of Training',
      implementationTime: '1 Week'
    });
  }

  // Cell 4: Knowledge / Skills
  if (cellScores.cell4_skills.deficitPercentage >= 35 && !gunToHeadPassed) {
    list.push({
      id: 'int_cell4_targeted_coaching',
      cellKey: 'cell4_skills',
      title: 'Targeted Micro-Practice & Simulation Coaching',
      type: 'hybrid',
      categoryName: 'Person Repertoire (Cell 4)',
      description: 'Deliver 15-minute scenario-based practice sessions specifically targeting high-error edge cases rather than full classroom lectures.',
      rationale: 'Focuses strictly on true skill gaps without pulling staff away for days of redundant training.',
      effortLevel: 'Medium',
      impactLevel: 'High',
      estimatedCostMultiplier: '0.4x of Training',
      implementationTime: '2 Weeks'
    });
  } else if (gunToHeadPassed) {
    list.push({
      id: 'int_cell4_skip_training',
      cellKey: 'cell4_skills',
      title: 'Formal Recommendation: Reject Full Classroom Training',
      type: 'non-training',
      categoryName: 'Executive Strategic Guidance',
      description: 'Formally advise client leadership against allocating budget for classroom training courses, as performers already demonstrate mastery under incentivized conditions.',
      rationale: 'Saves 100% of proposed training expenditure ($25k-$100k+) and prevents lost billable/production hours.',
      effortLevel: 'Low',
      impactLevel: 'Transformational',
      estimatedCostMultiplier: '$0 (Direct Cost Savings)',
      implementationTime: 'Immediate'
    });
  }

  // Cell 5: Capacity
  if (cellScores.cell5_capacity.deficitPercentage >= 25) {
    list.push({
      id: 'int_cell5_cognitive_offloading',
      cellKey: 'cell5_capacity',
      title: 'Cognitive Offloading & Inline System Prompts',
      type: 'non-training',
      categoryName: 'Person Repertoire (Cell 5)',
      description: 'Offload memory requirements into automated system validation prompts and drop-down selectors.',
      rationale: 'Prevents human cognitive burnout and eliminates reliance on working memory during complex tasks.',
      effortLevel: 'Medium',
      impactLevel: 'High',
      estimatedCostMultiplier: '0.2x of Training',
      implementationTime: '2-3 Weeks'
    });
  }

  // Cell 6: Motives
  if (cellScores.cell6_motives.deficitPercentage >= 25) {
    list.push({
      id: 'int_cell6_purpose_alignment',
      cellKey: 'cell6_motives',
      title: 'Task Purpose Alignment & Collaborative Standard Setting',
      type: 'non-training',
      categoryName: 'Person Repertoire (Cell 6)',
      description: 'Involve frontline staff in reviewing and redesigning the process so they build ownership and understand customer impact.',
      rationale: 'Staff who help build the process actively defend it, overcoming cynicism.',
      effortLevel: 'Low',
      impactLevel: 'High',
      estimatedCostMultiplier: '0.05x of Training',
      implementationTime: '1 Week'
    });
  }

  return list;
}

function generateObjectionPlaybook(
  cellScores: Record<BEMCellKey, CellScoreDetail>,
  environmentDeficitScore: number,
  gunToHeadPassed: boolean
): ClientObjectionStrategy[] {
  return [
    {
      id: 'obj_1',
      objectionTitle: '"Training is easier to budget for and schedule!"',
      clientQuote: 'It is much simpler to pull everyone into a 2-day workshop so we can check the training box for leadership.',
      dataDrivenCounter: `Diagnostic analysis indicates that ${environmentDeficitScore}% of performance friction stems from environmental barriers (unclear tools, delayed feedback, mismatched incentives). Delivering classroom training while environmental obstacles remain unaddressed carries a high risk of implementation failure once employees return to their workstations.`,
      gilbertPrinciple: 'Workplace accomplishments are constrained primarily by the environment rather than individual willingness or learning speed.',
      recommendedTalkingPoint: '“If we send staff to training without fixing tool latency and vague job aids, we risk spending significant budget teaching procedures that cannot be executed in the current work environment. Let’s invest in quick-reference job aids and environmental fixes first.”'
    },
    {
      id: 'obj_2',
      objectionTitle: '"The employees just aren’t paying attention or lack discipline!"',
      clientQuote: 'Our staff have been told 10 times what to do. They are just lazy or incompetent.',
      dataDrivenCounter: gunToHeadPassed
        ? 'The assessment’s Mager-Pipe skill test confirmed that performers CAN execute the task when appropriately incentivized or supported. This rules out incompetence or lack of capability.'
        : 'When feedback is delayed or software requires excessive manual steps, human cognitive fatigue increases significantly, driving up error rates regardless of discipline.',
      gilbertPrinciple: 'Behavior is shaped by its consequences and environmental feedback. What appears as a discipline problem is frequently an information or tool gap.',
      recommendedTalkingPoint: '“When a widespread majority of a team makes the same error, it indicates a structural workflow obstacle rather than an isolated discipline gap.”'
    },
    {
      id: 'obj_3',
      objectionTitle: '"Can’t we just do BOTH training AND fix the tools later?"',
      clientQuote: 'Let’s start with the training now while IT works on fixing the tools over the next 6 months.',
      dataDrivenCounter: 'Training delivered prior to environmental fixes creates frustration and rapid skill decay. Staff learn procedures in a vacuum that cannot be applied in practice until tools are updated.',
      gilbertPrinciple: 'Environmental supports (Cells 1-3) should be established before or alongside investing in individual skill building (Cell 4).',
      recommendedTalkingPoint: '“Training staff on a process before fixing the tools is like teaching someone to drive a car before installing the steering wheel. They will forget the training before the environment is ready.”'
    }
  ];
}
