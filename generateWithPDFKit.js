const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'A4', margin: 50 });
doc.pipe(fs.createWriteStream('reports/test_with_font.pdf'));

// 标题
doc.fontSize(24).text('Big Five Personality Assessment', { align: 'center' });
doc.moveDown();
doc.fontSize(16).text('Zhang Wei', { align: 'center' });
doc.moveDown(2);

// OCEAN分数
doc.fontSize(14).text('Your OCEAN Profile', { underline: true });
doc.moveDown();

const scores = [
  { name: 'Openness', score: 88, category: 'Visionary Pioneer' },
  { name: 'Conscientiousness', score: 82, category: 'Exceptionally Disciplined' },
  { name: 'Extraversion', score: 75, category: 'Moderately Extraverted' },
  { name: 'Agreeableness', score: 68, category: 'Highly Cooperative' },
  { name: 'Emotional Stability', score: 65, category: 'Highly Stable' }
];

scores.forEach(item => {
  doc.fontSize(12)
     .text(`${item.name}: ${item.score}`, { continued: true })
     .text(` - ${item.category}`);
  doc.moveDown(0.5);
});

doc.end();
console.log('✅ 新PDF已生成: reports/test_with_font.pdf');