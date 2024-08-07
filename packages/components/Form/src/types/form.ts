import type { FormProps as ElFormProps, FormItemRule } from 'element-plus';
import type { CSSProperties, Ref, Slot, VNode } from 'vue';
import type { ButtonProps as AntdButtonProps } from '@p-helper/components/Button';
import type {
  UploadBasicProps,
  UploadFileListProps,
  UploadPreviewProps,
  UploadUploadContainerProps,
} from '@p-helper/components/Upload';
import type { FormItem } from './formItem';
import type { ColEx, ComponentProps, ComponentType } from './index';
import type { TableActionType } from '@p-helper/components/Table/src/types/table';
import type { RowProps } from 'element-plus/es/components/row';
import type { FileItem } from '../../../Upload/src/typing';

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;

export type FieldMapToTime = [string, [string, string], string?][];

export type Rule = FormItemRule & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams {
  schema: FormSchemaInner;
  values: Recordable;
  model: Recordable;
  field: string;
}

export type RenderOpts = {
  disabled: boolean;
  [key: string]: any;
};

export interface ButtonProps extends AntdButtonProps {
  label: string;
  link?: boolean;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface FormActionType {
  submit: () => Promise<void>;
  setFieldsValue: (values: Recordable) => Promise<void>;
  resetFields: () => Promise<void>;
  getFieldsValue: <T>() => Recordable<T>;
  getFormModel: <T>() => Recordable<T>;
  clearValidate: (name?: string | string[]) => Promise<void>;
  updateSchema: (
    data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[]
  ) => Promise<void>;
  resetSchema: (
    data: Partial<FormSchemaInner> | Partial<FormSchemaInner>[]
  ) => Promise<void>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  removeSchemaByFiled: (field: string | string[]) => Promise<void>;
  appendSchemaByField: (
    schema: FormSchemaInner,
    prefixField: string | undefined,
    first?: boolean
  ) => Promise<void>;
  validateField: (nameList?: NamePath[]) => Promise<any>;
  validate: (callback?: (boolean, object) => void) => Promise<any>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
}

export type RegisterFormFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFormFn, FormActionType];

export type FormProps = ElFormProps & {
  layout?: 'vertical' | 'inline' | 'horizontal';
  // Form value
  model?: Recordable;
  isCol?: boolean;
  inline?: boolean;
  componentStyle?: CSSProperties;
  // alignment
  labelPosition?: 'left' | 'right' | 'top';
  // Row configuration for the entire form
  rowProps?: RowProps & any;
  // Submit form on reset
  submitOnReset?: boolean;
  // Submit form on form changing
  submitOnChange?: boolean;
  // Col configuration for the entire form
  labelCol?: Partial<ColEx>;
  // Col configuration for the entire form
  wrapperCol?: Partial<ColEx>;

  // General row style
  baseRowStyle?: CSSProperties;

  // General col configuration
  baseColProps?: Partial<ColEx>;

  // Form configuration rules
  schemas?: FormSchema[];

  // 默认表单配置规则配置
  defaultSchema?: Partial<FormSchema>;
  // Function values used to merge into dynamic control form items
  mergeDynamicData?: Recordable;
  // Compact mode for search forms
  compact?: boolean;
  // Blank line span
  emptySpan?: number | Partial<ColEx>;
  // Internal component size of the form
  size?: 'default' | 'small' | 'large';
  // Whether to disable
  disabled?: boolean;
  // Time interval fields are mapped into multiple
  fieldMapToTime?: FieldMapToTime;
  // Placeholder is set automatically
  autoSetPlaceHolder?: boolean;
  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean;
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean;
  // Whether to focus on the first input box, only works when the first form item is input
  autoFocusFirstItem?: boolean;
  // Automatically collapse over the specified number of rows
  autoAdvancedLine?: number;
  // Always show lines
  alwaysShowLines?: number;
  // Whether to show the operation button
  showActionButtonGroup?: boolean;

  // Reset button configuration
  resetButtonOptions?: Partial<ButtonProps>;

  // Confirm button configuration
  submitButtonOptions?: Partial<ButtonProps>;

  // Operation column configuration
  actionColOptions?: Partial<ColEx>;

  // Show reset button
  showResetButton?: boolean;
  // Show confirmation button
  showSubmitButton?: boolean;

  resetFunc?: () => Promise<void>;
  submitFunc?: () => Promise<void>;
  transformDateFunc?: (date: any) => string;
  colon?: boolean;
};

export interface SelectOptions<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type UploadProps = Partial<
  UploadUploadContainerProps & {
    fileListProps: Partial<UploadFileListProps>;
    previewProps: Partial<UploadPreviewProps>;
  }
> & {
  api: UploadBasicProps['api'];
  onChange: (urls: string[], fileList: FileItem[]) => void;
};

// export interface InputComponentSchema {
//   component: 'Input';
//   componentProps?:
//     | ComponentProps
//     | (Partial<InputProps & HTMLTextAreaElement> &
//         Partial<{
//           onChange: ((...args: any[]) => any) | undefined;
//           maxlength: string | number;
//           minlength: string | number;
//           max: string | number;
//           min: string | number;
//         }>);
// }

// export interface SelectComponentSchema {
//   component: 'Select';
//   componentProps?: (ComponentProps | Partial<Omit<ISelectProps, 'options'>>) &
//     Partial<
//       {
//         options:
//           | (OptionType & SelectOptions)[]
//           | Ref<(OptionType & SelectOptions)[]>;
//       } & {
//         style?: CSSProperties;
//         bbb: string;
//         onChange?: ((...args: any[]) => any) | undefined;
//         'onUpdate:modelValue'?: ((...args: any[]) => any) | undefined;
//         onFocus?: ((...args: any[]) => any) | undefined;
//         onBlur?: ((...args: any[]) => any) | undefined;
//         onClear?: ((...args: any[]) => any) | undefined;
//         onVisibleChange?: ((...args: any[]) => any) | undefined;
//         onRemoveTag?: ((...args: any[]) => any) | undefined;
//       }
//     >;
// }

// export interface TreeSelectComponentSchema {
//   component: 'TreeSelect';
//   componentProps?: (
//     | ComponentProps
//     | Partial<InstanceType<typeof ElSelect> & InstanceType<typeof ElTree>>
//   ) & {
//     data: any;
//   };
// }

// export interface RangePickerComponentSchema {
//   component: 'RangePicker';
//   componentProps?: ComponentProps;
// }
//
// export interface DatePickerComponentSchema {
//   component: 'DatePicker';
//   componentProps?: ComponentProps<DatePickerProps> | Partial<DatePickerProps>;
// }

// export interface TimePickerComponentSchema {
//   component: 'TimePicker';
//   componentProps?:
//     | ComponentProps<TimePickerDefaultProps>
//     | Partial<TimePickerDefaultProps>;
// }

// export interface RenderComponentSchema {
//   component: 'Render';
//   componentProps?: ComponentProps;
// }

// export interface CascaderComponentSchema {
//   component: 'Cascader';
//   componentProps?:
//     | ComponentProps<CascaderInstance['$props']>
//     | Partial<CascaderInstance['$props']>;
// }

// export interface UploadComponentSchema {
//   component: 'Upload';
//   componentProps?: ComponentProps<UploadProps> | UploadProps;
// }
// export type RadioGroupOverlap = Partial<RadioGroupProps> & {
//   onChange?: (value: string | number | boolean) => void;
//   options: Partial<
//     RadioProps &
//       RadioButtonProps &
//       RadioEmits & {
//         slot: null | VNode | VNode[] | (() => VNode | VNode[]);
//         content: Slot | string;
//       }
//   >[];
// };

// export interface RadioGroupComponentSchema {
//   component: 'RadioGroup';
//   componentProps?: ComponentProps<RadioGroupOverlap> | RadioGroupOverlap;
// }

// type RadioButtonGroupCommon = RadioGroupOverlap & { radioType: 'button' };

// export interface RadioButtonGroupComponentSchema {
//   component: 'RadioButtonGroup';
//   componentProps?:
//     | ComponentProps<RadioButtonGroupCommon>
//     | RadioButtonGroupCommon;
// }

export interface BaseFormSchema<T extends ComponentType = any> {
  // Field name
  field: string;
  // 通过连字符查找对象或数组下的值
  valuePath?: string | string[] | number[];
  // Event name triggered by internal value change, default change
  changeEvent?: string;
  // Variable name bound to v-model Default value
  valueField?: string;
  // Label name
  label: string | VNode;
  // Auxiliary text
  subLabel?: string;
  // Help text on the right side of the text
  helpMessage?:
    | string
    | string[]
    | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
  // BaseHelp component props
  helpComponentProps?: Partial<HelpComponentProps>;
  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: string | number;
  // Disable the adjustment of labelWidth with global settings of formModel,
  // and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  // 对应组件的属性传值  类型暂时不管 可以直接去看element-plus相对应的组件的props
  componentProps?:
    | ((opt: {
        schema: FormSchema;
        tableAction: TableActionType;
        formActionType: FormActionType;
        formModel: Recordable;
      }) => ComponentProps[T])
    | ComponentProps[T];
  // Required
  required?:
    | boolean
    | ((renderCallbackParams: RenderCallbackParams) => boolean);

  suffix?:
    | string
    | number
    | VNode
    | ((values: RenderCallbackParams) => string | number | VNode);

  // Validation rules
  rules?: Rule[];
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;

  // Reference formModelItem
  itemProps?: Partial<FormItem>;

  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;

  // 默认值
  defaultValue?: any;

  // 额外默认值数组对象
  defaultValueObj?: { [key: string]: any };

  isAdvanced?: boolean;

  // Matching details components
  span?: number;

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  // Render the content in the form-item tag
  render?: (
    renderCallbackParams: RenderCallbackParams,
    opts: RenderOpts
  ) => VNode | VNode[] | string;

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (
    renderCallbackParams: RenderCallbackParams,
    opts: RenderOpts
  ) => VNode | VNode[] | string;

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | VNode
    | VNode[]
    | string;

  // Custom slot, in from-item
  slot?: string;

  // Custom slot, similar to renderColContent
  colSlot?: string;

  dynamicDisabled?:
    | boolean
    | ((renderCallbackParams: RenderCallbackParams) => boolean);

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
}

export interface ComponentFormSchema<T extends ComponentType = any>
  extends BaseFormSchema<T> {
  // render component
  component: T;
}

export interface SlotFormSchema extends BaseFormSchema {
  // Custom slot, in from-item
  slot: string;
}

type ComponentFormSchemaType<T extends ComponentType = ComponentType> =
  T extends any ? ComponentFormSchema<T> : never;

export type FormSchema = ComponentFormSchemaType | SlotFormSchema;

export type FormSchemaInner = Partial<ComponentFormSchema> &
  Partial<SlotFormSchema> &
  BaseFormSchema;

export function isSlotFormSchema(
  schema: FormSchemaInner
): schema is SlotFormSchema {
  return 'slot' in schema;
}

export function isComponentFormSchema(
  schema: FormSchemaInner
): schema is ComponentFormSchema {
  return !isSlotFormSchema(schema);
}
export interface HelpComponentProps {
  maxWidth: string;
  // Whether to display the serial number
  showIndex: boolean;
  // Text list
  text: any;
  // colour
  color: string;
  // font size
  fontSize: string;
  icon: string;
  absolute: boolean;
  // Positioning
  position: any;
}
