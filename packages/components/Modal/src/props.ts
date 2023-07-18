import { UPDATE_MODEL_EVENT } from '@p-helper/constants/event';
import type { ModalMethods, ModalWrapperProps } from './typing';
import type { ButtonProps } from 'element-plus';
import type { CSSProperties, PropType } from 'vue';

export const modalProps = {
  modelValue: { type: Boolean },
  title: { type: String },
  width: [String, Number] as PropType<string | number>,
  fullscreen: { type: Boolean, default: false },
  modal: { type: Boolean, default: false },
  appendToBody: { type: Boolean, default: false },
  lockScroll: { type: Boolean, default: true },
  openDelay: { type: Number, default: 0 },
  closeDelay: { type: Number, default: 0 },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  draggable: { type: Boolean, default: false },
  center: { type: Boolean, default: false },
  destroyOnClose: { type: Boolean, default: false },
  beforeClose: Function as PropType<() => any>,
  customClass: { type: String },
  closeIcon: {
    type: String,
  },
  top: { type: String },
  modalClass: { type: String },
  zIndex: { type: String },
};

export const modalBodyProps = {
  height: {
    type: [String, Number],
  },
  maxHeight: {
    type: [String, Number],
    default: '70vh',
  },
  native: {
    type: Boolean,
  },
  wrapStyle: {
    type: String,
  },
  wrapClass: {
    type: String,
  },
  viewClass: {
    type: String,
  },
  viewStyle: {
    type: String,
  },
  noresize: {
    type: Boolean,
  },
  tag: {
    type: String,
  },
  always: {
    type: Boolean,
  },
  minSize: {
    type: String,
  },
};

export const modalBodyPropsKeys = Object.keys(modalBodyProps);
export const modalPropsKeys = Object.keys(modalProps);

// 这些传入到dialog会报警告 过滤使用
export const excludePropsKeys = [
  'centered',
  'cancelText',
  'okText',
  'noBottom',
  'defaultFullscreen',
  'canFullscreen',
  'wrapperFooterOffset',
  'useWrapper',
  'loading',
  'showCancelBtn',
  'showOkBtn',
  'closable',
  'confirmLoading',
  'mask',
  'maskClosable',
  'keyboard',
  'okType',
  'visible',
  'scrollTop',
  'closeFunc',
  'helpMessage',
  'loadingTip',
  'wrapperProps',
  'afterClose',
  'bodyStyle',
  'footer',
  'getContainer',
  'maskStyle',
  'okButtonProps',
  'cancelButtonProps',
  'wrapClassName',
  'height',
  'minHeight',
  'subTitle',
];

export const basicProps = Object.assign({}, modalProps, modalBodyProps, {
  subTitle: { type: String },
  closeFunc: Function as PropType<() => Promise<boolean>>,
  centered: { type: Boolean, default: false },
  cancelText: { type: String, default: '取消' },
  okText: { type: String, default: '确认' },
  noBottom: { type: Boolean, default: false },
  defaultFullscreen: { type: Boolean },
  // Can it be full screen
  canFullscreen: { type: Boolean, default: true },
  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: { type: Number, default: 0 },
  // Warm reminder message
  helpMessage: [String, Array] as PropType<string | string[]>,
  // Whether to setting wrapper
  useWrapper: { type: Boolean, default: true },
  loading: { type: Boolean },
  loadingTip: { type: String },
  /**
   * @description: Show close button
   */
  showCancelBtn: { type: Boolean, default: true },
  /**
   * @description: Show confirmation button
   */
  showOkBtn: { type: Boolean, default: true },

  wrapperProps: Object as PropType<Partial<ModalWrapperProps>>,

  afterClose: Function as PropType<() => Promise<VueNode>>,

  bodyStyle: Object as PropType<CSSProperties>,

  closable: { type: Boolean, default: true },

  closeIcon: Object as PropType<VueNode>,

  confirmLoading: { type: Boolean },

  footer: Object as PropType<VueNode>,

  getContainer: Function as PropType<() => any>,

  mask: { type: Boolean, default: true },

  maskClosable: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },

  maskStyle: Object as PropType<CSSProperties>,

  okType: { type: String, default: 'primary' },

  okButtonProps: Object as PropType<ButtonProps>,

  cancelButtonProps: Object as PropType<ButtonProps>,

  visible: { type: Boolean },

  wrapClassName: { type: String },
  minHeight: { type: Number },
  scrollTop: { type: Boolean, default: true },
});

export const basicModalEmits = {
  visibleChange: (val: boolean) => Boolean,
  register: (modalMethod: ModalMethods, uuid: number) => [modalMethod, uuid],
  [UPDATE_MODEL_EVENT]: (val: boolean) => [val],
  cancel: (e: Event) => [e],
  ok: (e: Event) => [e],
};
