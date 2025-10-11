const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Derived Indices Integration\n');

// 测试数据
const userData = {
  name: 'Test User',
  scores: {
    openness: 75,
    conscientiousness: 80,
    extraversion: 70,
    agreeableness: 65,
    neuroticism: 35
  },
  testDate: new Date()
};

// 计算衍生指数
function calculateIndices(scores) {
  const emotionalStability = 100 - scores.neuroticism;
  
  return {
    human_value: Math.round(
      (scores.agreeableness * 0.50) + 
      (scores.openness * 0.25) + 
      (emotionalStability * 0.15) + 
      (scores.conscientiousness * 0.10)
    ),
    life_integration: Math.round(
      (emotionalStability * 0.45) + 
      (scores.conscientiousness * 0.30) + 
      (scores.agreeableness * 0.15) + 
      (scores.extraversion * 0.10)
    ),
    entrepreneurship: Math.round(
      (scores.openness * 0.35) + 
      (scores.conscientiousness * 0.25) + 
      (scores.extraversion * 0.20) + 
      (emotionalStability * 0.15) + 
      Math.max(0, scores.agreeableness * -0.05)
    )
  };
}

const indices = calculateIndices(userData.scores);

console.log('Calculated Indices:');
console.log('- Human Value:', indices.human_value);
console.log('- Life Integration:', indices.life_integration);
console.log('- Entrepreneurship:', indices.entrepreneurship);
console.log('');

// 创建PDF
const outputPath = path.join(__dirname, '../../reports/Indices_Test.pdf');
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(outputPath));

doc.fontSize(24).text('Derived Indices Test', 100, 100);
doc.fontSize(16).text('Your Scores:', 100, 150);

doc.fontSize(14)
   .text(`Human Value Index: ${indices.human_value}`, 120, 190)
   .text(`Life Integration Index: ${indices.life_integration}`, 120, 220)
   .text(`Entrepreneurship Potential: ${indices.entrepreneurship}`, 120, 250);

let y = 300;
['Human Value', 'Life Integration', 'Entrepreneurship'].forEach((name, i) => {
  const score = Object.values(indices)[i];
  
  doc.fontSize(12).text(name, 100, y);
  doc.rect(100, y + 20, 300, 15).fillAndStroke('#ECF0F1', '#ECF0F1');
  doc.rect(100, y + 20, (score / 100) * 300, 15).fill('#3498DB');
  doc.fillColor('#000000').text(`${score}`, 420, y + 18);
  
  y += 60;
});

doc.end();

doc.on('finish', () => {
  console.log('✅ Test PDF generated!');
  console.log('📁 Location:', outputPath);
});

doc.on('error', (err) => {
  console.error('❌ Error:', err);
});