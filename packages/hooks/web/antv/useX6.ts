import { ref } from 'vue';
import { Graph } from '@antv/x6';
import type { Ref } from 'vue';

export function useX6(elRef: Ref<HTMLDivElement>) {
  const graphInstance = ref<Graph>();

  const initX6 = () => {
    graphInstance.value = new Graph({
      container: elRef.value,
      background: {
        color: '#F2F7FA',
      },
      autoResize: true,
    });
  };

  function getGraphInstance() {
    if (!graphInstance.value) {
      initX6();
    }
    return graphInstance.value!;
  }
  function resize(...args: [width?: number, height?: number]) {
    graphInstance.value?.resize(...args);
  }
  return {
    getGraphInstance,
    resize,
  };
}
