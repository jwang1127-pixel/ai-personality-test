const { generatePersonalityReport } = require('../generateReport');
const path = require('path');
const fs = require('fs');

console.log('========================================');
console.log('🧪 Big Five Complete Report Test');
console.log('========================================\n');

// 测试用户数据
const testUsers = [
  {
    name: 'Zhang Chuangxin',
    scores: {
      openness: 85,
      conscientiousness: 40,
      extraversion: 65,
      agreeableness: 70,
      neuroticism: 45
    },
    testDate: new Date(),
    description: 'High O+C+E, Low N - Innovation Leader'
  },
  {
    name: 'Li Yanjin',
    scores: {
      openness: 50,
      conscientiousness: 88,
      extraversion: 35,
      agreeableness: 65,
      neuroticism: 38
    },
    testDate: new Date(),
    description: 'Moderate O, High C+A, Low E+N - Reliable Specialist'
  },
  {
    name: 'Wang Junheng',
    scores: {
      openness: 52,
      conscientiousness: 55,
      extraversion: 48,
      agreeableness: 50,
      neuroticism: 47
    },
    testDate: new Date(),
    description: 'Very High O+E, Low C, Moderate A+N - Creative Explorer'
  }
];

async function runCompleteTest() {
  console.log('📋 Test Users:\n');
  
  testUsers.forEach((user, i) => {
    console.log(`${i + 1}. ${user.name}`);
    console.log(`   Profile: ${user.description}`);
    console.log(`   OCEAN Scores:`);
    console.log(`   - Openness: ${user.scores.openness}`);
    console.log(`   - Conscientiousness: ${user.scores.conscientiousness}`);
    console.log(`   - Extraversion: ${user.scores.extraversion}`);
    console.log(`   - Agreeableness: ${user.scores.agreeableness}`);
    console.log(`   - Neuroticism: ${user.scores.neuroticism} (Stability: ${100 - user.scores.neuroticism})`);
    console.log('');
  });

  console.log('========================================');
  console.log('🚀 Generating Reports...\n');
  console.log('========================================\n');

  const reportsDir = path.join(__dirname, '../../reports');
  
  for (const user of testUsers) {
    try {
      const fileName = `BigFive_${user.name.replace(' ', '_')}_${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      
      console.log(`📄 Generating report for ${user.name}...`);
      console.log(`   Output: ${fileName}`);
      
      const startTime = Date.now();
      await generatePersonalityReport(user, filePath);
      const endTime = Date.now();
      
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      console.log(`✅ Success!`);
      console.log(`   Size: ${sizeKB} KB`);
      console.log(`   Time: ${endTime - startTime} ms`);
      console.log('');
      
      // Wait 1 second between reports
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed for ${user.name}:`, error.message);
      console.log('');
    }
  }

  console.log('========================================');
  console.log('🎉 All Reports Generated!');
  console.log('========================================\n');
  
  console.log('📂 Location: ' + reportsDir);
  console.log('');
  console.log('✅ Verification Checklist:');
  console.log('   □ Open any PDF');
  console.log('   □ Check cover page shows "Big Five Personality"');
  console.log('   □ Verify NO "MBTI" terms anywhere');
  console.log('   □ Confirm 20+ pages present');
  console.log('   □ Check OCEAN dimensions all included');
  console.log('   □ Verify career recommendations present');
  console.log('');
  console.log('🎯 Next Steps:');
  console.log('   1. Review the generated PDFs');
  console.log('   2. Verify content quality and completeness');
  console.log('   3. Integrate into your payment system');
  console.log('   4. Test end-to-end user flow');
  console.log('');
  console.log('========================================');
}

runCompleteTest().catch(error => {
  console.error('❌ Test failed:', error);
  console.error(error.stack);
  process.exit(1);
});