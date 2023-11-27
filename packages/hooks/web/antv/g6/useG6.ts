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
            // size: [300, 200],
            // type: 'dice-er-box',
            // type: 'rect',
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
            // linkPoints: {
            //   right: true,
            //   left: true,
            //   /* linkPoints' size, 8 by default */
            //   //   size: 5,
            //   /* linkPoints' style */
            //   //   fill: '#ccc',
            //   //   stroke: '#333',
            //   //   lineWidth: 2,
            // },
          },
          defaultEdge: {
            // type: 'dice-er-edge',
            style: {
              stroke: '#e2e2e2',
              lineWidth: 4,
              endArrow: true,
            },
          },
          // defaultCombo: {
          //   type: 'rect',
          //   // padding: [10, 10, 10, 10],
          //   // size: [0, 0],
          // },
          // modes: {
          //   default: [
          //     'dice-er-scroll',
          //     {
          //       type: 'scroll-canvas',
          //     },
          //     {
          //       type: 'drag-canvas',
          //     },
          //     'drag-canvas',
          //     'drag-node',
          //     'collapse-expand-combo',
          //   ],
          // },
          // layout: {
          //   type: 'dagre',
          //   rankdir: 'LR',
          //   align: 'UL',
          //   controlPoints: true,
          //   nodesepFunc: () => 0.2,
          //   ranksepFunc: () => 0.2,
          // },
          //
          // groupByTypes: false,

          minZoom: 0.1,

          // animate: true,
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
