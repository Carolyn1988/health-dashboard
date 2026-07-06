/**
 * 八字命理引擎
 * 基于《渊海子平》《三命通会》《滴天髓》等传统命理经典
 * 仅供个人养生修行参考，非占卜之用
 */
const BaziEngine = {
  // 用户命盘（琉璃灯）
  // 真太阳时：1988年3月22日 08:36
  birthChart: {
    name: '琉璃灯',
    birthDate: '1988-03-22',
    birthTime: '08:36',
    year: { gan: '戊', zhi: '辰', cangGan: ['戊','乙','癸'], naYin: '大林木', shiShen: '食神' },
    month: { gan: '乙', zhi: '卯', cangGan: ['乙'], naYin: '大溪水', shiShen: '正印' },
    day: { gan: '丙', zhi: '子', cangGan: ['癸'], naYin: '涧下水', shiShen: '日主' },
    hour: { gan: '壬', zhi: '辰', cangGan: ['戊','乙','癸'], naYin: '长流水', shiShen: '七杀' }
  },

  // 十天干
  ganList: ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'],
  // 十二地支
  zhiList: ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'],

  // 天干五行
  ganWuxing: { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' },
  // 地支五行
  zhiWuxing: { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' },

  // 天干阴阳
  ganYinYang: { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' },
  // 地支阴阳
  zhiYinYang: { '子':'阳','丑':'阴','寅':'阳','卯':'阴','辰':'阳','巳':'阴','午':'阳','未':'阴','申':'阳','酉':'阴','戌':'阳','亥':'阴' },

  // 十神关系（以丙火日主为基准）
  shiShenMap: {
    '甲':'偏印', '乙':'正印',
    '丙':'比肩', '丁':'劫财',
    '戊':'食神', '己':'伤官',
    '庚':'偏财', '辛':'正财',
    '壬':'七杀', '癸':'正官'
  },

  // 六十甲子（简化，用于日柱计算）
  // 以1988-03-22（丙子日）为锚点
  anchorDate: '1988-03-22',
  anchorGanIdx: 2,  // 丙
  anchorZhiIdx: 0,  // 子

  /**
   * 计算两个日期之间的天数差
   */
  daysBetween(d1, d2) {
    const a = new Date(d1), b = new Date(d2);
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
  },

  /**
   * 计算某日的日柱干支
   */
  getDayPillar(dateStr) {
    const diff = this.daysBetween(this.anchorDate, dateStr);
    const ganIdx = ((this.anchorGanIdx + diff) % 10 + 10) % 10;
    const zhiIdx = ((this.anchorZhiIdx + diff) % 12 + 12) % 12;
    return {
      gan: this.ganList[ganIdx],
      zhi: this.zhiList[zhiIdx],
      ganIdx, zhiIdx,
      ganWx: this.ganWuxing[this.ganList[ganIdx]],
      zhiWx: this.zhiWuxing[this.zhiList[zhiIdx]]
    };
  },

  /**
   * 计算年柱干支
   */
  getYearPillar(year) {
    const gan = this.ganList[(year - 4) % 10];
    const zhi = this.zhiList[(year - 4) % 12];
    return { gan, zhi, ganWx: this.ganWuxing[gan], zhiWx: this.zhiWuxing[zhi] };
  },

  // 天干五行别名
  ganToWuxing: { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' },

  // 地支五行别名
  zhiToWuxing: { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' },

  // 五行生克关系判断（以target为中心）
  getWuxingRelation(target, source) {
    if (target === source) return '比和';
    const sheng = { '木':'火','火':'土','土':'金','金':'水','水':'木' };
    const ke = { '木':'土','火':'金','土':'水','金':'木','水':'火' };
    if (sheng[target] === source) return '我生';
    if (sheng[source] === target) return '生我';
    if (ke[target] === source) return '克我';
    if (ke[source] === target) return '我克';
    return '比和';
  },

  // 我生之色（通关色）
  getWuxingSheng(wx) {
    return { '木':'火','火':'土','土':'金','金':'水','水':'木' }[wx];
  },

  /**
   * 获取命盘十神
   */
  getShiShen(gan) {
    return this.shiShenMap[gan] || '未知';
  },

  /**
   * 五行力量分析（基于命盘）
   * 《滴天髓》："理承气行岂有常，进兮退兮宜抑扬"
   */
  getWuxingPower() {
    const chart = this.birthChart;
    const counts = { 木:0, 火:0, 土:0, 金:0, 水:0 };
    // 天干
    [chart.year, chart.month, chart.day, chart.hour].forEach(p => {
      counts[this.ganWuxing[p.gan]] += 1;
    });
    // 地支本气+中气+余气（权重3:2:1）
    const zhiCang = {
      '子':['癸'], '丑':['己','癸','辛'], '寅':['甲','丙','戊'],
      '卯':['乙'], '辰':['戊','乙','癸'], '巳':['丙','庚','戊'],
      '午':['丁','己'], '未':['己','丁','乙'], '申':['庚','壬','戊'],
      '酉':['辛'], '戌':['戊','辛','丁'], '亥':['壬','甲']
    };
    [chart.year, chart.month, chart.day, chart.hour].forEach(p => {
      const cang = zhiCang[p.zhi] || [];
      cang.forEach((g, i) => {
        const wx = this.ganWuxing[g];
        if (wx) counts[wx] += (3 - i) * 0.3; // 权重递减
      });
    });
    return counts;
  },

  /**
   * 日主强弱分析
   * 《子平真诠》："能知衰旺之真机，其于三命之奥，思过半矣"
   */
  getDayMasterStrength() {
    const wx = this.getWuxingPower();
    // 丙火日主：木生火为印（生助），火为比劫（同气），土为食伤（泄气），金为财（耗气），水为官杀（克身）
    const support = wx['木'] + wx['火']; // 生助
    const drain = wx['土'] + wx['金'] + wx['水']; // 克泄耗
    const ratio = support / (support + drain);
    if (ratio > 0.55) return { level: '偏旺', desc: '印比有力，日主不弱', ratio };
    if (ratio < 0.45) return { level: '偏弱', desc: '克泄耗重，日主失令', ratio };
    return { level: '中和', desc: '生克平衡，气势流通', ratio };
  },

  /**
   * 神煞解读（基于命盘）
   */
  getShenSha() {
    return [
      { name: '华盖', count: 2, desc: '年支辰、时支辰见辰，华盖重叠。\n《三命通会》："华盖者，喻如宝盖，天有此星，其形如盖。"\n主孤独清高，与佛道玄学有缘，宜静修、诵经、冥想。', effect: '修行' },
      { name: '太极贵人', count: 3, desc: '年、月、时皆见太极。\n《三命通会》："太极者，太初也，始也。物造于初为太极，成也，收也。"\n主聪明好学，喜神秘文化，对《易经》《黄庭经》有天然亲近。', effect: '悟道' },
      { name: '德秀贵人', count: 2, desc: '月支卯、时支辰见德秀。\n主温文尔雅，有慈悲之心，宜行善积德、养生利他。', effect: '德行' },
      { name: '阴差阳错', count: 1, desc: '日柱丙子为阴差阳错日。\n主行事多波折，感情/身体易有反复，需以平常心处之。\n《周易》："亢龙有悔"，过刚则折，宜柔中守正。', effect: '守正' },
      { name: '童子', count: 1, desc: '日柱见童子。\n主身体敏感，对气场、环境变化感知强。\n宜修行净化，以定力化解波动。', effect: '净化' },
      { name: '将星', count: 1, desc: '日支子见子为将星。\n主有领导才能，行事果决。\n但七杀透干，需注意刚柔并济，勿过强势。', effect: '调伏' }
    ];
  },

  /**
   * 每日干支与命盘作用关系分析
   * 结合《黄帝内经》五运六气与八字生克
   */
  getDailyInteraction(dateStr) {
    const day = this.getDayPillar(dateStr);
    const chart = this.birthChart;
    const interactions = [];

    // 1. 日天干与日主丙火的关系
    const dayGanWX = this.ganWuxing[day.gan];
    const dayGanSS = this.getShiShen(day.gan);

    if (day.gan === '壬' || day.gan === '癸') {
      interactions.push({
        type: '冲克', level: 'high',
        title: `${day.gan}水日主·官杀透干`,
        desc: '今日天干为水，与命局丙壬冲呼应。水旺克火，心火受压，易觉疲惫、情绪低落。',
        classic: '《素问·阴阳应象大论》："水为阴，火为阳，水火者，阴阳之征兆也。"',
        advice: ['午火冥想加时至30分钟，借天时补火气', '忌冷饮、生冷瓜果', '宜穿暖色衣物（红、橙）', '亥时（21-23点）前入睡，避水旺之时']
      });
    } else if (day.gan === '甲' || day.gan === '乙') {
      interactions.push({
        type: '生助', level: 'normal',
        title: `${day.gan}木日主·印星当令`,
        desc: '今日天干为木，木生火，印星生助日主。肝气易旺，思维活跃但易多虑。',
        classic: '《素问·五运行大论》："木曰敷和，火曰升明。"',
        advice: ['宜大礼拜，借运动疏泄木气', '可诵读《金刚经》，以金声肃降过旺之木', '忌过度思虑，遇事不纠结', '饮陈皮水，理气和胃防木克土']
      });
    } else if (day.gan === '丙' || day.gan === '丁') {
      interactions.push({
        type: '比劫', level: 'normal',
        title: `${day.gan}火日主·比劫帮身`,
        desc: '今日天干为火，比劫助身，精力较旺，但易上火、口干。',
        classic: '《滴天髓》："丙火猛烈，欺霜侮雪。"',
        advice: ['精力旺时处理重要事务', '注意滋阴，可饮桑葚水（少量）', '忌辛辣、烧烤', '若觉上火，减少午火冥想时长']
      });
    } else if (day.gan === '戊' || day.gan === '己') {
      interactions.push({
        type: '泄秀', level: 'low',
        title: `${day.gan}土日主·食伤泄秀`,
        desc: '今日天干为土，火生土为食伤。思绪宜表达，不宜憋闷，适合写作、交流。',
        classic: '《素问》："土爰稼穑，生化万物。"',
        advice: ['适合记录日记、整理思绪', '脾胃运化尚可，饮食宜规律', '大礼拜可加量', '宜接触自然，泥土、植物']
      });
    } else if (day.gan === '庚' || day.gan === '辛') {
      interactions.push({
        type: '耗气', level: 'low',
        title: `${day.gan}金日主·财星当令`,
        desc: '今日天干为金，火克金为财。金为命局所缺，今日宜收敛、肃降，不宜耗散。',
        classic: '《素问》："金曰从革，收敛肃杀。"',
        advice: ['宜静坐、诵经，以金之肃降安神', '减少社交，独处养神', '可整理家居，断舍离', '肺经当令时（寅时3-5点）保持深睡']
      });
    }

    // 2. 日地支与命局地支的关系（刑冲合害）
    const zhiRelations = this._getZhiRelation(day.zhi, chart);
    if (zhiRelations.length) {
      zhiRelations.forEach(r => interactions.push(r));
    }

    // 3. 纳音关系
    const dayNaYin = this._getNaYin(day.gan, day.zhi);
    interactions.push({
      type: '纳音', level: 'info',
      title: `今日纳音：${dayNaYin}`,
      desc: `日柱纳音${dayNaYin}，与命局纳音（大林木/大溪水/涧下水/长流水）相互激荡。`,
      classic: '《三命通会》："纳音者，天地之声气也。"',
      advice: [`今日宜${this._getNaYinAdvice(dayNaYin)}`]
    });

    return { day, interactions };
  },

  /**
   * 地支关系分析（刑冲合害）
   */
  _getZhiRelation(dayZhi, chart) {
    const results = [];
    const userZhi = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi];

    // 六冲
    const chong = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };
    userZhi.forEach((z, idx) => {
      if (chong[dayZhi] === z) {
        const pos = ['年','月','日','时'][idx];
        results.push({
          type: '冲', level: 'high',
          title: `日冲${pos}支：${dayZhi}冲${z}`,
          desc: `今日地支${dayZhi}与命局${pos}支${z}相冲，气机动荡，宜静不宜动。`,
          classic: '《滴天髓》："冲击者，激而战也。"',
          advice: ['避免重大决策', '宜静坐安神，减少外出', '注意对应身体部位：' + this._getBodyPart(z)]
        });
      }
    });

    // 三合
    const sanHe = {
      '申子辰': '水局', '亥卯未': '木局', '寅午戌': '火局', '巳酉丑': '金局'
    };
    userZhi.forEach((z1, i) => {
      userZhi.forEach((z2, j) => {
        if (i >= j) return;
        const combo = [dayZhi, z1, z2].sort().join('');
        for (let key in sanHe) {
          if (combo === key.split('').sort().join('')) {
            results.push({
              type: '合', level: 'normal',
              title: `三合${sanHe[key]}：${dayZhi}·${z1}·${z2}`,
              desc: `今日地支与命局形成三合${sanHe[key]}，气机聚合，利于专注修行。`,
              classic: '《三命通会》："合者，和也，阴阳相和，其气自合。"',
              advice: [`三合${sanHe[key]}，宜${sanHe[key] === '水局' ? '静坐观呼吸，引火归元' : sanHe[key] === '木局' ? '大礼拜疏泄肝气' : sanHe[key] === '火局' ? '午火冥想，借火势安神' : '诵经持咒，以金声肃降'}`]
            });
          }
        }
      });
    });

    // 刑
    const xing = {
      '子': ['卯'], '卯': ['子'], '寅': ['巳'], '巳': ['申'], '申': ['寅'],
      '丑': ['戌','未'], '戌': ['丑','未'], '未': ['丑','戌'],
      '辰': ['辰'], '午': ['午'], '酉': ['酉'], '亥': ['亥']
    };
    userZhi.forEach((z, idx) => {
      if (xing[dayZhi] && xing[dayZhi].includes(z)) {
        const pos = ['年','月','日','时'][idx];
        results.push({
          type: '刑', level: 'warning',
          title: `日刑${pos}支：${dayZhi}刑${z}`,
          desc: `今日地支${dayZhi}与命局${pos}支${z}相刑，气机淤塞，易有阻滞感。`,
          classic: '《滴天髓》："刑者，伤也，克中带伤。"',
          advice: ['宜温水泡脚，疏通经络', '可按揉太冲穴、三阴交', '避免与人争执', '饮陈皮水理气']
        });
      }
    });

    return results;
  },

  _getBodyPart(zhi) {
    const map = { '子':'肾/膀胱/耳','丑':'脾/胃/腹','寅':'肝/胆/腿','卯':'肝/胆/指','辰':'脾/胃/背',
                  '巳':'心/小肠/面','午':'心/小肠/眼','未':'脾/胃/唇','申':'肺/大肠/筋骨','酉':'肺/大肠/鼻',
                  '戌':'脾/胃/头','亥':'肾/膀胱/头' };
    return map[zhi] || '对应脏腑';
  },

  _getNaYin(gan, zhi) {
    // 简化纳音表（常用）
    const naYinMap = {
      '甲子':'海中金','乙丑':'海中金','丙寅':'炉中火','丁卯':'炉中火','戊辰':'大林木','己巳':'大林木',
      '庚午':'路旁土','辛未':'路旁土','壬申':'剑锋金','癸酉':'剑锋金','甲戌':'山头火','乙亥':'山头火',
      '丙子':'涧下水','丁丑':'涧下水','戊寅':'城头土','己卯':'城头土','庚辰':'白蜡金','辛巳':'白蜡金',
      '壬午':'杨柳木','癸未':'杨柳木','甲申':'泉中水','乙酉':'泉中水','丙戌':'屋上土','丁亥':'屋上土',
      '戊子':'霹雳火','己丑':'霹雳火','庚寅':'松柏木','辛卯':'松柏木','壬辰':'长流水','癸巳':'长流水',
      '甲午':'砂中金','乙未':'砂中金','丙申':'山下火','丁酉':'山下火','戊戌':'平地木','己亥':'平地木',
      '庚子':'壁上土','辛丑':'壁上土','壬寅':'金箔金','癸卯':'金箔金','甲辰':'覆灯火','乙巳':'覆灯火',
      '丙午':'天河水','丁未':'天河水','戊申':'大驿土','己酉':'大驿土','庚戌':'钗钏金','辛亥':'钗钏金',
      '壬子':'桑柘木','癸丑':'桑柘木','甲寅':'大溪水','乙卯':'大溪水','丙辰':'沙中土','丁巳':'沙中土',
      '戊午':'天上火','己未':'天上火','庚申':'石榴木','辛酉':'石榴木','壬戌':'大海水','癸亥':'大海水'
    };
    return naYinMap[gan + zhi] || '未知';
  },

  _getNaYinAdvice(naYin) {
    if (naYin.includes('金')) return '收敛肺气，宜深呼吸、诵经';
    if (naYin.includes('木')) return '舒展肝气，宜大礼拜、散步';
    if (naYin.includes('水')) return '静养肾气，宜静坐、冥想';
    if (naYin.includes('火')) return '温养心阳，宜午火冥想、晒太阳';
    if (naYin.includes('土')) return '健脾和胃，宜规律饮食、揉腹';
    return '顺其自然，保持平常心';
  },

  /**
   * 修行建议生成器
   * 结合八字、五运六气、体质三者
   */
  getPracticeAdvice(dateStr, liuQiInfo) {
    const daily = this.getDailyInteraction(dateStr);
    const shenSha = this.getShenSha();
    const strength = this.getDayMasterStrength();

    // 基础修行框架（根据神煞和体质）
    const basePractice = {
      morning: '金刚诵21遍（卯时5-7点，借木气生发）',
      noon: '午火冥想15-20分钟（午时11-13点，对日静坐，面前供凉水，观想水火既济）',
      evening: '大礼拜36拜（酉时17-19点，以运动泄火郁、健脾胃）',
      night: '睡前静坐10分钟，默念"心神丹元字守灵"（《黄庭经》）'
    };

    // 根据当日干支调整
    const dayGan = daily.day.gan;
    const dayZhi = daily.day.zhi;
    let adjustments = [];

    // 水日调整（壬癸日、亥子日）
    if (['壬','癸'].includes(dayGan) || ['子','亥'].includes(dayZhi)) {
      adjustments.push('今日水旺，午火冥想延长至30分钟，观想阳光普照水面，水汽蒸腾而上，水火交融。');
      adjustments.push('《周易·既济卦》："水在火上，既济。君子以思患而豫防之。"');
      basePractice.evening = '温水泡脚15分钟（加艾叶或姜片），引火归元';
    }

    // 木日调整（甲乙日、寅卯日）
    if (['甲','乙'].includes(dayGan) || ['寅','卯'].includes(dayZhi)) {
      adjustments.push('今日木旺，肝气易动。大礼拜加至54拜，以运动疏泄。');
      adjustments.push('《素问》："春三月，此谓发陈，天地俱生，万物以荣。"宜早起，面向东方诵经。');
    }

    // 火日调整（丙丁日、巳午日）
    if (['丙','丁'].includes(dayGan) || ['巳','午'].includes(dayZhi)) {
      adjustments.push('今日火旺，与日主同气。午火冥想可减至10分钟，避免过度兴奋。');
      adjustments.push('注意滋阴，冥想时面前凉水加量，观想清凉之意。');
    }

    // 金日调整（庚辛日、申酉日）——命局缺金，最宜补金
    if (['庚','辛'].includes(dayGan) || ['申','酉'].includes(dayZhi)) {
      adjustments.push('今日金气，补命局所缺。金刚诵加至49遍，以金声肃降过旺木火。');
      adjustments.push('《黄庭经》："肺神皓华字虚成，重十二两，状如华盖。"宜深呼吸，观白色金光入肺。');
      basePractice.noon = '午时静坐改以"金水火济"观：观想肺金生肾水，肾水上济心火，心火下温肾水，三环流转。';
    }

    // 土日调整（戊己日、辰戌丑未日）
    if (['戊','己'].includes(dayGan) || ['辰','戌','丑','未'].includes(dayZhi)) {
      adjustments.push('今日土旺，脾胃当令。大礼拜后加揉腹108圈，顺时针。');
      adjustments.push('《素问》："中央土以灌四傍。"宜黄色冥想，观想脾土厚实，运化有力。');
    }

    // 结合五运六气的特殊调整
    if (liuQiInfo) {
      const idx = liuQiInfo.index;
      if (idx === 2) { // 三之气，两火叠加
        adjustments.push('【五运六气·红色警戒】三之气两火叠加，与命局丙壬冲形成"火水未济"之险。');
        adjustments.push('《周易·未济卦》："火在水上，不相交也。"今日修行以"引火归元"为要：');
        adjustments.push('  - 午火冥想改在阴凉处，不可暴晒');
        adjustments.push('  - 观想肾水如深渊，心火如烛火，烛火缓缓下降，入于深渊之中，化为温暖之泉');
        adjustments.push('  - 亥时静坐加至20分钟，默念"真人潜深渊，浮游守规中"（《参同契》）');
      }
      if (idx === 3) { // 四之气，湿土
        adjustments.push('【五运六气】湿气当令，与命局辰辰自刑、湿土过重相应。');
        adjustments.push('修行宜"燥湿健脾"：大礼拜后饮陈皮水，揉腹时观想脾土干燥温暖。');
      }
    }

    // 神煞提示
    const huaGai = shenSha.find(s => s.name === '华盖');
    const taiJi = shenSha.find(s => s.name === '太极贵人');
    const spiritual = [];
    if (huaGai) {
      spiritual.push(`华盖重叠（${huaGai.count}处），与佛道缘深。每逢困惑，宜诵读《心经》或《清静经》，以空性化解。`);
    }
    if (taiJi) {
      spiritual.push(`太极贵人（${taiJi.count}处），天性喜《易》。可每月初一、十五研读《周易》一卦，以卦象映照身心。`);
    }

    return {
      day: daily.day,
      interactions: daily.interactions,
      basePractice,
      adjustments,
      spiritual,
      shenSha: shenSha.filter(s => ['华盖','太极贵人','童子'].includes(s.name)),
      strength
    };
  },

  /**
   * 获取命盘完整信息（用于档案页展示）
   */
  getFullChart() {
    const c = this.birthChart;
    return {
      pillars: [
        { position: '年柱', gan: c.year.gan, zhi: c.year.zhi, cangGan: c.year.cangGan, naYin: c.year.naYin, shiShen: c.year.shiShen },
        { position: '月柱', gan: c.month.gan, zhi: c.month.zhi, cangGan: c.month.cangGan, naYin: c.month.naYin, shiShen: c.month.shiShen },
        { position: '日柱', gan: c.day.gan, zhi: c.day.zhi, cangGan: c.day.cangGan, naYin: c.day.naYin, shiShen: c.day.shiShen },
        { position: '时柱', gan: c.hour.gan, zhi: c.hour.zhi, cangGan: c.hour.cangGan, naYin: c.hour.naYin, shiShen: c.hour.shiShen }
      ],
      wuxing: this.getWuxingPower(),
      strength: this.getDayMasterStrength(),
      shenSha: this.getShenSha(),
      analysis: this._getChartAnalysis()
    };
  },

  _getChartAnalysis() {
    return {
     格局: '正印格。月柱乙卯，正印当令，木旺生火。然坐下子水、时干透壬，水旺克火，形成"印旺身轻、水火交战"之局。',
      用神: '木火为喜用，土为调候。当前体质阴虚火旺，为"虚火"之象，养生宜"引火归元"，不可单纯温补。',
      体质映射: '丙火为心，壬子为肾，丙壬冲即心肾不交，故失眠；卯木为肝，辰土为脾，木旺土虚故肝郁脾虚；水旺湿蕴，故舌苔白厚、大便偏稀。八字与中医体质完全对应。',
      修行方向: '《周易·既济卦》为终生修行总纲——水火既济。\n华盖太极重叠，宜佛道双修：以佛之空性化解阴差阳错之波折，以道之阴阳调和丙壬冲之激荡。',
      经典推荐: [
        { name: '《周易·既济/未济卦》', reason: '丙壬冲即水火交战，既济为调和之道' },
        { name: '《黄庭经》', reason: '华盖之人宜存神内照，心神丹元字守灵' },
        { name: '《坐忘论》', reason: '水火交战需收心离境，安心坐忘' },
        { name: '《悟真篇》', reason: '"先把乾坤为鼎器，次搏乌兔药来烹"，取坎填离之旨' },
        { name: '《参同契》', reason: '"真人潜深渊，浮游守规中"，引火归元之法' }
      ]
    };
  }
};

if (typeof module !== 'undefined') module.exports = BaziEngine;
