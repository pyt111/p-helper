import { withInstall } from '@p-helper/utils';
import basicForm from './src/BasicForm.vue';

export * from './src/types/form';
export * from './src/types/formItem';
export * from './src/hooks/useRenderFuns';

export { useForm } from './src/hooks/useForm';
export const BasicForm = withInstall(basicForm);
