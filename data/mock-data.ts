import type { TreeNode, TreeData } from "../types/tree-table"

const createMockTree = (reportId: string, opportunities: string[], risks: string[]): TreeNode => ({
    "children": [
        {
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "description": "2021年定 向增发项目预计形成800G光模块产能15万只/年，为800G产品批量交付提供保障（文件中2021年定增项目预期产能）",
                                    "id": "mark-supply-800g-1",
                                    "level": 4,
                                    "name": "⭐800G 产能：15万只/年（2021年定增项目）",
                                    "type": "mark"
                                },
                                {
                                    "description": "公司已有1.6T的硅光解决方案和自研硅光芯片，为1.6T产品技术升级和成本控制提供支持（文件中公司1.6T产品介绍）",
                                    "id": "mark-supply-1.6t-1",
                                    "level": 4,
                                    "name": "⭐1.6T硅光解决 方案：自研硅光芯片",
                                    "type": "mark"
                                }
                            ],
                            "description": "- 技术储备：2020年率先推出800G产品，2023年推出1.6T产品，拥有自研硅光芯片能力，与Tower Semiconductor合作流片，布局LPO和CPO技术。\n- 产能布局：苏州、铜陵、泰国等生产基地，2021年定增 项目预计形成800G产能15万只/年，铜陵三期项目提升高端产品产能，2024年持续加大泰国产能资本开支。",
                            "id": "supply-800g-1.6t",
                            "level": 3,
                            "name": "800G/1.6T供给能力：技术领先+产能扩张",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "根据Lightcounting测算，数通市场高速光模块需求是主要增长动力，800G和1.6T市场规模预计2029年超160亿美元（文件中行业发展情况）",
                                    "id": "mark-demand-800g-1",
                                    "level": 5,
                                    "name": "⭐全球数通光模块市场规模：2023年62.5亿美元，2024-2029年CAGR 27%",
                                    "type": "mark"
                                },
                                {
                                    "description": "Factset一致预期显示，2025年微软、谷歌等四家云厂商资本 开支大幅增长，直接带动高速光模块采购需求（文件中行业发展数据）",
                                    "id": "mark-demand-1.6t-1",
                                    "level": 5,
                                    "name": "⭐北美云厂商资本开支：2025年预计达3055亿美元，同比增37%",
                                    "type": "mark"
                                }
                            ],
                            "description": "AI集群应用和云厂商DWDM网络升级推动 高速光模块需求，2024年Q4微软、Meta等四家云厂商资本支出同比提升69%，2025年预计增长37%至3055亿美元，直接拉动800G及1.6T产品需求。",
                            "id": "demand-800g-1.6t",
                            "level": 4,
                            "name": "800G/1.6T需求层：AI算力驱动，云厂商资本开支上行",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "公司超越Coherent成为全球第一，显示在高速光 模块领域的领先地位，有利于持续获取头部客户订单（文件中公司行业地位）",
                                    "id": "mark-industry-800g-1",
                                    "level": 6,
                                    "name": "⭐全球光模块厂商排名：2023年中际旭创第一（Lightcounting）",
                                    "type": "mark"
                                },
                                {
                                    "description": "Coherent预测未来五年800G 和1.6T光模块有望成为市场主流产品，公司提前布局将受益于产品代际更迭（文件中未 来发展趋势）",
                                    "id": "mark-industry-1.6t-1",
                                    "level": 6,
                                    "name": "⭐高速光模块市场 主流：未来五年800G和1.6T成主流（Coherent预测）",
                                    "type": "mark"
                                }
                            ],
                            "description": "高速光模块技术迭代周期缩短，头部厂商凭借技术和交付优势领先，2023年公司全球 市占率第一，800G及以上产品成为市场主流，预计未来五年800G和1.6T出货量占主导。",
                            "id": "industry-800g-1.6t",
                            "level": 5,
                            "name": "800G/1.6T行业层：技术迭代快，行 业集中度提升",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "国内市场在政策和 算力需求驱动下快速增长，公司作为国产龙头将显著受益（文件中行业发展数据）",
                                    "id": "mark-macro-800g-1",
                                    "level": 7,
                                    "name": "⭐中国光模块市场规模：2029年预计达65 亿美元（Lightcounting）",
                                    "type": "mark"
                                }
                            ],
                            "description": "国内政策加码算力产业 链，《“十四五”信息通信行业发展规划》推动数字经济发展，国产芯片和大模型能力提 升，国内算力基础设施建设蓄势待发，为高速光模块提供广阔市场空间。",
                            "id": "macro-800g-1.6t",
                            "level": 6,
                            "name": "800G/1.6T宏观层：政策支持+算力基建热潮",
                            "type": "normal"
                        },
                        {
                            "description": "⭐机构盈利预测：\n- 基于800G/1.6T产品上量，预计2024-2026年高速光通信模块业务营收分别为256.34/379.91/431.67亿元，增速162%/48%/14%，毛利率提升至35%左右。\n🌙盈利预测推导：\n1. 营收计算：2024年800G产能利用率 提升及1.6T开始出货，假设800G单价1500美元，出货量170万只，营收约25.5亿美元（折合人民币约182亿元），叠加其他高速产品，总营收256.34亿元；2025年1.6T批量出货，假设单价2500美元，出货量80万只，营收约20亿美元（折合人民币约143亿元），带动总营收增长至379.91亿元。\n2. 净利润计算：随着高端产品占比提升，毛利率从2023年35.06%提升至2025年35%，期间费用率控制稳定，净利率提升至21%，2025年净利润预计80.71亿元。\n3. 估值影响：按PE 30倍，2025年高速业务合理估值约2367亿元，占公司总 估值的80%以上，支撑公司整体估值提升（文件中盈利预测部分）。",
                            "id": "profit-forecast-800g-1.6t",
                            "level": 3,
                            "name": "🔮盈利预测（高速光模块业务2024-2026年营收CAGR 48%）",
                            "type": "forecast"
                        }
                    ],
                    "description": "- 💡产成品：800G可插拔OSFP和QSFP-DD系列光模块、1.6T OSFP-XD DR8+可插拔光模块等。\n- 🧩技术：采用硅光技术、线性直驱技术（LPO）等，支持高速率数据传输，降低功耗和成本。\n- 🤖应用：主要应用于AI数据中心、云计算等领域，满足英伟达等客户的高速互联需求。\n- 🧑‍🤝‍🧑客户   ：全球领先的云数据中心客户（如微软、谷歌、亚马逊等）和国内外主流通信设备厂商 。\n- 💴收入占比：800G产品2023年成为主力产品，1.6T预计2024年下半年到2025年逐 步上量。",
                    "id": "800g-1.6t-modules",
                    "level": 2,
                    "name": "800G/1.6T高速光模块（2023年800G已量产，1.6T市场导入阶段）",
                    "type": "normal"
                },
                {
                    "children": [
                        {
                            "description": "- 产能规模：苏州、成都基地持续供应，产能稳定。\n- 成本优势：规模生产降低 制造成本，毛利率维持在10%左右。",
                            "id": "supply-400g-below",
                            "level": 3,
                            "name": "400G及以下供给能力：稳定生产，成本控制",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "电信市场稳定增长，中低速光模块在5G和固网场景持续需求（文件中电信市场 数据）",
                                    "id": "mark-demand-400g-1",
                                    "level": 5,
                                    "name": "⭐全球电信光模块市场规模 ：2023年52.2亿美元，2024-2029年CAGR 14%",
                                    "type": "mark"
                                }
                            ],
                            "description": "全球5G基站建设稳步推进，2024年我国5G基站达425.1万个，推动前传光模块需求；千兆光纤 网络升级，10GPON端口增长，带动中低速光模块稳定需求。",
                            "id": "demand-400g-below",
                            "level": 4,
                            "name": "400G及以下需求层：5G建设和固网升级支撑",
                            "type": "normal"
                        },
                        {
                            "description": "中低速市场技术成熟，厂商众多，竞争激烈，公司凭借规模和客户优 势保持稳定份额，价格相对稳定。",
                            "id": "industry-400g-below",
                            "level": 5,
                            "name": "400G及以下行业层：竞争激烈，价格趋稳",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "政策明确5G基站建设目标，为中低速光模块提供稳定市场空间（文件中电信市场政策）",
                                    "id": "mark-macro-400g-1",
                                    "level": 7,
                                    "name": "⭐5G基站规划：2025年总数约390万个，年复合增长26%",
                                    "type": "mark"
                                }
                            ],
                            "description": "《“十四五”信息通信行业发展规划》要求2025年5G基站达390万个，千兆宽带用户6000万户，直接拉动中低速光模块需求。",
                            "id": "macro-400g-below",
                            "level": 6,
                            "name": "400G及以下宏观层：政策推 动5G和光纤接入",
                            "type": "normal"
                        },
                        {
                            "description": "预计2024-2026年中低速光通信 模块业务营收分别为2.89/2.60/2.34亿元，同比下降25%/10%/10%，毛利率维持10%，对 公司整体盈利贡献逐渐降低，主要作为补充业务存在。",
                            "id": "profit-forecast-400g-below",
                            "level": 3,
                            "name": "🔮盈利预测（中低速业务营收逐年下降）",
                            "type": "forecast"
                        }
                    ],
                    "description": "- 💡产成品：100G、200G、400G等中低速光模块，用于传统数据中心和5G网络。\n- 🧩技术：成熟工艺，支持稳定传输。\n- 🤖应用：5G前传、中传和 回传，固网接入等场景。\n- 🧑‍🤝‍🧑客户：电信设备商、中小型数据中心。\n- 💴收   入占比：2023年营收3.84亿元，同比下降42%，占比降至3.6%，随公司业务向高速转型，占比持续下降。",
                    "id": "400g-below-modules",
                    "level": 2,
                    "name": "400G及以下中低速 光模块（业务占比下降，2023年营收3.84亿元）",
                    "type": "normal"
                }
            ],
            "description": "- ✨业务涵盖范围：为云数据中心客户提供100G、200G、400G、800G和1.6T等高速光模 块，产品用于数据中心服务器与交换机、交换机与交换机之间的高速连接，支持AI算力 基础设施建设。\n- 💰创收情况：2023年高速光通信模块业务收入97.99亿元，同比增长12%，占公司总营收的91.4%；2024年预计营收256.34亿元，同比大幅增长162%，成为公 司主要收入来源。",
            "id": "high-speed-datacom-modules",
            "isExpanded": true,
            "level": 1,
            "name": "高速数通光模块：核心增长业务（收入占比超90%，2023年营收97.99亿元）",
            "type": "opportunity"
        },
        {
            "children": [
                {
                    "children": [
                        {
                            "description": "- 定制化能 力：根据电信设备商需求提供个性化设计，通过严格的质量认证体系。\n- 产能布局： 成都储瀚基地专注接入网光模块，产能匹配5G建设节奏。",
                            "id": "supply-5g-modules",
                            "level": 3,
                            "name": "5G光模块供给能力：定制化生产，质量认证严格",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "工信部数据显示5G基站快速建设，直接带动前传光模块需求（文件中电信市场数据）",
                                    "id": "mark-demand-5g-1",
                                    "level": 5,
                                    "name": "⭐5G 基站净增：2024年净增87.4万个，同比增长25.8%",
                                    "type": "mark"
                                }
                            ],
                            "description": "2024年我国5G基站净增87.4万个，总数达425.1万个，5G用户普及率提升至56%，推动前传、中传光模块需求增长。",
                            "id": "demand-5g-modules",
                            "level": 4,
                            "name": "5G光模块需求层：5G基站建设驱动",
                            "type": "normal"
                        },
                        {
                            "description": "5G光模块技术标准成熟，公司作为主流供应商，与华为、中兴等建立长期合作，市占率稳定在20%左右。",
                            "id": "industry-5g-modules",
                            "level": 5,
                            "name": "5G光模块行业层：技术标准明确，竞争格局稳定",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "政策明确5G建设目标，带动 相关光模块需求（文件中政策规划）",
                                    "id": "mark-macro-5g-1",
                                    "level": 7,
                                    "name": "⭐新基建投资：5G基站建设纳入新基建，预计2025年投资规模超2000亿元",
                                    "type": "mark"
                                }
                            ],
                            "description": "“新基建”政策持续推进5G网络建设，《“十四五”规划》要求2025年 每万人5G基站达26个，为5G光模块提供长期需求支撑。",
                            "id": "macro-5g-modules",
                            "level": 6,
                            "name": "5G光模块宏观层：新基建政策推动",
                            "type": "normal"
                        },
                        {
                            "description": "预计2024年电信级光模块业务营收随5G基站建设增长15%至11.5亿元，毛利率维持17%左右，成为公司稳定盈利来源之一。",
                            "id": "profit-forecast-5g-modules",
                            "level": 3,
                            "name": "🔮盈利预测（电信业务2024年营收增长15%）",
                            "type": "forecast"
                        }
                    ],
                    "description": "- 💡产成品：25G、50G等前传光模块，100G、200G中回传光模块。\n- 🧩技术 ：支持5G网络的高速率、低延迟传输。\n- 🤖应用：5G基站间连接，骨干网传输。\n-  🧑‍🤝‍🧑客户：华为、中兴等电信设备商。\n- 💴收入占比：2023年营收约6亿元，占电电信业务60%，随5G基站新增和升级，需求稳定增长。",
                    "id": "5g-optical-modules",
                    "level": 2,
                    "name": "5G前传/中传/回传光模块（2023年营收占电信业务60%）",
                    "type": "normal"
                }
            ],
            "description": "- ✨业务涵盖范围：为电信设备商提供5G前传、中传和回传光模块，以及骨干网和核心网传输光模块。\n- 💰创收情况：2023年光组件业务收入2.02亿 元，汽车光电子业务3.34亿元，电信级业务整体营收约10亿元，占比9.6%，预计2024年 随5G建设推进稳步增长。",
            "id": "telecom-modules",
            "isExpanded": true,
            "level": 1,
            "name": "电信级光模块：稳定增长业务（2023年营收约10亿元）",
            "type": "normal"
        },
        {
            "children": [
                {
                    "children": [
                        {
                            "children": [
                                {
                                    "description": "公司自研硅光芯片，减少对外部供应商依赖，提升产品竞争力（文件中硅光技术布局）",
                                    "id": "mark-supply-silicon-1",
                                    "level": 4,
                                    "name": "⭐硅光芯片自研：掌握核心设计能力",
                                    "type": "mark"
                                }
                            ],
                            "description": "- 自研能力：2017年组建硅光团队，自主设计硅光芯片，2022年推出800G硅 光模块。\n- 合作流片：与Tower Semiconductor合作，利用其PH18硅光子工艺平台，保障流片稳定性。",
                            "id": "supply-silicon-photonics",
                            "level": 3,
                            "name": "硅光模块供 给能力：自研+合作流片",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "硅光技术在高速光模块中的应用推动市场增长，公司硅光产品需求随之提升（文件中硅光技术趋 势）",
                                    "id": "mark-demand-silicon-1",
                                    "level": 5,
                                    "name": "⭐硅光芯片市场规模：2028年预计6.1亿美元，CAGR 44%",
                                    "type": "mark"
                                }
                            ],
                            "description": "800G光模块内部通道 数增加，硅光方案在功耗、成本和良率上优势凸显，Yole预测2022-2028年硅光芯片市场复合增长44%，数通场景为主要驱动力。",
                            "id": "demand-silicon-photonics",
                            "level": 4,
                            "name": "硅光模块需求层：800G时代渗透率提升",
                            "type": "normal"
                        },
                        {
                            "description": "硅光产业链价值向硅光芯片设计和流片环节集中，公司掌握自研芯片能力，有望占据 价值链高端，预计2024年硅光模块市占率提升至20%。",
                            "id": "industry-silicon-photonics",
                            "level": 5,
                            "name": "硅光模块行业层：产业链价值向上游集中",
                            "type": "normal"
                        },
                        {
                            "children": [
                                {
                                    "description": "政策推动光子技术创新，助力硅光模块技术成熟和产业化（文件中政策导向）",
                                    "id": "mark-macro-silicon-1",
                                    "level": 7,
                                    "name": "⭐光子 技术研发投入：国家“十四五”规划重点支持",
                                    "type": "mark"
                                }
                            ],
                            "description": "硅光技术是光模块未来重要方向，政策支持集成电路和光子技术研发，为硅光模块规模化应用 创造条件。",
                            "id": "macro-silicon-photonics",
                            "level": 6,
                            "name": "硅光模块宏观层：技术创新驱动行业变革",
                            "type": "normal"
                        },
                        {
                            "description": "随着800G硅光模块批量出货和1.6T硅光方案成熟，预计2025年硅光业务营收达30亿元，毛利率提升至38%，成为新的盈利增长点。",
                            "id": "profit-forecast-silicon-photonics",
                            "level": 3,
                            "name": "🔮盈利预测（硅光业务2025年营收达30亿元）",
                            "type": "forecast"
                        }
                    ],
                    "description": "- 💡产成品：400G、800G硅光模块，基于自研硅光芯片。\n- 🧩技术：硅光子集成技术， 集成度高，降低功耗和成本。\n- 🤖应用：数据中心短距传输，未来向1.6T硅光方案拓 展。\n- 🧑‍🤝‍🧑客户：提前布局硅光技术的云厂商和设备商。\n- 💴收入占比：2023   年硅光模块收入约5亿元，占比4.7%，预计2024年随800G硅光产品上量提升至15%。",
                    "id": "silicon-photonics-modules",
                    "level": 2,
                    "name": "硅光模块（2022年800G硅光产品 商用）",
                    "type": "normal"
                }
            ],
            "description": "- ✨业务涵盖范围：布局硅光技术、线性驱动可插拔光模块（LPO）、光电共封装（CPO）等新兴技术产品。\n- 💰创收情况：当 前处于技术储备和样品测试阶段，尚未大规模量产，预计2025年后逐步贡献收入。",
            "id": "new-tech-modules",
            "isExpanded": true,
            "level": 1,
            "name": "新兴技术光模块：未来潜力业务（硅光/LPO/CPO技术储备）",
            "type": "opportunity"
        }
    ],
    "description": "中际旭创是全球领先的光模块龙头企业，专注于高端光通信收发模块的研发、生产和销售，产品广 泛应用于云计算数据中心、5G无线网络等领域，凭借技术创新和规模优势，在全球光模块市场占据重要地位。",
    "id": "zhongji-xuchuang-analysis",
    "isExpanded": true,
    "level": 0,
    "name": "中际旭创-特色业务数据",
    "type": "company"
})

export const mockTreeDataList: TreeData[] = [
  {
    tree: createMockTree("report1", ["delivery", "margin"], ["asp"]),
    report: {
      id: "report1",
      name: "半导体行业：美国芯片制裁不断强化，自主可控主线凸显",
      author: "信达证券",
      date: "2025-01-20",
      url: "D:/reading/汽车🚗/华创证券-赛力斯-601127-深度研究报告：问界爆款引领，携手华为筑底中长期发展-250530.pdf",
    },
  },
  {
    tree: createMockTree("report2", ["asp"], ["delivery", "margin"]),
    report: {
      id: "report2",
      name: "晶圆制造龙头，领航国产芯片新征程",
      author: "上海证券",
      date: "2024-04-21",
      url: "https://pdf.dfcfw.com/pdf/H3_AP202504071652634491_1.pdf?1744024876000.pdf",
    },
  },
  {
    tree: createMockTree("report3", ["delivery", "pe"], ["margin"]),
    report: {
      id: "report3",
      name: "强势崛起本土中国芯，高端替代核心受益者",
      author: "申万宏源",
      date: "2025-07-28",
      url: "D:/reading/汽车🚗/广发证券-赛力斯-601127-跨界合作，打造世界级新豪华汽车领先品牌-250406.pdf",
    },
  }
]
