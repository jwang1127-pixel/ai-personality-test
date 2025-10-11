const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function diagnosePDF() {
  try {
    console.log('🔍 诊断PDF文件...\n');
    
    const pdfBytes = fs.readFileSync('reports/BigFive_Zhang_Wei_1759769074192.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    console.log(`📄 PDF信息：`);
    console.log(`   总页数: ${pdfDoc.getPageCount()}`);
    console.log(`   文件大小: ${(pdfBytes.length / 1024).toFixed(2)} KB\n`);
    
    for (let i = 0; i < Math.min(3, pdfDoc.getPageCount()); i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      
      console.log(`📃 第 ${i + 1} 页：`);
      console.log(`   尺寸: ${width.toFixed(2)} x ${height.toFixed(2)}`);
      
      const contentStream = page.node.Contents();
      if (contentStream) {
        console.log(`   ✅ 有内容流`);
      } else {
        console.log(`   ❌ 没有内容流`);
      }
      
      const fonts = page.node.Resources()?.lookup('Font');
      if (fonts) {
        console.log(`   ✅ 有字体定义`);
      } else {
        console.log(`   ⚠️  没有字体定义`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

diagnosePDF();