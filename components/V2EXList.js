import React, {Component} from 'react';
import {ListView, Text, StyleSheet, TouchableHighlight, RefreshControl, Image, View} from 'react-native';
import Cheerio from 'cheerio-without-node-native';
import Moment from 'moment';
import 'moment/locale/zh-cn';

import NewsDetail from './NewsDetail';
const url = 'https://v2ex.com?tab=all';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36';

const json = "[ { title: '[成都] - [百词斩-招聘] 15k-35k（可上浮）'," +
  "    href: 'https://v2ex.com/t/423579#reply126'," +
  "    avatar: '//cdn.v2ex.com/avatar/3e87/b607/135469_normal.png?m=1450150250'," +
  "    tab: ''," +
  "    author: 'Trent'," +
  "    replyCount: '126' }," +
  "  { title: '活久见！网易云音乐和 QQ 音乐的桌面端都支持高分屏了'," +
  "    href: 'https://v2ex.com/t/428943#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/cd40/af81/223968_normal.png?m=1510470663'," +
  "    tab: ''," +
  "    author: 'mengyaoss77'," +
  "    replyCount: '4' }," +
  "  { title: '索尼电视的遥控器也太差了'," +
  "    href: 'https://v2ex.com/t/428955#reply11'," +
  "    avatar: '//cdn.v2ex.com/gravatar/2b1317d6401c41342366068439c6b94d?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'bypain'," +
  "    replyCount: '11' }," +
  "  { title: '如何提高 KPI'," +
  "    href: 'https://v2ex.com/t/428936#reply15'," +
  "    avatar: '//cdn.v2ex.com/gravatar/b0b9d56211cd86c6817d1f198acf115f?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'hwb900501'," +
  "    replyCount: '15' }," +
  "  { title: '办公使用笔记本和台式机之间如何优雅的传文件、图片、文本消息呢？'," +
  "    href: 'https://v2ex.com/t/428809#reply32'," +
  "    avatar: '//cdn.v2ex.com/avatar/68b8/8ca9/158060_normal.png?m=1456380166'," +
  "    tab: ''," +
  "    author: 'dunn'," +
  "    replyCount: '32' }," +
  "  { title: '“生物黑客”如何帮助你提升智力 – 从性到莫达非尼到摇头丸'," +
  "    href: 'https://v2ex.com/t/428575#reply118'," +
  "    avatar: '//cdn.v2ex.com/avatar/8749/231f/148283_normal.png?m=1448251850'," +
  "    tab: ''," +
  "    author: 'BoyceChang'," +
  "    replyCount: '118' }," +
  "  { title: '而立之年的程序员转行体制内之后的困境'," +
  "    href: 'https://v2ex.com/t/428811#reply127'," +
  "    avatar: '//cdn.v2ex.com/gravatar/630414d3afe67d7a0a6f2e87013fe939?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'someoneuseless'," +
  "    replyCount: '127' }," +
  "  { title: '“二手东”，果然名不虚传。'," +
  "    href: 'https://v2ex.com/t/428882#reply46'," +
  "    avatar: '//cdn.v2ex.com/gravatar/f3ffe8e59b0925560953f1bb3c569e1d?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'anhaoh'," +
  "    replyCount: '46' }," +
  "  { title: '用一加的朋友请教一下地铁公交刷卡操作姿势具体是怎样的？'," +
  "    href: 'https://v2ex.com/t/428898#reply9'," +
  "    avatar: '//cdn.v2ex.com/avatar/3d13/d699/270240_normal.png?m=1511667040'," +
  "    tab: ''," +
  "    author: 'lidamao'," +
  "    replyCount: '9' }," +
  "  { title: '现在想配一台电脑太痛苦了'," +
  "    href: 'https://v2ex.com/t/428878#reply50'," +
  "    avatar: '//cdn.v2ex.com/avatar/4800/deb3/9976_normal.png?m=1471846787'," +
  "    tab: ''," +
  "    author: 'subpo'," +
  "    replyCount: '50' }," +
  "  { title: '区块链目前都是公司来主推，是不是应该转变为社区来主推？'," +
  "    href: 'https://v2ex.com/t/428845#reply16'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf7f/2f64/82428_normal.png?m=1515205549'," +
  "    tab: ''," +
  "    author: 'accacc'," +
  "    replyCount: '16' }," +
  "  { title: 'PayPal 送优惠券啦， 20-5'," +
  "    href: 'https://v2ex.com/t/428842#reply58'," +
  "    avatar: '//cdn.v2ex.com/gravatar/12130516c3aca3ddd3880afcccde49bb?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'sean233'," +
  "    replyCount: '58' }," +
  "  { title: 'mac 下的办公套件， office 全家桶好用还是机器自带的那一套 keynote 什么的好用？'," +
  "    href: 'https://v2ex.com/t/428759#reply28'," +
  "    avatar: '//cdn.v2ex.com/gravatar/bf8741ad3581f66e99a1cfebf7fdeb5a?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'jeffcott'," +
  "    replyCount: '28' }," +
  "  { title: '你们催的移动开发热点、安全沙龙 PPT 已上传，拿走不谢~'," +
  "    href: 'https://v2ex.com/t/428901#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/bf84/3ccd/283713_normal.png?m=1516181797'," +
  "    tab: ''," +
  "    author: 'meituandianping'," +
  "    replyCount: '5' }," +
  "  { title: '请问大佬们，刚毕业的 IT 汪应该选择哪种学习方向？'," +
  "    href: 'https://v2ex.com/t/428787#reply10'," +
  "    avatar: '//cdn.v2ex.com/avatar/8e0d/d94f/276323_normal.png?m=1513937003'," +
  "    tab: ''," +
  "    author: 'lincya'," +
  "    replyCount: '10' }," +
  "  { title: 'PyCharm 自带的 Monokai 主题看不顺眼，改了个模仿 Sublime 的版本'," +
  "    href: 'https://v2ex.com/t/428961#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/633b/65a7/79779_normal.png?m=1490454174'," +
  "    tab: ''," +
  "    author: 'simoncos'," +
  "    replyCount: '5' }," +
  "  { title: '不爱写 css 的前端是不是很不合格？'," +
  "    href: 'https://v2ex.com/t/428847#reply27'," +
  "    avatar: '//cdn.v2ex.com/avatar/086c/90e7/212666_normal.png?m=1495696865'," +
  "    tab: ''," +
  "    author: 'frankkai'," +
  "    replyCount: '27' }," +
  "  { title: '讨论一下本地发起的 POST 能不能算为 CSRF 攻击'," +
  "    href: 'https://v2ex.com/t/428860#reply21'," +
  "    avatar: '//cdn.v2ex.com/gravatar/f4116dcef6d05db794a03022660331e0?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'FONG2'," +
  "    replyCount: '21' }," +
  "  { title: '终于可以用上电信的光纤了。还给我升级到 100M'," +
  "    href: 'https://v2ex.com/t/428971#reply1'," +
  "    avatar: '//cdn.v2ex.com/gravatar/d4514b79470b6565e672928bd5c41c0b?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'chiho'," +
  "    replyCount: '1' }," +
  "  { title: '当前时间 (2018-02-06)，怎么搞到美国电话号码？'," +
  "    href: 'https://v2ex.com/t/428959#reply2'," +
  "    avatar: '//cdn.v2ex.com/gravatar/7b92c4c3f96f13f8129d897bd89acdad?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'lancelock'," +
  "    replyCount: '2' }," +
  "  { title: '如何在 iPhone 锁屏界面展现天气情况？'," +
  "    href: 'https://v2ex.com/t/428853#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/c200/6858/90449_normal.png?m=1474496106'," +
  "    tab: ''," +
  "    author: 'endosome'," +
  "    replyCount: '5' }," +
  "  { title: '给网络小白推荐什么路由器呢？能远程下载的。'," +
  "    href: 'https://v2ex.com/t/428934#reply8'," +
  "    avatar: '//cdn.v2ex.com/gravatar/4d6f38c9077246fc38403f096384ff4b?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'firhome'," +
  "    replyCount: '8' }," +
  "  { title: '信仰充值成功'," +
  "    href: 'https://v2ex.com/t/428800#reply42'," +
  "    avatar: '//cdn.v2ex.com/avatar/4801/6f54/21824_normal.png?m=1443346505'," +
  "    tab: ''," +
  "    author: 'cevincheung'," +
  "    replyCount: '42' }," +
  "  { title: '马云爸爸又发钱了，如何快速集齐 5 个福？'," +
  "    href: 'https://v2ex.com/t/428836#reply52'," +
  "    avatar: '//cdn.v2ex.com/avatar/f5cb/bbb3/281313_normal.png?m=1517559221'," +
  "    tab: ''," +
  "    author: 'sisterth'," +
  "    replyCount: '52' }," +
  "  { title: '10.13 版本的系统，命令行下 ssh 可以自动走系统代理了'," +
  "    href: 'https://v2ex.com/t/428976#reply1'," +
  "    avatar: '//cdn.v2ex.com/gravatar/98e4b18459c39f9bc6506480276c1abc?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'warcraft1236'," +
  "    replyCount: '1' }," +
  "  { title: '为程序员开发的 Chrome 插件'," +
  "    href: 'https://v2ex.com/t/428874#reply22'," +
  "    avatar: '//cdn.v2ex.com/avatar/4f7b/6eb7/89017_normal.png?m=1469064886'," +
  "    tab: ''," +
  "    author: 'jaywcjlove'," +
  "    replyCount: '22' }," +
  "  { title: 'JavaScript 如何只获取标签内的文字内容'," +
  "    href: 'https://v2ex.com/t/428969#reply2'," +
  "    avatar: '//cdn.v2ex.com/gravatar/78acd044e774b50cbc7e281aa2a5b2c7?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'whisky221'," +
  "    replyCount: '2' }," +
  "  { title: '微信 6.6.2 Android 版，更新后变这样了'," +
  "    href: 'https://v2ex.com/t/428880#reply29'," +
  "    avatar: '//cdn.v2ex.com/avatar/0e2f/17b0/251211_normal.png?m=1516950007'," +
  "    tab: ''," +
  "    author: 'XinLake'," +
  "    replyCount: '29' }," +
  "  { title: '[奇思妙想]我们能否劫持广告联盟来获取用户喜好\\r\?'," +
  "    href: 'https://v2ex.com/t/428926#reply8'," +
  "    avatar: '//cdn.v2ex.com/avatar/bd4a/7bde/120184_normal.png?m=1487426440'," +
  "    tab: ''," +
  "    author: 'vertigo'," +
  "    replyCount: '8' }," +
  "  { title: '星巴克 8-8 元优惠券'," +
  "    href: 'https://v2ex.com/t/428932#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/9759/c2a1/271101_normal.png?m=1513155821'," +
  "    tab: ''," +
  "    author: 'MooneyChu'," +
  "    replyCount: '4' }," +
  "  { title: 'A 站关停的第 6 天，想她~~~'," +
  "    href: 'https://v2ex.com/t/428948#reply9'," +
  "    avatar: '//cdn.v2ex.com/avatar/4ed3/e5b7/268036_normal.png?m=1514534938'," +
  "    tab: ''," +
  "    author: 'Elephant696'," +
  "    replyCount: '9' }," +
  "  { title: '深圳攻城湿们什么时候放假?'," +
  "    href: 'https://v2ex.com/t/428792#reply29'," +
  "    avatar: '//cdn.v2ex.com/avatar/4c85/39d2/287742_normal.png?m=1517221391'," +
  "    tab: ''," +
  "    author: 'WangAJiu'," +
  "    replyCount: '29' }," +
  "  { title: '支付宝五福活动彩蛋！'," +
  "    href: 'https://v2ex.com/t/428909#reply30'," +
  "    avatar: '//cdn.v2ex.com/avatar/f8b7/5486/61354_normal.png?m=1421983896'," +
  "    tab: ''," +
  "    author: 'charzluo'," +
  "    replyCount: '30' }," +
  "  { title: '狗东已经不行了，很多商品都不支持七天无理由退货'," +
  "    href: 'https://v2ex.com/t/428915#reply32'," +
  "    avatar: '//cdn.v2ex.com/avatar/f5fb/13d1/180875_normal.png?m=1514921911'," +
  "    tab: ''," +
  "    author: 'qsnow6'," +
  "    replyCount: '32' }," +
  "  { title: '晒一下各位 V 友的年终奖？'," +
  "    href: 'https://v2ex.com/t/428904#reply26'," +
  "    avatar: '//cdn.v2ex.com/gravatar/03af8589cf6944264db8bfe1ff9c91e4?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'Ziav'," +
  "    replyCount: '26' }," +
  "  { title: '读完《生物黑客》觉得有必要引起大家的重视'," +
  "    href: 'https://v2ex.com/t/428852#reply15'," +
  "    avatar: '//cdn.v2ex.com/avatar/491e/f963/50071_normal.png?m=1479122892'," +
  "    tab: ''," +
  "    author: 'fish19901010'," +
  "    replyCount: '15' }," +
  "  { title: '[中移物联网] [内推] [南京/无锡/] 大量招研发人员 [软件/硬件/产品/设计/市场]'," +
  "    href: 'https://v2ex.com/t/428832#reply26'," +
  "    avatar: '//cdn.v2ex.com/avatar/df17/bbdc/113430_normal.png?m=1429971815'," +
  "    tab: ''," +
  "    author: 'smallerpig'," +
  "    replyCount: '26' }," +
  "  { title: '众筹一个程序员版的饭否（纯邀请制）？'," +
  "    href: 'https://v2ex.com/t/428963#reply3'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf3a/425d/156927_normal.png?m=1453771887'," +
  "    tab: ''," +
  "    author: 'beryl'," +
  "    replyCount: '3' }," +
  "  { title: '分享一个 状态栏图标隐藏 App'," +
  "    href: 'https://v2ex.com/t/428962#reply4'," +
  "    avatar: '//cdn.v2ex.com/gravatar/fdcf458e74bd11d8c4f947978311d8e7?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'Rorysky'," +
  "    replyCount: '4' }," +
  "  { title: '你们的币咋样了？'," +
  "    href: 'https://v2ex.com/t/428951#reply35'," +
  "    avatar: '//cdn.v2ex.com/avatar/cee9/3463/68390_normal.png?m=1437121564'," +
  "    tab: ''," +
  "    author: 'sunfanteng'," +
  "    replyCount: '35' }," +
  "  { title: '多人公用的“网盘”系统，如何实现服务端文件加密？'," +
  "    href: 'https://v2ex.com/t/428975#reply0'," +
  "    avatar: '//cdn.v2ex.com/avatar/668d/17e7/71769_normal.png?m=1513309814'," +
  "    tab: ''," +
  "    author: 'flyingHagan'," +
  "    replyCount: '' }," +
  "  { title: '华为屏蔽 google play?'," +
  "    href: 'https://v2ex.com/t/428417#reply208'," +
  "    avatar: '//cdn.v2ex.com/avatar/30a1/afeb/16501_normal.png?m=1330186840'," +
  "    tab: ''," +
  "    author: 'a752252255'," +
  "    replyCount: '208' }," +
  "  { title: 'macOS 自动选中打出来的字 bug'," +
  "    href: 'https://v2ex.com/t/428974#reply0'," +
  "    avatar: '//cdn.v2ex.com/gravatar/6856edf00326c888bd914d98fc004adf?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'RobinCheng'," +
  "    replyCount: '' }," +
  "  { title: '程序员工作中奇葩同事关系处理以及个人发展的困惑？'," +
  "    href: 'https://v2ex.com/t/428957#reply6'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf3a/425d/156927_normal.png?m=1453771887'," +
  "    tab: ''," +
  "    author: 'beryl'," +
  "    replyCount: '6' }," +
  "  { title: '简单了解一下大家的工作时间和待遇问题'," +
  "    href: 'https://v2ex.com/t/428973#reply0'," +
  "    avatar: '//cdn.v2ex.com/gravatar/c63a0afab634afee39266737f459ea50?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'moeloliu'," +
  "    replyCount: '' }," +
  "  { title: 'ps4 猎人采购意见收集'," +
  "    href: 'https://v2ex.com/t/428838#reply17'," +
  "    avatar: '//cdn.v2ex.com/avatar/0bff/d7c8/155595_normal.png?m=1453886853'," +
  "    tab: ''," +
  "    author: 'Ncanback'," +
  "    replyCount: '17' }," +
  "  { title: '问一下各位，你们都能背的下来函数名吗'," +
  "    href: 'https://v2ex.com/t/428939#reply11'," +
  "    avatar: '//cdn.v2ex.com/avatar/c4e3/7418/196587_normal.png?m=1496719414'," +
  "    tab: ''," +
  "    author: 'IdJoel'," +
  "    replyCount: '11' }," +
  "  { title: '看教程总感觉枯燥无味，总是喜欢看开发案例直接撸'," +
  "    href: 'https://v2ex.com/t/428889#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/5317/3df6/180207_normal.png?m=1492830287'," +
  "    tab: ''," +
  "    author: 'cnqncom'," +
  "    replyCount: '4' }," +
  "  { title: 'OS X 时不时会冒出一个冒泡的声音，声音还挺大，这个声音是啥 App 的提示音？'," +
  "    href: 'https://v2ex.com/t/428916#reply7'," +
  "    avatar: '//cdn.v2ex.com/avatar/3d21/7241/22222_normal.png?m=1415601994'," +
  "    tab: ''," +
  "    author: 'verfino'," +
  "    replyCount: '7' }," +
  "  { title: '[知乎][北京/成都][社招] 内推工程/设计/产品/运营等各种职位'," +
  "    href: 'https://v2ex.com/t/428871#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/7975/7931/172971_normal.png?m=1517893073'," +
  "    tab: ''," +
  "    author: 'alvie'," +
  "    replyCount: '5' }," +
  "  { title: 'Go 碰到的内存问题'," +
  "    href: 'https://v2ex.com/t/428920#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/64e7/d277/169110_normal.png?m=1495696257'," +
  "    tab: ''," +
  "    author: 'Morriaty'," +
  "    replyCount: '5' }," +
  "  { title: '[阿里内推] 年底大量招人，需要的请进来看看'," +
  "    href: 'https://v2ex.com/t/428911#reply3'," +
  "    avatar: '//cdn.v2ex.com/avatar/106e/9495/108388_normal.png?m=1477024108'," +
  "    tab: ''," +
  "    author: 'w99wen'," +
  "    replyCount: '3' } ]" +
  "2018-02-06 17:52:24.672964+0800 ITNews[10794:1136577] 'v2ex-tmp', [ { title: '[成都] - [百词斩-招聘] 15k-35k（可上浮）'," +
  "    href: 'https://v2ex.com/t/423579#reply126'," +
  "    avatar: '//cdn.v2ex.com/avatar/3e87/b607/135469_normal.png?m=1450150250'," +
  "    tab: ''," +
  "    author: 'Trent'," +
  "    replyCount: '126' }," +
  "  { title: '活久见！网易云音乐和 QQ 音乐的桌面端都支持高分屏了'," +
  "    href: 'https://v2ex.com/t/428943#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/cd40/af81/223968_normal.png?m=1510470663'," +
  "    tab: ''," +
  "    author: 'mengyaoss77'," +
  "    replyCount: '4' }," +
  "  { title: '索尼电视的遥控器也太差了'," +
  "    href: 'https://v2ex.com/t/428955#reply11'," +
  "    avatar: '//cdn.v2ex.com/gravatar/2b1317d6401c41342366068439c6b94d?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'bypain'," +
  "    replyCount: '11' }," +
  "  { title: '如何提高 KPI'," +
  "    href: 'https://v2ex.com/t/428936#reply15'," +
  "    avatar: '//cdn.v2ex.com/gravatar/b0b9d56211cd86c6817d1f198acf115f?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'hwb900501'," +
  "    replyCount: '15' }," +
  "  { title: '办公使用笔记本和台式机之间如何优雅的传文件、图片、文本消息呢？'," +
  "    href: 'https://v2ex.com/t/428809#reply32'," +
  "    avatar: '//cdn.v2ex.com/avatar/68b8/8ca9/158060_normal.png?m=1456380166'," +
  "    tab: ''," +
  "    author: 'dunn'," +
  "    replyCount: '32' }," +
  "  { title: '“生物黑客”如何帮助你提升智力 – 从性到莫达非尼到摇头丸'," +
  "    href: 'https://v2ex.com/t/428575#reply118'," +
  "    avatar: '//cdn.v2ex.com/avatar/8749/231f/148283_normal.png?m=1448251850'," +
  "    tab: ''," +
  "    author: 'BoyceChang'," +
  "    replyCount: '118' }," +
  "  { title: '而立之年的程序员转行体制内之后的困境'," +
  "    href: 'https://v2ex.com/t/428811#reply127'," +
  "    avatar: '//cdn.v2ex.com/gravatar/630414d3afe67d7a0a6f2e87013fe939?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'someoneuseless'," +
  "    replyCount: '127' }," +
  "  { title: '“二手东”，果然名不虚传。'," +
  "    href: 'https://v2ex.com/t/428882#reply46'," +
  "    avatar: '//cdn.v2ex.com/gravatar/f3ffe8e59b0925560953f1bb3c569e1d?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'anhaoh'," +
  "    replyCount: '46' }," +
  "  { title: '用一加的朋友请教一下地铁公交刷卡操作姿势具体是怎样的？'," +
  "    href: 'https://v2ex.com/t/428898#reply9'," +
  "    avatar: '//cdn.v2ex.com/avatar/3d13/d699/270240_normal.png?m=1511667040'," +
  "    tab: ''," +
  "    author: 'lidamao'," +
  "    replyCount: '9' }," +
  "  { title: '现在想配一台电脑太痛苦了'," +
  "    href: 'https://v2ex.com/t/428878#reply50'," +
  "    avatar: '//cdn.v2ex.com/avatar/4800/deb3/9976_normal.png?m=1471846787'," +
  "    tab: ''," +
  "    author: 'subpo'," +
  "    replyCount: '50' }," +
  "  { title: '区块链目前都是公司来主推，是不是应该转变为社区来主推？'," +
  "    href: 'https://v2ex.com/t/428845#reply16'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf7f/2f64/82428_normal.png?m=1515205549'," +
  "    tab: ''," +
  "    author: 'accacc'," +
  "    replyCount: '16' }," +
  "  { title: 'PayPal 送优惠券啦， 20-5'," +
  "    href: 'https://v2ex.com/t/428842#reply58'," +
  "    avatar: '//cdn.v2ex.com/gravatar/12130516c3aca3ddd3880afcccde49bb?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'sean233'," +
  "    replyCount: '58' }," +
  "  { title: 'mac 下的办公套件， office 全家桶好用还是机器自带的那一套 keynote 什么的好用？'," +
  "    href: 'https://v2ex.com/t/428759#reply28'," +
  "    avatar: '//cdn.v2ex.com/gravatar/bf8741ad3581f66e99a1cfebf7fdeb5a?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'jeffcott'," +
  "    replyCount: '28' }," +
  "  { title: '你们催的移动开发热点、安全沙龙 PPT 已上传，拿走不谢~'," +
  "    href: 'https://v2ex.com/t/428901#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/bf84/3ccd/283713_normal.png?m=1516181797'," +
  "    tab: ''," +
  "    author: 'meituandianping'," +
  "    replyCount: '5' }," +
  "  { title: '请问大佬们，刚毕业的 IT 汪应该选择哪种学习方向？'," +
  "    href: 'https://v2ex.com/t/428787#reply10'," +
  "    avatar: '//cdn.v2ex.com/avatar/8e0d/d94f/276323_normal.png?m=1513937003'," +
  "    tab: ''," +
  "    author: 'lincya'," +
  "    replyCount: '10' }," +
  "  { title: 'PyCharm 自带的 Monokai 主题看不顺眼，改了个模仿 Sublime 的版本'," +
  "    href: 'https://v2ex.com/t/428961#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/633b/65a7/79779_normal.png?m=1490454174'," +
  "    tab: ''," +
  "    author: 'simoncos'," +
  "    replyCount: '5' }," +
  "  { title: '不爱写 css 的前端是不是很不合格？'," +
  "    href: 'https://v2ex.com/t/428847#reply27'," +
  "    avatar: '//cdn.v2ex.com/avatar/086c/90e7/212666_normal.png?m=1495696865'," +
  "    tab: ''," +
  "    author: 'frankkai'," +
  "    replyCount: '27' }," +
  "  { title: '讨论一下本地发起的 POST 能不能算为 CSRF 攻击'," +
  "    href: 'https://v2ex.com/t/428860#reply21'," +
  "    avatar: '//cdn.v2ex.com/gravatar/f4116dcef6d05db794a03022660331e0?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'FONG2'," +
  "    replyCount: '21' }," +
  "  { title: '终于可以用上电信的光纤了。还给我升级到 100M'," +
  "    href: 'https://v2ex.com/t/428971#reply1'," +
  "    avatar: '//cdn.v2ex.com/gravatar/d4514b79470b6565e672928bd5c41c0b?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'chiho'," +
  "    replyCount: '1' }," +
  "  { title: '当前时间 (2018-02-06)，怎么搞到美国电话号码？'," +
  "    href: 'https://v2ex.com/t/428959#reply2'," +
  "    avatar: '//cdn.v2ex.com/gravatar/7b92c4c3f96f13f8129d897bd89acdad?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'lancelock'," +
  "    replyCount: '2' }," +
  "  { title: '如何在 iPhone 锁屏界面展现天气情况？'," +
  "    href: 'https://v2ex.com/t/428853#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/c200/6858/90449_normal.png?m=1474496106'," +
  "    tab: ''," +
  "    author: 'endosome'," +
  "    replyCount: '5' }," +
  "  { title: '给网络小白推荐什么路由器呢？能远程下载的。'," +
  "    href: 'https://v2ex.com/t/428934#reply8'," +
  "    avatar: '//cdn.v2ex.com/gravatar/4d6f38c9077246fc38403f096384ff4b?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'firhome'," +
  "    replyCount: '8' }," +
  "  { title: '信仰充值成功'," +
  "    href: 'https://v2ex.com/t/428800#reply42'," +
  "    avatar: '//cdn.v2ex.com/avatar/4801/6f54/21824_normal.png?m=1443346505'," +
  "    tab: ''," +
  "    author: 'cevincheung'," +
  "    replyCount: '42' }," +
  "  { title: '马云爸爸又发钱了，如何快速集齐 5 个福？'," +
  "    href: 'https://v2ex.com/t/428836#reply52'," +
  "    avatar: '//cdn.v2ex.com/avatar/f5cb/bbb3/281313_normal.png?m=1517559221'," +
  "    tab: ''," +
  "    author: 'sisterth'," +
  "    replyCount: '52' }," +
  "  { title: '10.13 版本的系统，命令行下 ssh 可以自动走系统代理了'," +
  "    href: 'https://v2ex.com/t/428976#reply1'," +
  "    avatar: '//cdn.v2ex.com/gravatar/98e4b18459c39f9bc6506480276c1abc?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'warcraft1236'," +
  "    replyCount: '1' }," +
  "  { title: '为程序员开发的 Chrome 插件'," +
  "    href: 'https://v2ex.com/t/428874#reply22'," +
  "    avatar: '//cdn.v2ex.com/avatar/4f7b/6eb7/89017_normal.png?m=1469064886'," +
  "    tab: ''," +
  "    author: 'jaywcjlove'," +
  "    replyCount: '22' }," +
  "  { title: 'JavaScript 如何只获取标签内的文字内容'," +
  "    href: 'https://v2ex.com/t/428969#reply2'," +
  "    avatar: '//cdn.v2ex.com/gravatar/78acd044e774b50cbc7e281aa2a5b2c7?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'whisky221'," +
  "    replyCount: '2' }," +
  "  { title: '微信 6.6.2 Android 版，更新后变这样了'," +
  "    href: 'https://v2ex.com/t/428880#reply29'," +
  "    avatar: '//cdn.v2ex.com/avatar/0e2f/17b0/251211_normal.png?m=1516950007'," +
  "    tab: ''," +
  "    author: 'XinLake'," +
  "    replyCount: '29' }," +
  "  { title: '[奇思妙想]我们能否劫持广告联盟来获取用户喜好\\r\?'," +
  "    href: 'https://v2ex.com/t/428926#reply8'," +
  "    avatar: '//cdn.v2ex.com/avatar/bd4a/7bde/120184_normal.png?m=1487426440'," +
  "    tab: ''," +
  "    author: 'vertigo'," +
  "    replyCount: '8' }," +
  "  { title: '星巴克 8-8 元优惠券'," +
  "    href: 'https://v2ex.com/t/428932#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/9759/c2a1/271101_normal.png?m=1513155821'," +
  "    tab: ''," +
  "    author: 'MooneyChu'," +
  "    replyCount: '4' }," +
  "  { title: 'A 站关停的第 6 天，想她~~~'," +
  "    href: 'https://v2ex.com/t/428948#reply9'," +
  "    avatar: '//cdn.v2ex.com/avatar/4ed3/e5b7/268036_normal.png?m=1514534938'," +
  "    tab: ''," +
  "    author: 'Elephant696'," +
  "    replyCount: '9' }," +
  "  { title: '深圳攻城湿们什么时候放假?'," +
  "    href: 'https://v2ex.com/t/428792#reply29'," +
  "    avatar: '//cdn.v2ex.com/avatar/4c85/39d2/287742_normal.png?m=1517221391'," +
  "    tab: ''," +
  "    author: 'WangAJiu'," +
  "    replyCount: '29' }," +
  "  { title: '支付宝五福活动彩蛋！'," +
  "    href: 'https://v2ex.com/t/428909#reply30'," +
  "    avatar: '//cdn.v2ex.com/avatar/f8b7/5486/61354_normal.png?m=1421983896'," +
  "    tab: ''," +
  "    author: 'charzluo'," +
  "    replyCount: '30' }," +
  "  { title: '狗东已经不行了，很多商品都不支持七天无理由退货'," +
  "    href: 'https://v2ex.com/t/428915#reply32'," +
  "    avatar: '//cdn.v2ex.com/avatar/f5fb/13d1/180875_normal.png?m=1514921911'," +
  "    tab: ''," +
  "    author: 'qsnow6'," +
  "    replyCount: '32' }," +
  "  { title: '晒一下各位 V 友的年终奖？'," +
  "    href: 'https://v2ex.com/t/428904#reply26'," +
  "    avatar: '//cdn.v2ex.com/gravatar/03af8589cf6944264db8bfe1ff9c91e4?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'Ziav'," +
  "    replyCount: '26' }," +
  "  { title: '读完《生物黑客》觉得有必要引起大家的重视'," +
  "    href: 'https://v2ex.com/t/428852#reply15'," +
  "    avatar: '//cdn.v2ex.com/avatar/491e/f963/50071_normal.png?m=1479122892'," +
  "    tab: ''," +
  "    author: 'fish19901010'," +
  "    replyCount: '15' }," +
  "  { title: '[中移物联网] [内推] [南京/无锡/] 大量招研发人员 [软件/硬件/产品/设计/市场]'," +
  "    href: 'https://v2ex.com/t/428832#reply26'," +
  "    avatar: '//cdn.v2ex.com/avatar/df17/bbdc/113430_normal.png?m=1429971815'," +
  "    tab: ''," +
  "    author: 'smallerpig'," +
  "    replyCount: '26' }," +
  "  { title: '众筹一个程序员版的饭否（纯邀请制）？'," +
  "    href: 'https://v2ex.com/t/428963#reply3'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf3a/425d/156927_normal.png?m=1453771887'," +
  "    tab: ''," +
  "    author: 'beryl'," +
  "    replyCount: '3' }," +
  "  { title: '分享一个 状态栏图标隐藏 App'," +
  "    href: 'https://v2ex.com/t/428962#reply4'," +
  "    avatar: '//cdn.v2ex.com/gravatar/fdcf458e74bd11d8c4f947978311d8e7?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'Rorysky'," +
  "    replyCount: '4' }," +
  "  { title: '你们的币咋样了？'," +
  "    href: 'https://v2ex.com/t/428951#reply35'," +
  "    avatar: '//cdn.v2ex.com/avatar/cee9/3463/68390_normal.png?m=1437121564'," +
  "    tab: ''," +
  "    author: 'sunfanteng'," +
  "    replyCount: '35' }," +
  "  { title: '多人公用的“网盘”系统，如何实现服务端文件加密？'," +
  "    href: 'https://v2ex.com/t/428975#reply0'," +
  "    avatar: '//cdn.v2ex.com/avatar/668d/17e7/71769_normal.png?m=1513309814'," +
  "    tab: ''," +
  "    author: 'flyingHagan'," +
  "    replyCount: '' }," +
  "  { title: '华为屏蔽 google play?'," +
  "    href: 'https://v2ex.com/t/428417#reply208'," +
  "    avatar: '//cdn.v2ex.com/avatar/30a1/afeb/16501_normal.png?m=1330186840'," +
  "    tab: ''," +
  "    author: 'a752252255'," +
  "    replyCount: '208' }," +
  "  { title: 'macOS 自动选中打出来的字 bug'," +
  "    href: 'https://v2ex.com/t/428974#reply0'," +
  "    avatar: '//cdn.v2ex.com/gravatar/6856edf00326c888bd914d98fc004adf?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'RobinCheng'," +
  "    replyCount: '' }," +
  "  { title: '程序员工作中奇葩同事关系处理以及个人发展的困惑？'," +
  "    href: 'https://v2ex.com/t/428957#reply6'," +
  "    avatar: '//cdn.v2ex.com/avatar/cf3a/425d/156927_normal.png?m=1453771887'," +
  "    tab: ''," +
  "    author: 'beryl'," +
  "    replyCount: '6' }," +
  "  { title: '简单了解一下大家的工作时间和待遇问题'," +
  "    href: 'https://v2ex.com/t/428973#reply0'," +
  "    avatar: '//cdn.v2ex.com/gravatar/c63a0afab634afee39266737f459ea50?s=48&d=retro'," +
  "    tab: ''," +
  "    author: 'moeloliu'," +
  "    replyCount: '' }," +
  "  { title: 'ps4 猎人采购意见收集'," +
  "    href: 'https://v2ex.com/t/428838#reply17'," +
  "    avatar: '//cdn.v2ex.com/avatar/0bff/d7c8/155595_normal.png?m=1453886853'," +
  "    tab: ''," +
  "    author: 'Ncanback'," +
  "    replyCount: '17' }," +
  "  { title: '问一下各位，你们都能背的下来函数名吗'," +
  "    href: 'https://v2ex.com/t/428939#reply11'," +
  "    avatar: '//cdn.v2ex.com/avatar/c4e3/7418/196587_normal.png?m=1496719414'," +
  "    tab: ''," +
  "    author: 'IdJoel'," +
  "    replyCount: '11' }," +
  "  { title: '看教程总感觉枯燥无味，总是喜欢看开发案例直接撸'," +
  "    href: 'https://v2ex.com/t/428889#reply4'," +
  "    avatar: '//cdn.v2ex.com/avatar/5317/3df6/180207_normal.png?m=1492830287'," +
  "    tab: ''," +
  "    author: 'cnqncom'," +
  "    replyCount: '4' }," +
  "  { title: 'OS X 时不时会冒出一个冒泡的声音，声音还挺大，这个声音是啥 App 的提示音？'," +
  "    href: 'https://v2ex.com/t/428916#reply7'," +
  "    avatar: '//cdn.v2ex.com/avatar/3d21/7241/22222_normal.png?m=1415601994'," +
  "    tab: ''," +
  "    author: 'verfino'," +
  "    replyCount: '7' }," +
  "  { title: '[知乎][北京/成都][社招] 内推工程/设计/产品/运营等各种职位'," +
  "    href: 'https://v2ex.com/t/428871#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/7975/7931/172971_normal.png?m=1517893073'," +
  "    tab: ''," +
  "    author: 'alvie'," +
  "    replyCount: '5' }," +
  "  { title: 'Go 碰到的内存问题'," +
  "    href: 'https://v2ex.com/t/428920#reply5'," +
  "    avatar: '//cdn.v2ex.com/avatar/64e7/d277/169110_normal.png?m=1495696257'," +
  "    tab: ''," +
  "    author: 'Morriaty'," +
  "    replyCount: '5' }," +
  "  { title: '[阿里内推] 年底大量招人，需要的请进来看看'," +
  "    href: 'https://v2ex.com/t/428911#reply3'," +
  "    avatar: '//cdn.v2ex.com/avatar/106e/9495/108388_normal.png?m=1477024108'," +
  "    tab: ''," +
  "    author: 'w99wen'," +
  "    replyCount: '3' } ]";

export default class ItemList extends Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.name}`,
    headerStyle: { backgroundColor: '#0099ff', },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: { color: 'white' },
  });

  constructor(props) {
    super(props);

    this.state = ({
      refreshing: true,
      name: this.props.name,
      dataSource: [],
    })
  }

  componentDidMount() {
    this._fetchData();
  }

  _fetchData() {
    fetch(url, {
      headers: {
        'User-Agent': userAgent
      }
    })
      .then(response => response.text())
      .then(text => {
        let tmp = [];
        const $ = Cheerio.load(text);
        $('#Main .item').each(function (i, v) {
          tmp.push({
            title: $(v).find('.item_title').text(),
            href: 'https://v2ex.com' + $(v).find('.item_title>a').attr('href'),
            avatar: $(v).find('img').first().attr('src').replace('//', 'https://'),
            tab: $(v).find('.small .node').text(),
            author: $(v).find('.small>strong').first().text(),
            replyCount: $(v).find('.count_livid').text(),
            time: $(v).find('.small').children().remove().end().text().replace(/•/gi, '').replace('最后回复来自', '').trim(),
          });
        })
        console.log('v2ex-tmp', tmp);
        this.setState({
          refreshing: false,
          dataSource: tmp
        })
      })
      .catch(error => console.info('v2ex-error', error));
    // const tmp = [{
    //   title: '[阿里内推] 年底大量招人，需要的请进来看看',
    //   href: 'https://v2ex.com',
    //   avatar: 'https://cdn.v2ex.com/avatar/cf7f/2f64/82428_normal.png?m=1515205549',
    //   tab: 'share',
    //   author: 'tomoya',
    //   replyCount: 123,
    //   time: '2分钟前'
    // }]
    // this.setState({
    //   refreshing: false,
    //   dataSource: tmp
    // })
  }

  _onRefresh() {
    this._fetchData()
  }

  _onPress(rowData) {
    const {navigate} = this.props.navigation;
    navigate('NewsDetail', {
      title: rowData.title,
      href: rowData.href
    })
  }

  _renderRow(rowData) {
    return <TouchableHighlight
      underlayColor='#008b8b'
      onPress={() => this._onPress(rowData)}>
      <View style={styles.rowStyle}>
        {
          rowData.avatar ?
            <Image
              style={{width: 40, height: 40, borderRadius: 5, marginRight: 10}}
              source={{uri: rowData.avatar}}
            /> : null
        }
        <View style={{flex: 1}}>
          <Text style={styles.rowText}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <View style={styles.other}>
              <Text style={styles.tab}>{rowData.tab}</Text>
              <Text style={styles.author}>{rowData.author}</Text>
              <Text style={styles.author}>{rowData.time}</Text>
            </View>
            <Text style={[styles.other]}>{rowData.replyCount} 个回复</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  }

  render() {
    return <ListView
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }
      style={[styles.listView]}
      dataSource={ds.cloneWithRows(this.state.dataSource)}
      enableEmptySections={true}
      renderRow={this._renderRow.bind(this)}
    />
  }
}

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#eee',
  },
  rowStyle: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  other: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tab: {
    color: '#999',
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    padding: 2,
  },
  author: {
    marginLeft: 10,
    color: '#778087',
  }
});