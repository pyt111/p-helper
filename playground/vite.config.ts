import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
// import { IduxResolver } from 'unplugin-vue-components/resolvers'
import DefineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      DefineOptions(),
      Components({
        // include: `${__dirname}/**`,
        dirs:  ['../packages/components'],
        dts: 'src/components.d.ts',
      })
    ],
    server: {
      host: true, // 开发时打开 Network
    }
  }
})