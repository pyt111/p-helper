import { computed } from 'vue';
import { useData } from 'vitepress';
import type { Ref } from 'vue';
import { createGitHubUrl } from '~/utils';

export const useSourceCode = (path: Ref<string>) => {
  const { theme } = useData();

  const demoUrl = computed(() => {
    const {
      repo,
      docsDir = '',
      docsBranch = 'dev',
      docsRepo = repo,
    } = theme.value;

    console.log('theme >--->', theme);

    return createGitHubUrl(docsRepo, docsDir, docsBranch, path.value);
  });

  return demoUrl;
};
