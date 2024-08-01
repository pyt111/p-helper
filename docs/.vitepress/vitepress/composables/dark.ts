import { useDark, useToggle } from '@vueuse/core';

export const isDark = useDark({
  storageKey: 'p-theme-appearance',
});

export const toggleDark = useToggle(isDark);
