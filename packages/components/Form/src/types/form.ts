import type {
  CheckboxProps,
  DividerProps,
  FormItemRule,
  ISelectProps,
  InputNumberProps,
  InputProps,
  SwitchProps,
} from 'element-plus';
import type { CSSProperties, Ref, VNode } from 'vue';
import type { ButtonProps as AntdButtonProps } from '@p-helper/components/Button';
import type { FormItem } from './formItem';
import type { ColEx, ComponentType } from './index';
import type { TableActionType } from '@p-helper/components/Table/src/types/table';
import type { RowProps } from 'element-plus/es/components/row';
import type { OptionType } from 'element-plus/es/components/select-v2/src/select.types';

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;

export type FieldMapToTime = [string, [string, string], string?][];

export type Rule = FormItemRule & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams {
  schema: FormSchema;
  values: Recordable;
  model: Recordable;
  field: string;
}

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
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) => Promise<void>;
  resetSchema: (
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) => Promise<void>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  removeSchemaByFiled: (field: string | string[]) => Promise<void>;
  appendSchemaByField: (
    schema: FormSchema,
    prefixField: string | undefined,
    first?: boolean
  ) => Promise<void>;
  validateFields: (nameList?: NamePath[]) => Promise<any>;
  validate: (callback?: (boolean, object) => void) => Promise<any>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
}

export type RegisterFormFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFormFn, FormActionType];

export type FormProps = {
  layout?: 'vertical' | 'inline' | 'horizontal';
  // Form value
  model?: Recordable;
  isCol?: boolean;
  inline?: boolean;
  componentStyle?: CSSProperties;
  // The width of all items in the entire form
  labelWidth?: number | string;
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
export type ComponentProps<T = Recordable> = (opt: {
  schema: FormSchema;
  tableAction: TableActionType;
  formActionType: FormActionType;
  formModel: Recordable;
}) => T;

export interface SelectOptions<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}

export type FormSchemaExpand = Readonly<
  {
    componentProps?: {
      style?: CSSProperties;
    };
  } & (
    | {
        component: 'Input';
        componentProps?: (ComponentProps | Partial<InputProps>) & {
          onChange?: ((...args: any[]) => any) | undefined;
        };
      }
    | {
        component: 'Select';
        componentProps?: (
          | ComponentProps
          | Partial<Omit<ISelectProps, 'options'>>
        ) & {
          options:
            | (OptionType & SelectOptions)[]
            | Ref<(OptionType & SelectOptions)[]>;
        } & {
          style?: CSSProperties;
          onChange?: ((...args: any[]) => any) | undefined;
          'onUpdate:modelValue'?: ((...args: any[]) => any) | undefined;
          onFocus?: ((...args: any[]) => any) | undefined;
          onBlur?: ((...args: any[]) => any) | undefined;
          onClear?: ((...args: any[]) => any) | undefined;
          onVisibleChange?: ((...args: any[]) => any) | undefined;
          onRemoveTag?: ((...args: any[]) => any) | undefined;
        };
      }
    | {
        component: 'RangePicker';
      }
    | {
        component: 'Render';
      }
    | {
        component: 'Checkbox';
        componentProps?: (
          | ComponentProps<CheckboxProps>
          | Partial<CheckboxProps>
        ) & {
          onChange?: ((...args: any[]) => any) | undefined;
        };
      }
    | {
        component: 'Switch';
        componentProps?: (ComponentProps | Partial<SwitchProps>) & {
          onChange?: ((...args: any[]) => any) | undefined;
        };
      }
    | {
        component: 'Divider';
        componentProps?: ComponentProps | Partial<DividerProps>;
      }
    | {
        component: 'InputNumber';
        componentProps?: ComponentProps | Partial<InputNumberProps>;
      }
  )
>;
export type FormSchema = {
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
  // render component
  component: ComponentType;
  // 对应组件的属性传值  类型暂时不管 可以直接去看element-plus相对应的组件的props
  // componentProps?: ComponentProps;
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
  isAdvanced?: boolean;

  // Matching details components
  span?: number;

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

  // Render the content in the form-item tag
  render?: (
    renderCallbackParams: RenderCallbackParams
  ) => VNode | VNode[] | string;

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (
    renderCallbackParams: RenderCallbackParams
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
} & FormSchemaExpand;
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