import { ref } from 'vue';
import G6 from '@antv/g6';
import { registerComboNodes, registerGroupNode } from './groupComponent';
import type { GraphOptions } from '@antv/g6-core';
import type { Ref } from 'vue';
import type { Graph } from '@antv/g6';
export * from './groupComponent';
export function useG6(
  elRef: Ref<HTMLDivElement>,
  options: Partial<GraphOptions> = {}
) {
  const graphInstance = ref<Graph>();

  function initG6(): Graph {
    const graph = new G6.Graph(
      Object.assign(
        {
          container: elRef.value,
          fitView: true,
          fitCenter: false,
          fitViewPadding: 50,
          defaultNode: {
            type: 'rect',
            color: '#5B8FF9',
            style: {
              fill: '#9EC9FF',
              lineWidth: 3,
            },
            labelCfg: {
              style: {
                fill: 'black',
                fontSize: 30,
              },
            },
          },
          defaultEdge: {
            // type: 'dice-er-edge',
            style: {
              stroke: '#e2e2e2',
              lineWidth: 4,
              endArrow: true,
            },
          },

          minZoom: 0.1,

          animate: true,
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

export { registerGroupNode, registerComboNodes };
