const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('🌱 Seeding sales-themed data...')

  const stageOptions = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed']
  const priorityOptions = ['Low', 'Medium', 'High']
  const statusOptions = ['Pending', 'In Progress', 'Completed']
  const severityOptions = ['Low', 'Medium', 'High']
  const interactionTypes = ['Email', 'Call', 'Meeting']

  const dealTemplates = [
    { id: 'GS1001', name: 'Goldman Sachs CRM Upgrade' },
    { id: 'AMZ1002', name: 'Amazon Cloud Integration' },
    { id: 'TSL1003', name: 'Tesla Fleet Management' },
    { id: 'NFLX1004', name: 'Netflix AI Recommendation Engine' },
    { id: 'APPL1005', name: 'Apple Retail POS Solution' },
    { id: 'MSF1006', name: 'Microsoft Azure Expansion' },
    { id: 'GOO1007', name: 'Google Ads Optimization' },
    { id: 'FB1008', name: 'Meta Audience Insights Tool' },
    { id: 'UBR1009', name: 'Uber Driver Incentives System' },
    { id: 'LYF1010', name: 'Lyft Route Optimization Engine' },
    { id: 'NFLX1011', name: 'Netflix Subscriber Growth Analytics' },
    { id: 'ORCL1012', name: 'Oracle ERP Deployment' },
    { id: 'SAP1013', name: 'SAP Workflow Automation' },
    { id: 'IBM1014', name: 'IBM Cloud Migration' },
    { id: 'SLK1015', name: 'Slack Enterprise Messaging' },
    { id: 'AIRB1016', name: 'Airbnb Host Engagement Dashboard' },
    { id: 'ZOM1017', name: 'Zomato Partner Onboarding Suite' },
    { id: 'SWG1018', name: 'Swiggy Delivery Analytics' },
    { id: 'SNP1019', name: 'Snapchat Ad Insights Tool' },
    { id: 'PTM1020', name: 'Paytm FinTech Integration' }
  ]

  const deals = []

  // Seed Deals
  for (const template of dealTemplates) {
    const deal = await prisma.deal.create({
      data: {
        id: template.id,
        name: template.name,
        stage: getRandomItem(stageOptions),
        probability: parseFloat(faker.number.float({ min: 0.3, max: 1 }).toFixed(2)),
        value: parseFloat(faker.number.float({ min: 25000, max: 200000 }).toFixed(2)),
      },
    })
    deals.push(deal)
  }

  console.log(`✅ ${deals.length} Sales Deals seeded`)

  // Seed Tasks (7)
  const taskTitles = [
    'Follow up on pricing proposal',
    'Schedule technical onboarding call',
    'Prepare custom sales pitch deck',
    'Review client feedback and objections',
    'Organize internal kickoff meeting',
    'Update CRM with recent notes',
    'Create ROI estimate for client'
  ]

  for (let i = 0; i < taskTitles.length; i++) {
    await prisma.task.create({
      data: {
        title: taskTitles[i],
        dueDate: faker.date.soon({ days: 10 }),
        priority: getRandomItem(priorityOptions),
        status: getRandomItem(statusOptions),
        dealId: getRandomItem(deals).id,
      },
    })
  }

  console.log('✅ 7 Tasks seeded')

  // Seed Alerts (10)
  const alertMessages = [
    'Client opened pricing email',
    'Quarterly budget deadline approaching',
    'Contract revision pending approval',
    'Demo rescheduled by client',
    'Legal review pending',
    'Client requested feature comparison',
    'PO not yet issued',
    'Deal stuck in negotiation stage',
    'Stakeholder change detected in client org',
    'Follow-up needed post technical review'
  ]

  for (let i = 0; i < alertMessages.length; i++) {
    await prisma.alert.create({
      data: {
        message: alertMessages[i],
        severity: getRandomItem(severityOptions),
        dealId: getRandomItem(deals).id,
      },
    })
  }

  console.log('✅ 10 Alerts seeded')

  // Seed Interactions (20)
  const interactionContents = [
    'Held call to clarify pricing structure.',
    'Client responded with updated scope via email.',
    'Walkthrough session held for product dashboard.',
    'Client demo feedback collected over call.',
    'Follow-up meeting with procurement scheduled.',
    'Discussed implementation timeline and dependencies.',
    'Call with CTO to align technical expectations.',
    'Shared ROI projection and case studies.',
    'Client asked for product security documentation.',
    'Legal team discussion over NDAs.',
    'Email thread on billing breakdown and payment plans.',
    'Demo replay sent post-call as requested.',
    'Support requirements discussed in onboarding call.',
    'Stakeholders introduced in formal email.',
    'Call to finalize go-live date.',
    'Meeting to walk through KPI expectations.',
    'Discussion on integration APIs over Zoom.',
    'Email update with next steps and owner responsibilities.',
    'Product roadmap shared over webinar.',
    'Call to align with client onboarding lead.'
  ]

  for (let i = 0; i < interactionContents.length; i++) {
    await prisma.interaction.create({
      data: {
        type: getRandomItem(interactionTypes),
        content: interactionContents[i],
        dealId: getRandomItem(deals).id,
      },
    })
  }

  console.log('✅ 20 Interactions seeded')
  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })