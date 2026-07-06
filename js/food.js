/**
 * 饮食判断引擎
 * 基于《神农本草经》《食疗本草》《饮膳正要》《本草纲目》等传统食养经典
 * 结合体质、五运六气、当前方药进行食物适配性分析
 */
const FoodEngine = {
  // 食物数据库（性味归经、五行属性）
  // 来源：《神农本草经》《食疗本草》《饮膳正要》《本草纲目》
  foodDB: {
    // 谷物类
    '大米': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '补中益气，健脾和胃' },
    '小米': { nature: '凉', taste: '甘/咸', meridian: '肾/脾/胃', wuxing: '土', category: '谷物', desc: '健脾和胃，补益虚损' },
    '小米粥': { nature: '凉', taste: '甘/咸', meridian: '肾/脾/胃', wuxing: '土', category: '谷物', desc: '健脾和胃，补益虚损' },
    '糯米': { nature: '温', taste: '甘', meridian: '脾/胃/肺', wuxing: '土', category: '谷物', desc: '温补脾胃，但黏滞难化' },
    '燕麦': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '健脾益气，润肠通便' },
    '糙米': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '健脾养胃，补中益气' },
    '薏米': { nature: '微寒', taste: '甘/淡', meridian: '脾/胃/肺', wuxing: '土', category: '谷物', desc: '健脾渗湿，清热排脓' },
    '赤小豆': { nature: '平', taste: '甘/酸', meridian: '心/小肠', wuxing: '火', category: '谷物', desc: '利水消肿，解毒排脓' },
    '红豆': { nature: '平', taste: '甘/酸', meridian: '心/小肠', wuxing: '火', category: '谷物', desc: '健脾利水，补血养心' },
    '绿豆': { nature: '寒', taste: '甘', meridian: '心/胃', wuxing: '木', category: '谷物', desc: '清热解毒，消暑利水' },
    '黑豆': { nature: '平', taste: '甘', meridian: '脾/肾', wuxing: '水', category: '谷物', desc: '补肾益阴，健脾利湿' },
    '小麦粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '养心安神，除热止渴' },
    '面粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '养心安神，除热止渴' },
    '红薯粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '补脾益气，宽肠通便' },
    '木薯粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '谷物', desc: '补脾益气' },
    '黄豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '谷物', desc: '健脾宽中，润燥消水' },

    // 蔬菜类
    '白菜': { nature: '微寒', taste: '甘', meridian: '胃/大肠', wuxing: '金', category: '蔬菜', desc: '清热除烦，通利肠胃' },
    '菠菜': { nature: '凉', taste: '甘', meridian: '肝/胃/大肠', wuxing: '木', category: '蔬菜', desc: '滋阴平肝，助消化' },
    '芹菜': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '蔬菜', desc: '清热平肝，利水消肿' },
    '黄瓜': { nature: '凉', taste: '甘', meridian: '脾/胃/大肠', wuxing: '水', category: '蔬菜', desc: '清热利水，解毒消肿' },
    '冬瓜': { nature: '微寒', taste: '甘/淡', meridian: '肺/大肠/小肠/膀胱', wuxing: '水', category: '蔬菜', desc: '清热化痰，利尿消肿' },
    '南瓜': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '补中益气，消炎止痛' },
    '山药': { nature: '平', taste: '甘', meridian: '脾/肺/肾', wuxing: '土', category: '蔬菜', desc: '补脾养胃，生津益肺，补肾涩精' },
    '莲藕': { nature: '寒', taste: '甘', meridian: '心/脾/胃/肝/肺', wuxing: '金', category: '蔬菜', desc: '清热凉血，健脾开胃' },
    '白萝卜': { nature: '凉', taste: '辛/甘', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '消食化痰，下气宽中' },
    '胡萝卜': { nature: '平', taste: '甘', meridian: '肺/脾', wuxing: '土', category: '蔬菜', desc: '健脾和中，养肝明目' },
    '番茄': { nature: '微寒', taste: '酸/甘', meridian: '肝/脾/胃', wuxing: '木', category: '蔬菜', desc: '生津止渴，健胃消食' },
    '茄子': { nature: '凉', taste: '甘', meridian: '脾/胃/大肠', wuxing: '水', category: '蔬菜', desc: '清热活血，消肿止痛' },
    '苦瓜': { nature: '寒', taste: '苦', meridian: '心/脾/肺', wuxing: '火', category: '蔬菜', desc: '清热解暑，明目解毒' },
    '丝瓜': { nature: '凉', taste: '甘', meridian: '肺/肝/胃', wuxing: '水', category: '蔬菜', desc: '清热化痰，凉血解毒' },
    '木耳': { nature: '平', taste: '甘', meridian: '胃/大肠', wuxing: '水', category: '蔬菜', desc: '补气养血，润肺止咳' },
    '香菇': { nature: '平', taste: '甘', meridian: '胃/肝', wuxing: '土', category: '蔬菜', desc: '扶正补虚，健脾开胃' },
    '海带': { nature: '寒', taste: '咸', meridian: '肝/胃/肾', wuxing: '水', category: '蔬菜', desc: '软坚散结，利水消肿' },
    '紫菜': { nature: '寒', taste: '甘/咸', meridian: '肺/脾/膀胱', wuxing: '水', category: '蔬菜', desc: '化痰软坚，清热利水' },

    // 肉类
    '猪肉': { nature: '微寒', taste: '甘/咸', meridian: '脾/胃/肾', wuxing: '水', category: '肉类', desc: '滋阴润燥，补中益气' },
    '牛肉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '肉类', desc: '补脾胃，益气血，强筋骨' },
    '羊肉': { nature: '热', taste: '甘', meridian: '脾/胃/肾', wuxing: '火', category: '肉类', desc: '温补气血，益肾壮阳' },
    '鸡肉': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '肉类', desc: '温中益气，补精填髓' },
    '鸭肉': { nature: '寒', taste: '甘/咸', meridian: '脾/胃/肺/肾', wuxing: '水', category: '肉类', desc: '滋阴养胃，利水消肿' },
    '鱼肉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '肉类', desc: '健脾开胃，利水消肿' },
    '虾': { nature: '温', taste: '甘/咸', meridian: '肝/肾', wuxing: '火', category: '肉类', desc: '补肾壮阳，通乳抗毒' },
    '蟹': { nature: '寒', taste: '咸', meridian: '肝/胃', wuxing: '水', category: '肉类', desc: '清热滋阴，活血通络' },

    // 蛋类
    '鸡蛋': { nature: '平', taste: '甘', meridian: '肺/脾/胃', wuxing: '土', category: '蛋类', desc: '滋阴润燥，养血安胎' },
    '鸭蛋': { nature: '凉', taste: '甘/咸', meridian: '肺/大肠', wuxing: '水', category: '蛋类', desc: '滋阴清肺，止咳止痢' },

    // 豆制品
    '豆腐': { nature: '凉', taste: '甘', meridian: '脾/胃/大肠', wuxing: '水', category: '豆制品', desc: '益气和中，生津润燥' },
    '豆浆': { nature: '平', taste: '甘', meridian: '肺/胃', wuxing: '水', category: '豆制品', desc: '补虚润燥，清肺化痰' },
    '豆花': { nature: '平', taste: '甘/咸', meridian: '脾/胃', wuxing: '水', category: '豆制品', desc: '补虚润燥，清热' },
    '腐竹': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '豆制品', desc: '清热润肺，止咳消痰' },
    '豆皮': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '豆制品', desc: '清热润肺，养胃' },

    // 水果类
    '苹果': { nature: '凉', taste: '甘/酸', meridian: '脾/胃/心', wuxing: '金', category: '水果', desc: '生津润肺，除烦解暑' },
    '梨': { nature: '凉', taste: '甘/微酸', meridian: '肺/胃', wuxing: '水', category: '水果', desc: '生津润燥，清热化痰' },
    '香蕉': { nature: '寒', taste: '甘', meridian: '肺/大肠', wuxing: '土', category: '水果', desc: '清热润肠，解毒' },
    '西瓜': { nature: '寒', taste: '甘', meridian: '心/胃/膀胱', wuxing: '水', category: '水果', desc: '清热解暑，除烦止渴' },
    '葡萄': { nature: '平', taste: '甘/酸', meridian: '肺/脾/肾', wuxing: '木', category: '水果', desc: '补气血，益肝肾，生津液' },
    '桃子': { nature: '热', taste: '甘/酸', meridian: '胃/大肠', wuxing: '火', category: '水果', desc: '生津润肠，活血消积' },
    '李子': { nature: '平', taste: '甘/酸', meridian: '肝/胃', wuxing: '木', category: '水果', desc: '清热生津，泻肝利水' },
    '樱桃': { nature: '温', taste: '甘/酸', meridian: '脾/胃/肾', wuxing: '火', category: '水果', desc: '补中益气，祛风胜湿' },
    '草莓': { nature: '凉', taste: '甘/酸', meridian: '肺/脾', wuxing: '木', category: '水果', desc: '清热凉血，健脾和胃' },
    '猕猴桃': { nature: '寒', taste: '酸/甘', meridian: '胃/膀胱', wuxing: '木', category: '水果', desc: '清热生津，健脾止泻' },
    '橘子': { nature: '温', taste: '甘/酸', meridian: '肺/胃', wuxing: '金', category: '水果', desc: '理气开胃，生津止渴' },
    '橙子': { nature: '凉', taste: '甘/酸', meridian: '肺/胃', wuxing: '金', category: '水果', desc: '生津止渴，开胃下气' },
    '柚子': { nature: '寒', taste: '甘/酸', meridian: '脾/胃/肺', wuxing: '木', category: '水果', desc: '消食化痰，理气散结' },
    '柠檬': { nature: '平', taste: '酸/甘', meridian: '胃/肺', wuxing: '木', category: '水果', desc: '生津解暑，和胃安胎' },
    '木瓜': { nature: '温', taste: '酸', meridian: '肝/脾', wuxing: '木', category: '水果', desc: '舒筋活络，和胃化湿' },
    '桑葚': { nature: '寒', taste: '甘/酸', meridian: '肝/肾', wuxing: '水', category: '水果', desc: '滋阴补血，生津润燥' },
    '红枣': { nature: '温', taste: '甘', meridian: '脾/胃/心', wuxing: '土', category: '水果', desc: '补中益气，养血安神' },
    '桂圆': { nature: '温', taste: '甘', meridian: '心/脾', wuxing: '火', category: '水果', desc: '补益心脾，养血安神' },
    '枸杞': { nature: '平', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '水果', desc: '滋补肝肾，益精明目' },

    // 坚果类
    '核桃': { nature: '温', taste: '甘', meridian: '肾/肺/大肠', wuxing: '火', category: '坚果', desc: '补肾固精，温肺定喘' },
    '杏仁': { nature: '温', taste: '苦', meridian: '肺/大肠', wuxing: '金', category: '坚果', desc: '止咳平喘，润肠通便' },
    '花生': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '坚果', desc: '健脾和胃，润肺化痰' },
    '芝麻': { nature: '平', taste: '甘', meridian: '肝/肾/肺/脾', wuxing: '水', category: '坚果', desc: '补肝肾，益精血，润肠燥' },

    // 调味类
    '生姜': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '调味', desc: '发汗解表，温中止呕' },
    '大葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '调味', desc: '发表通阳，解毒消肿' },
    '大蒜': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '调味', desc: '解毒杀虫，消肿止痛' },
    '花椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '调味', desc: '温中止痛，杀虫止痒' },
    '辣椒': { nature: '热', taste: '辛', meridian: '心/脾', wuxing: '火', category: '调味', desc: '温中散寒，开胃消食' },
    '胡椒': { nature: '热', taste: '辛', meridian: '胃/大肠', wuxing: '火', category: '调味', desc: '温中下气，消痰解毒' },
    '桂皮': { nature: '热', taste: '辛/甘', meridian: '脾/胃/肝/肾', wuxing: '火', category: '调味', desc: '补火助阳，引火归元' },
    '八角': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '调味', desc: '温阳散寒，理气止痛' },
    '陈皮': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '调味', desc: '理气健脾，燥湿化痰' },
    '醋': { nature: '温', taste: '酸/苦', meridian: '肝/胃', wuxing: '木', category: '调味', desc: '散瘀止血，解毒杀虫' },
    '酱油': { nature: '寒', taste: '咸', meridian: '脾/胃/肾', wuxing: '水', category: '调味', desc: '除热解毒' },
    '盐': { nature: '寒', taste: '咸', meridian: '胃/肾/大肠/小肠', wuxing: '水', category: '调味', desc: '涌吐消痰，凉血解毒' },
    '糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '调味', desc: '补脾益气，润肺止咳' },
    '蜂蜜': { nature: '平', taste: '甘', meridian: '肺/脾/大肠', wuxing: '土', category: '调味', desc: '补中润燥，止痛解毒' },
    '糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '调味', desc: '补脾益气，润肺止咳' },
    '冰糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '调味', desc: '补中益气，和胃润肺' },
    '白砂糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '调味', desc: '补脾益气，润肺止咳' },
    '红糖': { nature: '温', taste: '甘', meridian: '脾/胃/肝', wuxing: '土', category: '调味', desc: '补中缓肝，活血和瘀' },
    '黄油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '润燥养阴，但滋腻难化' },
    '奶油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '滋阴润燥，但高脂滋腻' },
    '芝士': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '补钙益气，但滋腻难化' },
    '奶酪': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '补钙益气，但滋腻难化' },
    '蛋黄酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '滋阴润燥，但高脂' },
    '沙拉酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '滋阴润燥，但高脂' },
    '芝麻酱': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '调味', desc: '补肝肾，益精血，润肠燥' },
    '花生酱': { nature: '温', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '调味', desc: '健脾和胃，润肺化痰' },
    '甜面酱': { nature: '平', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '开胃助食' },
    '豆瓣酱': { nature: '温', taste: '辛/咸', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '开胃消食，但辛辣' },
    '豆豉': { nature: '平', taste: '甘/咸', meridian: '胃/肺', wuxing: '水', category: '调味', desc: '解表除烦，宣发郁热' },
    '腐乳': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '调味', desc: '开胃消食，但咸重' },
    '韭菜花': { nature: '温', taste: '辛', meridian: '肝/肾', wuxing: '火', category: '调味', desc: '温肾助阳，但辛热' },
    '沙茶酱': { nature: '温', taste: '辛/甘', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '开胃消食，但辛温' },
    '芥末': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '调味', desc: '温中散寒，但辛辣刺激' },
    '番茄酱': { nature: '微寒', taste: '酸/甘', meridian: '肝/脾/胃', wuxing: '木', category: '调味', desc: '生津止渴，健胃消食' },
    '咖喱粉': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '温中散寒，但辛热' },
    '孜然': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '理气开胃，但辛温' },
    '五香粉': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '温中散寒，但辛热' },
    '香叶': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '温中散寒' },
    '迷迭香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '温中散寒' },
    '百里香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '调味', desc: '温中散寒' },
    '鱼露': { nature: '温', taste: '咸', meridian: '脾/胃', wuxing: '水', category: '调味', desc: '开胃助食，但咸重' },
    '蚝油': { nature: '温', taste: '咸/甘', meridian: '脾/胃', wuxing: '水', category: '调味', desc: '滋阴润燥，但咸重' },
    '料酒': { nature: '温', taste: '辛/甘', meridian: '心/肝/肺/胃', wuxing: '火', category: '调味', desc: '通血脉，去腥膻' },

    // 饮品类
    '绿茶': { nature: '寒', taste: '甘/苦', meridian: '心/肺/胃', wuxing: '木', category: '饮品', desc: '清热解暑，提神醒脑' },
    '红茶': { nature: '温', taste: '甘/苦', meridian: '心/肺/胃', wuxing: '火', category: '饮品', desc: '温胃散寒，提神消疲' },
    '乌龙茶': { nature: '平', taste: '甘/微苦', meridian: '肺/胃', wuxing: '木', category: '饮品', desc: '消食去腻，提神醒脑' },
    '普洱茶': { nature: '温', taste: '甘/苦', meridian: '胃/肝', wuxing: '土', category: '饮品', desc: '暖胃降脂，消食化痰' },
    '菊花茶': { nature: '微寒', taste: '甘/苦', meridian: '肺/肝', wuxing: '金', category: '饮品', desc: '散风清热，平肝明目' },
    '玫瑰花茶': { nature: '温', taste: '甘/微苦', meridian: '肝/脾', wuxing: '木', category: '饮品', desc: '理气解郁，活血散瘀' },
    '金银花茶': { nature: '寒', taste: '甘', meridian: '肺/心/胃', wuxing: '金', category: '饮品', desc: '清热解毒，疏散风热' },
    '陈皮水': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '饮品', desc: '理气健脾，燥湿化痰' },
    '红枣水': { nature: '温', taste: '甘', meridian: '脾/胃/心', wuxing: '土', category: '饮品', desc: '补中益气，养血安神' },
    '枸杞水': { nature: '平', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '饮品', desc: '滋补肝肾，益精明目' },
    '姜茶': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '饮品', desc: '温中散寒，发汗解表' },
    '牛奶': { nature: '平', taste: '甘', meridian: '心/肺/胃', wuxing: '土', category: '饮品', desc: '补虚损，益肺胃，生津润肠' },
    '酸奶': { nature: '平', taste: '甘/酸', meridian: '心/肺/胃', wuxing: '土', category: '饮品', desc: '生津止渴，补虚开胃' },
    '豆浆': { nature: '平', taste: '甘', meridian: '肺/胃', wuxing: '水', category: '饮品', desc: '补虚润燥，清肺化痰' },
    '咖啡': { nature: '温', taste: '苦/甘', meridian: '心/肾', wuxing: '火', category: '饮品', desc: '提神醒脑，利尿消肿' },
    '酒': { nature: '大热', taste: '辛/甘/苦', meridian: '心/肝/肺/胃', wuxing: '火', category: '饮品', desc: '通血脉，御寒气，行药势' },

    // 药膳类
    '当归': { nature: '温', taste: '甘/辛', meridian: '肝/心/脾', wuxing: '火', category: '药材', desc: '补血活血，调经止痛' },
    '黄芪': { nature: '微温', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '药材', desc: '补气升阳，固表止汗' },
    '党参': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '药材', desc: '补中益气，健脾益肺' },
    '白术': { nature: '温', taste: '甘/苦', meridian: '脾/胃', wuxing: '土', category: '药材', desc: '健脾益气，燥湿利水' },
    '茯苓': { nature: '平', taste: '甘/淡', meridian: '心/脾/肾', wuxing: '土', category: '药材', desc: '利水渗湿，健脾宁心' },
    '甘草': { nature: '平', taste: '甘', meridian: '心/肺/脾/胃', wuxing: '土', category: '药材', desc: '补脾益气，清热解毒' },
    '熟地黄': { nature: '微温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '药材', desc: '滋阴补血，益精填髓' },
    '生地黄': { nature: '寒', taste: '甘/苦', meridian: '心/肝/肾', wuxing: '水', category: '药材', desc: '清热凉血，养阴生津' },
    '白芍': { nature: '微寒', taste: '苦/酸', meridian: '肝/脾', wuxing: '金', category: '药材', desc: '养血调经，敛阴止汗' },
    '川芎': { nature: '温', taste: '辛', meridian: '肝/胆/心包', wuxing: '木', category: '药材', desc: '活血行气，祛风止痛' },
    '丹参': { nature: '微寒', taste: '苦', meridian: '心/肝', wuxing: '火', category: '药材', desc: '活血祛瘀，通经止痛' },
    '三七': { nature: '温', taste: '甘/微苦', meridian: '肝/胃', wuxing: '火', category: '药材', desc: '散瘀止血，消肿定痛' },
    '阿胶': { nature: '平', taste: '甘', meridian: '肺/肝/肾', wuxing: '水', category: '药材', desc: '补血滋阴，润燥止血' },
    '麦冬': { nature: '微寒', taste: '甘/微苦', meridian: '心/肺/胃', wuxing: '金', category: '药材', desc: '养阴生津，润肺清心' },
    '天冬': { nature: '寒', taste: '甘/苦', meridian: '肺/肾', wuxing: '水', category: '药材', desc: '养阴润燥，清肺生津' },
    '百合': { nature: '微寒', taste: '甘', meridian: '心/肺', wuxing: '金', category: '药材', desc: '养阴润肺，清心安神' },
    '莲子': { nature: '平', taste: '甘/涩', meridian: '脾/肾/心', wuxing: '土', category: '药材', desc: '补脾止泻，益肾涩精，养心安神' },
    '芡实': { nature: '平', taste: '甘/涩', meridian: '脾/肾', wuxing: '土', category: '药材', desc: '益肾固精，补脾止泻' },
    '山药': { nature: '平', taste: '甘', meridian: '脾/肺/肾', wuxing: '土', category: '药材', desc: '补脾养胃，生津益肺，补肾涩精' },
    '山茱萸': { nature: '微温', taste: '酸/涩', meridian: '肝/肾', wuxing: '水', category: '药材', desc: '补益肝肾，涩精固脱' },
    '枸杞子': { nature: '平', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '药材', desc: '滋补肝肾，益精明目' },
    '女贞子': { nature: '凉', taste: '甘/苦', meridian: '肝/肾', wuxing: '水', category: '药材', desc: '滋补肝肾，明目乌发' },
    '墨旱莲': { nature: '寒', taste: '甘/酸', meridian: '肾/肝', wuxing: '水', category: '药材', desc: '滋补肝肾，凉血止血' },
    '菟丝子': { nature: '温', taste: '辛/甘', meridian: '肾/肝/脾', wuxing: '火', category: '药材', desc: '滋补肝肾，固精缩尿' },
    '杜仲': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '木', category: '药材', desc: '补肝肾，强筋骨，安胎' },
    '桑寄生': { nature: '平', taste: '苦/甘', meridian: '肝/肾', wuxing: '木', category: '药材', desc: '祛风湿，补肝肾，强筋骨' },
    '灵芝': { nature: '平', taste: '甘', meridian: '心/肺/肝/肾', wuxing: '土', category: '药材', desc: '补气安神，止咳平喘' },
    '酸枣仁': { nature: '平', taste: '甘/酸', meridian: '肝/胆/心', wuxing: '木', category: '药材', desc: '养心补肝，宁心安神' },
    '五味子': { nature: '温', taste: '酸/甘', meridian: '肺/心/肾', wuxing: '金', category: '药材', desc: '收敛固涩，益气生津' },
    '合欢皮': { nature: '平', taste: '甘', meridian: '心/肝/肺', wuxing: '木', category: '药材', desc: '解郁安神，活血消肿' },
    '牡丹皮': { nature: '微寒', taste: '苦/辛', meridian: '心/肝/肾', wuxing: '火', category: '药材', desc: '清热凉血，活血化瘀' },
    '麦芽': { nature: '平', taste: '甘', meridian: '脾/胃/肝', wuxing: '木', category: '药材', desc: '行气消食，健脾开胃' },

    // 海鲜类
    '海带': { nature: '寒', taste: '咸', meridian: '肝/胃/肾', wuxing: '水', category: '海鲜', desc: '软坚散结，利水消肿' },
    '紫菜': { nature: '寒', taste: '甘/咸', meridian: '肺/脾/膀胱', wuxing: '水', category: '海鲜', desc: '化痰软坚，清热利水' },
    '海参': { nature: '平', taste: '甘/咸', meridian: '肾/心', wuxing: '水', category: '海鲜', desc: '补肾益精，养血润燥' },
    '鲍鱼': { nature: '平', taste: '甘/咸', meridian: '肝/肾', wuxing: '水', category: '海鲜', desc: '养血柔肝，滋阴清热' },

    // 其他
    '燕窝': { nature: '平', taste: '甘', meridian: '肺/胃/肾', wuxing: '水', category: '滋补', desc: '养阴润燥，益气补中' },
    '银耳': { nature: '平', taste: '甘/淡', meridian: '肺/胃/肾', wuxing: '金', category: '滋补', desc: '滋阴润肺，养胃生津' },
    '花胶': { nature: '平', taste: '甘/咸', meridian: '肾/肝', wuxing: '水', category: '滋补', desc: '滋阴养颜，补肾益精' },

    // 新增常见食材（用于成品菜肴拆解）
    '生菜': { nature: '凉', taste: '甘', meridian: '胃/大肠', wuxing: '木', category: '蔬菜', desc: '清热爽神，清肝利胆' },
    '土豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '健脾益气，和胃调中' },
    '马铃薯': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '健脾益气，和胃调中' },
    '洋葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '理气和胃，发散风寒' },
    '竹笋': { nature: '微寒', taste: '甘', meridian: '胃/大肠', wuxing: '木', category: '蔬菜', desc: '清热化痰，益气和胃' },
    '玉米': { nature: '平', taste: '甘', meridian: '胃/大肠', wuxing: '土', category: '蔬菜', desc: '调中开胃，益肺宁心' },
    '西兰花': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '木', category: '蔬菜', desc: '补肾填精，健脑壮骨' },
    '青椒': { nature: '温', taste: '辛', meridian: '心/脾', wuxing: '火', category: '蔬菜', desc: '温中散寒，开胃消食' },
    '甜椒': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '健脾开胃，生津止渴' },
    '四季豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '健脾和中，消暑化湿' },
    '豆芽': { nature: '凉', taste: '甘', meridian: '脾/胃', wuxing: '木', category: '蔬菜', desc: '清热利湿，消肿除痹' },
    '黄豆芽': { nature: '凉', taste: '甘', meridian: '脾/胃', wuxing: '木', category: '蔬菜', desc: '清热利湿，消肿除痹' },
    '绿豆芽': { nature: '凉', taste: '甘', meridian: '脾/胃', wuxing: '木', category: '蔬菜', desc: '清热利湿，消肿除痹' },
    '韭菜': { nature: '温', taste: '辛', meridian: '肝/胃/肾', wuxing: '火', category: '蔬菜', desc: '补肾温阳，行气理血' },
    '香菜': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '蔬菜', desc: '发汗透疹，消食下气' },
    '茴香': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '蔬菜', desc: '温肾散寒，和胃理气' },
    '蒜苗': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '蔬菜', desc: '醒脾消食，杀菌' },
    '茼蒿': { nature: '平', taste: '甘/辛', meridian: '肝/脾', wuxing: '木', category: '蔬菜', desc: '和脾胃，消痰饮' },
    '油麦菜': { nature: '凉', taste: '甘', meridian: '胃/肝', wuxing: '木', category: '蔬菜', desc: '清热利尿，清肝利胆' },
    '空心菜': { nature: '寒', taste: '甘', meridian: '肠/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，凉血利尿' },
    '苋菜': { nature: '凉', taste: '甘', meridian: '大肠/小肠', wuxing: '木', category: '蔬菜', desc: '清热解毒，利尿除湿' },
    '芥蓝': { nature: '凉', taste: '甘/辛', meridian: '肺/胃', wuxing: '木', category: '蔬菜', desc: '解毒利咽，化痰平喘' },
    '莴笋': { nature: '凉', taste: '甘/苦', meridian: '胃/小肠', wuxing: '木', category: '蔬菜', desc: '清热利尿，通乳' },
    '芦笋': { nature: '凉', taste: '甘', meridian: '肺/胃', wuxing: '木', category: '蔬菜', desc: '清热生津，利水通淋' },
    '秋葵': { nature: '寒', taste: '甘', meridian: '胃/肾', wuxing: '水', category: '蔬菜', desc: '利咽通淋，下乳调经' },
    '冬瓜': { nature: '微寒', taste: '甘/淡', meridian: '肺/大肠/小肠/膀胱', wuxing: '水', category: '蔬菜', desc: '清热化痰，利尿消肿' },
    '佛手瓜': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '理气和中，疏肝止咳' },
    '百合': { nature: '微寒', taste: '甘', meridian: '心/肺', wuxing: '金', category: '蔬菜', desc: '养阴润肺，清心安神' },
    '荸荠': { nature: '寒', taste: '甘', meridian: '肺/胃', wuxing: '水', category: '蔬菜', desc: '清热生津，化痰消积' },
    '菱角': { nature: '凉', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '蔬菜', desc: '健脾益胃，除烦止渴' },
    '慈姑': { nature: '微寒', taste: '甘/苦', meridian: '肝/肺', wuxing: '水', category: '蔬菜', desc: '清热止血，解毒消肿' },
    '芋头': { nature: '平', taste: '甘/辛', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '健脾补虚，散结解毒' },
    '红薯': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '补脾益气，宽肠通便' },
    '紫薯': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '补脾益气，宽肠通便' },
    '山药': { nature: '平', taste: '甘', meridian: '脾/肺/肾', wuxing: '土', category: '蔬菜', desc: '补脾养胃，生津益肺，补肾涩精' },
    '牛蒡': { nature: '凉', taste: '甘', meridian: '肺/胃', wuxing: '木', category: '蔬菜', desc: '疏风散热，解毒消肿' },
    '葛根': { nature: '凉', taste: '甘/辛', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '解肌退热，生津止渴' },
    '蕨菜': { nature: '寒', taste: '甘', meridian: '胃/大肠', wuxing: '木', category: '蔬菜', desc: '清热滑肠，降气化痰' },
    '香椿': { nature: '平', taste: '甘/苦', meridian: '胃/大肠', wuxing: '木', category: '蔬菜', desc: '清热解毒，健胃理气' },
    '荠菜': { nature: '凉', taste: '甘', meridian: '肝/脾', wuxing: '木', category: '蔬菜', desc: '和脾利水，止血明目' },
    '马齿苋': { nature: '寒', taste: '酸', meridian: '肝/大肠', wuxing: '木', category: '蔬菜', desc: '清热解毒，凉血止血' },
    '蒲公英': { nature: '寒', taste: '甘/苦', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，消肿散结' },
    '鱼腥草': { nature: '微寒', taste: '辛', meridian: '肺', wuxing: '金', category: '蔬菜', desc: '清热解毒，消痈排脓' },
    '薄荷': { nature: '凉', taste: '辛', meridian: '肺/肝', wuxing: '木', category: '蔬菜', desc: '疏散风热，清利头目' },
    '紫苏': { nature: '温', taste: '辛', meridian: '肺/脾', wuxing: '金', category: '蔬菜', desc: '解表散寒，行气和胃' },
    '罗勒': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '蔬菜', desc: '化湿消食，行气活血' },
    '芝麻菜': { nature: '平', taste: '辛/甘', meridian: '肺/肾', wuxing: '木', category: '蔬菜', desc: '补肝益肾，润燥' },
    '西洋菜': { nature: '凉', taste: '甘/苦', meridian: '肺/膀胱', wuxing: '水', category: '蔬菜', desc: '清热止咳，利尿解毒' },
    '枸杞叶': { nature: '凉', taste: '甘/苦', meridian: '肝/肾', wuxing: '水', category: '蔬菜', desc: '补虚益精，清热明目' },
    '菊花脑': { nature: '凉', taste: '甘/苦', meridian: '肝/肺', wuxing: '木', category: '蔬菜', desc: '清热解毒，平肝明目' },
    '苜蓿': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '清脾胃，利大小肠' },
    '冰草': { nature: '凉', taste: '甘/咸', meridian: '胃/肾', wuxing: '水', category: '蔬菜', desc: '清热润燥，生津' },
    '穿心莲': { nature: '寒', taste: '苦', meridian: '心/肺', wuxing: '火', category: '蔬菜', desc: '清热解毒，凉血消肿' },
    '救心菜': { nature: '平', taste: '甘/微酸', meridian: '心/肝', wuxing: '木', category: '蔬菜', desc: '养心安神，活血化瘀' },
    '费菜': { nature: '平', taste: '甘/酸', meridian: '心/肝', wuxing: '木', category: '蔬菜', desc: '养心安神，活血化瘀' },
    '养心菜': { nature: '平', taste: '甘/酸', meridian: '心/肝', wuxing: '木', category: '蔬菜', desc: '养心安神，活血化瘀' },
    '高钙菜': { nature: '平', taste: '甘/酸', meridian: '心/肝', wuxing: '木', category: '蔬菜', desc: '养心安神，活血化瘀' },
    '景天三七': { nature: '平', taste: '甘/酸', meridian: '心/肝', wuxing: '木', category: '蔬菜', desc: '养心安神，活血化瘀' },
    '白子菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，止血' },
    '明月草': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '神仙草': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '富贵菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '百子菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '长寿菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '白背三七': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，降血糖' },
    '红凤菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，止血' },
    '紫背天葵': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，止血' },
    '血皮菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，止血' },
    '观音菜': { nature: '凉', taste: '甘', meridian: '肝/胃', wuxing: '木', category: '蔬菜', desc: '清热解毒，止血' },
    '木耳菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '落葵': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '藤菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '潺菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '豆腐菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '紫角叶': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '软浆叶': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '滑腹菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '滑藤菜': { nature: '寒', taste: '甘/酸', meridian: '心/肝/脾', wuxing: '水', category: '蔬菜', desc: '清热凉血，润燥滑肠' },
    '西洋菜': { nature: '凉', taste: '甘/苦', meridian: '肺/膀胱', wuxing: '水', category: '蔬菜', desc: '清热止咳，利尿解毒' },
    '豆瓣菜': { nature: '凉', taste: '甘/苦', meridian: '肺/膀胱', wuxing: '水', category: '蔬菜', desc: '清热止咳，利尿解毒' },
    '水田芥': { nature: '凉', taste: '甘/苦', meridian: '肺/膀胱', wuxing: '水', category: '蔬菜', desc: '清热止咳，利尿解毒' },
    '芥菜': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '宣肺豁痰，温中利气' },
    '雪里蕻': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '宣肺豁痰，温中利气' },
    '榨菜': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '宣肺豁痰，开胃下气' },
    '大头菜': { nature: '温', taste: '辛/甘', meridian: '肺/胃', wuxing: '金', category: '蔬菜', desc: '宣肺豁痰，开胃下气' },
    '苤蓝': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '球茎甘蓝': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '擘蓝': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '芥蓝头': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '菜头': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '芥菜头': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '疙瘩菜': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },
    '苤蓝': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '蔬菜', desc: '宽胸止渴，化痰' },

    // 新增：常见加工/辅料食材
    '酵母': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾消食，发酵助化' },
    '酵母粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾消食，发酵助化' },
    '泡打粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '膨松剂，少量无碍' },
    '小苏打': { nature: '平', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '膨松剂，少量无碍' },
    '食用碱': { nature: '平', taste: '甘/涩', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '中和酸性，少量无碍' },
    '碱': { nature: '平', taste: '甘/涩', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '中和酸性，少量无碍' },
    '明矾': { nature: '寒', taste: '酸/涩', meridian: '肺/脾', wuxing: '金', category: '其他', desc: '收敛固涩，但含铝不宜多食' },
    '棕榈油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '高温稳定，但饱和脂肪酸高' },
    '植物油': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '润燥滑肠，适量为宜' },
    '橄榄油': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '润燥滑肠，益心血管' },
    '芝麻油': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '其他', desc: '补肝肾，益精血，润肠燥' },
    '香油': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '其他', desc: '补肝肾，益精血，润肠燥' },
    '猪油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚润燥，但高脂' },
    '牛油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚润燥，但高脂' },
    '黄油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '润燥养阴，但滋腻难化' },
    '奶油': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '滋阴润燥，但高脂滋腻' },
    '芝士': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补钙益气，但滋腻难化' },
    '奶酪': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补钙益气，但滋腻难化' },
    '蛋黄酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '滋阴润燥，但高脂' },
    '沙拉酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '滋阴润燥，但高脂' },
    '芝麻酱': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '其他', desc: '补肝肾，益精血，润肠燥' },
    '花生酱': { nature: '温', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '健脾和胃，润肺化痰' },
    '甜面酱': { nature: '平', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '开胃助食' },
    '豆瓣酱': { nature: '温', taste: '辛/咸', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '开胃消食，但辛辣' },
    '豆豉': { nature: '平', taste: '甘/咸', meridian: '胃/肺', wuxing: '水', category: '其他', desc: '解表除烦，宣发郁热' },
    '腐乳': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '韭菜花': { nature: '温', taste: '辛', meridian: '肝/肾', wuxing: '火', category: '其他', desc: '温肾助阳，但辛热' },
    '沙茶酱': { nature: '温', taste: '辛/甘', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '开胃消食，但辛温' },
    '芥末': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '温中散寒，但辛辣刺激' },
    '番茄酱': { nature: '微寒', taste: '酸/甘', meridian: '肝/脾/胃', wuxing: '木', category: '其他', desc: '生津止渴，健胃消食' },
    '咖喱粉': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒，但辛热' },
    '孜然': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '理气开胃，但辛温' },
    '五香粉': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒，但辛热' },
    '香叶': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '迷迭香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '百里香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '鱼露': { nature: '温', taste: '咸', meridian: '脾/胃', wuxing: '水', category: '其他', desc: '开胃助食，但咸重' },
    '蚝油': { nature: '温', taste: '咸/甘', meridian: '脾/胃', wuxing: '水', category: '其他', desc: '滋阴润燥，但咸重' },
    '料酒': { nature: '温', taste: '辛/甘', meridian: '心/肝/肺/胃', wuxing: '火', category: '其他', desc: '通血脉，去腥膻' },
    '味精': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '提鲜增味，少量无碍' },
    '鸡精': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '提鲜增味，少量无碍' },
    '盐': { nature: '寒', taste: '咸', meridian: '胃/肾/大肠/小肠', wuxing: '水', category: '其他', desc: '涌吐消痰，凉血解毒' },
    '食盐': { nature: '寒', taste: '咸', meridian: '胃/肾/大肠/小肠', wuxing: '水', category: '其他', desc: '涌吐消痰，凉血解毒' },
    '酱油': { nature: '寒', taste: '咸', meridian: '脾/胃/肾', wuxing: '水', category: '其他', desc: '除热解毒' },
    '醋': { nature: '温', taste: '酸/苦', meridian: '肝/胃', wuxing: '木', category: '其他', desc: '散瘀止血，解毒杀虫' },
    '米醋': { nature: '温', taste: '酸/苦', meridian: '肝/胃', wuxing: '木', category: '其他', desc: '散瘀止血，解毒杀虫' },
    '陈醋': { nature: '温', taste: '酸/苦', meridian: '肝/胃', wuxing: '木', category: '其他', desc: '散瘀止血，解毒杀虫' },
    '白醋': { nature: '温', taste: '酸/苦', meridian: '肝/胃', wuxing: '木', category: '其他', desc: '散瘀止血，解毒杀虫' },
    '淀粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '生粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '木薯淀粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '玉米淀粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '红薯淀粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '土豆淀粉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中益气，健脾和胃' },
    '藕粉': { nature: '平', taste: '甘', meridian: '心/脾/胃', wuxing: '金', category: '其他', desc: '健脾开胃，养血止血' },
    '葛根粉': { nature: '凉', taste: '甘/辛', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '解肌退热，生津止渴' },
    '马蹄粉': { nature: '寒', taste: '甘', meridian: '肺/胃', wuxing: '水', category: '其他', desc: '清热生津，化痰消积' },
    '西米': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾和胃，补中益气' },
    '椰浆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚强壮，益气祛风' },
    '椰子': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚强壮，益气祛风' },
    '椰汁': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚强壮，益气祛风' },
    '椰蓉': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚强壮，益气祛风' },
    '椰果': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补虚强壮，益气祛风' },
    '西米露': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾和胃，补中益气' },
    '龟板': { nature: '寒', taste: '甘/咸', meridian: '肾/心/肝', wuxing: '水', category: '其他', desc: '滋阴潜阳，益肾健骨' },
    '土茯苓': { nature: '平', taste: '甘/淡', meridian: '肝/胃', wuxing: '土', category: '其他', desc: '解毒除湿，通利关节' },
    '桂花': { nature: '温', taste: '辛', meridian: '肺/脾/肾', wuxing: '金', category: '其他', desc: '温肺化饮，散寒止痛' },
    '茉莉花': { nature: '温', taste: '辛/甘', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '理气开郁，辟秽和中' },
    '玫瑰花': { nature: '温', taste: '甘/微苦', meridian: '肝/脾', wuxing: '木', category: '其他', desc: '理气解郁，活血散瘀' },
    '菊花': { nature: '微寒', taste: '甘/苦', meridian: '肺/肝', wuxing: '金', category: '其他', desc: '散风清热，平肝明目' },
    '金银花': { nature: '寒', taste: '甘', meridian: '肺/心/胃', wuxing: '金', category: '其他', desc: '清热解毒，疏散风热' },
    '枸杞': { nature: '平', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '其他', desc: '滋补肝肾，益精明目' },
    '红枣': { nature: '温', taste: '甘', meridian: '脾/胃/心', wuxing: '土', category: '其他', desc: '补中益气，养血安神' },
    '桂圆': { nature: '温', taste: '甘', meridian: '心/脾', wuxing: '火', category: '其他', desc: '补益心脾，养血安神' },
    '莲子': { nature: '平', taste: '甘/涩', meridian: '脾/肾/心', wuxing: '土', category: '其他', desc: '补脾止泻，益肾涩精，养心安神' },
    '芡实': { nature: '平', taste: '甘/涩', meridian: '脾/肾', wuxing: '土', category: '其他', desc: '益肾固精，补脾止泻' },
    '百合': { nature: '微寒', taste: '甘', meridian: '心/肺', wuxing: '金', category: '其他', desc: '养阴润肺，清心安神' },
    '银耳': { nature: '平', taste: '甘/淡', meridian: '肺/胃/肾', wuxing: '金', category: '其他', desc: '滋阴润肺，养胃生津' },
    '木耳': { nature: '平', taste: '甘', meridian: '胃/大肠', wuxing: '水', category: '其他', desc: '补气养血，润肺止咳' },
    '香菇': { nature: '平', taste: '甘', meridian: '胃/肝', wuxing: '土', category: '其他', desc: '扶正补虚，健脾开胃' },
    '金针菇': { nature: '凉', taste: '甘', meridian: '胃/肠', wuxing: '木', category: '其他', desc: '益肠胃，化痰理气' },
    '杏鲍菇': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾开胃，化痰理气' },
    '平菇': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾开胃，化痰理气' },
    '口蘑': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾开胃，化痰理气' },
    '鸡腿菇': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾开胃，化痰理气' },
    '茶树菇': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾开胃，化痰理气' },
    '猴头菇': { nature: '平', taste: '甘', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾养胃，安神' },
    '竹荪': { nature: '凉', taste: '甘', meridian: '胃/肺', wuxing: '水', category: '其他', desc: '补气养阴，润肺止咳' },
    '虫草花': { nature: '平', taste: '甘', meridian: '肺/肾', wuxing: '土', category: '其他', desc: '补肺益肾，化痰' },
    '茯苓': { nature: '平', taste: '甘/淡', meridian: '心/脾/肾', wuxing: '土', category: '其他', desc: '利水渗湿，健脾宁心' },
    '薏米': { nature: '微寒', taste: '甘/淡', meridian: '脾/胃/肺', wuxing: '土', category: '其他', desc: '健脾渗湿，清热排脓' },
    '赤小豆': { nature: '平', taste: '甘/酸', meridian: '心/小肠', wuxing: '火', category: '其他', desc: '利水消肿，解毒排脓' },
    '红豆': { nature: '平', taste: '甘/酸', meridian: '心/小肠', wuxing: '火', category: '其他', desc: '健脾利水，补血养心' },
    '绿豆': { nature: '寒', taste: '甘', meridian: '心/胃', wuxing: '木', category: '其他', desc: '清热解毒，消暑利水' },
    '黑豆': { nature: '平', taste: '甘', meridian: '脾/肾', wuxing: '水', category: '其他', desc: '补肾益阴，健脾利湿' },
    '黄豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '水', category: '其他', desc: '健脾宽中，润燥消水' },
    '白扁豆': { nature: '微温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾化湿，和中消暑' },
    '鹰嘴豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，补中益气' },
    '豌豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，补中益气' },
    '蚕豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，补中益气' },
    '豇豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，补中益气' },
    '毛豆': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾宽中，润燥消水' },
    '花生': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '健脾和胃，润肺化痰' },
    '核桃': { nature: '温', taste: '甘', meridian: '肾/肺/大肠', wuxing: '火', category: '其他', desc: '补肾固精，温肺定喘' },
    '杏仁': { nature: '温', taste: '苦', meridian: '肺/大肠', wuxing: '金', category: '其他', desc: '止咳平喘，润肠通便' },
    '芝麻': { nature: '平', taste: '甘', meridian: '肝/肾/肺/脾', wuxing: '水', category: '其他', desc: '补肝肾，益精血，润肠燥' },
    '松子': { nature: '温', taste: '甘', meridian: '肝/肺/大肠', wuxing: '火', category: '其他', desc: '润燥滑肠，补益气血' },
    '腰果': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，润肠通便' },
    '开心果': { nature: '温', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '健脾开胃，润肺化痰' },
    '碧根果': { nature: '温', taste: '甘', meridian: '肾/肺', wuxing: '火', category: '其他', desc: '补肾固精，温肺定喘' },
    '夏威夷果': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，润肠通便' },
    '巴旦木': { nature: '平', taste: '甘', meridian: '肺/脾', wuxing: '土', category: '其他', desc: '健脾开胃，润肺化痰' },
    '榛子': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，润肠通便' },
    '栗子': { nature: '温', taste: '甘', meridian: '脾/胃/肾', wuxing: '土', category: '其他', desc: '健脾养胃，补肾强筋' },
    '白果': { nature: '平', taste: '甘/苦/涩', meridian: '肺/肾', wuxing: '金', category: '其他', desc: '敛肺定喘，止带缩尿' },
    '葵花籽': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，润肠通便' },
    '南瓜子': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，驱虫' },
    '西瓜子': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '健脾开胃，润肠通便' },
    '莲子心': { nature: '寒', taste: '苦', meridian: '心/肾', wuxing: '火', category: '其他', desc: '清心安神，交通心肾' },
    '百合干': { nature: '微寒', taste: '甘', meridian: '心/肺', wuxing: '金', category: '其他', desc: '养阴润肺，清心安神' },
    '黄花菜': { nature: '凉', taste: '甘', meridian: '肝/脾', wuxing: '木', category: '其他', desc: '清热利湿，宽胸解郁' },
    '笋干': { nature: '微寒', taste: '甘', meridian: '胃/大肠', wuxing: '木', category: '其他', desc: '清热化痰，益气和胃' },
    '梅干菜': { nature: '平', taste: '甘/咸', meridian: '胃/大肠', wuxing: '土', category: '其他', desc: '开胃下气，益血生津' },
    '雪菜': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '宣肺豁痰，温中利气' },
    '酸菜': { nature: '温', taste: '酸', meridian: '胃/大肠', wuxing: '木', category: '其他', desc: '开胃消食，但咸重' },
    '泡菜': { nature: '温', taste: '酸/辛', meridian: '胃/大肠', wuxing: '木', category: '其他', desc: '开胃消食，但辛香' },
    '腌菜': { nature: '温', taste: '咸', meridian: '胃/大肠', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '酱菜': { nature: '温', taste: '咸', meridian: '胃/大肠', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '咸菜': { nature: '温', taste: '咸', meridian: '胃/大肠', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '萝卜干': { nature: '平', taste: '甘/辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '消食化痰，下气宽中' },
    '榨菜': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '宣肺豁痰，开胃下气' },
    '腐乳': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '臭豆腐': { nature: '温', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '开胃消食，但咸重' },
    '豆豉': { nature: '平', taste: '甘/咸', meridian: '胃/肺', wuxing: '水', category: '其他', desc: '解表除烦，宣发郁热' },
    '纳豆': { nature: '平', taste: '甘/咸', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾消食，但气味特殊' },
    '味噌': { nature: '平', taste: '甘/咸', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾消食，但咸重' },
    '大酱': { nature: '温', taste: '甘/咸', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾消食，但咸重' },
    '黄酱': { nature: '温', taste: '甘/咸', meridian: '胃/脾', wuxing: '土', category: '其他', desc: '健脾消食，但咸重' },
    '甜面酱': { nature: '平', taste: '甘/咸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '开胃助食' },
    '豆瓣酱': { nature: '温', taste: '辛/咸', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '开胃消食，但辛辣' },
    '辣椒酱': { nature: '热', taste: '辛', meridian: '心/脾', wuxing: '火', category: '其他', desc: '温中散寒，但辛热' },
    '番茄酱': { nature: '微寒', taste: '酸/甘', meridian: '肝/脾/胃', wuxing: '木', category: '其他', desc: '生津止渴，健胃消食' },
    '沙拉酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '滋阴润燥，但高脂' },
    '千岛酱': { nature: '温', taste: '甘/酸', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '滋阴润燥，但高脂' },
    '芝麻酱': { nature: '温', taste: '甘', meridian: '肝/肾', wuxing: '水', category: '其他', desc: '补肝肾，益精血，润肠燥' },
    '花生酱': { nature: '温', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '健脾和胃，润肺化痰' },
    '巧克力酱': { nature: '温', taste: '甘/苦', meridian: '心/脾', wuxing: '火', category: '其他', desc: '提神醒脑，但高糖' },
    '果酱': { nature: '平', taste: '甘/酸', meridian: '脾/胃', wuxing: '木', category: '其他', desc: '生津止渴，开胃消食' },
    '蜂蜜': { nature: '平', taste: '甘', meridian: '肺/脾/大肠', wuxing: '土', category: '其他', desc: '补中润燥，止痛解毒' },
    '枫糖浆': { nature: '平', taste: '甘', meridian: '肺/脾', wuxing: '土', category: '其他', desc: '润肺止咳，生津止渴' },
    '麦芽糖': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '饴糖': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '冰糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '补中益气，和胃润肺' },
    '红糖': { nature: '温', taste: '甘', meridian: '脾/胃/肝', wuxing: '土', category: '其他', desc: '补中缓肝，活血和瘀' },
    '白砂糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '绵白糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '糖粉': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '方糖': { nature: '平', taste: '甘', meridian: '脾/肺', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '黄糖': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补脾益气，和胃润肺' },
    '黑糖': { nature: '温', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补中缓肝，活血和瘀' },
    '椰糖': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '补脾益气，润肺止咳' },
    '代糖': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '甜味剂，少量无碍' },
    '木糖醇': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '甜味剂，少量无碍' },
    '赤藓糖醇': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '甜味剂，少量无碍' },
    '甜菊糖': { nature: '平', taste: '甘', meridian: '脾/胃', wuxing: '土', category: '其他', desc: '甜味剂，少量无碍' },
    '罗汉果糖': { nature: '平', taste: '甘', meridian: '肺/脾', wuxing: '土', category: '其他', desc: '清热润肺，止咳化痰' },
    '甘草': { nature: '平', taste: '甘', meridian: '心/肺/脾/胃', wuxing: '土', category: '其他', desc: '补脾益气，清热解毒' },
    '陈皮': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '其他', desc: '理气健脾，燥湿化痰' },
    '橘皮': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '其他', desc: '理气健脾，燥湿化痰' },
    '广皮': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '其他', desc: '理气健脾，燥湿化痰' },
    '新会皮': { nature: '温', taste: '辛/苦', meridian: '脾/肺', wuxing: '金', category: '其他', desc: '理气健脾，燥湿化痰' },
    '青皮': { nature: '温', taste: '辛/苦', meridian: '肝/胆', wuxing: '木', category: '其他', desc: '疏肝破气，消积化滞' },
    '枳壳': { nature: '微寒', taste: '苦/辛', meridian: '脾/胃', wuxing: '木', category: '其他', desc: '理气宽中，行滞消胀' },
    '枳实': { nature: '微寒', taste: '苦/辛', meridian: '脾/胃', wuxing: '木', category: '其他', desc: '破气消积，化痰散痞' },
    '佛手': { nature: '温', taste: '辛/苦/酸', meridian: '肝/脾/胃', wuxing: '木', category: '其他', desc: '疏肝理气，和胃止痛' },
    '香橼': { nature: '温', taste: '辛/苦/酸', meridian: '肝/脾/胃', wuxing: '木', category: '其他', desc: '疏肝理气，和胃止痛' },
    '木香': { nature: '温', taste: '辛/苦', meridian: '脾/胃/大肠', wuxing: '木', category: '其他', desc: '行气止痛，健脾消食' },
    '砂仁': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '化湿开胃，温脾止泻' },
    '白豆蔻': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '火', category: '其他', desc: '化湿行气，温中止呕' },
    '肉豆蔻': { nature: '温', taste: '辛', meridian: '脾/胃/大肠', wuxing: '火', category: '其他', desc: '温中行气，涩肠止泻' },
    '草果': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '燥湿温中，截疟除痰' },
    '草豆蔻': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '燥湿行气，温中止呕' },
    '高良姜': { nature: '热', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温胃止呕，散寒止痛' },
    '干姜': { nature: '热', taste: '辛', meridian: '脾/胃/肾/心/肺', wuxing: '火', category: '其他', desc: '温中散寒，回阳通脉' },
    '炮姜': { nature: '热', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温经止血，温中止痛' },
    '姜炭': { nature: '热', taste: '辛/涩', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温经止血，温脾止泻' },
    '生姜': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '鲜姜': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '老姜': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '温中散寒，回阳通脉' },
    '子姜': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜芽': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜皮': { nature: '凉', taste: '辛', meridian: '脾/肺', wuxing: '金', category: '其他', desc: '行水消肿' },
    '姜汁': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜丝': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜片': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜末': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜粉': { nature: '微温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗解表，温中止呕' },
    '姜糖': { nature: '温', taste: '辛/甘', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '温中散寒，和胃止呕' },
    '姜茶': { nature: '温', taste: '辛/甘', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '温中散寒，和胃止呕' },
    '姜汤': { nature: '温', taste: '辛/甘', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '温中散寒，和胃止呕' },
    '葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '大葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '小葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '青葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱白': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱绿': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱花': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱段': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱末': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱油': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '蒜': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '大蒜': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜头': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜瓣': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜泥': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜蓉': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜末': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '解毒杀虫，消肿止痛' },
    '蒜苗': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '醒脾消食，杀菌' },
    '蒜苔': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '醒脾消食，杀菌' },
    '蒜黄': { nature: '温', taste: '辛', meridian: '脾/胃/肺', wuxing: '金', category: '其他', desc: '醒脾消食，杀菌' },
    '韭菜': { nature: '温', taste: '辛', meridian: '肝/胃/肾', wuxing: '火', category: '其他', desc: '补肾温阳，行气理血' },
    '韭黄': { nature: '温', taste: '辛', meridian: '肝/胃/肾', wuxing: '火', category: '其他', desc: '补肾温阳，行气理血' },
    '韭苔': { nature: '温', taste: '辛', meridian: '肝/胃/肾', wuxing: '火', category: '其他', desc: '补肾温阳，行气理血' },
    '韭菜花': { nature: '温', taste: '辛', meridian: '肝/肾', wuxing: '火', category: '其他', desc: '温肾助阳，但辛热' },
    '韭花酱': { nature: '温', taste: '辛', meridian: '肝/肾', wuxing: '火', category: '其他', desc: '温肾助阳，但辛热' },
    '洋葱': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '理气和胃，发散风寒' },
    '洋葱头': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '理气和胃，发散风寒' },
    '红葱头': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '理气和胃，发散风寒' },
    ' shallot': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '理气和胃，发散风寒' },
    '香菜': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗透疹，消食下气' },
    '芫荽': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗透疹，消食下气' },
    '香菜叶': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗透疹，消食下气' },
    '香菜根': { nature: '温', taste: '辛', meridian: '肺/脾/胃', wuxing: '金', category: '其他', desc: '发汗透疹，消食下气' },
    '芹菜': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '西芹': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '香芹': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '水芹': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '芹菜叶': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '芹菜茎': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '芹菜根': { nature: '凉', taste: '甘/辛', meridian: '肝/胃/肺', wuxing: '木', category: '其他', desc: '清热平肝，利水消肿' },
    '茴香': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '其他', desc: '温肾散寒，和胃理气' },
    '小茴香': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '其他', desc: '温肾散寒，和胃理气' },
    '大茴香': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '其他', desc: '温阳散寒，理气止痛' },
    '八角': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '其他', desc: '温阳散寒，理气止痛' },
    '大料': { nature: '温', taste: '辛', meridian: '肝/肾/脾/胃', wuxing: '火', category: '其他', desc: '温阳散寒，理气止痛' },
    '花椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '麻椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '藤椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '青花椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '红花椒': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '花椒粉': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '花椒油': { nature: '温', taste: '辛', meridian: '脾/胃/肾', wuxing: '火', category: '其他', desc: '温中止痛，杀虫止痒' },
    '胡椒': { nature: '热', taste: '辛', meridian: '胃/大肠', wuxing: '火', category: '其他', desc: '温中下气，消痰解毒' },
    '白胡椒': { nature: '热', taste: '辛', meridian: '胃/大肠', wuxing: '火', category: '其他', desc: '温中下气，消痰解毒' },
    '黑胡椒': { nature: '热', taste: '辛', meridian: '胃/大肠', wuxing: '火', category: '其他', desc: '温中下气，消痰解毒' },
    '胡椒粉': { nature: '热', taste: '辛', meridian: '胃/大肠', wuxing: '火', category: '其他', desc: '温中下气，消痰解毒' },
    '桂皮': { nature: '热', taste: '辛/甘', meridian: '脾/胃/肝/肾', wuxing: '火', category: '其他', desc: '补火助阳，引火归元' },
    '肉桂': { nature: '热', taste: '辛/甘', meridian: '脾/胃/肝/肾', wuxing: '火', category: '其他', desc: '补火助阳，引火归元' },
    '官桂': { nature: '热', taste: '辛/甘', meridian: '脾/胃/肝/肾', wuxing: '火', category: '其他', desc: '补火助阳，引火归元' },
    '肉桂粉': { nature: '热', taste: '辛/甘', meridian: '脾/胃/肝/肾', wuxing: '火', category: '其他', desc: '补火助阳，引火归元' },
    '香叶': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '月桂叶': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '迷迭香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '百里香': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '温中散寒' },
    '罗勒': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '化湿消食，行气活血' },
    '九层塔': { nature: '温', taste: '辛', meridian: '脾/胃', wuxing: '火', category: '其他', desc: '化湿消食，行气活血' },
    '紫苏': { nature: '温', taste: '辛', meridian: '肺/脾', wuxing: '金', category: '其他', desc: '解表散寒，行气和胃' },
    '紫苏叶': { nature: '温', taste: '辛', meridian: '肺/脾', wuxing: '金', category: '其他', desc: '解表散寒，行气和胃' },
    '薄荷叶': { nature: '凉', taste: '辛', meridian: '肺/肝', wuxing: '木', category: '其他', desc: '疏散风热，清利头目' },
    '薄荷': { nature: '凉', taste: '辛', meridian: '肺/肝', wuxing: '木', category: '其他', desc: '疏散风热，清利头目' },
    '荆芥': { nature: '微温', taste: '辛', meridian: '肺/肝', wuxing: '木', category: '其他', desc: '解表散风，透疹消疮' },
    '白芷': { nature: '温', taste: '辛', meridian: '胃/大肠/肺', wuxing: '金', category: '其他', desc: '解表散寒，祛风止痛' },
    '细辛': { nature: '温', taste: '辛', meridian: '心/肺/肾', wuxing: '金', category: '其他', desc: '解表散寒，祛风止痛' },
    '辛夷': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '散风寒，通鼻窍' },
    '苍耳子': { nature: '温', taste: '辛/苦', meridian: '肺', wuxing: '金', category: '其他', desc: '散风寒，通鼻窍' },
    '鹅不食草': { nature: '温', taste: '辛', meridian: '肺', wuxing: '金', category: '其他', desc: '散风寒，通鼻窍' },
    '葱白': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱白头': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱须': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱根': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱子': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱花': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱段': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱末': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱油': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱香': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' },
    '葱味': { nature: '温', taste: '辛', meridian: '肺/胃', wuxing: '金', category: '其他', desc: '发表通阳，解毒消肿' }
  },

  // 体质禁忌映射
  constitutionRules: {
    '阴虚火旺': {
      avoidNature: ['热', '大热', '温'],
      avoidTaste: ['辛', '辣'],
      avoidFoods: ['羊肉', '辣椒', '花椒', '桂皮', '八角', '生姜', '大葱', '大蒜', '酒', '咖啡', '红茶', '桂圆', '核桃', '桃子', '樱桃', '荔枝', '龙眼'],
      preferNature: ['平', '凉', '微寒', '寒'],
      preferTaste: ['甘', '酸'],
      preferFoods: ['银耳', '百合', '梨', '苹果', '香蕉', '豆腐', '鸭肉', '猪肉', '绿豆', '冬瓜', '黄瓜', '菠菜', '芹菜'],
      reason: '阴虚火旺者体内阴液不足，阳气偏亢。热性食物助火伤阴，加重口干、失眠、烦躁等症状。'
    },
    '肝郁血瘀': {
      avoidNature: ['寒', '大热'],
      avoidTaste: ['酸', '涩'],
      avoidFoods: ['乌梅', '山楂', '醋', '柿子', '螃蟹', '苦瓜', '绿豆'],
      preferNature: ['平', '温', '微温'],
      preferTaste: ['辛', '甘'],
      preferFoods: ['玫瑰花茶', '陈皮', '生姜', '大葱', '洋葱', '韭菜', '香菜', '芹菜', '柑橘', '桃子', '樱桃'],
      reason: '肝郁血瘀者气机不畅，血行受阻。酸味收敛，不利于气机疏泄；寒性食物凝滞血脉。'
    },
    '脾虚湿蕴': {
      avoidNature: ['寒', '凉'],
      avoidTaste: ['甘', '腻'],
      avoidFoods: ['西瓜', '香蕉', '梨', '绿豆', '苦瓜', '海带', '紫菜', '螃蟹', '鸭肉', '牛奶', '酸奶', '冷饮', '生冷瓜果', '油腻', '甜食', '奶茶', '香菇'],
      preferNature: ['平', '温', '微温'],
      preferTaste: ['甘', '淡'],
      preferFoods: ['山药', '莲子', '芡实', '茯苓', '薏米', '红豆', '红枣', '桂圆', '糯米', '小米', '南瓜', '胡萝卜', '鸡肉', '牛肉'],
      reason: '脾虚湿蕴者运化无力，水湿内停。寒凉食物损伤脾阳，甜腻食物助湿生痰，加重腹胀、便溏、舌苔厚腻。'
    }
  },

  // 五运六气时令禁忌
  liuQiRules: {
    0: { // 初之气·寒包风
      avoid: ['生冷', '寒凉', '冰品'],
      prefer: ['温热', '辛散'],
      reason: '寒包风邪，宜温不宜凉，宜散不宜收'
    },
    1: { // 二之气·风火相煽
      avoid: ['辛辣', '发物', '温热'],
      prefer: ['清淡', '甘凉'],
      reason: '风火相煽，肝阳易亢，宜清不宜温'
    },
    2: { // 三之气·两火叠加
      avoid: ['辛辣', '烧烤', '羊肉', '酒', '温热', '油腻'],
      prefer: ['清凉', '甘淡', '滋阴'],
      reason: '两火叠加，全年最热，绝对禁温燥'
    },
    3: { // 四之气·湿热交蒸
      avoid: ['甜腻', '生冷', '油腻', '奶茶'],
      prefer: ['清淡', '利湿', '健脾'],
      reason: '湿气最重，脾土受困，宜健脾化湿'
    },
    4: { // 五之气·燥火当令
      avoid: ['辛辣', '温热', '煎炸'],
      prefer: ['滋阴', '润燥', '白色食物'],
      reason: '燥火伤阴，宜润不宜燥'
    },
    5: { // 终之气·寒燥收引
      avoid: ['寒凉', '生冷', '冰品'],
      prefer: ['温热', '滋补', '血肉有情'],
      reason: '寒燥交结，宜温养不宜寒凉'
    }
  },

  // 与当前方药的相互作用
  formulaInteractions: {
    '滋阴清热健脾安神方': {
      herbs: ['炒枣仁', '北柴胡', '墨旱莲', '酒山萸肉', '首乌藤', '麦冬', '酒黄芩', '炙甘草', '煅牡蛎', '珍珠母', '盐菟丝子', '炒杜仲', '淡豆豉', '生地黄', '炒鸡内金', '地骨皮', '酒女贞子', '醋五味子', '合欢皮', '生麦芽'],
      synergistic: ['酸枣仁', '百合', '莲子', '小麦', '银耳', '枸杞', '桑葚', '黑芝麻', '山药', '红枣', '玫瑰花', '合欢花', '玉竹', '麦冬', '菊花', '浮小麦', '首乌藤'],
      antagonistic: ['茶叶', '咖啡', '酒', '辛辣', '萝卜', '绿豆', '乌梅', '山楂', '醋', '柿子', '生冷', '油腻', '陈皮', '莓茶', '黄芪', '党参'],
      reason: '方以滋阴清热、健脾安神为主。当前睡眠仍不实，忌茶叶咖啡扰神；酒辛辣助火耗阴，与酒黄芩地骨皮清热方向相悖；萝卜绿豆解药性；乌梅山楂醋等酸涩收敛，与方中醋五味子叠加过收敛；生冷油腻碍胃，影响鸡内金麦芽健脾消食；陈皮苦燥伤津；黄芪党参升提助火，恐加重阴虚。'
    }
  },

  // 成品菜肴数据库：主要食材 + 烹饪方式 + 性味特征
  // 基于《饮膳正要》《随息居饮食谱》《调鼎集》等传统食养经典
  dishDB: {
    // 面点类
    '面包': {
      ingredients: ['小麦粉', '糖', '黄油', '鸡蛋', '酵母'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '烘烤面食，性偏温燥，易助火生热',
      tags: ['精制碳水', '烘烤', '高糖']
    },
    '包子': {
      ingredients: ['小麦粉', '猪肉', '白菜', '生姜', '大葱'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '蒸制面食，性较平和，馅料决定寒热',
      tags: ['蒸制', '荤素搭配']
    },
    '馒头': {
      ingredients: ['小麦粉', '酵母'],
      cookMethod: '蒸',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '纯蒸面食，性平味甘，健脾益气',
      tags: ['蒸制', '纯素']
    },
    '花卷': {
      ingredients: ['小麦粉', '大葱', '油', '盐'],
      cookMethod: '蒸',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '葱油蒸制，微温辛香',
      tags: ['蒸制', '葱油']
    },
    '饺子': {
      ingredients: ['小麦粉', '猪肉', '白菜', '生姜'],
      cookMethod: '煮/蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '水煮或蒸制，性平和，馅料多样',
      tags: ['水煮', '荤素搭配']
    },
    '馄饨': {
      ingredients: ['小麦粉', '猪肉', '虾仁', '紫菜', '虾皮'],
      cookMethod: '煮',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '水煮面食，汤鲜味美',
      tags: ['水煮', '海鲜汤底']
    },
    '面条': {
      ingredients: ['小麦粉'],
      cookMethod: '煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '水煮面食，性平健脾',
      tags: ['水煮', '基础主食']
    },
    '拉面': {
      ingredients: ['小麦粉', '牛肉', '香菜', '辣椒油'],
      cookMethod: '煮',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '牛肉汤底，辛香温热',
      tags: ['水煮', '牛肉汤', '辛辣']
    },
    '煎饼': {
      ingredients: ['绿豆面', '鸡蛋', '油条', '甜面酱', '大葱'],
      cookMethod: '煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '油煎面食，性偏温燥',
      tags: ['油煎', '高热量']
    },
    '油条': {
      ingredients: ['小麦粉', '明矾', '油'],
      cookMethod: '油炸',
      nature: '热', taste: '甘', wuxing: '火',
      desc: '高温油炸，性热燥烈，难消化',
      tags: ['油炸', '燥热', '难消化']
    },
    '烧饼': {
      ingredients: ['小麦粉', '芝麻', '油', '盐'],
      cookMethod: '烤/煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '烤煎面食，性偏温燥',
      tags: ['烤煎', '芝麻']
    },
    '蛋挞': {
      ingredients: ['小麦粉', '黄油', '糖', '鸡蛋', '牛奶'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '高糖高脂烘烤，性温热腻',
      tags: ['烘烤', '高糖', '高脂']
    },
    '蛋糕': {
      ingredients: ['小麦粉', '糖', '黄油', '鸡蛋', '奶油'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '高糖高脂烘烤，滋腻助湿',
      tags: ['烘烤', '高糖', '高脂', '滋腻']
    },
    '饼干': {
      ingredients: ['小麦粉', '糖', '黄油', '鸡蛋'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '烘烤干制，性偏温燥',
      tags: ['烘烤', '干制', '高糖']
    },

    // 快餐类
    '汉堡': {
      ingredients: ['小麦粉', '牛肉', '生菜', '番茄', '芝士', '蛋黄酱'],
      cookMethod: '煎烤+组装',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '煎烤肉饼+生冷蔬菜，寒热混杂，油腻难化',
      tags: ['煎烤', '生冷混食', '油腻', '高热量']
    },
    '披萨': {
      ingredients: ['小麦粉', '芝士', '番茄', '火腿', '橄榄油'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '芝士烘烤，性温热腻，难消化',
      tags: ['烘烤', '芝士', '滋腻']
    },
    '炸鸡': {
      ingredients: ['鸡肉', '面粉', '油', '香料'],
      cookMethod: '油炸',
      nature: '热', taste: '甘/辛', wuxing: '火',
      desc: '高温油炸，性热燥烈，助火生痰',
      tags: ['油炸', '燥热', '助火']
    },
    '薯条': {
      ingredients: ['土豆', '油', '盐'],
      cookMethod: '油炸',
      nature: '热', taste: '甘/咸', wuxing: '火',
      desc: '高温油炸，性热燥烈',
      tags: ['油炸', '燥热']
    },
    '热狗': {
      ingredients: ['小麦粉', '猪肉', '牛肉', '芥末', '番茄酱'],
      cookMethod: '煮/烤',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '加工肉制品，性偏温',
      tags: ['加工肉', '温性']
    },
    '三明治': {
      ingredients: ['小麦粉', '火腿', '生菜', '番茄', '芝士'],
      cookMethod: '冷组装',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '生冷熟食混食，脾胃负担重',
      tags: ['生冷混食', '加工肉']
    },

    // 火锅类
    '涮羊肉': {
      ingredients: ['羊肉', '芝麻酱', '韭菜花', '腐乳', '大葱', '生姜', '花椒'],
      cookMethod: '涮煮',
      nature: '大热', taste: '甘/辛', wuxing: '火',
      desc: '羊肉大热+辛香调料，火力极盛，阴虚者大忌',
      tags: ['大热', '辛香', '火锅']
    },
    '重庆火锅': {
      ingredients: ['牛油', '辣椒', '花椒', '桂皮', '八角', '生姜', '大蒜', '各种肉类'],
      cookMethod: '煮',
      nature: '大热', taste: '辛/甘', wuxing: '火',
      desc: '牛油辣椒花椒，性大热大辛，火力最盛',
      tags: ['大热', '大辛', '重油', '火锅']
    },
    '四川火锅': {
      ingredients: ['牛油', '辣椒', '花椒', '桂皮', '八角', '生姜', '大蒜', '各种肉类'],
      cookMethod: '煮',
      nature: '大热', taste: '辛/甘', wuxing: '火',
      desc: '牛油辣椒花椒，性大热大辛，火力最盛',
      tags: ['大热', '大辛', '重油', '火锅']
    },
    '老北京火锅': {
      ingredients: ['羊肉', '芝麻酱', '韭菜花', '腐乳', '大葱', '生姜'],
      cookMethod: '涮煮',
      nature: '大热', taste: '甘/辛', wuxing: '火',
      desc: '羊肉清汤涮煮，性大热',
      tags: ['大热', '火锅']
    },
    '潮汕牛肉火锅': {
      ingredients: ['牛肉', '沙茶酱', '芹菜', '白萝卜', '玉米'],
      cookMethod: '涮煮',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '牛肉清汤涮煮，性较平和，但沙茶酱偏温',
      tags: ['温性', '清汤', '火锅']
    },
    '菌菇火锅': {
      ingredients: ['各种菌菇', '鸡肉', '枸杞', '红枣', '生姜'],
      cookMethod: '煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '菌菇清汤，性平和，滋补不腻',
      tags: ['平和', '滋补', '火锅']
    },
    '番茄火锅': {
      ingredients: ['番茄', '牛肉', '土豆', '金针菇', '豆腐'],
      cookMethod: '煮',
      nature: '平', taste: '酸/甘', wuxing: '木',
      desc: '番茄汤底，酸甜开胃，性较平和',
      tags: ['平和', '酸甜', '火锅']
    },
    '椰子鸡火锅': {
      ingredients: ['鸡肉', '椰子', '红枣', '枸杞', '马蹄'],
      cookMethod: '煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '椰子清甜，鸡肉温补，性平和',
      tags: ['平和', '清甜', '火锅']
    },

    // 煲类/炖类
    '鸡公煲': {
      ingredients: ['鸡肉', '辣椒', '花椒', '桂皮', '八角', '生姜', '大蒜', '洋葱', '土豆', '芹菜'],
      cookMethod: '焖炖',
      nature: '大热', taste: '辛/甘', wuxing: '火',
      desc: '重油重辣焖炖，性大热大辛，火力极盛',
      tags: ['大热', '大辛', '重油', '焖炖']
    },
    '黄焖鸡': {
      ingredients: ['鸡肉', '香菇', '青椒', '生姜', '大葱', '酱油', '糖'],
      cookMethod: '焖炖',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '酱油糖色焖炖，性偏温，微甜',
      tags: ['温性', '焖炖', '微甜']
    },
    '砂锅粥': {
      ingredients: ['大米', '虾', '蟹', '干贝', '生姜', '香菜'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '海鲜煲粥，性平和，鲜美滋补',
      tags: ['平和', '海鲜', '煲煮']
    },
    '煲仔饭': {
      ingredients: ['大米', '腊肠', '腊肉', '鸡蛋', '青菜', '酱油'],
      cookMethod: '煲煮',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '腊味煲饭，性偏温，微咸',
      tags: ['温性', '腊味', '煲煮']
    },
    '红烧肉': {
      ingredients: ['猪肉', '糖', '酱油', '桂皮', '八角', '生姜', '大葱'],
      cookMethod: '焖炖',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '糖色酱油焖炖，性偏温，滋腻',
      tags: ['温性', '滋腻', '焖炖']
    },
    '东坡肉': {
      ingredients: ['猪肉', '黄酒', '糖', '酱油', '生姜', '大葱'],
      cookMethod: '焖炖',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '黄酒糖色焖炖，性偏温，滋腻',
      tags: ['温性', '滋腻', '黄酒']
    },
    '糖醋排骨': {
      ingredients: ['猪肉', '糖', '醋', '酱油', '生姜'],
      cookMethod: '焖炖',
      nature: '平', taste: '酸/甘', wuxing: '木',
      desc: '糖醋味型，酸甜开胃，性较平和',
      tags: ['平和', '酸甜', '焖炖']
    },
    '可乐鸡翅': {
      ingredients: ['鸡肉', '可乐', '酱油', '生姜'],
      cookMethod: '焖炖',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '可乐糖色焖炖，性偏温，过甜',
      tags: ['温性', '过甜', '焖炖']
    },

    // 炒菜类
    '宫保鸡丁': {
      ingredients: ['鸡肉', '花生', '辣椒', '花椒', '大葱', '生姜', '大蒜', '糖', '醋'],
      cookMethod: '爆炒',
      nature: '温', taste: '辛/甘/酸', wuxing: '火',
      desc: '麻辣酸甜，性偏温辛',
      tags: ['温性', '麻辣', '酸甜']
    },
    '麻婆豆腐': {
      ingredients: ['豆腐', '牛肉末', '辣椒', '花椒', '豆瓣酱', '豆豉'],
      cookMethod: '烧',
      nature: '大热', taste: '辛/咸', wuxing: '火',
      desc: '麻辣重口，性大热大辛',
      tags: ['大热', '大辛', '重口']
    },
    '鱼香肉丝': {
      ingredients: ['猪肉', '木耳', '竹笋', '辣椒', '糖', '醋', '酱油', '大蒜'],
      cookMethod: '炒',
      nature: '温', taste: '辛/甘/酸', wuxing: '木',
      desc: '鱼香味型，酸甜微辣，性偏温',
      tags: ['温性', '酸甜', '微辣']
    },
    '回锅肉': {
      ingredients: ['猪肉', '青椒', '豆瓣酱', '豆豉', '生姜', '大蒜'],
      cookMethod: '炒',
      nature: '温', taste: '辛/咸', wuxing: '火',
      desc: '豆瓣酱炒制，性偏温辛',
      tags: ['温性', '辛香', '炒制']
    },
    '番茄炒蛋': {
      ingredients: ['番茄', '鸡蛋', '糖', '盐'],
      cookMethod: '炒',
      nature: '平', taste: '酸/甘', wuxing: '木',
      desc: '酸甜可口，性平和，家常首选',
      tags: ['平和', '酸甜', '家常']
    },
    '青椒炒肉': {
      ingredients: ['猪肉', '青椒', '生姜', '大蒜', '酱油'],
      cookMethod: '炒',
      nature: '平', taste: '甘/辛', wuxing: '土',
      desc: '荤素搭配，性较平和',
      tags: ['平和', '荤素搭配', '炒制']
    },
    '蒜蓉西兰花': {
      ingredients: ['西兰花', '大蒜', '盐', '油'],
      cookMethod: '炒',
      nature: '平', taste: '甘/辛', wuxing: '木',
      desc: '清炒蔬菜，性平和，蒜香提味',
      tags: ['平和', '清炒', '蔬菜']
    },
    '清炒时蔬': {
      ingredients: ['各种绿叶蔬菜', '大蒜', '盐', '油'],
      cookMethod: '炒',
      nature: '平', taste: '甘', wuxing: '木',
      desc: '清炒绿叶菜，性平和，清淡爽口',
      tags: ['平和', '清炒', '蔬菜']
    },
    '干煸四季豆': {
      ingredients: ['四季豆', '猪肉末', '辣椒', '花椒', '生姜', '大蒜'],
      cookMethod: '干煸',
      nature: '温', taste: '辛/甘', wuxing: '火',
      desc: '干煸麻辣，性偏温辛',
      tags: ['温性', '麻辣', '干煸']
    },

    // 蒸菜类
    '清蒸鱼': {
      ingredients: ['鱼肉', '生姜', '大葱', '酱油', '料酒'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '水',
      desc: '清蒸鱼肉，性平和，鲜美不腻',
      tags: ['平和', '清蒸', '鲜美']
    },
    '蒸蛋羹': {
      ingredients: ['鸡蛋', '温水', '盐', '香油'],
      cookMethod: '蒸',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '蒸制蛋羹，性平味甘，易消化',
      tags: ['平和', '蒸制', '易消化']
    },
    '粉蒸肉': {
      ingredients: ['猪肉', '米粉', '豆瓣酱', '生姜', '大葱', '八角'],
      cookMethod: '蒸',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '米粉蒸制，性偏温，微辛',
      tags: ['温性', '蒸制', '米粉']
    },
    '蒸饺': {
      ingredients: ['小麦粉', '猪肉', '白菜', '生姜'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '蒸制面食，性平和',
      tags: ['平和', '蒸制', '面食']
    },

    // 汤类
    '鸡汤': {
      ingredients: ['鸡肉', '生姜', '大葱', '枸杞', '红枣'],
      cookMethod: '煲煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '温补鸡汤，性偏温，滋补',
      tags: ['温性', '滋补', '汤品']
    },
    '排骨汤': {
      ingredients: ['猪肉', '玉米', '胡萝卜', '山药', '生姜'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '清炖排骨，性平和，滋补不腻',
      tags: ['平和', '滋补', '汤品']
    },
    '紫菜蛋花汤': {
      ingredients: ['紫菜', '鸡蛋', '虾皮', '香油'],
      cookMethod: '煮',
      nature: '平', taste: '甘/咸', wuxing: '水',
      desc: '清淡汤品，性平和',
      tags: ['平和', '清淡', '汤品']
    },
    '酸辣汤': {
      ingredients: ['豆腐', '木耳', '鸡蛋', '醋', '胡椒', '辣椒', '淀粉'],
      cookMethod: '煮',
      nature: '温', taste: '辛/酸', wuxing: '火',
      desc: '酸辣开胃，性偏温辛',
      tags: ['温性', '酸辣', '汤品']
    },

    // 凉菜类
    '凉拌黄瓜': {
      ingredients: ['黄瓜', '大蒜', '醋', '香油', '盐'],
      cookMethod: '凉拌',
      nature: '凉', taste: '甘/酸', wuxing: '水',
      desc: '生冷凉拌，性凉，脾胃虚寒者慎食',
      tags: ['凉性', '生冷', '凉拌']
    },
    '凉拌木耳': {
      ingredients: ['木耳', '大蒜', '醋', '香油', '辣椒'],
      cookMethod: '凉拌',
      nature: '平', taste: '甘/酸/辛', wuxing: '水',
      desc: '凉拌菌菇，性平和，微辛',
      tags: ['平和', '凉拌', '菌菇']
    },
    '拍黄瓜': {
      ingredients: ['黄瓜', '大蒜', '醋', '香油', '盐'],
      cookMethod: '凉拌',
      nature: '凉', taste: '甘/酸', wuxing: '水',
      desc: '生冷凉拌，性凉',
      tags: ['凉性', '生冷', '凉拌']
    },

    // 烧烤类
    '烤串': {
      ingredients: ['羊肉/牛肉/鸡肉', '孜然', '辣椒', '花椒', '盐'],
      cookMethod: '炭烤',
      nature: '大热', taste: '辛/甘', wuxing: '火',
      desc: '炭火烤制+辛香调料，性大热大辛，助火生痰',
      tags: ['大热', '大辛', '炭烤', '燥热']
    },
    '烤羊肉串': {
      ingredients: ['羊肉', '孜然', '辣椒', '花椒', '盐'],
      cookMethod: '炭烤',
      nature: '大热', taste: '辛/甘', wuxing: '火',
      desc: '羊肉炭烤+孜然辣椒，性大热，火力极盛',
      tags: ['大热', '大辛', '炭烤', '燥热']
    },
    '烤鸡翅': {
      ingredients: ['鸡肉', '蜂蜜', '孜然', '辣椒', '花椒'],
      cookMethod: '烤',
      nature: '热', taste: '辛/甘', wuxing: '火',
      desc: '蜂蜜烤制+辛香，性热',
      tags: ['热性', '辛香', '烤制']
    },
    '烤鱼': {
      ingredients: ['鱼肉', '辣椒', '花椒', '豆瓣酱', '豆豉', '生姜', '大蒜'],
      cookMethod: '烤/煮',
      nature: '大热', taste: '辛/咸', wuxing: '火',
      desc: '麻辣烤制，性大热大辛',
      tags: ['大热', '大辛', '麻辣']
    },

    // 日料类
    '寿司': {
      ingredients: ['大米', '鱼肉/虾', '海苔', '醋', '芥末'],
      cookMethod: '冷组装',
      nature: '平', taste: '甘/酸', wuxing: '水',
      desc: '生冷海鲜+醋饭，性偏凉，脾胃虚寒者慎食',
      tags: ['生冷', '海鲜', '醋饭']
    },
    '刺身': {
      ingredients: ['生鱼肉', '芥末', '酱油'],
      cookMethod: '生食',
      nature: '寒', taste: '甘/咸', wuxing: '水',
      desc: '生冷生食，性寒，脾胃虚寒者大忌',
      tags: ['寒性', '生冷', '生食']
    },
    '拉面': {
      ingredients: ['小麦粉', '猪肉', '鸡蛋', '海苔', '葱花', '酱油汤底'],
      cookMethod: '煮',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '日式拉面，性偏温，汤底咸鲜',
      tags: ['温性', '汤面', '咸鲜']
    },
    '天妇罗': {
      ingredients: ['虾/蔬菜', '面粉', '油'],
      cookMethod: '油炸',
      nature: '热', taste: '甘', wuxing: '火',
      desc: '油炸面食，性热燥烈',
      tags: ['热性', '油炸', '燥热']
    },
    '味噌汤': {
      ingredients: ['味噌', '豆腐', '海带', '葱花'],
      cookMethod: '煮',
      nature: '平', taste: '甘/咸', wuxing: '水',
      desc: '发酵豆制品汤，性平和，咸鲜',
      tags: ['平和', '发酵', '汤品']
    },

    // 韩料类
    '石锅拌饭': {
      ingredients: ['大米', '牛肉', '鸡蛋', '各种蔬菜', '辣椒酱', '芝麻油'],
      cookMethod: '拌',
      nature: '温', taste: '辛/甘', wuxing: '火',
      desc: '辣椒酱拌饭，性偏温辛',
      tags: ['温性', '辛香', '拌饭']
    },
    '韩式烤肉': {
      ingredients: ['牛肉', '大蒜', '梨汁', '酱油', '糖', '芝麻油'],
      cookMethod: '烤',
      nature: '温', taste: '甘/辛', wuxing: '火',
      desc: '甜辣烤制，性偏温',
      tags: ['温性', '甜辣', '烤制']
    },
    '泡菜汤': {
      ingredients: ['泡菜', '豆腐', '猪肉', '辣椒', '大蒜'],
      cookMethod: '煮',
      nature: '温', taste: '辛/酸', wuxing: '火',
      desc: '发酵辣白菜汤，性偏温辛',
      tags: ['温性', '辛香', '发酵']
    },
    '冷面': {
      ingredients: ['荞麦面', '牛肉', '鸡蛋', '黄瓜', '梨', '醋', '芥末'],
      cookMethod: '冷食',
      nature: '凉', taste: '酸/甘', wuxing: '水',
      desc: '生冷酸甜，性凉，脾胃虚寒者慎食',
      tags: ['凉性', '生冷', '酸甜']
    },

    // 东南亚菜
    '冬阴功汤': {
      ingredients: ['虾', '香茅', '柠檬叶', '辣椒', '椰浆', '鱼露', '青柠'],
      cookMethod: '煮',
      nature: '温', taste: '辛/酸/甘', wuxing: '火',
      desc: '酸辣椰香，性偏温辛',
      tags: ['温性', '酸辣', '椰香']
    },
    '咖喱': {
      ingredients: ['鸡肉/牛肉', '土豆', '椰浆', '咖喱粉', '洋葱', '大蒜', '生姜'],
      cookMethod: '煮',
      nature: '温', taste: '辛/甘', wuxing: '火',
      desc: '辛香咖喱，性偏温，椰浆缓和',
      tags: ['温性', '辛香', '咖喱']
    },
    '越南粉': {
      ingredients: ['大米粉', '牛肉', '牛骨汤', '豆芽', '香菜', '青柠', '辣椒'],
      cookMethod: '煮',
      nature: '平', taste: '甘/辛', wuxing: '土',
      desc: '清汤米粉，性较平和，微辛',
      tags: ['平和', '清汤', '米粉']
    },
    '泰式炒河粉': {
      ingredients: ['河粉', '虾', '鸡蛋', '豆芽', '花生', '鱼露', '糖', '醋', '辣椒'],
      cookMethod: '炒',
      nature: '温', taste: '辛/甘/酸', wuxing: '火',
      desc: '酸甜辣炒，性偏温',
      tags: ['温性', '酸甜辣', '炒制']
    },

    // 西餐类
    '牛排': {
      ingredients: ['牛肉', '黄油', '黑胡椒', '盐'],
      cookMethod: '煎',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '黄油煎制，性偏温，黑胡椒辛香',
      tags: ['温性', '煎制', '辛香']
    },
    '意大利面': {
      ingredients: ['小麦粉', '番茄', '牛肉/猪肉', '洋葱', '大蒜', '芝士', '橄榄油'],
      cookMethod: '煮+炒',
      nature: '平', taste: '甘/酸', wuxing: '土',
      desc: '番茄肉酱意面，性较平和',
      tags: ['平和', '番茄', '意面']
    },
    '沙拉': {
      ingredients: ['生菜', '番茄', '黄瓜', '橄榄油', '醋', '芝士'],
      cookMethod: '冷拌',
      nature: '凉', taste: '甘/酸', wuxing: '木',
      desc: '生冷蔬菜，性凉，脾胃虚寒者慎食',
      tags: ['凉性', '生冷', '蔬菜']
    },
    '奶油蘑菇汤': {
      ingredients: ['蘑菇', '奶油', '黄油', '面粉', '洋葱'],
      cookMethod: '煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '奶油浓汤，性偏温，滋腻',
      tags: ['温性', '滋腻', '浓汤']
    },
    '烤鸡': {
      ingredients: ['鸡肉', '迷迭香', '百里香', '大蒜', '柠檬', '橄榄油'],
      cookMethod: '烤',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '香草烤制，性偏温，辛香',
      tags: ['温性', '烤制', '香草']
    },

    // 粥类
    '白粥': {
      ingredients: ['大米', '水'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '纯米煲煮，性平味甘，最养脾胃',
      tags: ['平和', '养胃', '粥品']
    },
    '皮蛋瘦肉粥': {
      ingredients: ['大米', '猪肉', '皮蛋', '生姜'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '皮蛋微寒，猪肉性平，整体平和',
      tags: ['平和', '粥品', '皮蛋']
    },
    '南瓜粥': {
      ingredients: ['大米', '南瓜'],
      cookMethod: '煲煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '南瓜温补，粥品养胃',
      tags: ['温性', '养胃', '粥品']
    },
    '山药粥': {
      ingredients: ['大米', '山药'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '山药健脾，粥品养胃，最佳搭配',
      tags: ['平和', '健脾', '粥品']
    },
    '小米粥': {
      ingredients: ['小米', '水'],
      cookMethod: '煲煮',
      nature: '凉', taste: '甘/咸', wuxing: '土',
      desc: '小米性凉，健脾和胃，补益虚损',
      tags: ['凉性', '健脾', '粥品']
    },
    '红豆粥': {
      ingredients: ['大米', '红豆', '糖'],
      cookMethod: '煲煮',
      nature: '平', taste: '甘/酸', wuxing: '火',
      desc: '红豆健脾利水，粥品平和',
      tags: ['平和', '利水', '粥品']
    },
    '绿豆粥': {
      ingredients: ['大米', '绿豆', '糖'],
      cookMethod: '煲煮',
      nature: '寒', taste: '甘', wuxing: '木',
      desc: '绿豆清热，粥品寒凉，脾胃虚寒者慎食',
      tags: ['寒性', '清热', '粥品']
    },

    // 粉面类
    '米粉': {
      ingredients: ['大米'],
      cookMethod: '煮',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '大米制成，性平味甘',
      tags: ['平和', '主食']
    },
    '河粉': {
      ingredients: ['大米'],
      cookMethod: '煮/炒',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '大米制成，性平味甘',
      tags: ['平和', '主食']
    },
    '肠粉': {
      ingredients: ['大米粉', '猪肉/虾仁', '酱油'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '蒸制米皮，性平和',
      tags: ['平和', '蒸制', '米皮']
    },
    '凉皮': {
      ingredients: ['小麦粉/大米', '黄瓜', '豆芽', '醋', '辣椒油', '大蒜'],
      cookMethod: '凉拌',
      nature: '凉', taste: '甘/酸/辛', wuxing: '土',
      desc: '生冷凉拌，性凉，脾胃虚寒者慎食',
      tags: ['凉性', '生冷', '凉拌']
    },
    '酸辣粉': {
      ingredients: ['红薯粉', '醋', '辣椒', '花椒', '花生', '豆芽', '香菜'],
      cookMethod: '煮',
      nature: '温', taste: '辛/酸', wuxing: '火',
      desc: '酸辣开胃，性偏温辛',
      tags: ['温性', '酸辣', '粉类']
    },
    '螺蛳粉': {
      ingredients: ['米粉', '螺蛳', '酸笋', '辣椒', '花生', '腐竹', '木耳'],
      cookMethod: '煮',
      nature: '温', taste: '辛/酸', wuxing: '火',
      desc: '酸辣臭香，性偏温辛，重口味',
      tags: ['温性', '酸辣', '重口']
    },

    // 小吃类
    '肉夹馍': {
      ingredients: ['小麦粉', '猪肉', '青椒', '香菜'],
      cookMethod: '烤+炖',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '烤饼夹炖肉，性偏温',
      tags: ['温性', '烤饼', '炖肉']
    },
    '驴肉火烧': {
      ingredients: ['小麦粉', '驴肉', '青椒', '香菜'],
      cookMethod: '烤+炖',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '烤饼夹驴肉，性偏温',
      tags: ['温性', '烤饼', '驴肉']
    },
    '煎饼果子': {
      ingredients: ['绿豆面', '鸡蛋', '油条', '甜面酱', '大葱'],
      cookMethod: '煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '油煎面食，性偏温燥',
      tags: ['温性', '油煎', '面食']
    },
    '手抓饼': {
      ingredients: ['小麦粉', '油', '鸡蛋', '生菜', '火腿'],
      cookMethod: '煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '油煎面食，性偏温燥',
      tags: ['温性', '油煎', '面食']
    },
    '葱油饼': {
      ingredients: ['小麦粉', '大葱', '油', '盐'],
      cookMethod: '煎',
      nature: '温', taste: '甘/辛', wuxing: '土',
      desc: '葱油煎制，性偏温辛',
      tags: ['温性', '油煎', '葱香']
    },
    '生煎包': {
      ingredients: ['小麦粉', '猪肉', '皮冻', '芝麻', '葱花'],
      cookMethod: '煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '油煎包子，性偏温',
      tags: ['温性', '油煎', '包子']
    },
    '小笼包': {
      ingredients: ['小麦粉', '猪肉', '皮冻', '生姜'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '蒸制汤包，性平和',
      tags: ['平和', '蒸制', '汤包']
    },
    '灌汤包': {
      ingredients: ['小麦粉', '猪肉', '皮冻', '蟹粉'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '蒸制汤包，性平和',
      tags: ['平和', '蒸制', '汤包']
    },
    '锅贴': {
      ingredients: ['小麦粉', '猪肉', '白菜', '生姜'],
      cookMethod: '煎',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '油煎饺子，性偏温',
      tags: ['温性', '油煎', '饺子']
    },
    '春卷': {
      ingredients: ['小麦粉', '猪肉', '豆芽', '香菇', '胡萝卜'],
      cookMethod: '油炸',
      nature: '热', taste: '甘', wuxing: '火',
      desc: '油炸春卷，性热燥烈',
      tags: ['热性', '油炸', '春卷']
    },
    '炸春卷': {
      ingredients: ['小麦粉', '猪肉', '豆芽', '香菇', '胡萝卜'],
      cookMethod: '油炸',
      nature: '热', taste: '甘', wuxing: '火',
      desc: '油炸春卷，性热燥烈',
      tags: ['热性', '油炸', '春卷']
    },

    // 甜品类
    '汤圆': {
      ingredients: ['糯米', '黑芝麻', '糖', '猪油'],
      cookMethod: '煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '糯米制品，性偏温，滋腻难化',
      tags: ['温性', '滋腻', '糯米']
    },
    '元宵': {
      ingredients: ['糯米', '黑芝麻', '糖', '猪油'],
      cookMethod: '煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '糯米制品，性偏温，滋腻难化',
      tags: ['温性', '滋腻', '糯米']
    },
    '粽子': {
      ingredients: ['糯米', '猪肉/红枣/豆沙', '粽叶'],
      cookMethod: '煮',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '糯米制品，性偏温，滋腻难化',
      tags: ['温性', '滋腻', '糯米']
    },
    '月饼': {
      ingredients: ['小麦粉', '糖', '油', '蛋黄/豆沙/莲蓉'],
      cookMethod: '烘烤',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '高糖高脂烘烤，性温热腻',
      tags: ['温性', '高糖', '高脂']
    },
    '绿豆糕': {
      ingredients: ['绿豆', '糖', '油'],
      cookMethod: '蒸',
      nature: '寒', taste: '甘', wuxing: '木',
      desc: '绿豆制品，性寒清热',
      tags: ['寒性', '清热', '糕点']
    },
    '红豆糕': {
      ingredients: ['红豆', '糖', '糯米粉'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/酸', wuxing: '火',
      desc: '红豆制品，性平和',
      tags: ['平和', '糕点']
    },
    '驴打滚': {
      ingredients: ['糯米', '红豆', '黄豆粉', '糖'],
      cookMethod: '蒸',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '糯米制品，性偏温，滋腻',
      tags: ['温性', '滋腻', '糯米']
    },
    '艾窝窝': {
      ingredients: ['糯米', '红豆', '糖'],
      cookMethod: '蒸',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '糯米制品，性偏温',
      tags: ['温性', '糯米']
    },
    '糖葫芦': {
      ingredients: ['山楂', '糖'],
      cookMethod: '熬糖',
      nature: '温', taste: '酸/甘', wuxing: '木',
      desc: '山楂酸甘，糖温，整体偏温',
      tags: ['温性', '酸甜', '山楂']
    },
    '双皮奶': {
      ingredients: ['牛奶', '糖', '蛋清'],
      cookMethod: '蒸',
      nature: '平', taste: '甘', wuxing: '土',
      desc: '奶品蒸制，性平和',
      tags: ['平和', '奶品', '蒸制']
    },
    '杨枝甘露': {
      ingredients: ['芒果', '柚子', '西米', '椰浆', '牛奶'],
      cookMethod: '冷制',
      nature: '凉', taste: '甘/酸', wuxing: '木',
      desc: '生冷甜品，性凉，脾胃虚寒者慎食',
      tags: ['凉性', '生冷', '甜品']
    },
    '奶茶': {
      ingredients: ['红茶', '牛奶', '糖', '珍珠'],
      cookMethod: '煮+冷制',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '高糖高脂，性偏温，滋腻助湿',
      tags: ['温性', '高糖', '滋腻', '助湿']
    },
    '珍珠奶茶': {
      ingredients: ['红茶', '牛奶', '糖', '木薯粉'],
      cookMethod: '煮+冷制',
      nature: '温', taste: '甘', wuxing: '土',
      desc: '高糖高脂，性偏温，滋腻助湿',
      tags: ['温性', '高糖', '滋腻', '助湿']
    },

    // 饮品类
    '豆浆': {
      ingredients: ['黄豆'],
      cookMethod: '煮',
      nature: '平', taste: '甘', wuxing: '水',
      desc: '大豆煮制，性平味甘',
      tags: ['平和', '豆制品']
    },
    '豆腐脑': {
      ingredients: ['黄豆', '卤汁/糖水'],
      cookMethod: '煮',
      nature: '平', taste: '甘/咸', wuxing: '水',
      desc: '豆制品，性平和',
      tags: ['平和', '豆制品']
    },
    '酸梅汤': {
      ingredients: ['乌梅', '山楂', '甘草', '桂花', '冰糖'],
      cookMethod: '煮',
      nature: '平', taste: '酸/甘', wuxing: '木',
      desc: '酸味收敛，生津止渴，性平和',
      tags: ['平和', '酸味', '消暑']
    },
    '冰糖雪梨': {
      ingredients: ['梨', '冰糖', '枸杞'],
      cookMethod: '炖',
      nature: '凉', taste: '甘', wuxing: '水',
      desc: '梨炖冰糖，性凉润肺',
      tags: ['凉性', '润肺', '炖品']
    },
    '银耳羹': {
      ingredients: ['银耳', '红枣', '枸杞', '冰糖'],
      cookMethod: '炖',
      nature: '平', taste: '甘', wuxing: '金',
      desc: '银耳滋阴，性平和，最佳滋补甜品',
      tags: ['平和', '滋阴', '炖品']
    },
    '龟苓膏': {
      ingredients: ['龟板', '土茯苓', '糖'],
      cookMethod: '煮',
      nature: '寒', taste: '甘/苦', wuxing: '水',
      desc: '清热解毒，性寒，脾胃虚寒者大忌',
      tags: ['寒性', '清热', '药膳']
    },

    // 其他常见成品
    '方便面': {
      ingredients: ['小麦粉', '棕榈油', '盐', '味精', '防腐剂'],
      cookMethod: '油炸+煮',
      nature: '热', taste: '甘/咸', wuxing: '火',
      desc: '油炸面饼+高钠调料，性热燥烈，伤阴助火',
      tags: ['热性', '油炸', '高钠', '伤阴']
    },
    '速冻水饺': {
      ingredients: ['小麦粉', '猪肉', '白菜', '盐', '味精'],
      cookMethod: '煮',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '速冻食品，性平和，但营养流失',
      tags: ['平和', '速冻', '营养流失']
    },
    '速冻包子': {
      ingredients: ['小麦粉', '猪肉', '白菜', '盐', '味精'],
      cookMethod: '蒸',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '速冻食品，性平和，但营养流失',
      tags: ['平和', '速冻', '营养流失']
    },
    '罐头': {
      ingredients: ['各种肉类/水果', '糖/盐', '防腐剂'],
      cookMethod: '加工',
      nature: '平', taste: '甘/咸', wuxing: '土',
      desc: '加工食品，性平和，但添加剂多',
      tags: ['平和', '加工', '添加剂']
    },
    '火腿肠': {
      ingredients: ['猪肉', '淀粉', '盐', '亚硝酸盐', '香精'],
      cookMethod: '加工',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '加工肉制品，性偏温，添加剂多',
      tags: ['温性', '加工肉', '添加剂']
    },
    '午餐肉': {
      ingredients: ['猪肉', '淀粉', '盐', '亚硝酸盐', '香精'],
      cookMethod: '加工',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '加工肉制品，性偏温，添加剂多',
      tags: ['温性', '加工肉', '添加剂']
    },
    '培根': {
      ingredients: ['猪肉', '盐', '糖', '亚硝酸盐'],
      cookMethod: '腌制+熏制',
      nature: '热', taste: '甘/咸', wuxing: '火',
      desc: '腌制熏制，性热燥烈，助火生痰',
      tags: ['热性', '腌制', '熏制', '助火']
    },
    '香肠': {
      ingredients: ['猪肉', '盐', '糖', '亚硝酸盐', '香料'],
      cookMethod: '腌制+风干',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '腌制风干，性偏温，咸重',
      tags: ['温性', '腌制', '咸重']
    },
    '腊肉': {
      ingredients: ['猪肉', '盐', '糖', '酒', '香料'],
      cookMethod: '腌制+风干+熏制',
      nature: '热', taste: '甘/咸', wuxing: '火',
      desc: '腌制熏制，性热燥烈，助火生痰',
      tags: ['热性', '腌制', '熏制', '助火']
    },
    '腊肠': {
      ingredients: ['猪肉', '盐', '糖', '酒', '香料'],
      cookMethod: '腌制+风干',
      nature: '温', taste: '甘/咸', wuxing: '土',
      desc: '腌制风干，性偏温，咸重',
      tags: ['温性', '腌制', '咸重']
    }
  },

  /**
   * 智能匹配食物（支持模糊匹配和别名）
   */
  _matchFood(inputName) {
    // 1. 精确匹配
    if (this.foodDB[inputName]) return { name: inputName, data: this.foodDB[inputName] };

    // 2. 别名映射表
    const aliases = {
      // 谷物别名
      '粥': '大米', '白粥': '大米', '稀饭': '大米', '米饭': '大米', '饭': '大米',
      '小米粥': '小米', '黄米': '小米',
      '燕麦片': '燕麦', '麦片': '燕麦',
      '薏仁': '薏米', '薏苡仁': '薏米',
      '红小豆': '赤小豆', '小豆': '赤小豆',
      '黄豆': '黑豆', '毛豆': '黑豆',

      // 蔬菜别名
      '小白菜': '白菜', '大白菜': '白菜', '青菜': '白菜',
      '菠薐菜': '菠菜',
      '胡瓜': '黄瓜', '青瓜': '黄瓜',
      '东瓜': '冬瓜',
      '倭瓜': '南瓜', '金瓜': '南瓜',
      '薯蓣': '山药', '淮山': '山药', '山薯': '山药',
      '藕': '莲藕', '荷藕': '莲藕',
      '萝卜': '白萝卜', '莱菔': '白萝卜',
      '红萝卜': '胡萝卜', '甘笋': '胡萝卜',
      '西红柿': '番茄', '洋柿子': '番茄',
      '落苏': '茄子', '矮瓜': '茄子',
      '锦荔枝': '苦瓜', '癞瓜': '苦瓜',
      '天丝瓜': '丝瓜', '天罗': '丝瓜',
      '黑木耳': '木耳', '云耳': '木耳',
      '香蕈': '香菇', '冬菇': '香菇',

      // 肉类别名
      '豚肉': '猪肉', '豕肉': '猪肉',
      '牛腩': '牛肉', '牛排': '牛肉',
      '羔羊肉': '羊肉', '绵羊肉': '羊肉',
      '雏鸡肉': '鸡肉', '土鸡': '鸡肉', '母鸡': '鸡肉', '公鸡': '鸡肉',
      '鹜肉': '鸭肉', '家凫': '鸭肉',
      '鲜鱼': '鱼肉', '鲫鱼': '鱼肉', '鲤鱼': '鱼肉', '草鱼': '鱼肉', '鲈鱼': '鱼肉',
      '虾米': '虾', '海米': '虾', '虾仁': '虾',
      '大闸蟹': '蟹', '河蟹': '蟹',

      // 蛋类别名
      '鸡子': '鸡蛋', '鸡卵': '鸡蛋', '蛋清': '鸡蛋', '蛋黄': '鸡蛋',
      '鸭子': '鸭蛋', '鸭卵': '鸭蛋',

      // 豆制品别名
      '豆花': '豆腐', '嫩豆腐': '豆腐', '老豆腐': '豆腐', '冻豆腐': '豆腐',
      '豆奶': '豆浆', '豆乳': '豆浆',

      // 水果别名
      '苹婆': '苹果', '柰子': '苹果',
      '快果': '梨', '玉乳': '梨', '蜜父': '梨',
      '甘蕉': '香蕉', '蕉子': '香蕉',
      '寒瓜': '西瓜', '夏瓜': '西瓜',
      '蒲桃': '葡萄', '草龙珠': '葡萄',
      '桃实': '桃子', '仙桃': '桃子',
      '嘉庆子': '李子', '山李子': '李子',
      '含桃': '樱桃', '荆桃': '樱桃',
      '洋莓': '草莓', '地莓': '草莓',
      '藤梨': '猕猴桃', '阳桃': '猕猴桃',
      '黄柑': '橘子', '柑子': '橘子',
      '甜橙': '橙子', '黄果': '橙子',
      '文旦': '柚子', '香栾': '柚子',
      '柠果': '柠檬',
      '番瓜': '木瓜', '万寿果': '木瓜',
      '桑实': '桑葚', '乌椹': '桑葚', '黑椹': '桑葚',
      '干枣': '红枣', '大枣': '红枣', '美枣': '红枣',
      '龙眼': '桂圆', '益智': '桂圆', '骊珠': '桂圆',
      '枸杞': '枸杞', '杞子': '枸杞', '红耳坠': '枸杞',

      // 坚果别名
      '胡桃': '核桃', '羌桃': '核桃',
      '杏核仁': '杏仁',
      '落花生': '花生', '地豆': '花生', '长生果': '花生',
      '胡麻': '芝麻', '油麻': '芝麻', '脂麻': '芝麻',

      // 调味别名
      '姜': '生姜', '鲜姜': '生姜', '老姜': '生姜', '干姜': '生姜',
      '葱': '大葱', '青葱': '大葱', '葱白': '大葱',
      '蒜': '大蒜', '蒜头': '大蒜',
      '蜀椒': '花椒', '巴椒': '花椒', '汉椒': '花椒',
      '番椒': '辣椒', '辣茄': '辣椒', '海椒': '辣椒',
      '昧履支': '胡椒', '浮椒': '胡椒',
      '肉桂': '桂皮', '官桂': '桂皮',
      '大茴香': '八角', '大料': '八角',
      '橘皮': '陈皮', '广皮': '陈皮', '新会皮': '陈皮',
      '苦酒': '醋', '醯': '醋', '米醋': '醋',
      '豉油': '酱油', '酱汁': '酱油',
      '食盐': '盐', '咸': '盐',
      '饴糖': '糖', '砂糖': '糖', '冰糖': '糖',
      '蜂糖': '蜂蜜', '蜜糖': '蜂蜜', '白蜜': '蜂蜜',

      // 饮品别名
      '茗': '绿茶', '苦荼': '绿茶', '龙井': '绿茶',
      '祁红': '红茶', '滇红': '红茶',
      '青茶': '乌龙茶', '岩茶': '乌龙茶',
      '普茶': '普洱茶', '普洱': '普洱茶',
      '甘菊': '菊花茶', '茶菊': '菊花茶',
      '徘徊花': '玫瑰花茶', '刺玫花': '玫瑰花茶',
      '忍冬': '金银花茶', '银花': '金银花茶', '双花': '金银花茶',
      '牛乳': '牛奶', '鲜乳': '牛奶',
      '酸乳': '酸奶', '优酪乳': '酸奶', '乳酪': '酸奶',
      '可可': '咖啡', '珈琲': '咖啡',
      '醇酒': '酒', '烧酒': '酒', '白酒': '酒', '黄酒': '酒',

      // 海鲜别名
      '海草': '海带', '昆布': '海带',
      '海苔': '紫菜',
      '刺参': '海参', '海鼠': '海参',
      '鳆鱼': '鲍鱼', '石决明肉': '鲍鱼',

      // 滋补品别名
      '燕菜': '燕窝', '燕蔬': '燕窝',
      '白木耳': '银耳', '雪耳': '银耳',
      '鱼肚': '花胶', '鱼鳔': '花胶',

      // 药材别名（常见入膳药材）
      '干归': '当归', '秦归': '当归', '云归': '当归',
      '黄耆': '黄芪', '戴糁': '黄芪',
      '上党人参': '党参', '黄参': '党参',
      '于术': '白术', '冬术': '白术',
      '云苓': '茯苓', '松苓': '茯苓',
      '国老': '甘草', '甜草': '甘草',
      '熟地': '熟地黄', '大熟地': '熟地黄',
      '生地': '生地黄', '干地黄': '生地黄',
      '白芍药': '白芍', '金芍药': '白芍',
      '芎藭': '川芎', '抚芎': '川芎',
      '赤参': '丹参', '紫丹参': '丹参',
      '山漆': '三七', '金不换': '三七',
      '傅致胶': '阿胶', '驴皮胶': '阿胶',
      '麦门冬': '麦冬', '寸冬': '麦冬',
      '天门冬': '天冬', '明门冬': '天冬',
      '白百合': '百合', '蒜脑薯': '百合',
      '藕实': '莲子', '水芝': '莲子', '泽芝': '莲子',
      '鸡头': '芡实', '鸡头米': '芡实', '雁头': '芡实',
      '薯药': '山药', '山芋': '山药',
      '蜀酸枣': '山茱萸', '肉枣': '山茱萸', '药枣': '山茱萸',
      '杞': '枸杞子', '地骨': '枸杞子',
      '冬青子': '女贞子', '蜡树': '女贞子',
      '金陵草': '墨旱莲', '莲子草': '墨旱莲', '旱莲草': '墨旱莲',
      '菟丝': '菟丝子', '吐丝子': '菟丝子', '黄藤子': '菟丝子',
      '思仙': '杜仲', '思仲': '杜仲', '木绵': '杜仲',
      '寄屑': '桑寄生', '寓木': '桑寄生', '宛童': '桑寄生',
      '芝': '灵芝', '瑞草': '灵芝', '神芝': '灵芝',
      '枣仁': '酸枣仁', '山枣仁': '酸枣仁',
      '五梅子': '五味子', '辽五味': '五味子',
      '夜合': '合欢皮', '夜合皮': '合欢皮',
      '丹皮': '牡丹皮', '木芍药': '牡丹皮',
      '麦蘖': '麦芽', '大麦蘖': '麦芽', '大麦芽': '麦芽'
    };

    if (aliases[inputName]) {
      const canonical = aliases[inputName];
      return { name: canonical, data: this.foodDB[canonical], alias: inputName };
    }

    // 3. 包含匹配（如"小米粥"匹配"小米"）
    for (let [name, data] of Object.entries(this.foodDB)) {
      if (inputName.includes(name) || name.includes(inputName)) {
        return { name, data, matched: true };
      }
    }

    // 4. 成品菜肴匹配
    if (this.dishDB[inputName]) {
      return { name: inputName, data: this.dishDB[inputName], isDish: true };
    }
    // 成品菜肴模糊匹配
    for (let [dishName, dishData] of Object.entries(this.dishDB)) {
      if (inputName.includes(dishName) || dishName.includes(inputName)) {
        return { name: dishName, data: dishData, isDish: true, matched: true };
      }
    }

    // 5. 未匹配
    return null;
  },

  /**
   * 拆解成品菜肴为食材列表
   */
  decomposeDish(dishName) {
    const match = this._matchFood(dishName);
    if (!match || !match.isDish) return null;

    const dish = match.data;
    const ingredients = [];

    // 将菜肴的主要食材逐一分析
    dish.ingredients.forEach(ing => {
      // 尝试匹配食材数据库
      const foodMatch = this._matchFood(ing);
      if (foodMatch && !foodMatch.isDish) {
        ingredients.push({
          name: ing,
          foodData: foodMatch.data,
          canonicalName: foodMatch.name
        });
      } else {
        // 食材不在数据库中，标记为未知
        ingredients.push({
          name: ing,
          foodData: null,
          canonicalName: ing
        });
      }
    });

    return {
      dishName: match.name,
      displayName: match.matched ? `${dishName}(${match.name})` : dishName,
      cookMethod: dish.cookMethod,
      nature: dish.nature,
      taste: dish.taste,
      wuxing: dish.wuxing,
      desc: dish.desc,
      tags: dish.tags,
      ingredients: ingredients
    };
  },

  /**
   * 分析单个食物或成品菜肴的适配性
   */
  analyzeFood(foodName, constitutions, liuQiIndex, formulaName) {
    const match = this._matchFood(foodName);
    if (!match) {
      return { status: 'unknown', food: foodName, reason: '数据库中暂无此食物信息，请尝试输入更常见的名称（如"大米"而非"米饭"）' };
    }

    // 如果是成品菜肴，使用菜肴分析逻辑
    if (match.isDish) {
      return this.analyzeDish(foodName, constitutions, liuQiIndex, formulaName);
    }

    const food = match.data;
    const canonicalName = match.name;
    const displayName = match.alias ? `${foodName}→${match.name}` : (match.matched ? `${foodName}(${match.name})` : foodName);

    const issues = [];
    const synergies = [];
    let status = 'green';

    // 1. 体质冲突检测（使用canonicalName进行规则匹配）
    constitutions.forEach(c => {
      const rule = this.constitutionRules[c];
      if (!rule) return;

      if (rule.avoidFoods.includes(canonicalName)) {
        issues.push(`【${c}】${rule.reason} ${canonicalName}为${food.nature}性，${food.taste}味，不宜食用。`);
        status = 'red';
      } else if (rule.avoidNature.includes(food.nature)) {
        issues.push(`【${c}】${canonicalName}性${food.nature}，与${c}体质相悖。`);
        if (status !== 'red') status = 'yellow';
      } else if (rule.avoidTaste.some(t => food.taste.includes(t))) {
        issues.push(`【${c}】${canonicalName}味${food.taste}，${c}者忌之。`);
        if (status !== 'red') status = 'yellow';
      }

      if (rule.preferFoods.includes(canonicalName)) {
        synergies.push(`【${c}】${canonicalName}为${c}体质所宜。`);
      }
    });

    // 2. 五运六气时令检测
    const lqRule = this.liuQiRules[liuQiIndex];
    if (lqRule) {
      if (food.nature === '寒' || food.nature === '大热') {
        if (liuQiIndex === 2) { // 三之气
          if (food.nature === '大热') {
            issues.push(`【三之气·两火叠加】${canonicalName}性大热，此时绝对禁止。`);
            status = 'red';
          }
        }
      }
      if (food.taste.includes('辛') && lqRule.avoid.includes('辛辣')) {
        issues.push(`【${lqRule.reason}】${canonicalName}味辛，此时不宜。`);
        if (status !== 'red') status = 'yellow';
      }
    }

    // 3. 方药相互作用
    const formula = this.formulaInteractions[formulaName];
    if (formula) {
      if (formula.antagonistic.includes(canonicalName)) {
        issues.push(`【方药冲突】${canonicalName}与${formulaName}相 antagonistic，${formula.reason}`);
        status = 'red';
      }
      if (formula.synergistic.includes(canonicalName)) {
        synergies.push(`【方药协同】${canonicalName}与${formulaName}功效相合。`);
      }
    }

    return {
      status,
      food: displayName,
      info: food,
      issues,
      synergies,
      summary: this._generateSummary(displayName, status, issues, synergies, food)
    };
  },

  /**
   * 分析成品菜肴的适配性（拆解为食材后分析）
   */
  analyzeDish(dishName, constitutions, liuQiIndex, formulaName) {
    const decomposed = this.decomposeDish(dishName);
    if (!decomposed) {
      return { status: 'unknown', food: dishName, reason: '无法拆解此菜肴' };
    }

    const dish = decomposed;
    const issues = [];
    const synergies = [];
    const ingredientAnalyses = [];
    let status = 'green';

    // 1. 菜肴整体性质判断
    // 根据烹饪方式调整性质
    const cookMethodModifiers = {
      '油炸': { natureMod: '热', issue: '高温油炸，性热燥烈，助火生痰，难消化' },
      '炭烤': { natureMod: '大热', issue: '炭火烤制，性大热大辛，火力极盛' },
      '烤': { natureMod: '热', issue: '高温烤制，性热燥烈' },
      '煎': { natureMod: '温', issue: '油煎制作，性偏温燥' },
      '爆炒': { natureMod: '温', issue: '高温爆炒，性偏温' },
      '干煸': { natureMod: '温', issue: '干煸制作，性偏温燥' },
      '凉拌': { natureMod: '凉', issue: '生冷凉拌，易伤脾阳' },
      '生食': { natureMod: '寒', issue: '生冷生食，性寒伤脾' },
      '冷组装': { natureMod: '凉', issue: '生冷熟食混食，脾胃负担重' },
      '冷食': { natureMod: '凉', issue: '冷食，易伤脾胃' },
      '涮煮': { natureMod: '平', issue: '涮煮方式，性质取决于汤底和蘸料' }
    };

    const cookMod = cookMethodModifiers[dish.cookMethod];
    if (cookMod) {
      if (cookMod.natureMod === '大热' || cookMod.natureMod === '热') {
        issues.push(`【烹饪方式】${dish.dishName}为${dish.cookMethod}，${cookMod.issue}。`);
        status = 'red';
      } else if (cookMod.natureMod === '温') {
        issues.push(`【烹饪方式】${dish.dishName}为${dish.cookMethod}，${cookMod.issue}。`);
        if (status !== 'red') status = 'yellow';
      } else if (cookMod.natureMod === '凉' || cookMod.natureMod === '寒') {
        const hasColdIssue = constitutions.some(c => c === '脾虚湿蕴');
        if (hasColdIssue) {
          issues.push(`【烹饪方式】${dish.dishName}为${dish.cookMethod}，${cookMod.issue}，脾虚湿蕴者尤忌。`);
          if (status !== 'red') status = 'yellow';
        }
      }
    }

    // 2. 分析各食材
    dish.ingredients.forEach(ing => {
      if (ing.foodData) {
        const ingAnalysis = this._analyzeIngredient(ing.name, ing.foodData, ing.canonicalName, constitutions, liuQiIndex, formulaName);
        ingredientAnalyses.push(ingAnalysis);

        // 汇总问题
        if (ingAnalysis.status === 'red') {
          issues.push(`【食材】${ing.name}：${ingAnalysis.issues[0]}`);
          status = 'red';
        } else if (ingAnalysis.status === 'yellow' && status !== 'red') {
          issues.push(`【食材】${ing.name}：${ingAnalysis.issues[0]}`);
          status = 'yellow';
        }

        if (ingAnalysis.synergies.length > 0) {
          synergies.push(`【食材】${ing.name}：${ingAnalysis.synergies[0]}`);
        }
      } else {
        ingredientAnalyses.push({
          name: ing.name,
          status: 'unknown',
          issues: ['数据库中暂无此食材信息'],
          synergies: []
        });
      }
    });

    // 3. 特殊标签检测
    if (dish.tags) {
      if (dish.tags.includes('高糖') && constitutions.includes('脾虚湿蕴')) {
        issues.push(`【标签】${dish.dishName}含高糖，脾虚湿蕴者甜食助湿生痰。`);
        if (status !== 'red') status = 'yellow';
      }
      if (dish.tags.includes('高脂') && constitutions.includes('脾虚湿蕴')) {
        issues.push(`【标签】${dish.dishName}含高脂，脾虚湿蕴者油腻碍脾运化。`);
        if (status !== 'red') status = 'yellow';
      }
      if (dish.tags.includes('重油') && constitutions.includes('脾虚湿蕴')) {
        issues.push(`【标签】${dish.dishName}重油，脾虚湿蕴者油重碍脾。`);
        if (status !== 'red') status = 'yellow';
      }
      if (dish.tags.includes('辛辣') && constitutions.includes('阴虚火旺')) {
        issues.push(`【标签】${dish.dishName}含辛辣，阴虚火旺者辛热助火伤阴。`);
        status = 'red';
      }
      if (dish.tags.includes('大热') && constitutions.includes('阴虚火旺')) {
        issues.push(`【标签】${dish.dishName}性大热，阴虚火旺者绝对禁忌。`);
        status = 'red';
      }
      if (dish.tags.includes('滋腻') && constitutions.includes('脾虚湿蕴')) {
        issues.push(`【标签】${dish.dishName}滋腻难化，脾虚湿蕴者运化无力。`);
        if (status !== 'red') status = 'yellow';
      }
      if (dish.tags.includes('加工肉')) {
        issues.push(`【标签】${dish.dishName}含加工肉制品，添加剂多，不宜常食。`);
        if (status !== 'red') status = 'yellow';
      }
    }

    // 4. 五运六气时令检测（针对菜肴整体）
    const lqRule = this.liuQiRules[liuQiIndex];
    if (lqRule) {
      if (dish.nature === '大热' || dish.nature === '热') {
        if (liuQiIndex === 2) { // 三之气
          issues.push(`【三之气·两火叠加】${dish.dishName}性${dish.nature}，此时绝对禁止食用。`);
          status = 'red';
        }
      }
      if (dish.taste && dish.taste.includes('辛') && lqRule.avoid.includes('辛辣')) {
        issues.push(`【${lqRule.reason}】${dish.dishName}味辛，此时不宜。`);
        if (status !== 'red') status = 'yellow';
      }
    }

    return {
      status,
      food: dish.displayName,
      isDish: true,
      dishInfo: {
        name: dish.dishName,
        cookMethod: dish.cookMethod,
        nature: dish.nature,
        taste: dish.taste,
        wuxing: dish.wuxing,
        desc: dish.desc,
        tags: dish.tags,
        ingredients: dish.ingredients.map(i => i.name)
      },
      ingredientAnalyses,
      issues,
      synergies,
      summary: this._generateDishSummary(dish.displayName, status, issues, synergies, dish)
    };
  },

  /**
   * 分析单个食材（用于菜肴拆解）
   */
  _analyzeIngredient(name, foodData, canonicalName, constitutions, liuQiIndex, formulaName) {
    const issues = [];
    const synergies = [];
    let status = 'green';

    // 体质冲突
    constitutions.forEach(c => {
      const rule = this.constitutionRules[c];
      if (!rule) return;

      if (rule.avoidFoods.includes(canonicalName)) {
        issues.push(`【${c}】${name}为${foodData.nature}性，不宜食用。`);
        status = 'red';
      } else if (rule.avoidNature.includes(foodData.nature)) {
        issues.push(`【${c}】${name}性${foodData.nature}，与${c}体质相悖。`);
        if (status !== 'red') status = 'yellow';
      } else if (rule.avoidTaste.some(t => foodData.taste.includes(t))) {
        issues.push(`【${c}】${name}味${foodData.taste}，${c}者忌之。`);
        if (status !== 'red') status = 'yellow';
      }

      if (rule.preferFoods.includes(canonicalName)) {
        synergies.push(`【${c}】${name}为${c}体质所宜。`);
      }
    });

    // 时令
    const lqRule = this.liuQiRules[liuQiIndex];
    if (lqRule) {
      if (foodData.nature === '大热' && liuQiIndex === 2) {
        issues.push(`【三之气】${name}性大热，此时不宜。`);
        status = 'red';
      }
    }

    // 方药
    const formula = this.formulaInteractions[formulaName];
    if (formula) {
      if (formula.antagonistic.includes(canonicalName)) {
        issues.push(`【方药冲突】${name}与${formulaName}相 antagonistic。`);
        status = 'red';
      }
      if (formula.synergistic.includes(canonicalName)) {
        synergies.push(`【方药协同】${name}与${formulaName}功效相合。`);
      }
    }

    return { name, status, issues, synergies, info: foodData };
  },

  _generateDishSummary(dishName, status, issues, synergies, dish) {
    if (status === 'red') {
      return `【不宜】${dishName}（${dish.cookMethod}，${dish.nature}性${dish.taste}味）—— ${issues[0]}`;
    } else if (status === 'yellow') {
      return `【谨慎】${dishName}（${dish.cookMethod}，${dish.nature}性）—— ${issues[0]}`;
    } else if (synergies.length > 0) {
      return `【可食】${dishName}（${dish.cookMethod}，${dish.nature}性）—— ${synergies[0]}`;
    } else {
      return `【可食】${dishName}（${dish.cookMethod}，${dish.nature}性${dish.taste}味）—— 性味平和，适量食用。`;
    }
  },

  /**
   * 分析一餐/一天的饮食组合
   */
  analyzeMeal(foodList, constitutions, liuQiIndex, formulaName) {
    const results = foodList.map(f => this.analyzeFood(f, constitutions, liuQiIndex, formulaName));

    // 组合分析
    const comboIssues = [];
    const comboSynergies = [];

    // 寒热搭配检测
    const coldFoods = results.filter(r => r.info && (r.info.nature === '寒' || r.info.nature === '凉'));
    const hotFoods = results.filter(r => r.info && (r.info.nature === '热' || r.info.nature === '大热' || r.info.nature === '温'));
    if (coldFoods.length > 0 && hotFoods.length > 0) {
      comboIssues.push('寒热食物同餐，易致脾胃失调。建议分开食用或调整比例。');
    }

    // 五行平衡检测（支持成品菜肴）
    const wuxingCounts = { 木:0, 火:0, 土:0, 金:0, 水:0 };
    results.forEach(r => {
      if (r.info && r.info.wuxing) {
        wuxingCounts[r.info.wuxing]++;
      } else if (r.isDish && r.dishInfo && r.dishInfo.wuxing) {
        wuxingCounts[r.dishInfo.wuxing]++;
      }
    });
    const dominant = Object.entries(wuxingCounts).sort((a,b) => b[1]-a[1])[0];
    if (dominant[1] >= 3) {
      comboIssues.push(`五行偏盛：${dominant[0]}行食物过多（${dominant[1]}种），建议增加其他行食物以平衡。`);
    }

    // 补益与攻伐检测
    const tonicFoods = results.filter(r => r.info && (r.info.desc.includes('补') || r.info.desc.includes('益')));
    const drainingFoods = results.filter(r => r.info && (r.info.desc.includes('泻') || r.info.desc.includes('利') || r.info.desc.includes('破')));
    if (tonicFoods.length > 0 && drainingFoods.length > 0) {
      comboIssues.push('补益与攻伐食物同餐，功效相抵。建议分开食用。');
    }

    return {
      items: results,
      comboIssues,
      comboSynergies,
      overallStatus: results.some(r => r.status === 'red') ? 'red' : results.some(r => r.status === 'yellow') ? 'yellow' : 'green',
      wuxingBalance: wuxingCounts
    };
  },

  _generateSummary(foodName, status, issues, synergies, food) {
    if (status === 'red') {
      return `【不宜】${foodName}（${food.nature}性${food.taste}味，归${food.meridian}经）—— ${issues[0]}`;
    } else if (status === 'yellow') {
      return `【谨慎】${foodName}（${food.nature}性${food.taste}味）—— ${issues[0]}`;
    } else if (synergies.length > 0) {
      return `【推荐】${foodName}（${food.nature}性${food.taste}味）—— ${synergies[0]}`;
    } else {
      return `【可食】${foodName}（${food.nature}性${food.taste}味，归${food.meridian}经）—— 性味平和，适量食用。`;
    }
  },

  /**
   * 获取推荐食物列表
   */
  getRecommendations(constitutions, liuQiIndex) {
    const recommendations = [];
    Object.entries(this.foodDB).forEach(([name, info]) => {
      let score = 0;
      let reasons = [];

      // 体质匹配加分
      constitutions.forEach(c => {
        const rule = this.constitutionRules[c];
        if (rule) {
          if (rule.preferFoods.includes(name)) { score += 3; reasons.push(`宜${c}`); }
          if (rule.preferNature.includes(info.nature)) { score += 1; }
          if (rule.avoidFoods.includes(name)) { score -= 5; }
          if (rule.avoidNature.includes(info.nature)) { score -= 2; }
        }
      });

      // 时令匹配加分
      const lqRule = this.liuQiRules[liuQiIndex];
      if (lqRule) {
        if (lqRule.prefer.some(p => info.desc.includes(p) || info.taste.includes(p) || info.nature.includes(p))) {
          score += 2; reasons.push('合时令');
        }
        if (lqRule.avoid.some(a => info.desc.includes(a) || info.taste.includes(a))) {
          score -= 2;
        }
      }

      // 平和食物加分
      if (info.nature === '平') score += 1;

      if (score >= 2) {
        recommendations.push({ name, score, reasons: reasons.join('、'), info });
      }
    });

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 15);
  },

  /**
   * 获取当日饮食总建议
   * 早中晚分别设计：早餐养胃、午餐营养、晚餐清淡
   */
  getDailyDietAdvice(constitutions, liuQiIndex, formulaName) {
    const lqRule = this.liuQiRules[liuQiIndex];
    const phase = ['初之气','二之气','三之气','四之气','五之气','终之气'][liuQiIndex];

    let advice = {
      phase,
      general: '',
      breakfast: [],
      lunch: [],
      dinner: [],
      avoid: [],
      prefer: []
    };

    if (lqRule) {
      advice.general = phase + '：' + lqRule.reason + '。宜' + lqRule.prefer.join('、') + '，忌' + lqRule.avoid.join('、') + '。';
      advice.avoid = lqRule.avoid;
      advice.prefer = lqRule.prefer;
    }

    // 根据体质补充
    constitutions.forEach(function(c) {
      const rule = this.constitutionRules[c];
      if (rule) {
        advice.avoid = [...new Set([...advice.avoid, ...rule.avoidFoods.slice(0, 5)])];
        advice.prefer = [...new Set([...advice.prefer, ...rule.preferFoods.slice(0, 5)])];
      }
    }.bind(this));

    // 获取推荐列表并分类
    const recs = this.getRecommendations(constitutions, liuQiIndex);

    // 按类别分组，同时排除忌食
    const avoidSet = new Set(advice.avoid);
    const safeRecs = recs.filter(function(r) { return !avoidSet.has(r.name); });

    const grains = safeRecs.filter(function(r) { return r.info.category === '谷物'; });
    const proteins = safeRecs.filter(function(r) { return ['肉类','蛋类','豆制品','海鲜'].indexOf(r.info.category) !== -1; });
    const vegetables = safeRecs.filter(function(r) { return r.info.category === '蔬菜'; });
    const fruits = safeRecs.filter(function(r) { return r.info.category === '水果'; });
    const nuts = safeRecs.filter(function(r) { return r.info.category === '坚果'; });

    // 早餐：养胃健脾、易消化。以粥/面食 + 温和蛋白 + 少量蔬果为主
    // 避免难消化、高蛋白、寒凉
    const breakfastGrains = grains.filter(function(r) {
      return ['小米','大米','糯米','燕麦'].indexOf(r.name) !== -1 || r.name.indexOf('粥') !== -1;
    });
    const breakfastProteins = proteins.filter(function(r) {
      return ['鸡蛋','豆浆','豆花'].indexOf(r.name) !== -1;
    });
    const breakfastFruits = fruits.filter(function(r) {
      return ['苹果','葡萄','红枣'].indexOf(r.name) !== -1;
    });
    const breakfastVegs = vegetables.filter(function(r) {
      return ['山药','南瓜','胡萝卜'].indexOf(r.name) !== -1;
    });

    advice.breakfast = [
      ...(breakfastGrains[0] ? [breakfastGrains[0].name + '粥'] : (grains[0] ? [grains[0].name] : [])),
      ...(breakfastProteins[0] ? [breakfastProteins[0].name] : []),
      ...(breakfastVegs[0] ? [breakfastVegs[0].name] : []),
      ...(breakfastFruits[0] ? [breakfastFruits[0].name] : [])
    ].slice(0, 4);

    // 午餐：营养最丰富。主食 + 适量蛋白质 + 多样蔬菜
    const lunchGrains = grains.filter(function(r) { return ['大米','糙米','小米'].indexOf(r.name) !== -1; });
    const lunchMeats = proteins.filter(function(r) { return ['猪肉','牛肉','鸡肉','鱼肉'].indexOf(r.name) !== -1; });
    const lunchVegs = vegetables.filter(function(r) {
      return ['菠菜','芹菜','黄瓜','冬瓜','番茄','茄子','丝瓜','木耳','胡萝卜','山药'].indexOf(r.name) !== -1;
    });

    advice.lunch = [
      ...(lunchGrains[0] ? [lunchGrains[0].name + '饭'] : (grains[0] ? [grains[0].name] : [])),
      ...(lunchMeats[0] ? [lunchMeats[0].name] : (proteins[0] ? [proteins[0].name] : [])),
      ...(lunchVegs[0] ? [lunchVegs[0].name] : []),
      ...(lunchVegs[1] ? [lunchVegs[1].name] : (vegetables[0] && vegetables[0].name !== lunchVegs[0]?.name ? [vegetables[0].name] : []))
    ].slice(0, 4);

    // 晚餐：清淡易消化。少量主食 + 以素为主 + 少量易消化蛋白
    const dinnerGrains = grains.filter(function(r) {
      return ['小米','大米','燕麦'].indexOf(r.name) !== -1;
    });
    const dinnerLightProteins = proteins.filter(function(r) {
      return ['豆腐','豆浆','鸡蛋','鱼肉'].indexOf(r.name) !== -1;
    });
    const dinnerVegs = vegetables.filter(function(r) {
      return ['白菜','菠菜','黄瓜','冬瓜','番茄','茄子','丝瓜','木耳','白萝卜'].indexOf(r.name) !== -1;
    });

    advice.dinner = [
      ...(dinnerGrains[0] ? [dinnerGrains[0].name + '粥'] : (grains[0] ? [grains[0].name] : [])),
      ...(dinnerVegs[0] ? [dinnerVegs[0].name] : []),
      ...(dinnerVegs[1] ? [dinnerVegs[1].name] : (vegetables[0] && vegetables[0].name !== dinnerVegs[0]?.name ? [vegetables[0].name] : [])),
      ...(dinnerLightProteins[0] ? [dinnerLightProteins[0].name] : [])
    ].slice(0, 4);

    // 若某餐为空，给出默认建议
    if (advice.breakfast.length === 0) advice.breakfast = ['小米粥', '鸡蛋'];
    if (advice.lunch.length === 0) advice.lunch = ['米饭', '清蒸鱼', '炒菠菜'];
    if (advice.dinner.length === 0) advice.dinner = ['山药粥', '豆腐', '炒白菜'];

    return advice;
  }
};

if (typeof module !== 'undefined') module.exports = FoodEngine;
