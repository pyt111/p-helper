import { withInstall } from '@p-helper/utils';
import type { ExtractPropTypes } from 'vue';
import button from './src/BasicButton.vue';
import popConfirmButton from './src/PopConfirmButton.vue';
import { buttonProps } from './src/props';
export declare type ButtonProps = Partial<ExtractPropTypes<typeof buttonProps>>;

export const BasicButton = withInstall(button);

export const PopConfirmButton = withInstall(popConfirmButton);
