
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crochetData from '../data/crochet_domain_knowledge.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🧶 Seeding crochet database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      skillLevel: 'expert',
      name: 'John Doe'
    },
  });

  console.log('✅ Admin user created');

  // Seed Stitch Library
  const stitches = [
    {
      name: 'Chain',
      abbreviation: 'ch',
      category: 'basic',
      difficulty: 'beginner',
      description: 'The foundation of crochet, creates a series of connected loops.',
      instructions: 'Yarn over, draw through loop on hook.',
      tips: 'Keep chains loose and even for best results.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Single Crochet',
      abbreviation: 'sc',
      category: 'basic',
      difficulty: 'beginner',
      description: 'The most basic crochet stitch, creates a tight, dense fabric.',
      instructions: 'Insert hook in stitch, yarn over, pull through (2 loops on hook), yarn over, pull through both loops.',
      tips: 'Keep consistent tension. This creates the shortest, tightest stitch.',
      imageUrl: 'https://www.nickishomemadecrafts.com/wp-content/uploads/2023/10/How-to-Single-Crochet-Tutorial-Square-1.jpg'
    },
    {
      name: 'Half Double Crochet',
      abbreviation: 'hdc',
      category: 'basic',
      difficulty: 'beginner',
      description: 'A medium-height stitch, taller than single crochet but shorter than double crochet.',
      instructions: 'Yarn over, insert hook in stitch, yarn over, pull through (3 loops on hook), yarn over, pull through all 3 loops.',
      tips: 'Medium height stitch, good for blankets and scarves.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Double Crochet',
      abbreviation: 'dc',
      category: 'basic',
      difficulty: 'beginner',
      description: 'A tall stitch that works up quickly and creates an open, airy fabric.',
      instructions: 'Yarn over, insert hook in stitch, yarn over, pull through (3 loops on hook), yarn over, pull through 2 loops (2 loops remain), yarn over, pull through last 2 loops.',
      tips: 'Tallest basic stitch, works up quickly. Great for hats and blankets.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Slip Stitch',
      abbreviation: 'sl st',
      category: 'basic',
      difficulty: 'beginner',
      description: 'Used for joining, moving across stitches without adding height.',
      instructions: 'Insert hook in stitch, yarn over, pull through both stitch and loop on hook in one motion.',
      tips: 'Minimal height. Used for joining rounds and finishing edges.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Treble Crochet',
      abbreviation: 'tr',
      category: 'basic',
      difficulty: 'intermediate',
      description: 'The tallest basic stitch, creates very open fabric.',
      instructions: 'Yarn over twice, insert hook in stitch, yarn over, pull through (4 loops on hook), *yarn over, pull through 2 loops* repeat until 1 loop remains.',
      tips: 'Very tall stitch. Work loosely to avoid tight fabric.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Increase',
      abbreviation: 'inc',
      category: 'increase',
      difficulty: 'beginner',
      description: 'Work two stitches in the same stitch to add width.',
      instructions: 'Work 2 stitches of the same type in one stitch.',
      tips: 'Essential for shaping. Spread increases evenly for smooth curves.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    },
    {
      name: 'Decrease',
      abbreviation: 'dec',
      category: 'decrease',
      difficulty: 'intermediate',
      description: 'Combine two stitches to reduce width.',
      instructions: 'Insert hook in first st, yo, draw through (2 loops), insert hook in next st, yo, draw through (3 loops), yo, draw through all 3 loops.',
      tips: 'Creates smooth decreases. Practice for even tension.',
      imageUrl: 'https://i0.wp.com/okiegirlblingnthings.com/wp-content/uploads/2022/07/double-crochet-square-laid-on-table-with-purple-crochet-hook.jpg?fit=1200%2C1200&ssl=1'
    }
  ];

  for (const stitch of stitches) {
    await prisma.stitchLibrary.upsert({
      where: { abbreviation: stitch.abbreviation },
      update: {},
      create: stitch
    });
  }

  console.log('✅ Stitch library seeded');

  // Seed Yarn Calculations
  const yarnCalculations = [
    // Hats
    { itemType: 'hat', size: 'baby', yarnWeight: 'worsted', yardage: 100, weightGrams: 50, notes: 'Perfect for newborn gifts' },
    { itemType: 'hat', size: 'child', yarnWeight: 'worsted', yardage: 120, weightGrams: 60, notes: 'Great for school-age children' },
    { itemType: 'hat', size: 'adult_medium', yarnWeight: 'worsted', yardage: 150, weightGrams: 75, notes: 'Standard adult hat' },
    { itemType: 'hat', size: 'adult_large', yarnWeight: 'worsted', yardage: 180, weightGrams: 90, notes: 'For larger heads or slouchy style' },
    
    // Scarves
    { itemType: 'scarf', size: 'child', yarnWeight: 'worsted', yardage: 300, weightGrams: 150, notes: 'Child-sized scarf' },
    { itemType: 'scarf', size: 'adult', yarnWeight: 'worsted', yardage: 500, weightGrams: 250, notes: 'Standard adult scarf' },
    
    // Blankets
    { itemType: 'blanket', size: 'baby', yarnWeight: 'worsted', yardage: 800, weightGrams: 400, notes: 'Perfect baby blanket size' },
    { itemType: 'blanket', size: 'throw', yarnWeight: 'worsted', yardage: 1500, weightGrams: 750, notes: 'Cozy throw blanket' },
    { itemType: 'blanket', size: 'twin', yarnWeight: 'worsted', yardage: 2500, weightGrams: 1250, notes: 'Twin bed blanket' },
  ];

  for (const calc of yarnCalculations) {
    await prisma.yarnCalculation.create({
      data: calc
    });
  }

  console.log('✅ Yarn calculations seeded');

  // Create sample patterns
  const basicHatPattern = await prisma.pattern.create({
    data: {
      title: 'Basic Beanie Hat',
      description: 'A simple, classic beanie perfect for beginners. Works up quickly in worsted weight yarn.',
      itemType: 'hat',
      skillLevel: 'beginner',
      imageUrl: 'https://craftykittydesigns.com/cdn/shop/products/il_fullxfull.5383534101_cmql.jpg?v=1725332038&width=1445',
      estimatedTime: 180,
      isPublic: true,
      isCustom: false,
      yarnWeight: 'worsted',
      hookSize: 'I/5.5mm',
      gauge: '4 sts/inch, 4.5 rows/inch',
      difficulty: 'Easy pattern with basic stitches only',
      authorId: adminUser.id,
      instructions: {
        create: [
          {
            rowNumber: 0,
            rowType: 'header',
            instruction: 'Basic Beanie Hat Pattern - Adult Medium',
            stitchCount: 0
          },
          {
            rowNumber: 1,
            rowType: 'foundation',
            instruction: 'Magic ring, 6 sc in ring. Join with sl st. (6 sts)',
            stitchCount: 6
          },
          {
            rowNumber: 2,
            rowType: 'instruction',
            instruction: 'Ch 1, 2 sc in each st around. Join. (12 sts)',
            stitchCount: 12
          },
          {
            rowNumber: 3,
            rowType: 'instruction',
            instruction: 'Ch 1, *sc in next st, 2 sc in next st*; repeat around. Join. (18 sts)',
            stitchCount: 18
          },
          {
            rowNumber: 4,
            rowType: 'instruction',
            instruction: 'Ch 1, *sc in next 2 sts, 2 sc in next st*; repeat around. Join. (24 sts)',
            stitchCount: 24
          },
          {
            rowNumber: 5,
            rowType: 'instruction',
            instruction: 'Continue increasing by 6 sts each round until you have 88 sts.',
            stitchCount: 88,
            notes: 'This should take about 8-9 more rounds'
          },
          {
            rowNumber: 14,
            rowType: 'instruction',
            instruction: 'Work even (sc in each st around) for 20 rounds or until hat measures 7 inches from crown.',
            stitchCount: 88,
            notes: 'This creates the body of the hat'
          }
        ]
      },
      materials: {
        create: [
          {
            type: 'yarn',
            name: 'Worsted weight yarn',
            amount: '150 yards (75g)',
            notes: 'Choose your favorite color!'
          },
          {
            type: 'hook',
            name: 'Size I (5.5mm) crochet hook',
            amount: '1'
          },
          {
            type: 'notions',
            name: 'Yarn needle, stitch markers',
            amount: '1 set'
          }
        ]
      }
    }
  });

  const simpleScarf = await prisma.pattern.create({
    data: {
      title: 'Classic Single Crochet Scarf',
      description: 'A warm and cozy scarf made with simple single crochet stitches. Perfect first project!',
      itemType: 'scarf',
      skillLevel: 'beginner',
      imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbsNAxbW476H5xR9bcljus7KSmVJFzSHzgOhB0bqzi3yBmpN5ObhXwDnpmjzOb8m9HZMFlMOxiWOYNlur4dVbEYmk7jNYIMr9xWVSaY5WT2fydIr5xf_3QVnv4uxQ2dC1jpl9FkrdWzN_c/s1600/IMG_2938.JPG',
      estimatedTime: 300,
      isPublic: true,
      isCustom: false,
      yarnWeight: 'worsted',
      hookSize: 'H/5mm',
      gauge: '4 sts/inch',
      authorId: adminUser.id,
      instructions: {
        create: [
          {
            rowNumber: 1,
            rowType: 'foundation',
            instruction: 'Chain 33.',
            stitchCount: 33
          },
          {
            rowNumber: 2,
            rowType: 'instruction',
            instruction: 'Sc in 2nd ch from hook and in each ch across. (32 sc)',
            stitchCount: 32
          },
          {
            rowNumber: 3,
            rowType: 'instruction',
            instruction: 'Ch 1, turn. Sc in each sc across.',
            stitchCount: 32,
            notes: 'Repeat this row until scarf measures 60 inches'
          }
        ]
      },
      materials: {
        create: [
          {
            type: 'yarn',
            name: 'Worsted weight yarn',
            amount: '500 yards (250g)',
          },
          {
            type: 'hook',
            name: 'Size H (5mm) crochet hook',
            amount: '1'
          }
        ]
      }
    }
  });

  console.log('✅ Sample patterns created');

  // Create sample project for admin user
  await prisma.project.create({
    data: {
      name: 'My First Beanie',
      notes: 'Working on this cozy hat for winter!',
      status: 'in_progress',
      currentRow: 5,
      userId: adminUser.id,
      patternId: basicHatPattern.id,
      startedAt: new Date(),
      progress: {
        create: [
          { rowNumber: 1, completed: true },
          { rowNumber: 2, completed: true },
          { rowNumber: 3, completed: true },
          { rowNumber: 4, completed: true },
          { rowNumber: 5, completed: false, notes: 'Working on this now' }
        ]
      }
    }
  });

  console.log('✅ Sample project created');
  console.log('🧶 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
