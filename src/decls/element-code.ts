/*
 * File: element-code.ts                                                       *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Wed Aug 14 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */
export const elementCode = {
  '100000': '基础地理信息要素',
  '160000': '境界与管辖区域',
  '162000': '管辖区域',
  '162010': '省级行政区',
  '162020': '地级行政区',
  '162030': '县级行政区',
  '162040': '乡级区域',
  '162050': '村级区域',
  '162060': '区域界线',
  '600000': '土壤普查',
  '610000': '基础要素',
  '611000': '土壤类型',
  '612000': '土地利用类型',
  '613000': '坡度图',
  '620000': '特征要素',
  '621000': '植被优势种群',
  '622000': '作物常年产量水平',
  '623000': '种植制度',
  '624000': '种植结构',
  '630000': '样点要素',
  '631000': '样点布设区',
  '632000': '布设网格',
  '633000': '布设样点',
  '634000': '调查样点',
  '640000': '制图要素',
  '641000': '土壤分类制图单元',
  '642000': '土壤性状制图单元',
  '300000': '栅格数据',
  '310000': '数字正射影像图',
  '320000': '数字栅格地图',
  '330000': '数字高程模型',
  '390000': '其他栅格数据',
} as const
