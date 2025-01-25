/*
 * File: b-tables.ts                                                           *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Sun Aug 25 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { IsIn } from '@/utils/decorators'

function makeBTableValidator(table: Record<string, any>) {
  return IsIn(Object.keys(table))
}

/**
 * B1 界线类型代码表
 */
export const B1BoundaryType = {
  '250200': '海岸线',
  '250201': '大潮平均高潮线',
  '250202': '零米等深线',
  '250203': '江河入海口陆海分界线',
  '620200': '国界',
  '630200': '省、自治区、直辖市界',
  '640200': '地区、自治州、地级市界',
  '650200': '县、区、旗、县级市界',
  '660200': '乡、街道、镇界',
  '670200': '国有农场界',
  '670402': '开发区、保税区界',
  '670500': '街坊、村界',
  '670900': '组界',
} as const
export function IsB1() {
  return makeBTableValidator(B1BoundaryType)
}
/**
 * B2 界线性质代码表
 */
export const B2BoundaryProperty = {
  '600001': '已定界',
  '600002': '未定界',
  '600003': '争议界',
  '600004': '工作界',
  '600009': '其他界线',
} as const
export function IsB2() {
  return makeBTableValidator(B2BoundaryProperty)
}

/**
 * B3 坡度级别代码表
 */
export const B3SlopeLevel = {
  I: '平地(≤2)',
  II: '微坡(2-6)',
  III: '缓坡(6-15)',
  IV: '中缓坡(15-25)',
  V: '极陡坡(>25)',
} as const
export function IsB3() {
  return makeBTableValidator(B3SlopeLevel)
}

/**
 * B4 自然植被型代码表
 */
export const B4NaturalVegetationType = {
  '1101': '寒温带、温带山地落叶针叶林',
  '1102': '温带山地常绿针叶林',
  '1103': '温带草原沙地常绿针叶疏林',
  '1104': '温带常绿针叶林',
  '1105': '亚热带、热带常绿针叶林',
  '1106': '亚热带、热带山地常绿针叶林',
  '1207': '温带落叶阔叶树—常绿针叶树混交林',
  '1208': '温带、亚热带落叶阔叶林',
  '1209': '温带、亚热带山地落叶小叶林',
  '1210': '温带落叶小叶疏林',
  '1211': '亚热带石灰岩落叶阔叶树—常绿阔叶树混交林',
  '1212': '亚热带山地酸性黄壤常绿阔叶树—落叶阔叶树混交林',
  '1213': '亚热带常绿阔叶林',
  '1214': '热带雨林性常绿阔叶林',
  '1215': '亚热带硬叶常绿阔叶林',
  '1216': '亚热带竹林',
  '1217': '热带半常绿阔叶季雨林及次生植被',
  '1218': '热带常绿阔叶雨林及次生植被',
  '1319': '温带、亚热带落叶灌丛、矮林',
  '1320': '亚热带、热带酸性土常绿、落叶阔叶灌丛、矮林和草甸结合',
  '1321': '亚热带、热带石灰岩具有多种藤本的常绿，落叶灌丛、矮林',
  '1322': '热带海滨硬叶常绿阔叶灌丛、矮林',
  '1323': '热带珊瑚礁肉质常绿阔叶灌丛，矮林',
  '1324': '亚热带高山，亚高山常绿革质叶灌丛矮林',
  '1325': '温带、亚热带亚高山落叶灌丛',
  '1326': '温带高山矮灌木苔原',
  '1327': '温带、亚热带高山垫状矮半灌木、草本植被',
  '1428': '温带矮半灌木荒漠',
  '1429': '温带多汁盐生矮半灌木荒漠',
  '1430': '温带灌木、半灌木荒漠',
  '1431': '温带半乔木荒漠',
  '1432': '温带高寒匍匐矮半灌木荒漠',
  '1533': '温带禾草、杂类草草原',
  '1534': '温带丛生禾草草原',
  '1535': '温带山地丛生禾草草原',
  '1536': '温带丛生矮禾草、矮半灌木草原',
  '1537': '温带山地矮禾草、矮半灌木草原',
  '1538': '温带、亚热带高寒草原',
  '1539': '亚热带、热带稀树灌木草原',
  '1540': '温带草甸',
  '1541': '温带、亚热带高寒草甸',
  '1542': '温带草本沼泽',
  '1543': '温带高寒草本沼泽',
} as const
export function IsB4() {
  return makeBTableValidator(B4NaturalVegetationType)
}

/**
 * 作物类型代码表
 */
export const B5CropType = {
  '10': '基准作物',
  '10001': '春小麦',
  '10002': '冬小麦',
  '10003': '春玉米',
  '10004': '夏玉米',
  '10005': '一季稻',
  '10006': '早稻',
  '10007': '晚稻',
  '10008': '马铃薯',
  '20': '经济作物',
  '201': '蔬菜作物',
  '20101': '西红柿',
  '20102': '茄子',
  '20103': '辣椒',
  '20104': '黄瓜',
  '20105': '丝瓜',
  '20106': '豆角',
  '202': '纤维作物',
  '20201': '棉花',
  '20202': '麻类',
  '20203': '蚕桑',
  '203': '油料作物',
  '20301': '花生',
  '20302': '油菜',
  '20303': '芝麻',
  '20304': '大豆',
  '20305': '向日葵',
  '20306': '橄榄',
  '204': '糖料作物',
  '20401': '甜菜',
  '20402': '甘蔗',
  '205': '饮料作物',
  '20501': '茶叶',
  '20502': '咖啡',
  '20503': '可可',
  '206': '嗜好作物',
  '20601': '烟叶',
  '207': '药用作物',
  '20701': '人参',
  '20702': '灵芝',
  '20703': '贝母',
  '208': '热带作物',
  '20801': '橡胶',
  '20802': '椰子',
  '20803': '油棕',
  '20804': '剑麻',
  '20805': '蛋黄果',
  '90': '其它，选择后，需要在备注中说明具体类型',
} as const
export function IsB5() {
  return makeBTableValidator(B5CropType)
}

/**
 * 轮作制度代码表
 */
export const B6CropRotationSystem = {
  '01': '稻麦轮作',
  '02': '油菜-水稻',
  '03': '油菜-棉花',
  '04': '小麦-豆类',
  '05': '小麦-薯类',
  '06': '小麦-玉米',
  '07': '甘薯-玉米（旱）',
  '08': '早稻-晚稻',
  '09': '小麦-春玉米/甘薯',
  '10': '春小麦',
  '11': '棉花',
  '12': '马铃薯',
  '13': '冬小麦-春玉米-马铃薯',
  '14': '冬小麦-水稻',
  '15': '甘薯-早稻-晚稻',
  '16': '春花生-秋甘薯',
  '17': '其它，选择后，需要在备注中说明具体类型',
} as const
export function IsB6() {
  return makeBTableValidator(B6CropRotationSystem)
}

/**
 * 复种类型代码表
 */
export const B7ReplantingType = {
  '1': '一年一熟',
  '2': '一年二熟',
  '3': '一年三熟',
  '4': '二年三熟',
} as const
export function IsB7() {
  return makeBTableValidator(B7ReplantingType)
}

/**
 * 布设网格类型代码表
 */
export const B8GridType = {
  '01': '0.5Km*0.5Km',
  '02': '1Km*1Km',
  '03': '4Km*4Km',
} as const
export function IsB8() {
  return makeBTableValidator(B8GridType)
}

/**
 * 样点类别代码表
 */
export const B9SampleType = { '0': '表层样（农化样）', '1': '剖面样' } as const
export function IsB9() {
  return makeBTableValidator(B9SampleType)
}

/**
 * 采样类型代码表
 */
export const B10SamplingType = { '1': '普通样', '2': '普通样+平行样' } as const
export function IsB10() {
  return makeBTableValidator(B10SamplingType)
}

/**
 * 天气情况代码表
 */
export const B11WeatherCondition = {
  '01': '晴或极少云',
  '02': '部分云',
  '03': '阴',
  '04': '雨',
  '05': '雨夹雪或冰雹',
  '06': '雪',
} as const
export function IsB11() {
  return makeBTableValidator(B11WeatherCondition)
}

/**
 * 大地形分类
 *
 * @prop altitude: 海拔高度 (m)
 * @prop relativeAltitude: 相对海拔高度 (m)
 */
export const B12Topography = {
  MO: {
    name: '山地',
    altitude: '>500',
    relativeAltitude: '>100',
  },
  HI: {
    name: '丘陵',
    altitude: '<500',
    relativeAltitude: '<200',
  },
  PL: {
    name: '平原',
  },
  PT: {
    name: '高原',
    altitude: '>500',
  },
  BA: {
    name: '盆地',
  },
} as const
export function IsB12() {
  return makeBTableValidator(B12Topography)
}

/**
 * 中地形分类
 */
export const B13MiddleTopography = {
  AP: { name: '冲积平原' },
  CP: { name: '海岸(海积)平原' },
  LP: { name: '湖积平原' },
  PE: { name: '山麓平原' },
  DF: { name: '洪积平原' },
  WI: { name: '风积平原' },
  DU: { name: '沙丘' },
  DT: { name: '三角洲' },
  TF: { name: '河滩/潮滩' },
  LH: { name: '低丘', desc: '相对高差 <200m' },
  HH: { name: '高丘', desc: '相对高差 200-500m' },
  LM: { name: '低山', desc: '绝对高程 500-1000m' },
  MM: { name: '中山', desc: '绝对高程 1000-3500m' },
  OM: { name: '高山', desc: '绝对高程 3500-5000m' },
  EM: { name: '极高山' },
} as const
export function IsB13() {
  return makeBTableValidator(B13MiddleTopography)
}

/**
 * 小地形分类
 */
export const B14SmallTopography = {
  IF: '河间地',
  VA: '沟谷地',
  VF: '谷底',
  CH: '河道',
  LE: '河堤',
  TE: '阶地',
  FP: '泛滥平原',
  PF: '洪积扇',
  AF: '冲积扇',
  PA: '盘状凹地',
  CO: '珊瑚礁',
  CA: '火山口',
  DE: '洼地',
  DU: '沙丘',
  LD: '纵向沙丘',
  ID: '沙丘间洼地',
  SL: '坡',
  LA: '泻湖',
  RI: '山脊',
  BR: '滩脊',
} as const
export function IsB14() {
  return makeBTableValidator(B14SmallTopography)
}

/**
 * 成土母岩代码表
 */
export const B15ParentMaterial = {
  PA: '酸性深成岩',
  PQ: '酸性到中性深成岩',
  PI: '中性深成岩',
  PW: '中性到基性深成岩',
  PB: '基性深成岩',
  PU: '超基性深成岩',
  VA: '酸性火成岩',
  VQ: '酸到中性火成岩',
  VI: '中性火成岩',
  VW: '中性到酸性火成岩',
  VJ: '酸性到基性火成岩',
  VB: '基性火成岩',
  VU: '超基性火成岩',
  VP: '火山碎屑岩',
  MA: '酸性变质岩',
  MB: '基性变质岩',
  MC: '钙性变质岩',
  MU: '钙质交待变质岩与热液蚀变岩石',
  SP: '碎砾岩或砾质岩',
  SA: '砂质岩或砂屑岩',
  SL: '泥质岩或细屑岩',
  SO: '钙质岩，钙质变质岩',
  SE: '蒸发岩',
  SQ: '有机质富集岩',
  SS: '硅质岩',
  SX: '磷块石',
  SI: '铁矿石，铁岩',
  UQ: '砾质沉积物',
  US: '砂质沉积物',
  UT: '粉、壤质沉积物',
  UY: '粘质沉积物',
  UU: '混杂沉积物（未分类）',
  UA: '人为/人工沉积物',
  UL: '石灰沉积物',
  UP: '磷酸盐沉积物',
  UI: '铁质沉积物',
  UX: '硅质淤泥',
  UO: '泥炭和富含有机质的泥沙',
  UR: '风化壳',
} as const
export function IsB15() {
  return makeBTableValidator(B15ParentMaterial)
}

/**
 * 成土母质代码表
 */
export const B16SoilParentMaterial = {
  AS: '风积沙',
  LO: '原生黄土',
  LOP: '黄土状物质（次生黄土）',
  LI: '残积物',
  LG: '坡积物',
  MA: '洪积物',
  FL: '冲积物',
  PY: '海岸沉积物',
  AL: '湖沉积物',
  VA: '河流沉积物',
  CO: '火成碎屑沉积物',
  WE: '冰川沉积物',
  SA: '有机沉积物',
  CD: '崩积物',
  QR: '红黏土',
  OT: '其它',
} as const
export function IsB16() {
  return makeBTableValidator(B16SoilParentMaterial)
}

/**
 * 侵蚀类型代码表
 */
export const B17ErosionType = {
  W: '水蚀',
  W1: '片蚀',
  W2: '细沟侵蚀',
  W3: '浅沟侵蚀',
  W4: '切沟侵蚀',
  M: '重力侵蚀',
  A: '风蚀',
  WA: '水蚀与风蚀复合',
  P: '冻融侵蚀',
} as const
export function IsB17() {
  return makeBTableValidator(B17ErosionType)
}

/**
 * 侵蚀程度代码表
 */
export const B18ErosionDegree = {
  N: '无明显侵蚀',
  S: '轻度侵蚀',
  M: '中度侵蚀',
  V: '强',
  E: '剧烈',
} as const
export function IsB18() {
  return makeBTableValidator(B18ErosionDegree)
}

/**
 * 主要土壤层次类型代码表
 */
export const B19SoilLayerType = {
  O: '有机层（包括枯枝落叶层、草根密集盘结层和泥炭层）',
  A: '腐殖质表层或受耕作影响和表层',
  E: '淋溶层、漂白层',
  B: '物质淀积层或聚积层，或风化B层',
  C: '母质层',
  R: '基岩',
  G: '潜育层',
  K: '矿质土壤A层之上的矿质结壳层（如，盐结壳、铁结壳等）',
} as const
export function IsB19() {
  return makeBTableValidator(B19SoilLayerType)
}

/**
 * 土壤结构代码表
 */
export const B20SoilStructure = {
  A: '片状',
  B: '鳞片状',
  C: '棱柱状',
  D: '柱状',
  E: '棱块状',
  F: '团块状',
  G: '核状',
  H: '粒状',
  I: '团粒状',
  J: '屑粒状',
  K: '楔状',
} as const
export function IsB20() {
  return makeBTableValidator(B20SoilStructure)
}

/**
 * 耕层质地代码表
 */
export const B21TillageTexture = {
  '1': '砂土',
  '2': '砂壤',
  '3': '轻壤',
  '4': '中壤',
  '5': '重壤',
  '6': '黏土',
} as const
export function IsB21() {
  return makeBTableValidator(B21TillageTexture)
}

/**
 * 紧实度代码表
 */
export const B22Compactness = {
  '1': '松散',
  '2': '疏松',
  '3': '稍坚实',
  '4': '极紧',
} as const
export function IsB22() {
  return makeBTableValidator(B22Compactness)
}

/**
 剖面标本类型 
*/
export const B23ProfileSpecimenType = {
  '1': '整段标本',
  '2': '纸盒标本',
} as const
export function IsB23() {
  return makeBTableValidator(B23ProfileSpecimenType)
}

/**
 地形部位分类 
*/
export const B24TerrainPartsClass = {
  CR: '顶部',
  UP: '上坡',
  MS: '中坡',
  LS: '下坡',
  BOf: '坡麓(底部)',
  IN: '高阶地（洪冲积平原）',
  LO: '低阶地（河流冲积平原）',
  RB: '河漫滩',
  BOl: '底部(排水线)',
} as const
export function IsB24() {
  return makeBTableValidator(B24TerrainPartsClass)
}

/**
 坡向分类 
*/
export const B25SlopeDirectionClass = {
  E: '东 East (68~113)',
  SE: '东南 Southeast (113~158)',
  S: '南 South (158~203)',
  SW: '西南 Southwest (203~248)',
  W: '西 West (248~293)',
  NW: '西北 Northwest (293~338)',
  N: '北 North (23~338)', //FIXME: is this a typo?
  NE: '东北 Northeast (23~68)',
} as const
export function IsB25() {
  return makeBTableValidator(B25SlopeDirectionClass)
}

/** 岩石出露 -丰度 */
export const B26RockExposure = {
  N: {
    description: '无',
    abundance: '0',
    landCoverage: '对耕作无影响',
  },
  F: {
    description: '少',
    abundance: '<5',
    landCoverage: '对耕作有一定影响',
  },
  C: {
    description: '中',
    abundance: '5-15',
    landCoverage: '对耕作影响严重',
  },
  M: {
    description: '多',
    abundance: '15-50',
    landCoverage: '一般不宜耕作，但对小农具尚可局部使用',
  },
  A: {
    description: '很多',
    abundance: '>50',
    landCoverage: '不宜农用',
  },
} as const
export function IsB26() {
  return makeBTableValidator(B26RockExposure)
}

/** 岩石出露 -间距 */
export const B27RockSpacing = {
  VF: {
    description: '很远',
    distance: '>50',
  },
  F: {
    description: '远',
    distance: '20-50',
  },
  M: {
    description: '中',
    distance: '5-20',
  },
  C: {
    description: '较近',
    distance: '2-5',
  },
  VC: {
    description: '近',
    distance: '<2',
  },
} as const
export function IsB27() {
  return makeBTableValidator(B27RockSpacing)
}

/** 地表砾石程度 */
export const B28SurfaceGravel = {
  N: {
    description: '无',
    coverage: '0%',
    impact: '对耕作无影响',
  },
  F: {
    description: '少',
    coverage: '<5%',
    impact: '对耕作有影响',
  },
  C: {
    description: '中',
    coverage: '5-15%',
    impact: '对大田工作影响严重',
  },
  M: {
    description: '多',
    coverage: '15-50%',
    impact: '不宜耕作，但对小农具尚可局部使用',
  },
  A: {
    description: '很多',
    coverage: '>50%',
    impact: '不能利用',
  },
} as const
export function IsB28() {
  return makeBTableValidator(B28SurfaceGravel)
}

/** 地表砾石大小 */
export const B29SurfaceGravelSize = {
  F: {
    description: '细砾石',
    diameter: '<2cm',
  },
  C: {
    description: '粗砾石',
    diameter: '2-6cm',
  },
  S: {
    description: '石块',
    diameter: '6-20cm',
  },
  B: {
    description: '巨砾',
    diameter: '>20cm',
  },
} as const
export function IsB29() {
  return makeBTableValidator(B29SurfaceGravelSize)
}

/** 地表盐斑 -丰度 */
export const B30SaltCrustAbundance = {
  N: {
    description: '无',
    coverage: '0%',
  },
  L: {
    description: '低',
    coverage: '<15%',
  },
  M: {
    description: '中',
    coverage: '15-40%',
  },
  H: {
    description: '高',
    coverage: '40-80%',
  },
  V: {
    description: '极高',
    coverage: '≥80%',
  },
} as const
export function IsB30() {
  return makeBTableValidator(B30SaltCrustAbundance)
}

/** 地表盐斑 -厚度 */
export const B31SaltCrustThickness = {
  N: {
    description: '无',
    thickness: '0mm',
  },
  Ti: {
    description: '薄',
    thickness: '<5mm',
  },
  M: {
    description: '中',
    thickness: '5-10mm',
  },
  Tk: {
    description: '厚',
    thickness: '10-20mm',
  },
  V: {
    description: '很厚',
    thickness: '≥20mm',
  },
} as const
export function IsB31() {
  return makeBTableValidator(B31SaltCrustThickness)
}

/** 地表裂隙描述 -宽度 */
export const B32SurfaceCrackWidth = {
  VF: {
    description: '很细',
    width: '<1mm',
  },
  FI: {
    description: '细',
    width: '1-3mm',
  },
  ME: {
    description: '中',
    width: '3-5mm',
  },
  WI: {
    description: '宽',
    width: '5-10mm',
  },
  VW: {
    description: '很宽',
    width: '≥10mm',
  },
} as const
export function IsB32() {
  return makeBTableValidator(B32SurfaceCrackWidth)
}

/** 地表裂隙描述 -长度 */
export const B33SurfaceCrackLength = {
  SH: {
    description: '短',
    length: '<10cm',
  },
  ME: {
    description: '中',
    length: '10-30cm',
  },
  LO: {
    description: '长',
    length: '30-50cm',
  },
  VL: {
    description: '很长',
    length: '≥50cm',
  },
} as const
export function IsB33() {
  return makeBTableValidator(B33SurfaceCrackLength)
}

/** 地表裂隙-丰度 */
export const B34SurfaceCrackAbundance = {
  VM: '很多',
  MA: '多',
  MI: '中',
  F: '少',
  N: '无',
} as const
export function IsB34() {
  return makeBTableValidator(B34SurfaceCrackAbundance)
}

/** 地表裂隙 -间距 */
export const B35SurfaceCrackSpacing = {
  VS: {
    description: '很少',
    spacing: '<10cm',
  },
  SM: {
    description: '小',
    spacing: '10-30cm',
  },
  ME: {
    description: '中',
    spacing: '30-50cm',
  },
  LA: {
    description: '大',
    spacing: '50-100cm',
  },
  VL: {
    description: '很大',
    spacing: '≥100cm',
  },
} as const
export function IsB35() {
  return makeBTableValidator(B35SurfaceCrackSpacing)
}

/**
 地表裂隙 -方向 
*/
export const B36SurfaceCrackDirection = {
  V: '垂直和接近垂直',
  H: '水平和接近水平',
  R: '任意',
} as const
export function IsB36() {
  return makeBTableValidator(B36SurfaceCrackDirection)
}

/**
 地表裂隙 -连续性 
*/
export const B37SurfaceCrackContinuity = { B: '间断', C: '连续' } as const
export function IsB37() {
  return makeBTableValidator(B37SurfaceCrackContinuity)
}

/**
 土壤沙化指标与分级 
*/
export const B38SoilDesertification = {
  '0': '未沙化，沙生植物为一般伴生种或偶见种',
  '1': '轻度沙化，沙生植物为主要伴生种',
  '2': '中度沙化，沙生植物为优势种',
  '3': '重度沙化，植被稀疏，仅存少量沙生植物',
} as const
export function IsB38() {
  return makeBTableValidator(B38SoilDesertification)
}

/**
 植被覆盖度分类 (不含农作物) 
*/
export const B39VegetationCoverage = {
  '0': '0',
  '1': '<15',
  '2': '15-40',
  '3': '40-80',
  '4': '≥80',
} as const
export function IsB39() {
  return makeBTableValidator(B39VegetationCoverage)
}

/** 农田排水条件 */
export const B40FarmlandDrainageConditions = {
  A: {
    description: '充分满足',
    details: '具备健全的干、支、斗、农排水渠道（包括人工抽排），无洪涝灾害',
  },
  B: {
    description: '满足',
    details:
      '排水体系基本健全，丰水年暴雨后有短时间洪涝灾害（田间积水时长1-2天）',
  },
  C: {
    description: '基本满足',
    details: '排水体系一般，丰水年大雨后有洪涝发生（田间积水时长2-3天）',
  },
  D: {
    description: '不满足',
    details: '无排水系统，一般年份在大雨后发生洪涝灾害（田间积水大于3天）',
  },
} as const
export function IsB40() {
  return makeBTableValidator(B40FarmlandDrainageConditions)
}

/** 发生层层次过渡 - 明显度 */
export const B41LayerTransitionClarity = {
  A: {
    description: '突变',
    thickness: '<2cm',
  },
  C: {
    description: '清晰',
    thickness: '2-5cm',
  },
  G: {
    description: '渐变',
    thickness: '5-12cm',
  },
  F: {
    description: '模糊',
    thickness: '≥12cm',
  },
} as const
export function IsB41() {
  return makeBTableValidator(B41LayerTransitionClarity)
}

/** 发生层层次过渡 - 过渡形状 */
export const B42LayerTransitionShape = {
  S: {
    description: '平滑',
    details: '指过渡层呈水平或近于水平',
  },
  W: {
    description: '波状',
    details: '指土层间过渡形成凹陷，其深度和宽度不规则',
  },
  I: {
    description: '不规则',
    details: '指土层间过渡下次凹陷，其深度和宽度不规则',
  },
  B: {
    description: '间断',
    details: '指土层间过渡出现中断现象',
  },
} as const
export function IsB42() {
  return makeBTableValidator(B42LayerTransitionShape)
}

/** 根系 - 粗细 */
export const B43RootThickness = {
  VF: {
    description: '极细',
    diameter: '<0.5mm',
  },
  F: {
    description: '细',
    diameter: '0.5-2mm',
  },
  M: {
    description: '中',
    diameter: '2-5mm',
  },
  C: {
    description: '粗',
    diameter: '5-10mm',
  },
  VC: {
    description: '很粗',
    diameter: '≥10mm',
  },
} as const
export function IsB43() {
  return makeBTableValidator(B43RootThickness)
}

/** 根系 - 丰度 */
export const B44RootAbundance = {
  N: {
    description: '无',
    abundance: '0',
  },
  V: {
    description: '很少',
    abundance: '<20 (VF & F) / <2 (M & C & VC)',
  },
  F: {
    description: '少',
    abundance: '20-50 (VF & F) / 2-5 (M & C & VC)',
  },
  C: {
    description: '中',
    abundance: '50-200 (VF & F) / ≥5 (M & C & VC)',
  },
  M: {
    description: '多',
    abundance: '>200 (VF & F) / ≥5 (M & C & VC)',
  },
} as const
export function IsB44() {
  return makeBTableValidator(B44RootAbundance)
}

/** 土壤结构 - 形状大小 */
export const B45SoilStructureShapeSize = {
  PL: {
    description: '片状',
    maxDimension: '最大尺度 (mm)',
    sizes: {
      VF: '<11',
      FI: '11-22',
      ME: '22-55',
      CO: '55-100',
      VC: '≥100',
    },
    size_names: {
      VF: '很薄',
      FI: '薄',
      ME: '中',
      CO: '厚',
      VC: '很厚',
    },
  },
  PR: {
    description: '棱柱状',
    maxDimension: '最大尺度 (mm)',
    sizes: {
      VF: '<10',
      FI: '10-20',
      ME: '20-50',
      CO: '50-100',
      VC: '≥100',
    },
    size_names: {
      VF: '很小',
      FI: '小',
      ME: '中',
      CO: '大',
      VC: '很大',
    },
  },
  BL: {
    description: '块状',
    maxDimension: '最大尺度 (mm)',
    sizes: {
      VF: '<5',
      FI: '5-10',
      ME: '10-20',
      CO: '20-50',
      VC: '≥50',
    },
    size_names: {
      VF: '很小',
      FI: '小',
      ME: '中',
      CO: '大',
      VC: '很大',
    },
  },
  GR: {
    description: '粒状（或单粒状）',
    maxDimension: '最大尺度 (mm)',
    sizes: {
      VF: '<1',
      FI: '1-2',
      ME: '2-5',
      CO: '5-10',
      VC: '≥10',
    },
    size_names: {
      VF: '很小',
      FI: '小',
      ME: '中',
      CO: '大',
      VC: '很大',
    },
  },
  MA: {
    description: '整体状（或整块状）',
    details: '细沉积层理, 分风化矿物结晶',
    sizes: {
      FS: '细沉积层理',
      FMA: '分风化矿物结晶',
    },
    size_names: {
      VF: '很小',
      FI: '小',
      ME: '中',
      CO: '大',
      VC: '很大',
    },
  },
} as const
export function IsB45() {
  return makeBTableValidator(B45SoilStructureShapeSize)
}

/** 土壤结构 - 发育程度 */
export const B46SoilStructureDevelopment = {
  VW: {
    description: '很弱',
    details: '保留大部分母质特性',
  },
  WE: {
    description: '弱',
    details: '保留部分母质特性',
  },
  MO: {
    description: '中',
    details: '保留少量母质特性',
  },
  ST: {
    description: '强',
    details: '基本没有母质特性',
  },
  VS: {
    description: '很强',
    details: '没有母质特性',
  },
} as const
export function IsB46() {
  return makeBTableValidator(B46SoilStructureDevelopment)
}

/** 岩石和矿物碎屑 - 丰度 */
export const B47RockAndMineralFragmentsAbundance = {
  F: {
    description: '少',
    volume: '<25%',
  },
  C: {
    description: '中',
    volume: '25-50%',
  },
  M: {
    description: '多',
    volume: '50-75%',
  },
  A: {
    description: '很多',
    volume: '≥75%',
  },
} as const
export function IsB47() {
  return makeBTableValidator(B47RockAndMineralFragmentsAbundance)
}

/** 岩石和矿物碎屑 - 大小 */
export const B48RockAndMineralFragmentsSize = {
  A: {
    description: '很小',
    diameter: '<5mm',
    equivalent: '细砾',
  },
  B: {
    description: '小',
    diameter: '5-20mm',
    equivalent: '中砾',
  },
  C: {
    description: '中',
    diameter: '20-75mm',
    equivalent: '粗砾',
  },
  D: {
    description: '大',
    diameter: '75-250mm',
    equivalent: '石块',
  },
  E: {
    description: '很大',
    diameter: '≥250mm',
    equivalent: '巨砾',
  },
} as const
export function IsB48() {
  return makeBTableValidator(B48RockAndMineralFragmentsSize)
}

/** 岩石和矿物碎屑 - 形状 */
export const B49RockAndMineralFragmentsShape = {
  P: {
    description: '棱角状',
  },
  SP: {
    description: '次棱角状',
  },
  SR: {
    description: '次圆状',
  },
  R: {
    description: '圆状',
  },
} as const
export function IsB49() {
  return makeBTableValidator(B49RockAndMineralFragmentsShape)
}

/** 岩石和矿物碎屑 - 风化状态 */
export const B50RockAndMineralFragmentsWeathering = {
  F: {
    description: '微风化（包括新鲜）',
    details: '没有或仅有极少的风化证据',
  },
  W: {
    description: '中等风化',
    details:
      '砾石表面颜色明显变化，原晶体已遭破坏，但部分仍保新鲜状态，基本保持原岩石强度',
  },
  S: {
    description: '强风化',
    details: '几乎所有抗风化矿物均已改变原有颜色，施加一般压力即可把砾石弄碎',
  },
  T: {
    description: '全风化',
    details: '所有抗风化矿物均已改变原有颜色',
  },
} as const
export function IsB50() {
  return makeBTableValidator(B50RockAndMineralFragmentsWeathering)
}

/** 岩石和矿物碎屑 - 莫氏硬度 */
export const B51RockAndMineralFragmentsMohsHardness = {
  1: '滑石',
  2: '石膏',
  3: '方解石',
  4: '氟石',
  5: '磷灰石',
  6: '正长石',
  7: '石英',
  8: '黄晶',
  9: '刚玉',
  10: '金刚石',
} as const
export function IsB51() {
  return makeBTableValidator(B51RockAndMineralFragmentsMohsHardness)
}

/** 岩石和矿物碎屑 - 组成物质 */
export const B52RockAndMineralFragmentsComposition = {
  QU: {
    description: '石英颗粒',
  },
  WZ: {
    description: '石英岩',
  },
  FE: {
    description: '长石',
  },
  GR: {
    description: '花岗岩',
  },
  CH: {
    description: '燧石',
  },
  MI: {
    description: '云母',
  },
  OT: {
    description: '其它',
    details: '选择后，需要在备注中说明具体类型',
  },
} as const
export function IsB52() {
  return makeBTableValidator(B52RockAndMineralFragmentsComposition)
}

/** 孔隙 - 总孔隙度 */
export const B53PorosityTotal = {
  1: {
    description: '很低',
    volume: '<2%',
  },
  2: {
    description: '低',
    volume: '2-5%',
  },
  3: {
    description: '中',
    volume: '5-15%',
  },
  4: {
    description: '高',
    volume: '15-40%',
  },
  5: {
    description: '很高',
    volume: '≥40%',
  },
} as const
export function IsB53() {
  return makeBTableValidator(B53PorosityTotal)
}

/** 孔隙 - 丰度 */
export const B54PorosityAbundance = {
  N: {
    description: '无',
    abundance: '0',
  },
  V: {
    description: '很少',
    abundance: '<20 (VF & F) / <2 (M & C & VC)',
  },
  F: {
    description: '少',
    abundance: '20-50 (VF & F) / 2-5 (M & C & VC)',
  },
  C: {
    description: '中',
    abundance: '50-200 (VF & F) / 5-20 (M & C & VC)',
  },
  M: {
    description: '多',
    abundance: '≥200 (VF & F) / ≥20 (M & C & VC)',
  },
} as const
export function IsB54() {
  return makeBTableValidator(B54PorosityAbundance)
}

/** 孔隙描述 - 粗细 */
export const B55PorosityTexture = {
  VF: {
    description: '很细',
    diameter: '<0.5mm',
  },
  F: {
    description: '细',
    diameter: '0.5-2mm',
  },
  M: {
    description: '中',
    diameter: '2-5mm',
  },
  C: {
    description: '粗',
    diameter: '5-20mm',
  },
  VC: {
    description: '很粗',
    diameter: '20-50mm',
  },
} as const
export function IsB55() {
  return makeBTableValidator(B55PorosityTexture)
}

/** 孔隙描述 - 类型 */
export const B56PorosityType = {
  I: {
    description: '粒间孔隙（蜂窝状）',
  },
  B: {
    description: '气孔（气泡状）',
  },
  R: {
    description: '根孔（管道状）',
  },
  A: {
    description: '动物穴（孔洞状）',
  },
} as const
export function IsB56() {
  return makeBTableValidator(B56PorosityType)
}

/** 孔隙描述 - 分布位置 */
export const B57PorosityDistribution = {
  I: {
    description: '结构体内',
  },
  O: {
    description: '结构体外',
  },
  IO: {
    description: '结构体内外',
  },
} as const
export function IsB57() {
  return makeBTableValidator(B57PorosityDistribution)
}

/** 斑纹定量描述 - 丰度 */
export const B58PatternAbundance = {
  N: {
    description: '无',
    area: '0%',
  },
  V: {
    description: '很少',
    area: '<2%',
  },
  F: {
    description: '少',
    area: '2-5%',
  },
  C: {
    description: '中',
    area: '5-15%',
  },
  M: {
    description: '多',
    area: '15-40%',
  },
  A: {
    description: '很多',
    area: '≥40%',
  },
} as const
export function IsB58() {
  return makeBTableValidator(B58PatternAbundance)
}

/** 斑纹定量描述 - 大小 */
export const B59PatternSize = {
  V: {
    description: '很小',
    diameter: '<2mm',
  },
  F: {
    description: '小',
    diameter: '2-6mm',
  },
  M: {
    description: '中',
    diameter: '6-20mm',
  },
  C: {
    description: '大',
    diameter: '≥20mm',
  },
} as const
export function IsB59() {
  return makeBTableValidator(B59PatternSize)
}

/** 斑纹定量描述 - 位置 */
export const B60PatternLocation = {
  A: {
    description: '结构体表面',
  },
  B: {
    description: '结构体内',
  },
  C: {
    description: '孔隙周围',
  },
  D: {
    description: '根系周围',
  },
} as const
export function IsB60() {
  return makeBTableValidator(B60PatternLocation)
}

/** 斑纹定量描述 - 与土壤基质对比度 */
export const B61PatternContrast = {
  F: {
    description: '模糊',
  },
  D: {
    description: '明显',
  },
  P: {
    description: '显著',
  },
} as const
export function IsB61() {
  return makeBTableValidator(B61PatternContrast)
}

/** 斑纹定量描述 - 边界 */
export const B62PatternBoundary = {
  S: {
    description: '鲜明',
    diffusionDistance: '0-0.5mm',
  },
  C: {
    description: '清楚',
    diffusionDistance: '0.5-2mm',
  },
  D: {
    description: '扩散',
    diffusionDistance: '≥2mm',
  },
} as const
export function IsB62() {
  return makeBTableValidator(B62PatternBoundary)
}

/** 斑纹定量描述 - 组成物质 */
export const B63PatternComposition = {
  D: {
    description: '铁',
  },
  E: {
    description: '锰',
  },
  F: {
    description: '铁锰',
  },
  B: {
    description: '高岭',
  },
  C: {
    description: '二氧化硅',
  },
  G: {
    description: '石膏',
  },
  OT: {
    description: '其它',
  },
} as const
export function IsB63() {
  return makeBTableValidator(B63PatternComposition)
}

/** 胶膜 - 丰度 */
export const B64CoatingAbundance = {
  N: {
    description: '无',
  },
  V: {
    description: '很少',
  },
  F: {
    description: '少',
  },
  C: {
    description: '中',
  },
  M: {
    description: '多',
  },
  A: {
    description: '很多',
  },
  D: {
    description: '极多',
  },
} as const
export function IsB64() {
  return makeBTableValidator(B64CoatingAbundance)
}

/** 胶膜 - 位置 */
export const B65CoatingLocation = {
  P: {
    description: '结构面',
  },
  PV: {
    description: '垂直结构面',
  },
  PH: {
    description: '水平结构面',
  },
  CF: {
    description: '粗碎块',
  },
  LA: {
    description: '薄片层',
  },
  VO: {
    description: '孔隙',
  },
  NS: {
    description: '无一定位置',
  },
} as const
export function IsB65() {
  return makeBTableValidator(B65CoatingLocation)
}

/** 胶膜 - 组成物质 */
export const B66CoatingComposition = {
  C: {
    description: '黏粒',
  },
  CS: {
    description: '黏粒-铁锰氧化物',
  },
  H: {
    description: '腐殖质（有机质）',
  },
  CH: {
    description: '黏粒-腐殖质',
  },
  FM: {
    description: '铁-锰',
  },
  SIL: {
    description: '粉砂',
  },
  OT: {
    description: '其它',
  },
} as const
export function IsB66() {
  return makeBTableValidator(B66CoatingComposition)
}

/** 胶膜 - 与土壤基质对比度 */
export const B67CoatingContrast = {
  F: {
    description: '模糊',
    details: '只有用10倍的放大镜才能在近处的少数部位看到，与周围物质差异很小。',
  },
  D: {
    description: '明显',
    details:
      '不用放大镜即可看到，与相邻物质在颜色、质地和其它性质上有明显差异。',
  },
  P: {
    description: '显著',
    details: '胶膜与结构体内部颜色有十分明显的差异。',
  },
} as const
export function IsB67() {
  return makeBTableValidator(B67CoatingContrast)
}

/** 矿质瘤状结核 - 丰度 */
export const B68MineralNoduleAbundance = {
  N: {
    description: '无',
    volume: '0',
  },
  V: {
    description: '很少',
    volume: '<2',
  },
  F: {
    description: '少',
    volume: '2-5',
  },
  C: {
    description: '中',
    volume: '5-15',
  },
  M: {
    description: '多',
    volume: '15-40',
  },
  A: {
    description: '很多',
    volume: '40-80',
  },
  D: {
    description: '极多',
    volume: '≥80',
  },
} as const
export function IsB68() {
  return makeBTableValidator(B68MineralNoduleAbundance)
}

/** 矿质瘤状结核 - 种类 */
export const B69MineralNoduleType = {
  T: {
    description: '晶体',
  },
  C: {
    description: '结核',
  },
  S: {
    description: '软质分凝物',
  },
  B: {
    description: '假菌丝体',
  },
  L: {
    description: '石灰膜',
  },
  N: {
    description: '瘤状物',
  },
  R: {
    description: '残留岩屑',
  },
} as const
export function IsB69() {
  return makeBTableValidator(B69MineralNoduleType)
}

/** 矿质瘤状结核 - 大小 */
export const B70MineralNoduleSize = {
  V: {
    description: '很小',
    diameter: '<2mm',
  },
  F: {
    description: '小',
    diameter: '2-6mm',
  },
  M: {
    description: '中',
    diameter: '6-20mm',
  },
  C: {
    description: '大',
    diameter: '≥20mm',
  },
} as const
export function IsB70() {
  return makeBTableValidator(B70MineralNoduleSize)
}

/** 矿质瘤状结核 - 形状 */
export const B71IneralNoduleShape = {
  R: {
    description: '球形',
  },
  E: {
    description: '管状',
  },
  F: {
    description: '扁平',
  },
  I: {
    description: '不规则',
  },
  A: {
    description: '角块',
  },
} as const
export function IsB71() {
  return makeBTableValidator(B71IneralNoduleShape)
}

/** 矿质瘤状结核 - 硬度 */
export const B72MineralNoduleHardness = {
  H: {
    description: '用小刀难易破开',
  },
  S: {
    description: '用小刀易于破开',
  },
  B: {
    description: '硬软兼有',
  },
} as const
export function IsB72() {
  return makeBTableValidator(B72MineralNoduleHardness)
}

/** 矿质瘤状结核 - 组成物质 */
export const B73MineralNoduleComposition = {
  K: {
    description: '碳酸盐',
  },
  CA: {
    description: '碳酸钙（镁）',
  },
  Q: {
    description: '二氧化硅',
  },
  FM: {
    description: '铁锰（R2O3）',
  },
  GY: {
    description: '石膏',
  },
  OT: {
    description: '其它',
  },
} as const
export function IsB73() {
  return makeBTableValidator(B73MineralNoduleComposition)
}

/** 磐层胶结与紧实状况 - 连续性 */
export const B74BedrockCementationContinuity = {
  B: {
    description: '间断',
  },
  C: {
    description: '连续',
  },
} as const
export function IsB74() {
  return makeBTableValidator(B74BedrockCementationContinuity)
}

/** 磐层胶结与紧实状况 - 内部构造 */
export const B75BedrockCementationStructure = {
  N: {
    description: '无',
  },
  P: {
    description: '板状',
  },
  V: {
    description: '气孔状',
  },
  B: {
    //FIXME: 重复, 暂时改成B，原本是P
    description: '豆粒状',
  },
  D: {
    description: '不规则瘤状',
  },
} as const
export function IsB75() {
  return makeBTableValidator(B75BedrockCementationStructure)
}

/** 磐层胶结与紧实状况 - 胶结程度 */
export const B76BedrockCementationDegree = {
  N: {
    description: '无',
  },
  Y: {
    description: '紧实但非胶结',
  },
  W: {
    description: '弱胶结',
  },
  M: {
    description: '中胶结',
  },
  C: {
    description: '胶结',
  },
} as const
export function IsB76() {
  return makeBTableValidator(B76BedrockCementationDegree)
}

/** 磐层胶结与紧实状况 - 组成物质 */
export const B77BedrockCementationComposition = {
  K: {
    description: '碳酸盐',
  },
  Q: {
    description: '二氧化硅',
  },
  KQ: {
    description: '碳酸盐和二氧化硅',
  },
  F: {
    description: '铁',
  },
  FM: {
    description: '铁锰氧化物',
  },
  FO: {
    description: '铁锰',
  },
  GY: {
    description: '石膏',
  },
  C: {
    description: '黏粒',
  },
  CS: {
    description: '黏粒和铁锰氧化物',
  },
} as const
export function IsB77() {
  return makeBTableValidator(B77BedrockCementationComposition)
}

/** 磐层胶结与紧实状况 - 成因或起源 */
export const B78BedrockCementationOrigin = {
  NA: {
    description: '自然形成',
  },
  AM: {
    description: '人为形成',
  },
  ME: {
    description: '机械压实',
  },
  AP: {
    description: '耕犁',
  },
  OT: {
    description: '其它',
  },
} as const
export function IsB78() {
  return makeBTableValidator(B78BedrockCementationOrigin)
}

/** 滑擦面 */
export const B79SlipSurface = {
  N: {
    description: '无',
    area: '0%',
  },
  V: {
    description: '少',
    area: '<5%',
  },
  C: {
    description: '中',
    area: '5-15%',
  },
  M: {
    description: '多',
    area: '15-50%',
  },
  A: {
    description: '很多',
    area: '≥50%',
  },
} as const
export function IsB79() {
  return makeBTableValidator(B79SlipSurface)
}

/** 土壤侵入体 - 组成物质 */
export const B80SoilIntrusionComposition = {
  CH: {
    description: '草木炭',
  },
  CF: {
    description: '陶瓷碎片',
  },
  ID: {
    description: '工业粉尘',
  },
  BF: {
    description: '贝壳',
  },
  CC: {
    description: '煤渣',
  },
  WL: {
    description: '废弃液',
  },
  PS: {
    description: '砖、瓦、水泥、钢筋等建筑物碎屑',
  },
} as const
export function IsB80() {
  return makeBTableValidator(B80SoilIntrusionComposition)
}

/** 土壤侵入体 - 丰度 */
export const B81SoilIntrusionAbundance = {
  N: {
    description: '无',
    volume: '0%',
  },
  V: {
    description: '很少',
    volume: '<2%',
  },
  F: {
    description: '少',
    volume: '2-5%',
  },
  C: {
    description: '中',
    volume: '5-15%',
  },
} as const
export function IsB81() {
  return makeBTableValidator(B81SoilIntrusionAbundance)
}

/** 土壤动物种类 */
export const B82SoilAnimalTypes = {
  EW: {
    description: '蚯蚓',
  },
  AT: {
    description: '蚂蚁',
  },
  FM: {
    description: '田鼠',
  },
  BT: {
    description: '甲虫',
  },
  OT: {
    description: '其它',
  },
} as const
export function IsB82() {
  return makeBTableValidator(B82SoilAnimalTypes)
}

/** 土壤动物 - 丰度 */
export const B83SoilAnimalAbundance = {
  N: {
    description: '无',
    count: '0',
  },
  F: {
    description: '少',
    count: '<2',
  },
  C: {
    description: '中',
    count: '3-10',
  },
  M: {
    description: '多',
    count: '≥10',
  },
} as const
export function IsB83() {
  return makeBTableValidator(B83SoilAnimalAbundance)
}

/** 土壤动物 - 影响情况 */
export const B84SoilAnimalImpact = {
  A: {
    description: '动物孔穴',
  },
  B: {
    description: '蚯蚓粪',
  },
} as const
export function IsB84() {
  return makeBTableValidator(B84SoilAnimalImpact)
}

/** 土壤反应 - 石灰反应 */
export const B85SoilLimeReaction = {
  N: {
    description: '无',
    level: '无',
  },
  SL: {
    description: '轻度石灰性',
    level: '(+)',
  },
  MO: {
    description: '中度石灰性',
    level: '(++)',
  },
  ST: {
    description: '强石灰性',
    level: '(+++)',
  },
  EX: {
    description: '极强石灰性',
    level: '(++++)',
  },
} as const
export function IsB85() {
  return makeBTableValidator(B85SoilLimeReaction)
}

/** 土壤反应 - 亚铁反应 */
export const B86SoilFerrousReaction = {
  N: {
    description: '无',
    level: '无色',
  },
  SL: {
    description: '轻度',
    level: '微红或微蓝 (+)',
  },
  MO: {
    description: '中度',
    level: '红或蓝 (++)',
  },
  ST: {
    description: '强度',
    level: '深红或深蓝 (+++)',
  },
} as const
export function IsB86() {
  return makeBTableValidator(B86SoilFerrousReaction)
}

/** 土壤反应 - 土壤碱化度 */
export const B87SoilAlkalization = {
  N: {
    description: '无',
    level: '无色',
  },
  SL: {
    description: '轻度碱化',
    level: '淡红 (+)',
  },
  MO: {
    description: '中度碱化',
    level: '红 (++)',
  },
  ST: {
    description: '强度碱化',
    level: '紫红 (+++)',
  },
} as const
export function IsB87() {
  return makeBTableValidator(B87SoilAlkalization)
}

/** 土壤酸碱性分级 */
export const B88SoilAcidityAlkalinity = {
  IAc: {
    description: '强酸',
    pHRange: '< 4.5',
  },
  Ac: {
    description: '酸',
    pHRange: '4.5 - 5.5',
  },
  LAc: {
    description: '微酸',
    pHRange: '5.5 - 6.5',
  },
  M: {
    description: '中性',
    pHRange: '6.5 - 7.5',
  },
  LAl: {
    description: '微碱',
    pHRange: '7.5 - 8.5',
  },
  Al: {
    description: '碱',
    pHRange: '8.5 - 9.5',
  },
  IAl: {
    description: '强碱',
    pHRange: '≥ 9.5',
  },
} as const
export function IsB88() {
  return makeBTableValidator(B88SoilAcidityAlkalinity)
}

/** 样品类型 */
export const B89SampleTypes = {
  '01': {
    name: '表层样品',
  },
  '02': {
    name: '剖面样品',
  },
  '03': {
    name: '水稳性大团聚体样品',
  },
} as const
export function IsB89() {
  return makeBTableValidator(B89SampleTypes)
}

/** 检测实验室检测能力 */
export const B90LabTestingCapabilities = {
  JXZC: '机械组成',
  TRSWXDTJ: '土壤水稳性大团聚体',
  PH: 'pH值',
  KJHSD: '可交换酸度',
  YLZJHL: '阳离子交换量',
  JHXYJJ: '交换性盐基及盐基总量',
  SRXY: '水溶性盐',
  OM: '有机质',
  TN: '全氮',
  TP: '全磷',
  TK: '全钾',
  TS: '全硫',
  TB: '全硼',
  TSE: '全硒',
  TFE: '全铁',
  TMN: '全锰',
  TCU: '全铜',
  TZN: '全锌',
  TMO: '全钼',
  TAL: '全铝',
  TSI: '全硅',
  TCA: '全钙',
  TMG: '全镁',
  AP: '有效磷',
  SK: '速效钾',
  AK: '缓效钾',
  AS: '有效硫',
  ASI: '有效硅',
  AFE: '有效铁',
  AMN: '有效锰',
  ACU: '有效铜',
  AZN: '有效锌',
  AB: '有效硼',
  AMO: '有效钼',
  HG: '总汞',
  AS2: '总砷',
  PB: '总铅',
  CD: '总镉',
  CR: '总铬',
  NI: '总镍',
} as const
export function IsB90() {
  return makeBTableValidator(B90LabTestingCapabilities)
}
