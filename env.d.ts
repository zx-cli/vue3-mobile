/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module 'lodash-es';
declare module 'dayjs';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
