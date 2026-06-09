# 结构 - AuraTab

详见[英文详细结构](../en/STRUCTURE.md)。

## 项目概览

```
AuraTab/
├── manifest.json              # 配置文件 (Manifest V3)
├── background.js              # 后台服务工作者
├── newtab.html                # 新标签页界面
├── newtab.js                  # 新标签页逻辑
├── newtab-style.css           # 新标签页样式
├── settings.html              # 设置页面
├── settings.js                # 设置逻辑
├── i18n.js                    # 翻译系统
├── translations.json          # 翻译词典（5种语言）
│
├── docs/                      # 各语言文档
├── images/                    # 扩展程序图标
└── wallpapers/                # 壁纸文件夹
```

## 主要组件

- **background.js** → 音频事件和存储管理
- **newtab.js** → 主要逻辑(AuraTabManager)
- **settings.js** → 用户偏好设置
- **i18n.js** → 翻译系统
- **translations.json** → 多语言词典

---

**版本**: 1.0.0
