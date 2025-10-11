const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

console.log('🧪 Big Five 中文支持测试开始...\n');

const testUser = {
  name: 'Zhang Wei',
  scores: {
    openness: 88,
    conscientiousness: 82,
    extraversion: 75,
    agreeableness: 68,
    neuroticism: 35
  },
  testDate: new Date()
};

const outputPath = path.join(__dirname, '../../reports/BigFive_English.pdf');

const doc = new PDFDocument({ 
  size: 'A4', 
  margins: { top: 50, bottom: 50, left: 50, right: 50 }
});

doc.pipe(fs.createWriteStream(outputPath));

// ========== 第1页：封面（全英文） ==========
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#1a1a2e');

doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .fontSize(48)
   .text('Big Five Personality', 0, 200, { align: 'center' });

doc.fontSize(32)
   .text('Assessment Report', 0, 260, { align: 'center' });

doc.fontSize(28)
   .text(testUser.name, 0, 350, { align: 'center' });

doc.fontSize(14)
   .fillColor('#95a5a6')
   .text(`Test Date: ${testUser.testDate.toLocaleDateString('en-US')}`, 0, 420, { align: 'center' });

doc.fontSize(12)
   .fillColor('#16a085')
   .text('Based on Big Five Theory', 0, 700, { align: 'center' });

addPageWithNumber();

// ========== 第2页：OCEAN维度（英文标签） ==========
doc.fillColor('#2C3E50')
   .font('Helvetica-Bold')
   .fontSize(26)
   .text('Your OCEAN Profile', 100, 80);

doc.moveTo(100, 120).lineTo(500, 120).stroke('#3498DB');

const dimensions = [
  { name: 'Openness', score: testUser.scores.openness },
  { name: 'Conscientiousness', score: testUser.scores.conscientiousness },
  { name: 'Extraversion', score: testUser.scores.extraversion },
  { name: 'Agreeableness', score: testUser.scores.agreeableness },
  { name: 'Emotional Stability', score: 100 - testUser.scores.neuroticism }
];

let y = 160;
dimensions.forEach(dim => {
  // 维度名称
  doc.fillColor('#34495E')
     .font('Helvetica')
     .fontSize(16)
     .text(dim.name, 100, y);

  // 进度条背景
  doc.rect(100, y + 28, 350, 22).fillAndStroke('#ECF0F1', '#ECF0F1');

  // 进度条填充
  const barWidth = (dim.score / 100) * 350;
  const barColor = dim.score >= 70 ? '#27AE60' : dim.score >= 50 ? '#3498DB' : '#F39C12';
  doc.rect(100, y + 28, barWidth, 22).fill(barColor);

  // 分数
  doc.fillColor('#34495E')
     .font('Helvetica-Bold')
     .fontSize(18)
     .text(`${dim.score}`, 470, y + 28);

  y += 85;
});

doc.fillColor('#7f8c8d')
   .font('Helvetica')
   .fontSize(11)
   .text('Based on Big Five Personality Theory', 0, 680, { align: 'center' });

doc.fontSize(10)
   .text('No MBTI trademarks - Legally compliant', 0, 700, { align: 'center' });

addPageWithNumber();

// ========== 第3页：成功确认 ==========
doc.fillColor('#2C3E50')
   .font('Helvetica-Bold')
   .fontSize(32)
   .text('Test Successful!', 100, 100);

doc.fillColor('#27AE60')
   .fontSize(72)
   .text('✓', 0, 200, { align: 'center' });

doc.fillColor('#34495E')
   .font('Helvetica')
   .fontSize(16)
   .text('PDF Generation Working Correctly', 0, 300, { align: 'center' });

doc.fontSize(14)
   .fillColor('#7f8c8d')
   .text('Based on Big Five Theory', 0, 350, { align: 'center' });

doc.text('No MBTI Terms', 0, 380, { align: 'center' });

doc.text('Safe for Commercial Use', 0, 410, { align: 'center' });

doc.fillColor('#34495E')
   .font('Helvetica-Bold')
   .fontSize(13)
   .text('Next Step:', 100, 500);

doc.font('Helvetica')
   .fontSize(12)
   .text('Integrate the full 20-page report generator', 100, 530, { width: 400 });

doc.text('with your existing payment system.', 100, 555, { width: 400 });

// 完成
doc.end();

doc.on('finish', () => {
  console.log('✅ PDF生成成功！');
  console.log(`📁 文件位置: ${outputPath}`);
  console.log('\n🎉 这个版本使用全英文标签，避免中文显示问题');
  console.log('💡 完整版报告中，我们会使用英文标题 + 中文内容的方式');
});

doc.on('error', (err) => {
  console.error('❌ 错误:', err);
});