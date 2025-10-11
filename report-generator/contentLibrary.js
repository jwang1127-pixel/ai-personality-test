// Big Five (OCEAN) 内容库
// 完全基于Big Five理论，无MBTI版权风险

const CONTENT_LIBRARY = {
  dimensions: {
    openness: {
      name: "开放性",
      description: "你对新体验和新想法的接受程度",
      segments: {
        veryLow: {
          range: [0, 20],
          title: "传统务实型",
          coreTraits: "你偏好熟悉的日常惯例和成熟的方法。你重视实用性和具体成果，而非抽象思维。你在处理问题时更喜欢依赖已验证的解决方案，对新奇想法保持谨慎态度。你的思维方式注重现实和可操作性，擅长在明确的框架内工作。",
          specificBehaviors: "在工作中，你擅长执行经过验证的策略和标准操作流程。你偏好清晰的指示和经过测试的方法，在需要遵循既定规则的环境中表现出色。你对变化持保守态度，更倾向于渐进式改进而非激进创新。你在重复性任务和需要精确执行的工作中能够保持高效和稳定。",
          aiAdvantages: "你对可靠性的关注使你非常适合确保AI系统遵循既定协议并提供一致的结果。你能够有效地测试和验证AI输出的准确性，确保系统在实际应用中的稳定性。你的务实态度帮助团队关注AI解决方案的实际价值和可行性，避免过度追求技术新奇而忽视实用性。",
          developmentTips: "1. 每周尝试一项新体验，从小处开始，逐步扩大舒适区\n2. 阅读你专业领域之外的文章，培养跨领域思维\n3. 使用AI工具如Claude探索新观点和不同视角\n4. 参与跨职能项目，接触不同的工作方式和思维模式\n5. 与创新型同事建立搭档关系，学习他们的思考方式\n6. 设定每月的「创新实验日」，尝试新方法完成常规任务\n7. 记录新体验带来的积极成果，强化开放心态"
        },
        low: {
          range: [21, 40],
          title: "审慎创新型",
          coreTraits: "你在传统与选择性创新之间保持平衡。当新想法能证明其实用价值时，你愿意接纳。你不会盲目追求新奇，而是理性评估创新的可行性和收益。你的思维方式既稳重又不失灵活，能够在稳定性和创新性之间找到合适的平衡点。",
          specificBehaviors: "你在采纳新方法之前会仔细评估其风险和收益。你偏好渐进式改进而非激进变革，通过小步快跑的方式推进创新。你善于识别哪些传统方法值得保留，哪些领域需要创新突破。你在面对新技术或新流程时会进行充分的试点测试，确保其可行性后再推广应用。",
          aiAdvantages: "你能够在传统方法与AI创新之间架起桥梁，确保技术平稳落地。你的谨慎态度帮助组织避免盲目采用不成熟的AI技术，同时你的开放性又能让团队不错过真正有价值的创新机会。你擅长评估AI工具的实际效用，为组织做出明智的技术投资决策。",
          developmentTips: "1. 每月尝试一款新的AI工具，评估其实际价值\n2. 参加创新工作坊，学习结构化创新方法\n3. 每周挑战一个自己的假设，培养批判性思维\n4. 与创意型同事合作项目，学习他们的思维方式\n5. 建立「创新实验日志」，记录尝试新方法的过程和结果\n6. 阅读科技趋势报告，了解行业创新动向\n7. 为团队设立「安全创新区」，鼓励低风险实验"
        },
        moderate: {
          range: [41, 60],
          title: "平衡探索型",
          coreTraits: "你能很好地适应常规工作和新奇体验。你对拥抱哪些创新有选择性，既不排斥新事物，也不盲目追求变化。你的思维方式灵活且务实，能够根据具体情境在传统和创新之间切换。你理解稳定性和创新性各自的价值，懂得在适当的时候采用合适的方式。",
          specificBehaviors: "你在稳定性与创新之间保持平衡，懂得在适当的时候采用合适的方式。你能够在核心业务中维持稳定，在边缘领域探索创新。你善于评估何时应该坚持传统方法，何时应该尝试新途径。你在团队中常常扮演平衡者的角色，既支持创新又关注风险控制。",
          aiAdvantages: "你的灵活性让你既能利用AI推动创新，又能保持运营稳定。你能够识别哪些业务流程适合AI自动化，哪些领域需要保持人工判断。你的平衡视角帮助组织在AI转型中避免两个极端：过于保守错失机会，或过于激进引发混乱。你擅长设计渐进式的AI实施路线图。",
          developmentTips: "1. 在常规项目和探索性项目之间交替工作\n2. 使用AI进行创意头脑风暴，拓展思维边界\n3. 记录两种方法的学习心得，总结最佳实践\n4. 指导他人培养平衡思维，分享你的决策框架\n5. 定期评估你的平衡点，根据环境调整策略\n6. 建立「创新组合」，在不同风险级别的项目中分配精力\n7. 发展情境判断能力，提高在传统和创新间切换的效率"
        },
        high: {
          range: [61, 80],
          title: "创新驱动型",
          coreTraits: "你主动寻求新体验和新想法。你享受创造性思维和智力探索，对新概念、新技术和新方法充满好奇。你的思维活跃且富有想象力，常常能看到事物的多种可能性。你不满足于现状，持续寻求改进和创新的机会。你在面对复杂问题时能够跳出常规思维框架，提出创新性解决方案。",
          specificBehaviors: "你能产生新颖的解决方案并欣然接受变化。你在动态演变的环境中茁壮成长，享受探索未知领域的过程。你经常提出创新建议，推动团队尝试新方法。你善于连接不同领域的知识，产生跨界创新。你在头脑风暴会议中常常是想法的主要贡献者，能够激发团队的创造力。",
          aiAdvantages: "你能够开创新的AI应用领域，突破现有技术的界限。你的创新思维帮助团队发现AI的非传统用途，为业务创造独特价值。你善于实验新的AI工具和技术，快速评估其潜力。你的热情和远见能够激励团队拥抱AI带来的变革，推动组织的数字化转型。",
          developmentTips: "1. 平衡创意产出与执行能力，确保想法落地\n2. 将AI作为创意伙伴，用Claude等工具拓展思维\n3. 建立想法管理系统，筛选和优先级排序创新项目\n4. 制作原型来测试概念，快速验证可行性\n5. 与团队分享创新，培养组织创新文化\n6. 发展项目管理技能，提高创新执行成功率\n7. 学习设计思维方法，结构化创新过程\n8. 寻找执行型合作伙伴，互补能力"
        },
        veryHigh: {
          range: [81, 100],
          title: "远见先锋型",
          coreTraits: "你具有高度想象力和强烈的求知欲。你不断寻求新奇体验和非常规想法，对知识和新体验有着永不满足的渴望。你的思维极其活跃，能够快速吸收新信息并将其整合到你的认知框架中。你对抽象概念、哲学思考和未来趋势充满兴趣。你的创造力不仅体现在工作中，更渗透到生活的各个方面。",
          specificBehaviors: "你挑战传统，探索未知领域。你能看到别人忽视的可能性，常常提出突破性的创新想法。你热衷于学习新技能，跨越多个领域，成为多面手。你在面对复杂挑战时表现出色，能够从多个角度分析问题。你可能同时参与多个创新项目，享受智力上的刺激。你是组织中的思想领袖，推动变革和创新。",
          aiAdvantages: "你能够定义AI应用的未来，创造突破性创新。你的远见帮助组织提前布局新兴技术，在竞争中保持领先。你善于识别AI技术的长期趋势和潜在影响，为战略决策提供前瞻性洞察。你的创新精神和技术敏锐度使你成为AI时代的变革推动者，能够引领组织进行深度的数字化转型。",
          developmentTips: "1. 与执行型伙伴合作，确保创新想法落地实施\n2. 建立结构化的创新流程，提高成功率\n3. 使用AI扩展创意输出，如用Claude进行深度对话激发灵感\n4. 在探索与交付之间找平衡，避免过度分散精力\n5. 建立多元化创新团队，互补技能和视角\n6. 发展商业敏锐度，评估创新的市场价值\n7. 学习快速原型和迭代方法，加速想法验证\n8. 培养耐心，给创新项目足够的时间成熟\n9. 记录和分享学习过程，建立知识库\n10. 定期反思，确保创新方向与组织目标一致"
        }
      }
    },
    conscientiousness: {
      name: "尽责性",
      description: "你的组织能力和目标导向程度",
      segments: {
        veryLow: {
          range: [0, 20],
          title: "灵活自发型",
          coreTraits: "你在非结构化环境中茁壮成长，能轻松适应变化的环境。你偏好灵活性而非严格规划，享受随机应变的自由。你的工作方式自然流畅，不受严格时间表约束。你相信最好的创意和解决方案往往来自即兴和灵活应对，而非死板的计划。",
          specificBehaviors: "你偏好灵活性而非严格的时间表。你在跟随灵感工作时表现最佳，能够快速响应新机会和变化。你可能在最后关头完成任务，依靠压力激发创造力和效率。你对细节关注较少，更注重大局和整体方向。你在需要快速适应和灵活应对的环境中表现出色。",
          aiAdvantages: "你的适应能力让你能在AI揭示新洞察时快速调整方向。你不会被既定计划束缚，能够灵活地将AI工具整合到工作流程中。你的开放心态使你乐于尝试新的AI应用，快速发现其潜在价值。你能够在AI驱动的快速变化环境中保持敏捷和创新。",
          developmentTips: "1. 使用AI任务管理工具如Notion AI帮助组织工作\n2. 设定少而精的日常习惯，从小处建立结构\n3. 与组织型同事搭档，学习他们的规划方法\n4. 创建灵活框架而非严格时间表，保持适应性\n5. 定期清理积压任务，避免堆积过多\n6. 使用视觉化工具如看板管理任务\n7. 设置关键里程碑而非详细计划\n8. 建立「最小可行结构」，满足基本组织需求"
        },
        low: {
          range: [21, 40],
          title: "适度灵活型",
          coreTraits: "你在自发性与一定组织性之间保持平衡。你在必要时会制定计划，但不会过度拘泥于计划。你能够适应变化，同时也认识到某些结构的价值。你的工作方式介于完全自发和高度组织之间，根据情况灵活调整。",
          specificBehaviors: "你能遵循计划，但不会死守不变。你随着情况演变而调整策略，保持灵活性。你在某些领域保持组织性，在其他领域更加自由。你能够在需要时快速响应变化，也能在必要时坚持计划。你擅长在结构和灵活之间找到平衡点。",
          aiAdvantages: "你能基于实时数据快速调整AI策略。你的灵活性使你能够充分利用AI的预测和分析能力，同时不被算法束缚。你善于在AI建议和人类判断之间平衡，做出最优决策。你能够快速采纳有效的AI工具，同时淘汰不适用的。",
          developmentTips: "1. 使用AI自动化跟踪重要任务和截止日期\n2. 建立轻量级规划系统，避免过度复杂\n3. 安排灵活缓冲时间，应对意外变化\n4. 利用项目管理工具如Asana提高效率\n5. 定期回顾有效结构，强化好习惯\n6. 为不同类型任务设计不同组织方法\n7. 使用AI助手如Claude帮助优先级排序\n8. 建立「核心与灵活」系统：核心任务严格管理，其他灵活处理"
        },
        moderate: {
          range: [41, 60],
          title: "平衡规划型",
          coreTraits: "你将规划与灵活性结合。你组织关键领域的同时保持适应性。你理解计划的价值，也认识到过度规划的局限。你能够根据情况在结构化和灵活性之间切换，展现出成熟的项目管理能力。",
          specificBehaviors: "你进行战略规划但战术灵活调整。你在结构与自发之间保持平衡，既有长期目标又能适应短期变化。你善于设定优先级，专注于重要任务。你能够在保持组织性的同时不失灵活性，在计划和执行之间找到最佳平衡点。",
          aiAdvantages: "你能设计既可靠又能适应变化需求的AI系统。你的平衡视角帮助团队建立稳定的AI流程，同时保留改进和优化的空间。你善于使用AI进行战略规划，同时利用其实时分析能力进行战术调整。你能够有效整合AI工具到现有工作流程，提高整体效率。",
          developmentTips: "1. 用AI洞察优化规划过程，提高准确性\n2. 自动化例行组织工作，节省精力\n3. 为创意工作预留专门时间，保持创新\n4. 使用数据分析改进优先级决策\n5. 定期评估平衡点，根据反馈调整\n6. 建立「计划-执行-反思」循环\n7. 使用AI工具如Notion进行知识管理\n8. 培养预见性，提前规划但保留灵活性"
        },
        high: {
          range: [61, 80],
          title: "高度有序型",
          coreTraits: "你自律且目标导向。你擅长规划并系统化执行任务。你对自己和工作有高标准，持续追求卓越。你的组织能力强，能够有效管理多个项目和优先事项。你的可靠性和执行力使你成为团队中的重要支柱。",
          specificBehaviors: "你创建详细计划并一贯执行。你可靠地达成截止日期，很少延误。你善于分解大项目为可管理的小任务，系统化推进。你对细节关注，确保工作质量。你能够长期保持专注和纪律，不轻易被干扰。你在需要高度组织性和精确执行的工作中表现出色。",
          aiAdvantages: "你能构建稳健可靠的AI系统，配备出色的质量控制。你的系统化思维帮助团队建立完善的AI实施流程和监控机制。你善于使用AI工具优化工作流程，提高效率和准确性。你的纪律性确保AI项目按计划推进，达成预定目标。",
          developmentTips: "1. 在规划与敏捷性之间找平衡，避免过度僵化\n2. 使用AI优化流程但允许迭代改进\n3. 建立灵活性缓冲，应对意外变化\n4. 委托战术细节，专注战略方向\n5. 练习有计算的冒险，拓展舒适区\n6. 定期反思，避免为组织而组织\n7. 培养对他人灵活工作方式的包容\n8. 使用AI分析数据，而非过度依赖直觉\n9. 学习「足够好」原则，避免完美主义陷阱"
        },
        veryHigh: {
          range: [81, 100],
          title: "卓越纪律型",
          coreTraits: "你拥有高度自律和卓越的组织能力。你以坚定不移的专注追求目标，展现出非凡的执行力。你对自己和工作有极高标准，持续追求完美。你的时间管理和任务规划能力堪称典范，能够高效管理复杂的项目组合。你的可靠性和专业性使你成为组织中不可或缺的人才。",
          specificBehaviors: "你保持精细的系统和高标准。你在复杂项目管理中表现出色，能够协调多个利益相关方和依赖关系。你对细节的关注接近完美，很少出错。你能够长期保持高度专注和效率，在压力下依然保持组织性。你是团队中的榜样，用行动展示卓越的工作标准。",
          aiAdvantages: "你能精准可靠地编排复杂的AI实施项目。你的系统化方法确保AI系统的稳定性和可维护性。你善于建立完善的AI治理框架，包括质量控制、风险管理和合规监督。你的纪律性和远见使你能够成功领导大规模的AI转型项目，确保按时按质交付。",
          developmentTips: "1. 在完美与迭代之间找平衡，避免分析瘫痪\n2. 将AI用于日常任务自动化，节省精力用于战略工作\n3. 允许创意混乱，为创新留出空间\n4. 构建灵活框架而非刚性规则\n5. 赋予团队自主权，避免微观管理\n6. 培养对不确定性的容忍度\n7. 学习「足够好」和「卓越」的区别\n8. 使用AI进行预测和场景规划，减少过度规划\n9. 定期反思，确保组织性服务于目标而非自我目的\n10. 培养同理心，理解他人不同的工作风格"
        }
      }
    },
    extraversion: {
      name: "外向性",
      description: "你如何从外部互动中获取能量",
      segments: {
        veryLow: {
          range: [0, 20],
          title: "深度内向型",
          coreTraits: "你从独处和内在反思中获得能量。你在需要深度专注的独立工作中表现卓越。你偏好安静的环境，享受独处时间。你的思维深刻，善于内省和深度思考。你在独自工作时能够达到最高的创造力和生产力水平。社交互动虽然必要，但会消耗你的能量。",
          specificBehaviors: "你偏好一对一交谈而非群体环境。你在发言前会深入思考，发言时往往言简意赅但有深度。你可能在大型社交场合感到不适，更喜欢小规模的深度交流。你需要独处时间来充电和恢复精力。你在书面沟通中可能比口头沟通更有优势，能够更好地表达复杂想法。",
          aiAdvantages: "你的深度专注使你能够掌握复杂的AI系统和算法。你善于进行深入的技术分析和问题解决。你能够长时间专注于AI开发和优化工作，产出高质量成果。你的思考深度使你能够预见AI系统的潜在问题和改进机会。你可以将AI作为思考伙伴，进行深度对话和探索。",
          developmentTips: "1. 保护能量恢复时间，在日程中安排独处时段\n2. 利用深度工作优势，安排需要高度专注的任务\n3. 发挥书面沟通优势，用邮件和文档清晰表达想法\n4. 逐步扩展舒适区，从小规模社交开始\n5. 将AI作为思考伙伴，用Claude进行深度对话\n6. 准备社交场合的话题和问题，减少即兴压力\n7. 寻找同样内向的合作伙伴，建立深度连接\n8. 使用在线协作工具，减少面对面会议需求"
        },
        low: {
          range: [21, 40],
          title: "适度内向型",
          coreTraits: "你倾向内向，但必要时能够进行社交互动。你需要安静时间来充电，但也能享受有意义的社交。你在人际互动中较为谨慎，偏好深度而非广度。你能够在需要时表现出外向行为，但这会消耗你的能量，需要后续恢复。",
          specificBehaviors: "你在小团体中感到自在，享受深入讨论。大型活动会让你精疲力竭，需要事后的独处时间恢复。你可能在熟悉的环境中更加开放，在陌生环境中较为保守。你善于倾听，能够建立有意义的一对一关系。你的社交圈可能不大，但关系深厚。",
          aiAdvantages: "你能够很好地与AI工具协作，将其视为工作伙伴而非单纯的工具。你的深度思考能力使你能够充分利用AI的分析能力，产出高质量见解。你能够在独立工作和必要协作之间找到平衡，高效完成项目。你善于通过书面形式分享AI分析结果，清晰传达复杂信息。",
          developmentTips: "1. 优化工作环境，创造适合深度工作的空间\n2. 战略性安排社交互动，在精力充沛时参与\n3. 利用书面沟通优势，减少即兴发言压力\n4. 建立支持性关系，寻找理解你需求的同事\n5. 使用AI助手帮助准备会议和演讲\n6. 发展在线影响力，利用书面形式建立专业声誉\n7. 设定社交边界，学会礼貌地拒绝不必要的邀请\n8. 培养一项可以独立进行的专业技能"
        },
        moderate: {
          range: [41, 60],
          title: "灵活社交型",
          coreTraits: "你在社交能量和独处之间保持有效平衡。你能够根据情境调整风格，在需要时表现外向，也能享受独处时光。你是真正的「双面人格」，能够在不同社交环境中切换自如。你不会被社交或独处中的任何一种过度消耗。",
          specificBehaviors: "你在工作模式上具有灵活性，既能舒适地协作也能独立工作。你能够在团队会议中积极参与，也能在独立工作时保持高效。你的社交网络中等规模，包括各种深浅不一的关系。你能够根据任务需求和个人状态灵活调整工作方式。",
          aiAdvantages: "你能够在团队协作和独立AI分析工作之间无缝切换。你既能与团队有效沟通AI项目进展，也能独立深入研究技术细节。你善于翻译技术概念，在技术专家和业务团队之间架桥。你的灵活性使你成为AI项目中的多面手，能够适应各种角色需求。",
          developmentTips: "1. 监控能量水平，根据状态安排任务\n2. 根据任务类型优化工作方式：协作或独立\n3. 发展桥接角色，连接不同类型的团队成员\n4. 保持协作与专注工作的平衡\n5. 灵活使用AI工具，适应不同工作场景\n6. 培养情境判断能力，快速评估何时需要何种模式\n7. 建立多样化的工作节奏，避免单一模式疲劳\n8. 帮助他人理解灵活工作方式的价值"
        },
        high: {
          range: [61, 80],
          title: "适度外向型",
          coreTraits: "你从社交互动中获得能量，在协作环境中茁壮成长。你享受与他人交流想法，通过对话激发创造力。你在团队环境中表现出色，能够有效地与各种人建立联系。你的热情和积极态度感染周围的人，营造积极的工作氛围。",
specificBehaviors: "你在会议中积极参与，享受头脑风暴。你自然地建立广泛网络，善于与不同背景的人沟通。你倾向于通过讨论来思考问题，外部对话帮助你理清思路。你在需要团队协作和人际互动的项目中表现突出。你可能担任团队中的沟通协调角色，促进信息流通。",
aiAdvantages: "你能够推广AI采用，为创新建立组织支持。你的沟通能力使你能够有效地向不同受众解释AI的价值和应用。你善于组织AI相关的培训和研讨会，推动技术普及。你能够快速识别AI项目的利益相关者并建立支持联盟。你的热情帮助团队克服对新技术的抵触情绪。",
developmentTips: "1. 平衡互动与深度工作，为专注任务安排独立时间\n2. 练习积极倾听，确保沟通是双向的\n3. 安排独立思考时间，深化想法和见解\n4. 使用AI提高效率，节省时间用于更多人际互动\n5. 战略性扩展影响力，建立有意义的专业网络\n6. 发展演讲和呈现技能，放大影响力\n7. 学习书面沟通，触及更广泛受众\n8. 培养深度一对一关系，超越表面社交"
},
veryHigh: {
range: [81, 100],
title: "高度外向型",
coreTraits: "你在社交互动中蓬勃发展，能够激发团队活力。你通过讨论来处理信息，外部互动是你思考的重要部分。你的能量和热情具有感染力，能够激励和动员团队。你在高度社交化的环境中达到最佳状态，享受成为关注中心。你的人际网络广泛，跨越多个领域和层级。",
specificBehaviors: "你是会议中的催化剂，天生的社交网络达人。你建立广泛的专业关系网，跨越组织边界。你通过与人交谈来思考和解决问题，外部对话激发你的最佳想法。你可能同时参与多个社交和专业团体。你在需要高度人际互动的角色中表现卓越，如销售、咨询、培训等。",
aiAdvantages: "你的沟通技能使你成为AI翻译角色的理想人选，连接技术和业务团队。你能够有效地推广AI创新，建立跨部门支持。你善于识别和连接AI项目的关键人物，构建成功的协作网络。你的热情和说服力帮助组织克服AI采用的障碍。你能够将技术愿景转化为激动人心的叙事，赢得领导层支持。",
developmentTips: "1. 发展专注工作能力，为深度任务创造条件\n2. 在广度和深度之间平衡，避免关系过于表面\n3. 提升倾听技能，给他人更多空间表达\n4. 练习独立反思，深化思考和决策质量\n5. 将AI用作效率倍增器，自动化重复任务\n6. 培养书面沟通能力，扩大影响范围\n7. 学习尊重内向者的需求，调整沟通方式\n8. 定期独处，避免过度社交导致的疲劳\n9. 发展深度专业知识，超越社交优势\n10. 使用AI工具管理和维护广泛的人际网络"
}
}
},
agreeableness: {
name: "宜人性",
description: "你的合作态度和共情水平",
segments: {
veryLow: {
range: [0, 20],
title: "高度独立型",
coreTraits: "你优先考虑逻辑而非和谐，重视直接沟通。你对冲突感到自在，不会为了维护关系而妥协原则。你的决策基于客观分析而非人际考虑。你重视诚实和效率，即使这可能导致人际摩擦。你相信最好的结果来自坦诚的讨论和理性的辩论。",
specificBehaviors: "你严格质疑想法，做出客观决策。你专注于结果而非关系维护，可能被视为强硬或不妥协。你在需要做出艰难决策或提供批判性反馈时表现出色。你不会因为顾及他人感受而回避必要的冲突。你可能在竞争性环境中表现更好，擅长在利益冲突中维护立场。",
aiAdvantages: "你能够做出艰难的AI治理决策，批判性评估系统性能。你不会因为团队关系而妥协AI系统的质量标准。你善于识别和指出AI项目中的问题，即使这不受欢迎。你的客观性确保AI决策基于数据和逻辑，而非政治考虑。你能够在AI伦理问题上坚持原则立场。",
developmentTips: "1. 练习共情沟通，理解他人情感需求\n2. 平衡批评与鼓励，认可他人贡献\n3. 逐步建立信任，展示你的可靠性\n4. 识别情感动态，提高情商\n5. 使用AI分析人际模式，理解不同沟通风格\n6. 学习外交语言，在坚持立场时减少冲突\n7. 培养团队建设技能，平衡任务和关系\n8. 寻求反馈，了解你的风格如何影响他人"
},
low: {
range: [21, 40],
title: "适度独立型",
coreTraits: "你在直率与外交之间保持平衡。你能够坚定但不苛刻，认识到关系的价值但不会为此牺牲原则。你的决策综合考虑逻辑和人际因素。你能够在必要时提出异议，但会选择合适的方式表达。",
specificBehaviors: "你直截了当但不苛刻。你能够在竞争和合作之间灵活切换，根据情境调整方法。你会挑战想法但尊重人，批评问题但不攻击个人。你能够在必要时强硬，在适当时妥协。你的方法是实用主义的，追求最佳结果而非个人胜利。",
aiAdvantages: "你对AI系统提供诚实反馈的同时维护团队关系。你能够在质量标准和团队和谐之间找到平衡。你善于以建设性方式提出AI项目的改进建议。你的直率确保问题被及时发现，你的外交技巧确保解决方案被团队接受。",
developmentTips: "1. 增强协作技能，学习团队动力学\n2. 更多表达感激，认可他人贡献\n3. 主动考虑他人视角，培养同理心\n4. 寻找双赢解决方案，超越零和思维\n5. 使用AI分析不同立场，找到共同点\n6. 发展谈判技能，在坚持和妥协间平衡\n7. 建立信任关系，为坦诚沟通创造基础\n8. 学习积极倾听，真正理解他人需求"
},
moderate: {
range: [41, 60],
title: "平衡协作型",
coreTraits: "你在自身利益与合作之间保持平衡。你在需要时善于外交，在适当时直接。你能够根据情境调整合作程度，既能坚持立场也能寻求共识。你理解合作的价值，也认识到有时需要坚持原则。",
specificBehaviors: "你有效地在竞争优先事项之间导航。你既能支持他人，也能提出挑战。你在团队中扮演平衡者角色，促进建设性讨论。你能够调解冲突，找到各方都能接受的解决方案。你善于建立联盟，同时保持独立判断。",
aiAdvantages: "你能够调解AI实施挑战，平衡技术需求与人性需求。你在AI项目中促进跨职能协作，弥合不同团队的分歧。你善于将AI的技术能力转化为对各方都有价值的解决方案。你的平衡视角帮助团队避免极端，找到可持续的AI策略。",
developmentTips: "1. 利用情境意识，提高判断何时合作何时坚持的能力\n2. 发展冲突解决技能，成为团队的和平使者\n3. 建立多元联盟，连接不同观点的人\n4. 使用AI获得客观洞察，超越个人偏见\n5. 记录成功的平衡案例，总结最佳实践\n6. 培养文化敏感度，理解不同背景的协作风格\n7. 发展促进技能，引导团队达成共识\n8. 学习原则性谈判，寻找创造性解决方案"
},
high: {
range: [61, 80],
title: "高度合作型",
coreTraits: "你重视和谐与协作。你富有同理心，体贴他人需求。你倾向于寻求共识，避免冲突。你在建立信任和维护关系方面表现出色。你的合作精神使你成为团队中受欢迎的成员。你相信通过协作能够达成更好的结果。",
specificBehaviors: "你建立牢固的关系，外交地解决冲突。你是值得信赖的团队成员，可靠且支持他人。你善于倾听和理解不同观点，促进包容性讨论。你可能在需要坚持不受欢迎立场时感到挑战。你在协作和团队建设活动中表现突出。",
aiAdvantages: "你确保AI实施考虑人的影响，建立组织支持。你的同理心帮助团队理解AI对不同群体的影响。你善于建立跨部门的AI项目支持网络。你的协作精神促进AI知识的共享和团队学习。你能够缓解AI变革带来的焦虑，帮助团队平稳过渡。",
developmentTips: "1. 练习果断性，在必要时坚持立场\n2. 平衡他人需求与自己需求，避免过度妥协\n3. 提供诚实反馈，即使可能引起不适\n4. 设定清晰界限，学会说不\n5. 使用AI进行客观分析，支持艰难决策\n6. 发展自我主张技能，有效表达自己的需求\n7. 认识到建设性冲突的价值\n8. 培养情绪韧性，面对他人不满时保持镇定"
},
veryHigh: {
range: [81, 100],
title: "卓越协作型",
coreTraits: "你高度共情和利他。你优先考虑他人福祉和群体和谐。你天生的善良和体贴使你成为团队的情感支柱。你对他人的需求高度敏感，常常将他人利益置于自己之上。你相信善意和协作能够解决大多数问题。",
specificBehaviors: "你是团队的和事佬和值得信赖的倾听者。你创造积极、支持性的环境，促进心理安全感。你主动帮助他人，即使这会增加你的负担。你在调解冲突和建立共识方面表现卓越。你可能难以提供负面反馈或做出可能伤害他人的决策。",
aiAdvantages: "你能够倡导AI的道德使用，确保技术服务于人类价值观。你的同理心使你能够识别AI系统可能对弱势群体的负面影响。你善于建立包容性的AI开发流程，确保多元声音被听到。你的协作精神促进负责任AI的跨部门合作。你能够赢得利益相关者的信任，推动AI伦理标准的采纳。",
developmentTips: "1. 在给予与自我照顾之间找平衡，避免倦怠\n2. 练习健康界限，学会优先考虑自己的需求\n3. 建设性地表达不同意见，不要总是妥协\n4. 使用客观标准做决策，而非仅凭情感\n5. 利用AI确保公平性，避免个人偏见\n6. 认识到有时「善意的残忍」比回避更有帮助\n7. 发展自我主张技能，有效维护自己的权益\n8. 培养情绪边界，不要过度承担他人的情绪负担\n9. 学习区分帮助和过度帮助\n10. 寻求互惠关系，避免单向付出"
}
}
},
neuroticism: {
name: "情绪稳定性",
description: "你的情绪调节能力和压力韧性",
segments: {
veryLow: {
range: [0, 20],
title: "高度敏感型",
coreTraits: "你深刻体验情绪，对压力反应强烈。你具有情感意识和同理心，能够敏锐地察觉他人的情绪变化。你的情绪世界丰富而复杂，对环境刺激高度敏感。你可能容易被负面事件影响，需要更多时间从挫折中恢复。你的敏感性既是挑战也是礼物。",
specificBehaviors: "你需要情绪处理时间和支持性环境。你注意到细微情绪线索，能够深度理解他人感受。你可能在高压环境中感到不堪重负，需要定期休息和恢复。你对批评较为敏感，可能需要更多的正面反馈和鼓励。你在情绪安全的环境中表现最佳。",
aiAdvantages: "你的敏感性帮助识别AI系统的人性影响和情感智能需求。你能够预见AI可能对用户情绪的影响，设计更人性化的体验。你的同理心使你成为AI伦理讨论的重要声音，确保技术考虑人类情感需求。你善于评估AI对工作场所心理健康的影响。",
developmentTips: "1. 建立压力管理工具包，包括冥想、运动、创意表达\n2. 每日练习正念，提高情绪觉察和调节能力\n3. 创建支持性环境，在工作和生活中建立安全空间\n4. 使用AI进行情绪追踪，识别触发因素和模式\n5. 寻求专业支持，如心理咨询或教练\n6. 培养韧性技能，学习从挫折中恢复\n7. 建立健康边界，保护自己免受过度刺激\n8. 发展自我同情，温和对待自己的情绪反应\n9. 寻找情绪健康的榜样，学习有效的应对策略\n10. 将敏感性视为优势，利用它建立深度连接"
},
low: {
range: [21, 40],
title: "适度敏感型",
coreTraits: "你体验正常的情绪反应，但可能被重大压力影响。你能够在大多数情况下保持情绪平衡，但在高强度时期可能感到挑战。你的情绪恢复能力正常，通常能够从挫折中反弹，虽然可能需要一些时间。你认识到情绪管理的重要性，正在发展相关技能。",
specificBehaviors: "你能很好地管理大多数情况，但在高强度时期后需要恢复。你可能在面对多重压力时感到不堪重负，需要主动管理压力源。你对批评有一定敏感度，但能够理性处理。你在支持性环境中表现更好，压力过大时可能需要额外支持。",
aiAdvantages: "你在AI项目管理中平衡情感意识与分析思维。你能够识别团队成员在AI转型中的情绪需求，同时保持项目焦点。你的适度敏感性使你成为团队中的情感温度计，帮助领导者理解团队状态。你善于在AI实施的技术要求和人性考虑之间找到平衡。",
developmentTips: "1. 发展应对策略，建立个人压力管理系统\n2. 建立韧性实践，如定期运动、社交支持、充足睡眠\n3. 寻求支持性关系，在工作和生活中建立支持网络\n4. 使用AI进行模式识别，了解你的压力触发因素\n5. 定期评估压力水平，采取预防性措施\n6. 学习认知重构技术，改变对压力事件的解读\n7. 培养情绪调节技能，如深呼吸、渐进放松\n8. 建立工作生活平衡，为恢复留出充足时间"
},
moderate: {
range: [41, 60],
title: "平衡稳定型",
coreTraits: "你有良好的情绪调节能力和正常的压力反应。你能够合理恢复，在大多数情况下保持平衡。你的情绪韧性使你能够应对工作和生活中的常见压力源。你认识到何时需要支持，并能够主动寻求帮助。你的情绪稳定性为你的专业表现提供了坚实基础。",
specificBehaviors: "你平静地处理大多数挑战，但知道何时需要支持。你能够在压力下保持表现，虽然可能不是你的最佳状态。你从挫折中恢复的速度合理，能够从经验中学习。你能够管理多个压力源，虽然可能需要有意识的努力。你在正常工作压力下表现稳定。",
aiAdvantages: "你在AI实施的压力下保持稳定表现。你能够在AI项目的不确定性中保持镇定，为团队提供情绪稳定的锚点。你的平衡情绪使你能够在AI转型的高压环境中做出理性决策。你善于评估AI项目中的风险，既不过度焦虑也不过于乐观。",
developmentTips: "1. 继续建立韧性，通过定期实践强化应对能力\n2. 维持健康实践，保持运动、营养、睡眠的良好习惯\n3. 利用支持系统，在需要时不犹豫寻求帮助\n4. 使用AI进行工作负载管理，优化时间和精力分配\n5. 定期反思和调整，评估什么有效什么需要改进\n6. 培养压力预防意识，在问题变严重前采取行动\n7. 发展领导力技能，帮助他人管理压力\n8. 保持学习心态，不断提升情绪智能"
},
high: {
range: [61, 80],
title: "高度稳定型",
coreTraits: "你情绪韧性强，能很好地处理压力。你在挑战中保持镇定，展现出色的情绪调节能力。你很少被压力事件困扰，能够快速恢复平衡。你的情绪稳定性使你成为团队在困难时期的支柱。你能够在压力下保持清晰思考和有效行动。",
specificBehaviors: "你是危机中的冷静存在。你快速从挫折中恢复，保持积极和建设性态度。你能够在高压环境中保持高水平表现，甚至可能在挑战中更加兴奋。你对批评的反应理性，能够客观评估反馈。你的稳定性使他人感到安心和信任。",
aiAdvantages: "你能够领导AI项目度过不确定性，管理高风险实施。你的情绪稳定性使你能够在AI转型的动荡中为团队提供方向和信心。你善于处理AI项目中的意外挫折，保持团队士气和专注。你能够在AI相关的高压决策中保持清晰判断。",
developmentTips: "1. 支持他人的情绪需求，利用你的稳定性帮助同事\n2. 避免情感疏离，保持与自己和他人情绪的连接\n3. 练习脆弱性，分享你的挑战和不确定性\n4. 建立共情技能，更深入理解他人的情绪体验\n5. 使用AI进行人员分析，更好地支持团队成员\n6. 认识到不是每个人都有你的韧性，调整期望\n7. 主动表达情绪，避免被视为冷漠或不关心\n8. 培养情绪智能，超越情绪稳定性"
},
veryHigh: {
range: [81, 100],
title: "卓越稳定型",
coreTraits: "你拥有卓越的情绪稳定性和压力韧性。你在压力下毫不动摇，展现出非凡的情绪控制力。你很少经历焦虑或负面情绪，即使在极端压力下也能保持冷静。你的情绪稳定性是你最大的优势之一，使你能够在最具挑战性的环境中表现出色。",
specificBehaviors: "你是风暴中的磐石。你在危机中保持视角和清晰决策，为团队提供稳定的领导。你对压力的反应极其理性，几乎不会被情绪淹没。你快速从任何挫折中反弹，保持前进动力。你的稳定性可能使你成为组织中处理高压项目和危机的首选人物。",
aiAdvantages: "你能够管理关键AI系统，在极端压力下做出明智决策。你的卓越稳定性使你能够领导高风险的AI创新项目，在不确定性中保持战略清晰。你善于在AI相关危机中保持冷静，做出关键决策。你能够承受AI转型带来的巨大压力，同时支持团队保持信心。",
developmentTips: "1. 保持情感连接，不要让稳定性变成情感疏离\n2. 承认他人的压力，即使你不亲身体验也要表示理解\n3. 分享你的镇定策略，帮助他人发展韧性\n4. 示范健康情绪反应，展示如何表达和处理情绪\n5. 使用AI进行风险评估，支持你的直觉判断\n6. 培养深度共情，理解他人的情绪体验\n7. 认识到你的稳定性可能使你低估他人的挑战\n8. 主动表达脆弱性，建立真实的人际连接\n9. 支持组织的情绪健康计划，利用你的稳定性帮助系统\n10. 保持自我觉察，确保稳定性不会变成压抑情绪"
}
}
}
}
};
function getContentSegment(dimension, score) {
const dim = CONTENT_LIBRARY.dimensions[dimension];
if (!dim) return null;
for (const [key, segment] of Object.entries(dim.segments)) {
if (score >= segment.range[0] && score <= segment.range[1]) {
return segment;
}
}
return dim.segments.moderate || null;
}
// ==================== 衍生指数内容 ====================
// ==================== 衍生指数内容（双语版） ====================
const DERIVED_INDICES = {
  human_value: {
    name: "Human Value Index",
    nameZh: "人类价值指数",
    icon: "🌍",
    description: "Measures your focus on human welfare, social responsibility, and ethical values",
    descriptionZh: "衡量您对人类福祉、社会责任和道德价值的关注程度",
    
    interpretations: {
      veryLow: {
        range: [0, 40],
        title: "Task-Focused Pragmatist",
        titleZh: "任务导向的实用主义者",
        description: "You prioritize practical outcomes and objective analysis over emotional considerations. This analytical approach is valuable in technical and strategic roles.",
        descriptionZh: "您优先考虑实际成果和客观分析，而非情感因素。这种分析方法在技术和战略角色中非常有价值。",
        strengths: "Objective decision-making, rational analysis, efficiency-focused",
        strengthsZh: "客观决策、理性分析、注重效率",
        development: "Practice perspective-taking, engage in community service, explore ethical frameworks",
        developmentZh: "练习换位思考、参与社区服务、探索道德框架"
      },
      moderate: {
        range: [41, 60],
        title: "Balanced Humanist",
        titleZh: "平衡的人文主义者",
        description: "You balance practical considerations with human welfare concerns. You can make decisions that consider both efficiency and people's wellbeing.",
        descriptionZh: "您平衡实际考量与人类福祉关切。您能够做出兼顾效率和人们幸福的决策。",
        strengths: "Pragmatic compassion, balanced decision-making, situational ethics",
        strengthsZh: "务实的同情心、平衡的决策、情境伦理",
        development: "Deepen empathy skills, volunteer regularly, study moral philosophy",
        developmentZh: "深化共情能力、定期志愿服务、学习道德哲学"
      },
      high: {
        range: [61, 100],
        title: "Values-Driven Leader",
        titleZh: "价值驱动型领导者",
        description: "You strongly prioritize human welfare and ethical considerations. You're driven by making positive social impact.",
        descriptionZh: "您强烈优先考虑人类福祉和道德考量。您的驱动力来自创造积极的社会影响。",
        strengths: "Strong ethics, social consciousness, inspiring leadership, community building",
        strengthsZh: "强烈的道德观、社会意识、鼓舞人心的领导力、社区建设能力",
        development: "Balance idealism with pragmatism, develop business acumen, manage compassion fatigue",
        developmentZh: "平衡理想主义与实用主义、培养商业敏锐度、管理同情心疲劳"
      }
    }
  },

  life_integration: {
    name: "Life Integration Index",
    nameZh: "生活整合指数",
    icon: "⚖️",
    description: "Measures your ability to balance work-life demands and maintain overall wellbeing",
    descriptionZh: "衡量您平衡工作与生活需求、保持整体幸福感的能力",
    
    interpretations: {
      veryLow: {
        range: [0, 40],
        title: "Work-Intensive Focus",
        titleZh: "工作密集型专注者",
        description: "You may struggle with work-life balance, potentially prioritizing one domain heavily. This is common during career-building phases but requires attention.",
        descriptionZh: "您可能在工作与生活平衡方面遇到困难，可能过度优先某一领域。这在职业建设阶段很常见，但需要关注。",
        strengths: "High dedication, intense focus capability, achievement-driven",
        strengthsZh: "高度投入、强大的专注能力、成就驱动",
        development: "Set boundaries, schedule personal time, practice stress management, seek support",
        developmentZh: "设定边界、安排个人时间、练习压力管理、寻求支持"
      },
      moderate: {
        range: [41, 60],
        title: "Active Balancer",
        titleZh: "积极的平衡者",
        description: "You're working on balancing multiple life domains with moderate success. You recognize the importance but face normal challenges.",
        descriptionZh: "您正在努力平衡多个生活领域，取得适度成功。您认识到其重要性，但面临正常的挑战。",
        strengths: "Awareness of balance needs, adaptive strategies, resilience-building",
        strengthsZh: "平衡意识、适应性策略、韧性建设",
        development: "Refine time management, delegate effectively, maintain self-care routines",
        developmentZh: "优化时间管理、有效授权、保持自我照顾习惯"
      },
      high: {
        range: [61, 100],
        title: "Integrated Achiever",
        titleZh: "整合型成就者",
        description: "You successfully integrate work and personal life, maintaining wellbeing across domains. You've developed sustainable patterns.",
        descriptionZh: "您成功整合工作和个人生活，在各个领域保持幸福感。您已建立可持续的模式。",
        strengths: "Excellent boundaries, holistic wellbeing, sustained performance, life satisfaction",
        strengthsZh: "出色的边界管理、整体幸福感、持续的表现、生活满意度",
        development: "Share strategies with others, mentor on integration, stay vigilant against burnout",
        developmentZh: "与他人分享策略、指导整合问题、保持警惕防止倦怠"
      }
    }
  },

  entrepreneurship: {
    name: "Entrepreneurship Potential",
    nameZh: "创业潜力指数",
    icon: "🚀",
    description: "Assesses your innovation capacity, risk-taking ability, and leadership potential",
    descriptionZh: "评估您的创新能力、风险承受能力和领导潜力",
    
    interpretations: {
      veryLow: {
        range: [0, 40],
        title: "Stability-Oriented Professional",
        titleZh: "稳定导向的专业人士",
        description: "You prefer structured environments with clear expectations. You excel in established organizations where processes are defined.",
        descriptionZh: "您偏好具有明确期望的结构化环境。您在流程明确的成熟组织中表现出色。",
        strengths: "Reliability, process excellence, risk mitigation, institutional knowledge",
        strengthsZh: "可靠性、流程卓越、风险缓解、机构知识",
        development: "Take calculated risks, lead small projects, develop business thinking, build networks",
        developmentZh: "承担经过计算的风险、领导小型项目、培养商业思维、建立人脉网络"
      },
      moderate: {
        range: [41, 60],
        title: "Adaptive Innovator",
        titleZh: "适应性创新者",
        description: "You have moderate entrepreneurial potential with capability for innovation within structure. You can lead initiatives with support.",
        descriptionZh: "您具有适度的创业潜力，能够在结构内进行创新。您可以在支持下领导项目。",
        strengths: "Balanced risk-taking, steady innovation, collaborative leadership, practical creativity",
        strengthsZh: "平衡的风险承担、稳定的创新、协作式领导、实用的创造力",
        development: "Lead larger projects, develop financial literacy, expand risk tolerance, build skills",
        developmentZh: "领导更大的项目、培养财务素养、扩展风险承受能力、构建技能"
      },
      high: {
        range: [61, 100],
        title: "Natural Entrepreneur",
        titleZh: "天生创业者",
        description: "You possess strong entrepreneurial qualities including innovation drive, risk tolerance, and leadership capacity. You thrive creating new ventures.",
        descriptionZh: "您具备强大的创业素质，包括创新驱动力、风险承受能力和领导能力。您在创造新事业方面表现出色。",
        strengths: "Visionary thinking, risk management, resilient leadership, opportunity recognition",
        strengthsZh: "富有远见的思维、风险管理、韧性领导力、机会识别",
        development: "Build execution discipline, develop team management, study business models, find mentors",
        developmentZh: "建立执行纪律、培养团队管理能力、学习商业模式、寻找导师"
      }
    }
  }
};

// 计算衍生指数
function calculateDerivedIndices(scores) {
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
      (scores.agreeableness * -0.05)
    )
  };
}

// 获取指数解释
function getIndexInterpretation(indexKey, score) {
  const index = DERIVED_INDICES[indexKey];
  if (!index) return null;

  let interpretation;
  
  // 根据分数选择对应的解读
  for (const key in index.interpretations) {
    const interp = index.interpretations[key];
    if (score >= interp.range[0] && score <= interp.range[1]) {
      interpretation = interp;
      break;
    }
  }

  if (!interpretation) {
    interpretation = index.interpretations.moderate;
  }

  return {
    title: interpretation.title,
    titleZh: interpretation.titleZh,
    description: interpretation.description,
    descriptionZh: interpretation.descriptionZh,
    strengths: interpretation.strengths,
    strengthsZh: interpretation.strengthsZh,
    development: interpretation.development,
    developmentZh: interpretation.developmentZh
  };
}
module.exports = { 
  CONTENT_LIBRARY, 
  DERIVED_INDICES,
  getContentSegment,
  calculateDerivedIndices,
  getIndexInterpretation
};