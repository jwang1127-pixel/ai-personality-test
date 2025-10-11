const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
// ❌ 已删除 canvas 导入 - 不再需要
const { 
  CONTENT_LIBRARY, 
  DERIVED_INDICES,
  getContentSegment,
  calculateDerivedIndices,
  getIndexInterpretation
} = require('./contentLibrary');
const { generateCareerRecommendations, generate30DayPlan, generateResources } = require('./reportHelpers');

/**
 * 生成完整专业版 Big Five 人格报告（无雷达图版本 - Vercel 兼容）
 */
async function generatePersonalityReport(userData = {}, outputPath = './personality-report.pdf') {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        bufferPages: true,
        autoFirstPage: false
      });

      // ============ 颜色配置（提前定义，供所有函数使用） ============
      const colors = {
        primary: '#1E3A8A',
        secondary: '#3B82F6',
        orange: '#F97316',
        yellow: '#FBBF24',
        green: '#10B981',
        text: '#1F2937',
        lightText: '#6B7280',
        border: '#E5E7EB'
      };

      // ============ 核心辅助函数（改进版） ============
      
      // 1. 添加新页（不绘制页码）
      function addNewPage() {
        doc.addPage();
        doc.x = 50;
        doc.y = 50;
      }

      // 2. 智能分页（检查是否需要新页）
      function newPageIfNeeded(extraHeight = 200) {
        const available = doc.page.height - doc.page.margins.bottom - doc.y;
        if (available < extraHeight) {
          addNewPage();
        }
      }

      // 3. 强制新页（用于章节开始）
      function newPage() {
        addNewPage();
      }

      // 3. 章节标题
      function addSectionHeader(title, subtitle = '') {
        doc.font('ChineseBold').fontSize(18).fillColor(colors.primary)
          .text(title, { align: 'left' });
        if (subtitle) {
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(11).fillColor(colors.lightText)
            .text(subtitle, { align: 'left' });
        }
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y)
          .strokeColor(colors.secondary).lineWidth(2).stroke();
        doc.moveDown(1);
      }

      // 4. 分数颜色
      function getScoreColor(score) {
        if (score >= 70) return '#27AE60';
        if (score >= 50) return '#3498DB';
        if (score >= 30) return '#F39C12';
        return '#E74C3C';
      }

      // 5. 衍生指数分析函数
      function addIndicesAnalysis() {
        doc.font('ChineseBold').fontSize(18).fillColor(colors.primary)
           .text('综合指数分析 / Comprehensive Indices Analysis', 50);
        doc.moveDown(0.5);
        doc.font('Chinese').fontSize(11).fillColor(colors.lightText)
           .text('以下衍生指数为您的人格特质提供额外洞察：\nThese derived indices provide additional insights into your personality profile:', 50, doc.y, { lineGap: 4 });
        doc.moveDown(2);
        
        const indices = [
          { key: 'human_value', score: derivedIndices.human_value },
          { key: 'life_integration', score: derivedIndices.life_integration },
          { key: 'entrepreneurship', score: derivedIndices.entrepreneurship }
        ];
        
        indices.forEach((idx, i) => {
          const indexData = DERIVED_INDICES[idx.key];
          const interp = getIndexInterpretation(idx.key, idx.score);
          
          // 每个指数换页（第一个除外）
          if (i > 0) {
            addNewPage();
            doc.font('ChineseBold').fontSize(16).fillColor(colors.primary)
               .text('综合指数分析（续）/ Comprehensive Indices Analysis (cont.)', 50);
            doc.moveDown(2);
          }
          
          // 指数名称（双语）
          doc.font('ChineseBold').fontSize(16).fillColor(colors.primary)
             .text(`${indexData.icon} ${indexData.nameZh}`, 50);
          doc.font('ChineseBold').fontSize(12).fillColor(colors.lightText)
             .text(indexData.name, 50);
          doc.font('ChineseBold').fontSize(14).fillColor(colors.secondary)
             .text(`得分 / Score: ${idx.score}/100`, 380);
          doc.moveDown(1);
          
          // Category（双语）
          doc.font('ChineseBold').fontSize(12).fillColor(colors.secondary)
             .text(`类别 / Category: ${interp.titleZh} / ${interp.title}`, 50);
          doc.moveDown(1.5);
          
          // 描述（双语）
          doc.font('ChineseBold').fontSize(12).fillColor(colors.text)
             .text('描述 / Description:', 50);
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(11).fillColor(colors.text)
             .text(interp.descriptionZh, 50, doc.y, { width: 495, lineGap: 5 });
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(10).fillColor(colors.lightText)
             .text(interp.description, 50, doc.y, { width: 495, lineGap: 4 });
          doc.moveDown(1.5);
          
          // 优势（双语）
          doc.font('ChineseBold').fontSize(12).fillColor(colors.green)
             .text('优势 / Strengths:', 50);
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(11).fillColor(colors.text)
             .text(interp.strengthsZh, 50, doc.y, { width: 495, lineGap: 4 });
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(10).fillColor(colors.lightText)
             .text(interp.strengths, 50, doc.y, { width: 495, lineGap: 3 });
          doc.moveDown(1.5);
          
          // 发展（双语）
          doc.font('ChineseBold').fontSize(12).fillColor(colors.orange)
             .text('发展方向 / Development:', 50);
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(11).fillColor(colors.text)
             .text(interp.developmentZh, 50, doc.y, { width: 495, lineGap: 4 });
          doc.moveDown(0.3);
          doc.font('Chinese').fontSize(10).fillColor(colors.lightText)
             .text(interp.development, 50, doc.y, { width: 495, lineGap: 3 });
          doc.moveDown(3);
        });
      }

      // ============ 开始生成报告 ============
      doc.pipe(fs.createWriteStream(outputPath));
      
      // 计算衍生指数
      const derivedIndices = calculateDerivedIndices(userData.scores);

      // ============ 字体设置 ============
      const regularFont = path.join(__dirname, '../fonts/NotoSansSC-Regular.ttf');
      const boldFont = path.join(__dirname, '../fonts/NotoSansSC-Bold.ttf');

      try {
        if (fs.existsSync(regularFont) && fs.existsSync(boldFont)) {
          doc.registerFont('Chinese', regularFont);
          doc.registerFont('ChineseBold', boldFont);
          console.log('✅ 已加载中文字体');
        } else {
          console.warn('⚠️ 未找到中文字体');
          doc.font('Helvetica');
        }
      } catch (err) {
        console.error('字体加载错误：', err);
      }

      // ============ 封面 ============
      newPage();
      doc.font('ChineseBold').fontSize(32).fillColor(colors.primary)
        .text('个性报告', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(22).fillColor(colors.secondary)
        .text('Personality Report', { align: 'center' });
      doc.moveDown(3);
      
      doc.font('Chinese').fontSize(14).fillColor(colors.text)
        .text(`姓名：${userData.name || '未填写'}`, { align: 'center' });
      doc.moveDown(0.5);
      doc.text(`日期：${userData.date || new Date().toLocaleDateString()}`, { align: 'center' });
      doc.moveDown(4);
      
      doc.fontSize(12).fillColor(colors.lightText)
        .text('本报告基于 OCEAN 人格模型，为您呈现全面的个性特征分析、', { align: 'center' });
      doc.text('职业建议和个性化发展计划。', { align: 'center' });

      // ============ 目录 ============
      newPage();
      addSectionHeader('目录 / Table of Contents');
      
      const toc = [
        { titleZh: 'I. 您的人格概览', titleEn: 'I. Your Personality Overview', page: 3 },
        { titleZh: 'II. OCEAN 五维度分析', titleEn: 'II. OCEAN Five Dimensions Analysis', page: 4 },
        { titleZh: '    1. 开放性维度', titleEn: '    1. Openness Dimension', page: 5 },
        { titleZh: '    2. 尽责性维度', titleEn: '    2. Conscientiousness Dimension', page: 6 },
        { titleZh: '    3. 外向性维度', titleEn: '    3. Extraversion Dimension', page: 7 },
        { titleZh: '    4. 宜人性维度', titleEn: '    4. Agreeableness Dimension', page: 8 },
        { titleZh: '    5. 情绪稳定性维度', titleEn: '    5. Emotional Stability Dimension', page: 9 },
        { titleZh: 'III. 职业推荐', titleEn: 'III. Career Recommendations', page: 10 },
        { titleZh: 'IV. 综合指数分析', titleEn: 'IV. Comprehensive Indices Analysis', page: 11 },
        { titleZh: 'V. 30天发展计划', titleEn: 'V. 30-Day Development Plan', page: 14 },
        { titleZh: 'VI. 资源和下一步', titleEn: 'VI. Resources & Next Steps', page: 17 }
      ];

      toc.forEach(item => {
        const y = doc.y;
        
        // 中文标题
        doc.font('Chinese').fontSize(11).fillColor(colors.text)
          .text(item.titleZh, 50, y, { width: 200, continued: false });
        
        // 英文标题（较小字体）
        doc.font('Chinese').fontSize(9).fillColor(colors.lightText)
          .text(item.titleEn, 260, y, { width: 200, continued: false });
        
        // 点线
        const dotsStart = 470;
        const dotsEnd = 510;
        let x = dotsStart;
        while (x < dotsEnd) {
          doc.fontSize(8).fillColor(colors.lightText)
            .text('.', x, y, { continued: false });
          x += 6;
        }
        
        // 页码
        doc.fontSize(10).fillColor(colors.text)
          .text(item.page.toString(), 515, y, { width: 30, align: 'right' });
        
        doc.moveDown(1.2);
      });

      // ============ 人格概览 ============
      newPage();
      addSectionHeader('Your Personality Overview / 您的人格概览');

      const traits = [
        { key: 'openness', zh: '开放性', en: 'Openness' },
        { key: 'conscientiousness', zh: '尽责性', en: 'Conscientiousness' },
        { key: 'extraversion', zh: '外向性', en: 'Extraversion' },
        { key: 'agreeableness', zh: '宜人性', en: 'Agreeableness' },
        { key: 'neuroticism', zh: '神经质', en: 'Neuroticism' }
      ];

      const scores = traits.map(t => (userData.scores && userData.scores[t.key]) || 50);

      doc.font('Chinese').fontSize(12).fillColor(colors.text)
        .text('以下是您的 Big Five 人格维度得分概览，每个维度反映了您在该特质上的倾向程度。', 
              { align: 'left', lineGap: 4 });
      doc.moveDown(2);

      traits.forEach((trait, i) => {
        const score = (userData.scores && userData.scores[trait.key]) || 0;
        const segment = getContentSegment(trait.key, score);
        
        doc.font('ChineseBold').fontSize(13).fillColor(colors.text)
          .text(`${trait.zh} (${trait.en})`, 50);
        doc.font('Chinese').fontSize(10).fillColor(colors.lightText)
          .text(`${score}分 - ${segment?.title || ''}`, 50);
        doc.moveDown(0.5);

        const barX = 50, barY = doc.y, barW = 400, barH = 14;
        const filledW = (barW * score) / 100;

        doc.rect(barX, barY, barW, barH).strokeColor(colors.border).stroke();
        doc.rect(barX, barY, filledW, barH).fillColor(colors.secondary).fill();
        
        doc.moveDown(2);
      });

      // ============ OCEAN 五维度页面 ============
      newPage();
      addSectionHeader('OCEAN Five Dimensions / OCEAN 五维度');
      
      doc.font('Chinese').fontSize(12).fillColor(colors.text)
        .text('以下部分提供每个维度的详细分析，包括您的特质、行为表现、AI时代优势和发展建议。', 
              { align: 'left', lineGap: 4 });
      doc.moveDown(2);

      const dimensionColors = [colors.orange, colors.yellow, colors.secondary, colors.yellow, colors.orange];
      const dimensionData = [
        { zh: '开放性', en: 'Openness', desc: '对新体验和新想法的接纳程度' },
        { zh: '尽责性', en: 'Conscientiousness', desc: '组织能力和目标导向程度' },
        { zh: '外向性', en: 'Extraversion', desc: '从外部互动中获取能量的程度' },
        { zh: '宜人性', en: 'Agreeableness', desc: '合作态度和共情水平' },
        { zh: '情绪稳定性', en: 'Emotional Stability', desc: '情绪调节和压力韧性' }
      ];

      dimensionData.forEach((dim, i) => {
        const boxY = doc.y;
        const boxH = 60;
        
        doc.roundedRect(50, boxY, 495, boxH, 8)
          .fillColor(dimensionColors[i])
          .fill();
        
        doc.font('ChineseBold').fontSize(14).fillColor('white')
          .text(dim.zh, 70, boxY + 15);
        doc.font('Chinese').fontSize(10).fillColor('white')
          .text(dim.en, 70, boxY + 35);
        
        doc.moveDown(4);
      });

      // ❌ 雷达图部分已删除 - 不兼容 Vercel 环境

      // ============ 详细维度分析 ============
      traits.forEach((trait) => {
        const score = (userData.scores && userData.scores[trait.key]) || 50;
        const dimension = CONTENT_LIBRARY.dimensions[trait.key];
        
        if (!dimension) return;

        const segment = getContentSegment(trait.key, score);
        if (!segment) return;

        newPage();
        
        doc.font('ChineseBold').fontSize(20).fillColor(colors.primary)
          .text(`${dimension.name} (${trait.en})`, { align: 'left' });
        doc.moveDown(0.3);
        
        doc.font('Chinese').fontSize(12).fillColor(colors.lightText)
          .text(`得分：${score}分 | 类型：${segment.title}`, { align: 'left' });
        doc.moveDown(0.5);
        
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y)
          .strokeColor(colors.secondary).lineWidth(2).stroke();
        doc.moveDown(2);

        doc.font('ChineseBold').fontSize(14).fillColor(colors.text)
          .text('核心特征 / Core Traits');
        doc.moveDown(0.5);
        doc.font('Chinese').fontSize(11).fillColor(colors.text)
          .text(segment.coreTraits, { align: 'justify', lineGap: 4 });
        doc.moveDown(2);

        doc.font('ChineseBold').fontSize(14).fillColor(colors.text)
          .text('具体行为表现 / Specific Behaviors');
        doc.moveDown(0.5);
        doc.font('Chinese').fontSize(11).fillColor(colors.text)
          .text(segment.specificBehaviors, { align: 'justify', lineGap: 4 });
        doc.moveDown(2);

        doc.font('ChineseBold').fontSize(14).fillColor(colors.text)
          .text('AI 时代优势 / AI Era Advantages');
        doc.moveDown(0.5);
        doc.font('Chinese').fontSize(11).fillColor(colors.text)
          .text(segment.aiAdvantages, { align: 'justify', lineGap: 4 });
        doc.moveDown(2);

        doc.font('ChineseBold').fontSize(14).fillColor(colors.text)
          .text('发展建议 / Development Tips');
        doc.moveDown(0.5);
        
        const tips = segment.developmentTips.split('\n').filter(tip => tip.trim());
        tips.forEach(tip => {
          doc.font('Chinese').fontSize(10).fillColor(colors.text)
            .text(`• ${tip.trim()}`, { indent: 10, lineGap: 3 });
        });
      });

      // ============ 职业推荐 ============
      newPage();
      addSectionHeader('职业推荐 / Career Recommendations', 
                       '基于您的 Big Five 人格特质，以下职业与您的优势高度契合：\nBased on your Big Five personality profile, these careers align highly with your strengths:');

      const careers = generateCareerRecommendations(userData.scores || {});
      
      careers.forEach((career, i) => {
        const boxY = doc.y;
        const boxH = 120;
        
        doc.roundedRect(50, boxY, 495, boxH, 8)
          .strokeColor(colors.border)
          .lineWidth(1)
          .stroke();
        
        doc.font('ChineseBold').fontSize(13).fillColor(colors.text)
          .text(`${i + 1}. ${career.title}`, 70, boxY + 15);
        
        doc.font('ChineseBold').fontSize(12).fillColor(colors.green)
          .text(`匹配度 / Match: ${career.match}%`, 430, boxY + 15);
        
        // 中文描述
        doc.font('Chinese').fontSize(10).fillColor(colors.text)
          .text(career.descriptionZh, 70, boxY + 40, { width: 460 });
        
        // 英文描述
        doc.font('Chinese').fontSize(9).fillColor(colors.lightText)
          .text(career.descriptionEn, 70, boxY + 58, { width: 460 });
        
        // AI影响（双语）
        doc.font('Chinese').fontSize(9).fillColor(colors.secondary)
          .text(`AI影响 / AI Impact: ${career.aiImpactZh}\n${career.aiImpactEn}`, 70, boxY + 78);
        
        doc.font('Chinese').fontSize(9).fillColor(colors.lightText)
          .text(`关键技能 / Key Skills: ${career.skills.join(', ')}`, 70, boxY + 98);
        
        doc.moveDown(8.5);
      });

      // ============ 添加衍生指数部分 ============
      newPage();
      addIndicesAnalysis();

      // ============ 30天发展计划 ============
      newPage();
      addSectionHeader('30天发展计划 / 30-Day Development Plan',
                       '基于您的人格特质定制的个性化成长计划：\nA personalized growth plan based on your personality profile:');

      const plan = generate30DayPlan(userData.scores || {});

      doc.font('Chinese').fontSize(11).fillColor(colors.lightText)
        .text('以下计划根据您的人格特质定制，每周聚焦不同主题。建议您：\nThis plan is customized based on your personality traits, focusing on different themes each week. We recommend you:', 
              { lineGap: 4 });
      doc.moveDown(0.5);
      doc.font('Chinese').fontSize(10).fillColor(colors.text)
        .text('• 每周选择2-3个与您最相关的目标\n  Select 2-3 goals most relevant to you each week', { indent: 20, lineGap: 2 });
      doc.text('• 使用日历或待办工具追踪进度\n  Use calendar or to-do tools to track progress', { indent: 20, lineGap: 2 });
      doc.text('• 灵活调整，重在持续实践而非完美执行\n  Adjust flexibly; focus on consistent practice rather than perfect execution', { indent: 20, lineGap: 2 });
      doc.moveDown(2);

      ['week1', 'week2', 'week3', 'week4'].forEach((week, index) => {
        const data = plan[week];
        if (!data) return;
        
        if (doc.y > 600) {
          newPage();
        }
        
        const boxY = doc.y;
        doc.roundedRect(50, boxY, 495, 38, 6)
          .fillColor(index % 2 === 0 ? colors.secondary : colors.orange)
          .fill();
        
        doc.font('ChineseBold').fontSize(13).fillColor('white')
          .text(data.title, 70, boxY + 12);
        
        doc.moveDown(3.2);
        
        if (data.goals && data.goals.length > 0) {
          data.goals.forEach((goal, i) => {
            if (doc.y > 680) newPage();
            
            doc.font('ChineseBold').fontSize(10).fillColor(colors.secondary)
              .text(`${i + 1}.`, 60, doc.y);
            
            doc.font('Chinese').fontSize(9.5).fillColor(colors.text)
              .text(goal, 80, doc.y, { 
                width: 450, 
                lineGap: 3,
                paragraphGap: 0
              });
            doc.moveDown(1);
          });
        }
        
        doc.moveDown(1.2);
      });

      doc.moveDown(1);
      const tipBoxY = doc.y;
      doc.roundedRect(50, tipBoxY, 495, 100, 8)
        .strokeColor(colors.orange)
        .lineWidth(2)
        .stroke();

      doc.font('ChineseBold').fontSize(12).fillColor(colors.orange)
        .text('💡 实践建议 / Practice Tips', 70, tipBoxY + 15);

      doc.font('Chinese').fontSize(9).fillColor(colors.text)
        .text('• 每晚睡前花5分钟回顾当天进展，庆祝小胜利\n  Spend 5 minutes before bed reviewing daily progress and celebrating small wins', 
              70, tipBoxY + 38, { width: 450, lineGap: 2 });
      doc.font('Chinese').fontSize(9).fillColor(colors.text)
        .text('• 使用AI助手（ChatGPT/Claude）作为每日反思伙伴\n  Use AI assistants (ChatGPT/Claude) as daily reflection partners', 
              70, tipBoxY + 62, { width: 450, lineGap: 2 });
      doc.font('Chinese').fontSize(9).fillColor(colors.text)
        .text('• 如遇困难，优先调整策略而非自我批评\n  When encountering difficulties, prioritize adjusting strategies over self-criticism', 
              70, tipBoxY + 82, { width: 450, lineGap: 2 });

      // ============ 资源和下一步 ============
      newPage();
      addSectionHeader('资源和下一步 / Resources & Next Steps',
                       '继续您的发展旅程，以下资源可以帮助您：\nContinue your development journey with these resources:');

      const resources = generateResources();

      doc.font('ChineseBold').fontSize(13).fillColor(colors.text)
        .text('📚 书籍推荐 / Recommended Books');
      doc.moveDown(0.5);
      resources.books.forEach(book => {
        doc.font('Chinese').fontSize(9.5).fillColor(colors.text)
          .text(`• ${book}`, { indent: 20, lineGap: 3 });
      });
      doc.moveDown(2);

      doc.font('ChineseBold').fontSize(13).fillColor(colors.text)
        .text('🎓 在线课程 / Online Courses');
      doc.moveDown(0.5);
      resources.courses.forEach(course => {
        doc.font('Chinese').fontSize(9.5).fillColor(colors.text)
          .text(`• ${course}`, { indent: 20, lineGap: 3 });
      });
      doc.moveDown(2);

      doc.font('ChineseBold').fontSize(13).fillColor(colors.text)
        .text('🤖 AI工具 / AI Tools');
      doc.moveDown(0.5);
      resources.aiTools.forEach(tool => {
        doc.font('Chinese').fontSize(9.5).fillColor(colors.text)
          .text(`• ${tool}`, { indent: 20, lineGap: 3 });
      });
      doc.moveDown(3);

      doc.font('ChineseBold').fontSize(11).fillColor(colors.orange)
        .text('💡 记住 / Remember:');
      doc.moveDown(0.5);
      doc.font('Chinese').fontSize(10).fillColor(colors.text)
        .text('您的个性是您的基础，而非限制。利用这些洞察来发挥优势并培养新能力。\nYour personality is your foundation, not your limitation. Use these insights to build on your strengths and develop new capabilities.', 
              { lineGap: 4 });

      // ============ 统一添加页码（在 doc.end() 之前） ============
      const pageCount = doc.bufferedPageRange().count;
      
      console.log(`📄 总页数: ${pageCount}`);
      console.log(`📄 开始添加页码...`);
      
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        console.log(`  -> 正在处理第 ${i + 1} 页`);
        doc.font('Chinese').fontSize(8).fillColor(colors.lightText)
          .text(`第 ${i + 1} 页 / Page ${i + 1}`, 50, 792 - 40, {
            width: 495,
            align: 'center'
          });
      }
      
      console.log(`✅ 页码添加完成`);

      doc.end();

      console.log(`✅ 已生成完整专业报告（无雷达图版本）: ${outputPath}`);
      resolve(outputPath);
      
    } catch (error) {
      console.error('❌ 生成报告失败:', error);
      reject(error);
    }
  });
}

module.exports = { generatePersonalityReport };