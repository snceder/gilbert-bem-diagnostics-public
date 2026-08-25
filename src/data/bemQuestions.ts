import { BEMCellDefinition, BranchingQuestion } from '../types';

export const BEM_CELL_DEFINITIONS: Record<string, BEMCellDefinition> = {
  cell1_data: {
    key: 'cell1_data',
    number: 1,
    name: 'Information / Expectations',
    category: 'environment',
    description: 'Clear expectations, explicit performance metrics, job aids, and timely feedback on results.',
    gilbertQuote: 'No one can perform well without knowing what is expected and how well they are doing.',
    typicalDeficitExamples: [
      'Unclear quality standards',
      'Feedback given weeks after errors occur',
      'Missing workflow checklists / job aids',
      'Conflicting management priorities'
    ]
  },
  cell2_resources: {
    key: 'cell2_resources',
    number: 2,
    name: 'Resources & Tools',
    category: 'environment',
    description: 'Tools, equipment, software, materials, ergonomics, and adequate time allocated for execution.',
    gilbertQuote: 'Give a master craftsman broken tools, and even they will produce flawed work.',
    typicalDeficitExamples: [
      'Slow or crashing software platforms',
      'Lack of dual monitors or proper hardware',
      'Unrealistic time per task forcing shortcuts',
      'Excessive context switching & interruptions'
    ]
  },
  cell3_incentives: {
    key: 'cell3_incentives',
    number: 3,
    name: 'Incentives & Consequences',
    category: 'environment',
    description: 'Financial/non-financial rewards, career advancement, and non-punitive alignment of consequences.',
    gilbertQuote: 'If doing good work brings no reward while doing bad work is easier, bad work prevails.',
    typicalDeficitExamples: [
      'High performers rewarded only with more work',
      'Same pay regardless of quality or output',
      'Metric mismatch (rewarding speed over accuracy)',
      'Lack of meaningful career pathing'
    ]
  },
  cell4_skills: {
    key: 'cell4_skills',
    number: 4,
    name: 'Knowledge & Skills',
    category: 'person',
    description: 'Structured training, task practice, mental models, and procedural fluency.',
    gilbertQuote: 'Training is only necessary when performers truly do not know HOW to execute the task.',
    typicalDeficitExamples: [
      'Complex decision tree with zero prior training',
      'New software system introduced without practice',
      'High error rate from missing domain concepts',
      'No onboarding curriculum for new hires'
    ]
  },
  cell5_capacity: {
    key: 'cell5_capacity',
    number: 5,
    name: 'Capacity & Load',
    category: 'person',
    description: 'Physical suitability, mental working memory capacity, stamina, and job-role fit.',
    gilbertQuote: 'If the task exceeds human cognitive bandwidth, even trained geniuses will fail.',
    typicalDeficitExamples: [
      'Requiring memorization of 100+ complex codes',
      '12-hour shifts causing severe late-shift fatigue',
      'High cognitive overload without system prompts',
      'Mismatched baseline aptitude for mathematical task'
    ]
  },
  cell6_motives: {
    key: 'cell6_motives',
    number: 6,
    name: 'Motives & Alignment',
    category: 'person',
    description: 'Personal desire to perform, intrinsic task interest, and alignment with organizational mission.',
    gilbertQuote: 'People must see value in their work to sustain high performance over time.',
    typicalDeficitExamples: [
      'Perception that tasks are meaningless bureaucracy',
      'Widespread organizational cynicism and distrust',
      'Resentment over previous failed management initiatives',
      'Low morale and burn-out turnover'
    ]
  }
};

export const BRANCHING_QUESTIONS: BranchingQuestion[] = [
  {
    id: 1,
    cellKey: 'cell4_skills',
    cellNumber: 4,
    title: 'Question 1: The "Gun-to-the-Head" Skill Test',
    question: 'If performers were offered a $1,000 spot bonus or told their job depended on executing this exact task correctly today, could they do it?',
    contextTip: 'This classic Gilbert/Mager-Pipe test determines whether the deficit is a true Skill/Knowledge gap or an Environmental barrier.',
    whyItMatters: 'If people CAN perform when incentivized or assisted, training will yield near ZERO return on investment.',
    choices: [
      {
        id: 'q1_a',
        text: 'Yes! Most performers know how, but face system friction, bad data, or lack of motivation.',
        subtext: 'Proves the capability exists. The issue is strictly environmental or incentive-based.',
        passesGunToHead: true,
        cellImpacts: {
          cell1_data: 2,
          cell2_resources: 2,
          cell3_incentives: 3,
          cell4_skills: 0,
          cell5_capacity: 0,
          cell6_motives: 1
        },
        severityTag: 'Optimal'
      },
      {
        id: 'q1_b',
        text: 'Partial: Experienced staff could, but newer or average staff would hesitate or stumble on edge cases.',
        subtext: 'Indicates a need for on-the-job aids or decision trees rather than full training.',
        passesGunToHead: false,
        cellImpacts: {
          cell1_data: 4,
          cell4_skills: 4,
          cell2_resources: 2
        },
        severityTag: 'Minor Friction'
      },
      {
        id: 'q1_c',
        text: 'No: Even with maximum incentive, performers lack the foundational understanding or procedure knowledge.',
        subtext: 'Demonstrates a true skill or procedural knowledge deficit requiring instructional intervention.',
        passesGunToHead: false,
        cellImpacts: {
          cell4_skills: 8,
          cell5_capacity: 3
        },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 2,
    cellKey: 'cell1_data',
    cellNumber: 1,
    title: 'Question 2: Performance Expectations & Clarity',
    question: 'Are performance standards, target metrics, and quality expectations explicitly defined and accessible to performers?',
    contextTip: 'Unclear expectations and lack of feedback represent one of the primary sources of workplace performance friction in Gilbert’s research.',
    whyItMatters: 'Employees cannot meet targets they do not know exist or cannot measure.',
    choices: [
      {
        id: 'q2_a',
        text: 'Explicit & Documented: Clear KPIs, written SOPs, and visual target dashboards are readily available.',
        subtext: 'Expectations are well communicated.',
        cellImpacts: { cell1_data: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q2_b',
        text: 'Vague or Informal: Expectations are communicated verbally during onboarding but lack written standards.',
        subtext: 'Performers rely on guesswork and peer assumptions.',
        cellImpacts: { cell1_data: 6 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q2_c',
        text: 'Conflicting Priorities: Management frequently changes targets, or quality collides with volume quotas.',
        subtext: 'Performers are forced to choose between competing goals without guidance.',
        cellImpacts: { cell1_data: 10, cell3_incentives: 4 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 3,
    cellKey: 'cell1_data',
    cellNumber: 1,
    title: 'Question 3: Real-Time Feedback Loops',
    question: 'How do performers know whether they are executing the task correctly during or immediately after completion?',
    contextTip: 'Feedback must be immediate, non-punitive, and actionable to guide behavior.',
    whyItMatters: 'Without real-time feedback, performers repeatedly practice and solidify incorrect habits.',
    choices: [
      {
        id: 'q3_a',
        text: 'Immediate & Self-Correcting: Systems provide instant prompts, validation checks, or peer-review loops.',
        subtext: 'Performers catch errors in real time.',
        cellImpacts: { cell1_data: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q3_b',
        text: 'Delayed Audits: Errors are reported weeks or months later in formal QA reports or performance reviews.',
        subtext: 'Too late to correct active habit patterns.',
        cellImpacts: { cell1_data: 7 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q3_c',
        text: 'No Feedback / Punitive Only: Performers only hear back when a customer or executive complains.',
        subtext: 'Creates anxiety and defensive behavior.',
        cellImpacts: { cell1_data: 10, cell6_motives: 4 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 4,
    cellKey: 'cell2_resources',
    cellNumber: 2,
    title: 'Question 4: Tooling, Software & System Quality',
    question: 'Are the tools, software, equipment, and reference materials provided to performers fully functional and streamlined?',
    contextTip: 'Poor tools act as a tax on human performance, causing fatigue and high error rates.',
    whyItMatters: 'Training people to use broken or clumsy software will not fix software latency or double-data entry.',
    choices: [
      {
        id: 'q4_a',
        text: 'Modern & Ergonomic: Systems are fast, intuitive, integrated, and reliable.',
        subtext: 'Zero technological friction.',
        cellImpacts: { cell2_resources: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q4_b',
        text: 'Clumsy or Fragmented: Performers must switch between 4+ apps, copy-paste manually, or deal with lag.',
        subtext: 'Introduces cognitive strain and manual error surfaces.',
        cellImpacts: { cell2_resources: 6, cell5_capacity: 4 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q4_c',
        text: 'Defective or Outdated: Systems crash often, lack critical features, or require workaround hacks.',
        subtext: 'Primary physical barrier to performance.',
        cellImpacts: { cell2_resources: 10, cell5_capacity: 6 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 5,
    cellKey: 'cell2_resources',
    cellNumber: 2,
    title: 'Question 5: Time Allocation & Environment Ergonomics',
    question: 'Do performers have adequate time allocated per task and a physical/digital environment free from constant interruptions?',
    contextTip: 'Time is a fundamental resource. Compression of time forces human shortcuts.',
    whyItMatters: 'If time standards are unrealistic, performers skip verification steps even if fully trained.',
    choices: [
      {
        id: 'q5_a',
        text: 'Balanced Pace: Time standards are realistic with low noise and manageable context switching.',
        subtext: 'Allows thorough execution.',
        cellImpacts: { cell2_resources: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q5_b',
        text: 'Frequent Interruptions: Performers are bombarded with Slack messages, calls, or multi-tasking demands.',
        subtext: 'Degrades concentration and working memory.',
        cellImpacts: { cell2_resources: 5, cell5_capacity: 5 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q5_c',
        text: 'Severe Time Squeeze: Handling times or quotas force performers to cut corners to avoid punishment.',
        subtext: 'Systemic bottleneck masquerading as poor employee discipline.',
        cellImpacts: { cell2_resources: 10, cell3_incentives: 5 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 6,
    cellKey: 'cell3_incentives',
    cellNumber: 3,
    title: 'Question 6: Incentive & Reward Alignment',
    question: 'What happens financially, professionally, or socially when a performer consistently delivers high-quality work?',
    contextTip: 'Behavior is maintained by its consequences. If good performance brings no upside, effort decays.',
    whyItMatters: 'Clients often ask for training when the actual problem is that high performers are punished with extra work.',
    choices: [
      {
        id: 'q6_a',
        text: 'Directly Rewarded: High performers receive bonuses, recognition, priority scheduling, or advancement.',
        subtext: 'Incentives are tightly aligned with outcomes.',
        cellImpacts: { cell3_incentives: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q6_b',
        text: 'No Differentiation: Outstanding performance and bare-minimum effort receive identical pay and status.',
        subtext: 'Leads to "quiet quitting" and compliance-only effort.',
        cellImpacts: { cell3_incentives: 6, cell6_motives: 4 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q6_c',
        text: 'Punished Good Performance: Top performers are assigned hardest cases and extra volume with zero added compensation.',
        subtext: 'Actively disincentivizes high performance.',
        cellImpacts: { cell3_incentives: 10, cell6_motives: 7 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 7,
    cellKey: 'cell3_incentives',
    cellNumber: 3,
    title: 'Question 7: Consequence Clarity & Accountability',
    question: 'What happens when performers ignore established procedures or submit substandard work?',
    contextTip: 'Consequences must be fair, consistent, and predictable.',
    whyItMatters: 'If shortcuts carry no negative consequences, training on procedures will be disregarded.',
    choices: [
      {
        id: 'q7_a',
        text: 'Constructive Accountability: Deviations are promptly addressed with supportive coaching and corrective action.',
        subtext: 'Establishes psychological safety and standards.',
        cellImpacts: { cell3_incentives: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q7_b',
        text: 'Random Enforcement: Consequences depend on supervisor personality, client complaints, or monthly mood.',
        subtext: 'Creates uncertainty and selective compliance.',
        cellImpacts: { cell3_incentives: 6, cell1_data: 3 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q7_c',
        text: 'Zero Consequences: Poor quality or skipped steps are ignored as long as volume metrics look acceptable.',
        subtext: 'Signals that quality standards are fake.',
        cellImpacts: { cell3_incentives: 10, cell1_data: 5 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 8,
    cellKey: 'cell4_skills',
    cellNumber: 4,
    title: 'Question 8: Prior Training History & Practice Opportunities',
    question: 'What training or instructional support have performers already received for this specific responsibility?',
    contextTip: 'Re-delivering training when staff have already completed it signals an environmental breakdown.',
    whyItMatters: 'If staff were trained recently, repeating the same course is a waste of client budget.',
    choices: [
      {
        id: 'q8_a',
        text: 'Thorough Training + Practice: Completed formal training with hands-on simulations within the past 12 months.',
        subtext: 'Knowledge has already been delivered. Focus should shift to environmental supports.',
        cellImpacts: { cell4_skills: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q8_b',
        text: 'One-Time Onboarding: Received generic orientation when hired, but no task-specific practice or refresher since.',
        subtext: 'Possible skill decay or lack of fluency.',
        cellImpacts: { cell4_skills: 5, cell1_data: 3 },
        severityTag: 'Minor Friction'
      },
      {
        id: 'q8_c',
        text: 'No Formal Training: Performers were expected to "figure it out" or shadow colleagues with conflicting habits.',
        subtext: 'Instructional gap exists.',
        cellImpacts: { cell4_skills: 9 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 9,
    cellKey: 'cell5_capacity',
    cellNumber: 5,
    title: 'Question 9: Cognitive Load & Working Memory Capacity',
    question: 'Does the task require performers to memorize vast amounts of complex data, or work under physical/mental fatigue?',
    contextTip: 'Gilbert noted that capacity issues stem from overloading human memory or physical endurance.',
    whyItMatters: 'Humans can hold ~4-7 items in working memory. Expecting memorization without job aids guarantees errors.',
    choices: [
      {
        id: 'q9_a',
        text: 'Manageable Cognitive Load: Task relies on reference guides, clear prompts, or reasonable memory demands.',
        subtext: 'Fits normal cognitive bandwidth.',
        cellImpacts: { cell5_capacity: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q9_b',
        text: 'High Memory Burden: Performers must memorize dozens of codes, rules, or exception lists without quick lookup tools.',
        subtext: 'Cognitive overload causes frequent slips.',
        cellImpacts: { cell5_capacity: 7, cell1_data: 4 },
        severityTag: 'Moderate Deficit'
      },
      {
        id: 'q9_c',
        text: 'Extreme Overload / Fatigue: Long shifts, high burnout turnover, or intense stress causing mental exhaustion.',
        subtext: 'Human capacity limits exceeded.',
        cellImpacts: { cell5_capacity: 10, cell2_resources: 4 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  },
  {
    id: 10,
    cellKey: 'cell6_motives',
    cellNumber: 6,
    title: 'Question 10: Performer Buy-In & Task Alignment',
    question: 'Do performers see value in the task and feel intrinsically aligned with the team and company goals?',
    contextTip: 'Cell 6 explores personal motives, intrinsic value, and cultural alignment.',
    whyItMatters: 'If staff view the task as useless bureaucracy, they will resist compliance regardless of skill level.',
    choices: [
      {
        id: 'q10_a',
        text: 'High Buy-In: Performers understand the "why" and take pride in quality outcomes.',
        subtext: 'Strong intrinsic motivation.',
        cellImpacts: { cell6_motives: 0 },
        severityTag: 'Optimal'
      },
      {
        id: 'q10_b',
        text: 'Passive Compliance: Performers see the task as a compliance checkbox with little personal connection.',
        subtext: 'Transactional effort level.',
        cellImpacts: { cell6_motives: 5 },
        severityTag: 'Minor Friction'
      },
      {
        id: 'q10_c',
        text: 'Active Cynicism: Performers distrust leadership, resent recent changes, or feel the task is pointless.',
        subtext: 'Cultural resistance and low morale.',
        cellImpacts: { cell6_motives: 10, cell3_incentives: 4 },
        severityTag: 'Severe Bottleneck'
      }
    ]
  }
];
