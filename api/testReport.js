const { generatePersonalityReport } = require('../report-generator/generateReport.js');
const path = require('path');
const fs = require('fs');

const testProfile = {
    name: 'Zhang Wei',
    date: 'October 6, 2025',
    scores: {
        openness: 88,
        conscientiousness: 82,
        extraversion: 75,
        agreeableness: 68,
        neuroticism: 55
    }
};

async function generateTestReport() {
    try {
        console.log('🚀 开始生成测试报告...');
        console.log('📊 测试数据:', JSON.stringify(testProfile, null, 2));
        
        const outputPath = path.join(__dirname, 'test_report.pdf');
        await generatePersonalityReport(testProfile, outputPath);
        
        // 等待一下让文件写入完成
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ 测试报告已生成: ' + outputPath);
        
        // 检查文件大小
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            console.log('📄 文件大小:', stats.size, 'bytes');
            
            if (stats.size < 1000) {
                console.error('⚠️ 警告：文件太小，可能生成失败！');
            } else {
                console.log('✅ PDF 生成成功！');
            }
        }
    } catch (error) {
        console.error('❌ 生成报告失败:', error.message);
        console.error('🔍 错误堆栈:', error.stack);
    }
}

generateTestReport();