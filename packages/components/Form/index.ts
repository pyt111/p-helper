import { withInstall } from '@p-helper/utils';
import basicForm from './src/BasicForm.vue';
import formItem from './src/components/FormItem.vue';

export * from './src/types/form';
export * from './src/types/formItem';
export * from './src/hooks/useRenderFuns';

export { useForm } from './src/hooks/useForm';
export const BasicForm = withInstall(basicForm);
export const FormItem = withInstall(formItem);
