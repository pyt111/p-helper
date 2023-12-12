import { ref, unref } from 'vue';
import { Graph } from '@antv/x6';
import type { Ref } from 'vue';
import type { Options } from '@antv/x6';
export * from './groupComponent';
export function useX6(
  elRef: Ref<HTMLDivElement>,
  options: Partial<Options.Manual> = {}
) {
  const graphInstance = ref<Graph>();

  function initG6(): Graph {
    const graph = new Graph(
      Object.assign(
        {
          container: unref(elRef),
          background: {
            color: '#F2F7FA',
          },
          // width: 800,
          // height: 600,
        },
        options
      )
    );
    graphInstance.value = graph;
    return graph;
  }

  function getGraphInstance() {
    if (!graphInstance.value) {
      return initG6();
    }
    return graphInstance.value!;
  }
  return {
    getGraphInstance,
  };
}
