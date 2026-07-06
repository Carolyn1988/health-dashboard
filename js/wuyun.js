/**
 * 五运六气计算引擎
 * 基于《黄帝内经·素问》五运六气理论
 */
const WuyunEngine = {
  // 天干化运
  tianGanYun: {
    '甲': { yun: '土', nature: '太过', wuxing: '土' },
    '乙': { yun: '金', nature: '不及', wuxing: '金' },
    '丙': { yun: '水', nature: '太过', wuxing: '水' },
    '丁': { yun: '木', nature: '不及', wuxing: '木' },
    '戊': { yun: '火', nature: '太过', wuxing: '火' },
    '己': { yun: '土', nature: '不及', wuxing: '土' },
    '庚': { yun: '金', nature: '太过', wuxing: '金' },
    '辛': { yun: '水', nature: '不及', wuxing: '水' },
    '壬': { yun: '木', nature: '太过', wuxing: '木' },
    '癸': { yun: '火', nature: '不及', wuxing: '火' }
  },

  // 地支化气（司天在泉）
  diZhiQi: {
    '子': { siTian: '少阴君火', zaiQuan: '阳明燥金', wuxing: '火' },
    '丑': { siTian: '太阴湿土', zaiQuan: '太阳寒水', wuxing: '土' },
    '寅': { siTian: '少阳相火', zaiQuan: '厥阴风木', wuxing: '火' },
    '卯': { siTian: '阳明燥金', zaiQuan: '少阴君火', wuxing: '金' },
    '辰': { siTian: '太阳寒水', zaiQuan: '太阴湿土', wuxing: '水' },
    '巳': { siTian: '厥阴风木', zaiQuan: '少阳相火', wuxing: '木' },
    '午': { siTian: '少阴君火', zaiQuan: '阳明燥金', wuxing: '火' },
    '未': { siTian: '太阴湿土', zaiQuan: '太阳寒水', wuxing: '土' },
    '申': { siTian: '少阳相火', zaiQuan: '厥阴风木', wuxing: '火' },
    '酉': { siTian: '阳明燥金', zaiQuan: '少阴君火', wuxing: '金' },
    '戌': { siTian: '太阳寒水', zaiQuan: '太阴湿土', wuxing: '水' },
    '亥': { siTian: '厥阴风木', zaiQuan: '少阳相火', wuxing: '木' }
  },

  // 主气（每年固定）
  zhuQi: [
    { name: '厥阴风木', desc: '风', wuxing: '木', nature: '温' },
    { name: '少阴君火', desc: '热', wuxing: '火', nature: '热' },
    { name: '少阳相火', desc: '暑', wuxing: '火', nature: '暑' },
    { name: '太阴湿土', desc: '湿', wuxing: '土', nature: '湿' },
    { name: '阳明燥金', desc: '燥', wuxing: '金', nature: '凉' },
    { name: '太阳寒水', desc: '寒', wuxing: '水', nature: '寒' }
  ],

  // 六气名称
  liuQiNames: ['初之气', '二之气', '三之气', '四之气', '五之气', '终之气'],

  // 2026年六气分界（以节气为界）
  liuQiBounds2026: [
    { start: '2026-01-20', end: '2026-03-20', idx: 0 },
    { start: '2026-03-20', end: '2026-05-21', idx: 1 },
    { start: '2026-05-21', end: '2026-07-23', idx: 2 },
    { start: '2026-07-23', end: '2026-09-23', idx: 3 },
    { start: '2026-09-23', end: '2026-11-22', idx: 4 },
    { start: '2026-11-22', end: '2027-01-20', idx: 5 }
  ],

  // 2026年24节气
  jieQi2026: [
    { name: '小寒', date: '2026-01-05' },
    { name: '大寒', date: '2026-01-20' },
    { name: '立春', date: '2026-02-04' },
    { name: '雨水', date: '2026-02-18' },
    { name: '惊蛰', date: '2026-03-05' },
    { name: '春分', date: '2026-03-20' },
    { name: '清明', date: '2026-04-05' },
    { name: '谷雨', date: '2026-04-20' },
    { name: '立夏', date: '2026-05-05' },
    { name: '小满', date: '2026-05-21' },
    { name: '芒种', date: '2026-06-05' },
    { name: '夏至', date: '2026-06-21' },
    { name: '小暑', date: '2026-07-07' },
    { name: '大暑', date: '2026-07-23' },
    { name: '立秋', date: '2026-08-07' },
    { name: '处暑', date: '2026-08-23' },
    { name: '白露', date: '2026-09-07' },
    { name: '秋分', date: '2026-09-23' },
    { name: '寒露', date: '2026-10-08' },
    { name: '霜降', date: '2026-10-23' },
    { name: '立冬', date: '2026-11-07' },
    { name: '小雪', date: '2026-11-22' },
    { name: '大雪', date: '2026-12-07' },
    { name: '冬至', date: '2026-12-21' }
  ],

  // 获取干支（1900-2100）
  getGanZhi(year) {
    const ganList = ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'];
    const zhiList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const gan = ganList[(year - 1900) % 10];
    // 1900年庚子年，地支偏移
    const zhi = zhiList[(year - 1900) % 12];
    return { gan, zhi, year };
  },

  // 计算岁运
  getSuiYun(year) {
    const gz = this.getGanZhi(year);
    const info = this.tianGanYun[gz.gan];
    return {
      ...gz,
      ...info,
      fullName: `${info.yun}运${info.nature}`
    };
  },

  // 计算司天在泉
  getSiTianZaiQuan(year) {
    const gz = this.getGanZhi(year);
    const info = this.diZhiQi[gz.zhi];
    return { ...gz, ...info };
  },

  // 计算客气（核心算法）
  getKeQi(year, qiIndex) {
    const gz = this.getGanZhi(year);
    const siTianName = this.diZhiQi[gz.zhi].siTian;
    const order = ['厥阴风木', '少阴君火', '太阴湿土', '少阳相火', '阳明燥金', '太阳寒水'];
    const siTianIdx = order.indexOf(siTianName);
    // 司天在三之气，初之气 = 司天往前推两位（逆序）
    const chuIdx = (siTianIdx - 2 + 6) % 6;
    const keQiIdx = (chuIdx + qiIndex) % 6;
    const name = order[keQiIdx];
    return {
      name,
      desc: name.slice(2),
      wuxing: this.zhuQi[keQiIdx].wuxing,
      nature: this.zhuQi[keQiIdx].nature
    };
  },

  // 获取某日期所在的六气信息
  getLiuQiInfo(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    // 处理跨年边界
    if (year === 2025 && month >= 12 && ds >= '2025-11-22') {
      return this._buildInfo(5, 2026, ds);
    }
    if (year === 2027 && month <= 1 && ds < '2027-01-20') {
      return this._buildInfo(5, 2026, ds);
    }
    // 2026年范围
    if (year === 2026 || (year === 2025 && ds >= '2025-11-22') || (year === 2027 && ds < '2027-01-20')) {
      for (let b of this.liuQiBounds2026) {
        if (ds >= b.start && ds < b.end) {
          return this._buildInfo(b.idx, 2026, ds);
        }
      }
    }
    // 通用处理：找最近一年的分界
    return this._buildInfo(0, year, ds);
  },

  _buildInfo(idx, year, dateStr) {
    const zhu = this.zhuQi[idx];
    const ke = this.getKeQi(year, idx);
    const bound = this.liuQiBounds2026[idx] || { start: '', end: '' };
    return {
      index: idx,
      name: this.liuQiNames[idx],
      start: bound.start,
      end: bound.end,
      date: dateStr,
      zhuQi: { ...zhu },
      keQi: { ...ke },
      year
    };
  },

  // 获取当前/下一个节气
  getJieQiInfo(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const ds = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

    let list = this.jieQi2026;
    let current = null, next = null;
    for (let i = 0; i < list.length; i++) {
      if (list[i].date <= ds) current = list[i];
      if (list[i].date > ds && !next) next = list[i];
    }
    // 跨年处理
    if (!current && year === 2025) current = { name: '冬至', date: '2025-12-21' };
    if (!next && year === 2026) next = { name: '小寒', date: '2027-01-05' };
    return { current, next };
  },

  // 计算距下一个节气的天数
  daysToNextJieQi(date) {
    const info = this.getJieQiInfo(date);
    if (!info.next) return null;
    const d1 = new Date(date);
    const d2 = new Date(info.next.date);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
  },

  // 获取全年六气完整数据（用于可视化）
  getFullYearData(year) {
    const suiYun = this.getSuiYun(year);
    const stzq = this.getSiTianZaiQuan(year);
    const phases = [];
    for (let i = 0; i < 6; i++) {
      const zhu = this.zhuQi[i];
      const ke = this.getKeQi(year, i);
      const bound = this.liuQiBounds2026[i];
      phases.push({
        index: i,
        name: this.liuQiNames[i],
        start: bound.start,
        end: bound.end,
        zhuQi: zhu,
        keQi: ke
      });
    }
    return { year, suiYun, siTianZaiQuan: stzq, phases };
  }
};

if (typeof module !== 'undefined') module.exports = WuyunEngine;
