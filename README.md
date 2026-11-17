# 校本 · 经济学教材编审智能体

根据《第二次作业经济学组》制度汇编制作的网页工具，提供制度问答、书稿审读、送审材料准备、条款检索和原件下载。

- [打开网页](https://jiayou20021120-afk.github.io/xiaoben-economics-agent/)
- [打开完整 HTML，保存后可转发](https://jiayou20021120-afk.github.io/xiaoben-economics-agent/xiaoben.html)
- [原有网站](https://xiaoben-economics-agent.jiayou20021120.workers.dev/)

## 使用

打开网页即可提问，无需填写 API Key。可导入 DOCX、TXT、Markdown 书稿，查看依据并导出问答和审核清单。完整 HTML 内置资料和原件，离线可检索、下载和使用清单；AI 问答需要联网。

资料快照为 2026-11-15，共 198 条记录、63 份政策与表单原件，并附作业原文件。保留原材料中的适用范围、“本组建议”和“待核”等标注。资料存档不自动代表政策现行有效；智能体输出供人工编审参考。

## 部署结构

GitHub Pages 发布 `main` 分支的 `docs/`。网页调用现有 Cloudflare Worker，再由 Worker 调用 DeepSeek。API Key 保存在 Worker 的 `DEEPSEEK_API_KEY` secret 中，仓库和 HTML 都不包含密钥。

当前网页共享站点维护者的 API 配额，访问者的提问会消耗该账户余额。问题、检索摘录及导入后发送的书稿会提交给模型服务。聊天和清单状态保留在当前页面，刷新后清空。

## 文件与更新

| 路径 | 内容 |
| --- | --- |
| `src/page.html`、`src/app.js` | 页面模板和交互逻辑 |
| `data/knowledge.json` | 制度记录、原件信息及校验值 |
| `docs/files/` | 原始资料文件，按资料索引编号 |
| `docs/index.html` | 网站入口 |
| `docs/xiaoben.html` | 内置全部资料的单文件版本 |
| `worker/` | 当前模型后台源码 |

修改模板、脚本或知识库后，在项目根目录执行：

```sh
python3 build.py
```

提交更新后的源码和 `docs/` 并推送到 `main`，GitHub Pages 自动发布。构建仅使用 Python 标准库，无需安装前端依赖。

后台继续使用已有部署，推送本仓库不会更新 Worker。`worker/cloudflare.config.ts` 是当前站点配置；另建站点时应修改账户与 Worker 名称、配置自己的 secret，并同步修改 `src/app.js` 中的接口地址。不要将真实密钥写入文件或 Git。

政策、表单和作业资料保留各自来源与权利归属，本仓库没有为第三方材料授予新的使用许可。
