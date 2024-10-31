import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import { resolve } from 'path';
import pxtovw from 'postcss-px-to-viewport';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';

const loder_pxtovw = pxtovw({
  viewportWidth: 750,
  viewportUnit: 'vw',
  exclude: [/node_modules\/vant/i],
});
const vant_pxtovw = pxtovw({
  viewportWidth: 375,
  viewportUnit: 'vw',
  exclude: [/^(?!.*node_modules\/vant)/], // 忽略除vant之外的
});

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      ReactivityTransform(),
      AutoImport({
        imports: ['vue', 'vue-router'],
      }),
      Components({
        resolvers: [VantResolver()],
      }),
    ],
    css: {
      postcss: {
        plugins: [loder_pxtovw, vant_pxtovw],
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 4200,
      host: '0.0.0.0',
      // proxy: {
      //   '/dev-api': {
      //     target: 'http://ss-zqztc-backend-dev.cnsaas.com',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/dev-api/, ''),
      //   },
      // },
    },
  };
});
