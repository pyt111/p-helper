import { nextTick, onUnmounted, ref, unref, watch } from 'vue';
import { isProdMode } from '@p-helper/utils/env';
import { error } from '@p-helper/utils/log';
import { getDynamicProps } from '@p-helper/utils';
import type { FormProps } from '../../../Form';
import type { X6Methods, X6Props } from '../typing';

type Props = Partial<DynamicProps<FormProps>>;

export const useX6 = (props: Props) => {
  const basicX6Instance = ref<Nullable<X6Methods>>(null);
  const loaded = ref<Boolean>(false);
  async function getX6Instance() {
    const form = unref(basicX6Instance);
    if (!form) {
      error('尚未获取x6实例!');
    }
    await nextTick();
    return form as X6Methods;
  }
  function register(instance: X6Methods, uuid: number | string) {
    isProdMode() &&
      onUnmounted(() => {
        basicX6Instance.value = null;
        loaded.value = false;
      });
    if (unref(loaded) && isProdMode() && instance === unref(basicX6Instance))
      return;

    basicX6Instance.value = instance;
    loaded.value = true;
    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  const methods: X6Methods = {
    setProps: async (x6Props: Partial<X6Props>) => {
      const instance = await getX6Instance();
      instance.setProps(x6Props);
    },
  };
  return [register, methods];
};
