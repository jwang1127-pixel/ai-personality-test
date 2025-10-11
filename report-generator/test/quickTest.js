const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 简化版测试：生成一个3页的Big Five报告
async function quickTest() {
  console.log('🧪 Big Five 快速测试开始...\n');

  // 测试数据
  const testUser = {
    name: '张伟',
    scores: {
      openness: 88,
      conscientiousness: 82,
      extraversion: 75,
      agreeableness: 68,
      neuroticism: 35
    },
    testDate: new Date()
  };

  // 输出路径
  const outputPath = path.join(__dirname, '../../reports/BigFive_QuickTest.pdf');

  // 创建PDF
  const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
  doc.pipe(fs.createWriteStream(outputPath));

  // ========== 第1页：封面 ==========
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a2e');
  
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(48)
     .text('五维人格测评报告', 0, 200, { align: 'center' });

  doc.fontSize(18)
     .fillColor('#95a5a6')
     .text('Big Five Personality Assessment', 0, 260, { align: 'center' });

  doc.fontSize(32)
     .fillColor('#ffffff')
     .text(testUser.name, 0, 350, { align: 'center' });

  doc.fontSize(14)
     .fillColor('#95a5a6')
     .text(`测试日期: ${formatDate(testUser.testDate)}`, 0, 420, { align: 'center' });

  doc.fontSize(12)
     .fillColor('#7f8c8d')
     .text('完全基于Big Five理论，科学严谨', 0, 700, { align: 'center' });

  addPageWithNumber();

  // ========== 第2页：OCEAN五维分数 ==========
  doc.fillColor('#2C3E50')
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('您的OCEAN五维人格', 100, 100);

  doc.moveTo(100, 135).lineTo(500, 135).stroke('#3498DB');

  const dimensions = [
    { name: 'Openness 开放性', score: testUser.scores.openness },
    { name: 'Conscientiousness 尽责性', score: testUser.scores.conscientiousness },
    { name: 'Extraversion 外向性', score: testUser.scores.extraversion },
    { name: 'Agreeableness 宜人性', score: testUser.scores.agreeableness },
    { name: 'Emotional Stability 情绪稳定性', score: 100 - testUser.scores.neuroticism }
  ];

  let y = 180;
  dimensions.forEach(dim => {
    // 维度名称
    doc.fillColor('#34495E')
       .font('Helvetica')
       .fontSize(14)
       .text(dim.name, 100, y);

    // 进度条背景
    doc.rect(100, y + 25, 400, 20).fillAndStroke('#ECF0F1', '#ECF0F1');

    // 进度条填充
    const barWidth = (dim.score / 100) * 400;
    const barColor = dim.score >= 70 ? '#27AE60' : dim.score >= 50 ? '#3498DB' : '#F39C12';
    doc.rect(100, y + 25, barWidth, 20).fill(barColor);

    // 分数
    doc.fillColor('#34495E')
       .fontSize(16)
       .text(`${dim.score}`, 520, y + 25);

    y += 80;
  });

  // 底部说明
  doc.fillColor('#7f8c8d')
     .fontSize(10)
     .text('基于Big Five人格理论 | 无MBTI版权风险', 0, 700, { align: 'center' });

  addPageWithNumber();

  // ========== 第3页：关键信息 ==========
  doc.fillColor('#2C3E50')
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('测试成功！', 100, 100);

  doc.fillColor('#27AE60')
     .fontSize(48)
     .text('✓', 0, 200, { align: 'center' });

  doc.fillColor('#34495E')
     .font('Helvetica')
     .fontSize(14)
     .text('PDF生成功能正常', 0, 280, { align: 'center' });

  doc.fontSize(12)
     .fillColor('#7f8c8d')
     .text('完全基于Big Five理论', 0, 320, { align: 'center' });

  doc.text('无MBTI术语', 0, 345, { align: 'center' });

  doc.text('可以安全使用', 0, 370, { align: 'center' });

  // 下一步提示
  doc.fillColor('#34495E')
     .fontSize(11)
     .text('下一步：集成完整的20页报告生成器', 100, 500, { width: 400 });

  // 完成
  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('finish', () => {
      console.log('✅ PDF生成成功！');
      console.log(`📁 文件位置: ${outputPath}`);
      console.log('\n🎉 测试完成！请打开 reports 文件夹查看 BigFive_QuickTest.pdf');
      resolve(outputPath);
    });
    doc.on('error', reject);
  });
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 运行测试
quickTest().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});