import type { DrawerInstance } from './typing';
import type { PropType } from 'vue';

export const footerProps = {
  confirmLoading: { type: Boolean },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: Object as PropType<Recordable>,
  cancelText: { type: String, default: '取消' },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },
  okButtonProps: Object as PropType<Recordable>,
  okText: { type: String, default: '确认' },
  okType: {
    type: String as PropType<
      'primary' | 'success' | 'warning' | 'danger' | 'info'
    >,
    default: 'primary',
  },
  showFooter: { type: Boolean },
  footerHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
};
export const basicDrawerProps = {
  isDetail: { type: Boolean },
  title: { type: String, default: '' },
  loadingText: { type: String },
  showDetailBack: { type: Boolean, default: true },
  loading: { type: Boolean },
  /**
   * @description: 是否在当前容器内展开
   */
  inContainer: { type: Boolean, default: false },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  ...footerProps,
};

export const basicDrawerEmits = {
  'open-change': (open: boolean) => [open],
  register: (instance: DrawerInstance, uid: number) => [instance, uid],
  ok: () => [],
  close: () => [],
};
