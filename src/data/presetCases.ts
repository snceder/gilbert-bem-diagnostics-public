import { SavedCase } from '../types';

export const PRESET_CASES: SavedCase[] = [
  {
    id: 'preset_call_center',
    updatedAt: new Date().toISOString(),
    isPreset: true,
    metadata: {
      clientName: 'Apex Financial Services',
      department: 'Customer Escalations & Operations',
      targetRole: 'Tier 1 Call Center Specialists',
      performanceIssueDescription: 'High call resolution error rates, missed compliance disclosures, and 38% annual turnover. Management requested a 3-day mandatory refresher training on customer service and compliance.',
      assessedBy: 'Lead Performance Consultant',
      assessmentDate: '2026-07-22',
      targetMetrics: 'Reduce compliance error rate from 24% to < 5%'
    },
    answers: {
      1: 0, // Option A: Yes! Gun-to-head test passed! Performers know how if incentivized.
      2: 1, // Option B: Vague expectations passed verbally
      3: 1, // Option B: Delayed QA audits weeks later
      4: 1, // Option B: Clumsy app switching between 5 legacy tools
      5: 2, // Option C: Severe handling time quotas forcing shortcuts
      6: 2, // Option C: Top performers punished with hardest calls
      7: 2, // Option C: Zero consequences for missing disclosures as long as AHT is under 3 mins
      8: 0, // Option A: Already completed 2-week onboarding + compliance training 3 months ago
      9: 1, // Option B: High memory load of 80+ financial compliance codes
      10: 1 // Option B: Passive compliance
    }
  },
  {
    id: 'preset_software_dev',
    updatedAt: new Date().toISOString(),
    isPreset: true,
    metadata: {
      clientName: 'Nexus Cloud Systems',
      department: 'Engineering & DevOps',
      targetRole: 'Senior Software Engineers',
      performanceIssueDescription: 'Missed release deadlines and high post-deployment bug counts. VP of Engineering wants "Agile and Code Quality Training" for all 45 developers.',
      assessedBy: 'HPT Performance Architect',
      assessmentDate: '2026-07-22',
      targetMetrics: 'Improve sprint velocity predictability and decrease release rollback frequency by 50%'
    },
    answers: {
      1: 0, // Option A: Pass - Developers know how to write clean code
      2: 0, // Option A: Clear sprint goals
      3: 1, // Option B: Delayed feedback from CI/CD pipeline taking 3 hours to run
      4: 2, // Option C: Broken staging environment and flaking unit test suites
      5: 2, // Option C: Constantly interrupted by emergency hotfixes and scope creep
      6: 1, // Option B: No rewards for bug-free code
      7: 1, // Option B: Inconsistent PR review guidelines
      8: 0, // Option A: Highly skilled, average 6+ years experience
      9: 2, // Option C: Burnout fatigue from 60-hour crunch weeks
      10: 2 // Option C: Cynicism toward shifting leadership directives
    }
  },
  {
    id: 'preset_hospital_nursing',
    updatedAt: new Date().toISOString(),
    isPreset: true,
    metadata: {
      clientName: 'St. Jude Healthcare Network',
      department: 'Inpatient Surgical Units',
      targetRole: 'Registered Staff Nurses',
      performanceIssueDescription: 'Inconsistent patient discharge documentation and missed shift-handover checklists. Chief Nursing Officer ordered a mandatory 4-hour weekend training workshop.',
      assessedBy: 'Healthcare Performance Strategist',
      assessmentDate: '2026-07-22',
      targetMetrics: '100% handover documentation compliance and zero readmissions due to missing instructions'
    },
    answers: {
      1: 0, // Option A: Nurses definitely know how to fill the forms when time permits
      2: 1, // Option B: Overlapping documentation requirements
      3: 2, // Option C: Zero feedback unless an incident report is filed
      4: 2, // Option C: EHR system is slow, mobile carts have dead batteries
      5: 2, // Option C: Nurse-to-patient ratio exceeds safe limits during peak hours
      6: 2, // Option C: Nurses who finish charts early get assigned additional patients
      7: 1, // Option B: Random enforcement
      8: 0, // Option A: Nurses passed formal clinical orientation
      9: 2, // Option C: 12-hour night shift exhaustion
      10: 0 // Option A: Nurses care deeply about patients
    }
  },
  {
    id: 'preset_b2b_sales',
    updatedAt: new Date().toISOString(),
    isPreset: true,
    metadata: {
      clientName: 'Enterprise SaaS Global',
      department: 'Commercial Sales',
      targetRole: 'Account Executives',
      performanceIssueDescription: 'Low CRM logging accuracy, missed discovery call steps, and inaccurate quarterly forecast data. CRO requested sales methodology retraining.',
      assessedBy: 'Sales Effectiveness Advisor',
      assessmentDate: '2026-07-22',
      targetMetrics: '100% CRM opportunity stage accuracy and 20% increase in pipeline conversion'
    },
    answers: {
      1: 0, // Option A: Reps know how to log CRM, but hate doing it because it takes time away from selling
      2: 1, // Option B: Vague definition of "qualified opportunity"
      3: 2, // Option C: Sales ops only checks CRM data at end of quarter
      4: 1, // Option B: CRM fields require 18 clicks per opportunity stage
      5: 1, // Option B: Reps overwhelmed with admin forms
      6: 2, // Option C: Commission structure pays only on closed revenue, zero incentive for accurate CRM logging
      7: 2, // Option C: Top revenue producers exempted from CRM rules
      8: 0, // Option A: Trained on sales methodology 6 months ago
      9: 0, // Option A: Capable reps
      10: 1 // Option B: View CRM as administrative overhead
    }
  }
];
