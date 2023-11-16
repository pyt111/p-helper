import type { ComputedRef } from 'vue';
import type {
  ButtonProps,
  DrawerProps as ElDrawerProps,
  ScrollbarProps,
} from 'element-plus';

export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps>) => void;
  emitOpen?: (open: boolean, uid: number) => void;
}

export interface ReturnDrawerMethods extends DrawerInstance {
  openDrawer: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
  closeDrawer: () => void;
  getOpen?: ComputedRef<boolean>;
}

export type RegisterDrawerFn = (
  drawerInstance: DrawerInstance,
  uuid: number
) => void;

export interface ReturnInnerDrawerMethods extends DrawerInstance {
  closeDrawer: () => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  getOpen?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [RegisterDrawerFn, ReturnDrawerMethods];

export type UseDrawerInnerReturnType = [
  RegisterDrawerFn,
  ReturnInnerDrawerMethods
];

export interface DrawerFooterProps {
  showOkBtn: boolean;
  showCancelBtn: boolean;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { props: ButtonProps; on: {} };

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { props: ButtonProps; on: {} };
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  showFooter: boolean;
  footerHeight: string | number;
}
export interface BasicDrawerProps extends DrawerFooterProps {
  isDetail?: boolean;
  loading?: boolean;
  showDetailBack?: boolean;
  scrollOptions?: ScrollbarProps;
  closeFunc?: () => Promise<any>;
  triggerWindowResize?: boolean;
  inContainer?: boolean;

  getContainer?: string | false | HTMLElement | (() => HTMLElement);
  closeOnClickModal?: boolean;
  wrapClassName?: string;

  class?: string;
  modelValue?: boolean;
  destroyOnClose?: boolean;
  showClose?: boolean;
}
export type ElDrawerBasicProps = ElDrawerProps;
export type DrawerProps = BasicDrawerProps & ElDrawerBasicProps;

export interface DrawerActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
