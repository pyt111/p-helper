import { withInstall } from '@p-helper/utils';
import button from './src/BasicButton.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import type { buttonProps } from './src/props';
import type { ExtractPropTypes } from 'vue';
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;

export const BasicButton = withInstall(button);

export const PopConfirmButton = withInstall(popConfirmButton);
