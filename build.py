from pathlib import Path
import base64
import copy
import json

ROOT = Path(__file__).resolve().parent
template = (ROOT / 'src/page.html').read_text(encoding='utf-8')
script = (ROOT / 'src/app.js').read_text(encoding='utf-8')
data = json.loads((ROOT / 'data/knowledge.json').read_text(encoding='utf-8'))


def render(payload):
    encoded = json.dumps(payload, ensure_ascii=False).replace('</', '<\\/')
    return template.replace('__KNOWLEDGE__', encoded).replace('__SCRIPT__', script)


portable = copy.deepcopy(data)
for item in [*portable['files'], portable['original']]:
    item['data'] = base64.b64encode((ROOT / 'docs' / item.pop('asset')).read_bytes()).decode()
(ROOT / 'docs/xiaoben.html').write_text(render(portable), encoding='utf-8')

web = render(data).replace(
    '<button class="button" id="settings">',
    '<a class="button" href="xiaoben.html" download="校本_经济学教材编审智能体.html">下载 HTML</a><button class="button" id="settings">'
).replace(
    '文件已嵌入 HTML，离线也可下载。',
    '网页提供完整原件下载；下载完整 HTML 后，可离线使用资料库。'
).replace(
    '所有下载均来自本 HTML 内置副本', '全部原件已保存到本网站'
).replace(
    '作业原文件、政策存档和配套表单已完整嵌入。',
    '作业原文件、政策存档和配套表单已保存。'
)
(ROOT / 'docs/index.html').write_text(web, encoding='utf-8')
print(f"Built website and portable HTML: {len(data['records'])} records, {len(data['files'])} materials")
