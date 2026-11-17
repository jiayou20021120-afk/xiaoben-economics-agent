import { defineConfig, bindings } from 'cf/config';
export default defineConfig({
  accountId:'890307c12a3cca36fe6895231a98a2bd',
  worker:{name:'xiaoben-economics-agent',entrypoint:'./index.js',compatibilityDate:'2026-11-15',workersDev:true,env:{DEEPSEEK_API_KEY:bindings.secret()}}
});
