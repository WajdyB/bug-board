import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample ideas
  const ideas = await Promise.all([
    prisma.idea.create({
      data: {
        title: 'Dark Mode Toggle',
        description: 'Add a dark mode toggle to the application for better user experience during night time usage.',
        tags: ['Feature', 'UI/UX'],
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Search Functionality',
        description: 'Implement a search feature that allows users to find ideas by keywords in title and description.',
        tags: ['Feature', 'Enhancement'],
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Mobile Responsive Design',
        description: 'The current design doesn\'t work well on mobile devices. Need to improve responsive layout.',
        tags: ['Bug', 'Mobile', 'UI/UX'],
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Email Notifications',
        description: 'Send email notifications when someone comments on your idea or when your idea gets upvoted.',
        tags: ['Feature', 'Enhancement'],
      },
    }),
    prisma.idea.create({
      data: {
        title: 'Export Ideas to CSV',
        description: 'Allow administrators to export all ideas and their data to a CSV file for analysis.',
        tags: ['Feature', 'API'],
      },
    }),
  ])

  // Add some sample votes
  const votePromises = []
  for (let i = 1; i <= 3; i++) {
    votePromises.push(
      prisma.vote.create({
        data: {
          userId: `user-${i}`,
          ideaId: ideas[0].id, // Dark Mode Toggle
        },
      })
    )
    votePromises.push(
      prisma.vote.create({
        data: {
          userId: `user-${i}`,
          ideaId: ideas[1].id, // Search Functionality
        },
      })
    )
  }
  await Promise.all(votePromises)

  // Add some sample comments
  const comments = [
    'Great idea! This would be really useful.',
    'I agree, this is definitely needed.',
    'This would solve a lot of problems for users.',
    'Excellent suggestion, hope this gets implemented soon.',
  ]

  const commentPromises = []
  for (const idea of ideas) {
    if (Math.random() < 0.7) {
      commentPromises.push(
        prisma.comment.create({
          data: {
            userId: `user-${Math.floor(Math.random() * 5) + 1}`,
            ideaId: idea.id,
            content: comments[Math.floor(Math.random() * comments.length)],
          },
        })
      )
    }
  }
  await Promise.all(commentPromises)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 