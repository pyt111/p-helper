<template>
  <div class="app-container__2 traceability-index-wrapper">
    <div ref="elRef" class="container" />
    <TeleportContainer />
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';
  import { DagreLayout, GridLayout } from '@antv/layout';
  // import { useG6, registerGroupNode } from '@/hooks/g6/useG6';
  import { getTeleport, register } from '@antv/x6-vue-shape';
  import { Scroller } from '@antv/x6-plugin-scroller';
  import { useX6 } from '@p-helper/hooks/web/x6/useX6';
  import { Graph } from '@antv/x6';
  import CustomNode from './components/CustomNode.vue';
  import CustomChildNode from './components/CustomChildNode.vue';
  import type { Node } from '@antv/x6/src/model/node';
  import type { Edge } from '@antv/x6';

  defineOptions({
    name: 'Traceability',
  });
  const nodeWidth = 100;
  const nodeHeight = 35;
  register({
    shape: 'custom-vue-node',
    width: 100,
    height: 100,
    component: CustomNode,
  });
  Graph.registerNode(
    'custom-vue-child-node',
    {
      width: nodeWidth,
      height: nodeHeight,
      zIndex: 3,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'title-text',
        },
      ],
      attrs: {
        body: {
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#F2F7FA',
          refWidth: 1,
          refHeight: 1,
          refX: 0,
          refY: 0,
          cursor: 'pointer',
        },
        'title-text': {
          refY: 10,
          refX: 14,
          cursor: 'pointer',
        },
      },
    },
    true
  );
  const TeleportContainer = getTeleport();
  const elRef = ref();

  const rawData = {
    combos: [
      {
        // 定义 comboA
        id: 'comboA',
        label: 'A',
        data: {
          title: '测试',
        },
        shape: 'custom-vue-node',
        zIndex: 1,
      },
      {
        // 定义 comboB
        id: 'comboB',
        label: 'B',
        shape: 'custom-vue-node',
        zIndex: 1,
      },
      {
        // 定义 comboC，这是一个空的 combo
        id: 'comboC',
        label: 'C',
        shape: 'custom-vue-node',
        zIndex: 1,
      },
    ],
    nodes: [
      {
        id: '0',
        label: '0',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboA',
      },
      {
        id: '1',
        label: '1',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboA',
      },
      {
        id: '2',
        label: '2',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboA',
      },
      {
        id: '3',
        label: '3',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboB',
      },
      {
        id: '4',
        label: '4',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboB',
      },
      {
        id: '5',
        label: '5',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboC',
      },
      {
        id: '6',
        label: '6',
        shape: 'custom-vue-child-node',
        zIndex: 2,
        parent: 'comboC',
      },
    ],
    edges: [
      {
        source: '0',
        target: '10',
      },
      {
        source: '0',
        target: '13',
      },
      {
        source: '2',
        target: '13',
      },
      {
        source: '5',
        target: '13',
      },
      {
        source: '7',
        target: '13',
      },
      {
        source: '8',
        target: '13',
      },
      {
        source: '2',
        target: '13',
      },
      {
        source: '2',
        target: '18',
      },
      {
        source: '6',
        target: '20',
      },
      {
        source: '6',
        target: '28',
      },
      {
        source: '6',
        target: '90',
      },
      {
        source: '6',
        target: '59',
      },
    ],
  };

  const transformData = (data: typeof rawData) => {
    return {
      // nodes: data.nodes,
      combos: data.combos,
      nodes: Array.from({ length: 300 }).map((item, i) => {
        const config: Node.Metadata = {
          id: `${i}`,
          shape: 'custom-vue-child-node',
          zIndex: 3,
          attrs: {
            'title-text': {
              text: `label_${i}`,
            },
          },
          ports: {
            groups: {
              group1: {
                // position: 'right',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#31d0c6',
                    fill: '#fff',
                    strokeWidth: 2,
                  },
                },
              },
            },
          },
        };
        if (i < 9) {
          config.parent = 'comboA';
        } else if (i < 60) {
          config.parent = 'comboB';
        } else {
          config.parent = 'comboC';
        }
        return config;
      }),
      edges: data.edges.map((edge, num) => {
        return {
          ...edge,
          source: {
            cell: edge.source,
            connectionPoint: {
              name: 'anchor',
            },
          },
          target: {
            cell: edge.target,
            connectionPoint: {
              name: 'anchor',
            },
          },
          id: `edge_${num}`,
          zIndex: 2,
          router: {
            name: 'orth',
          },
          attrs: {
            line: {
              stroke: '#5f5d61',
              strokeWidth: 0.5,
              targetMarker: 'classic',
              sourceMarker: 'circlePlus',
            },
          },
          connector: {
            name: 'rounded',
            args: {
              radius: 10,
            },
          },
        };
      }) as Edge.Metadata[],
    };
  };
  const childrenMap = ref({});

  const { getGraphInstance } = useX6(elRef, {
    virtual: true,
    interacting: {
      nodeMovable: false,
    },
    connecting: {
      sourceAnchor: {
        name: 'bottom',
        args: {
          // dy: nodeHeight / 2,
        },
      },
      targetAnchor: {
        name: 'top',
        args: {
          // dy: nodeHeight,
        },
      },
    },
  });

  onMounted(() => {
    const graph = getGraphInstance();
    const clientWidth = graph.options.width ?? 1000;
    const clientHeight = graph.options.height ?? 1000;
    graph.use(
      new Scroller({
        enabled: true,
        padding: 0,
      })
    );
    const width = Math.floor(clientWidth * 0.8) + 1;
    const height = clientHeight;
    const margin = 40;
    const parentPaddingTop = 40;
    const parentLeft = (clientWidth - width) / 2;
    const align = 'center';
    let cols = 1;
    const space = margin * 2;

    const transformNodes = (parentNode) => {
      let preNode;
      let boxPadding = 0;
      if (align === 'center') {
        boxPadding = (width - cols * (nodeWidth + space)) / 2;
      }
      childrenMap.value[parentNode.id].forEach((node, i) => {
        const baseX = parentNode.x + boxPadding;
        const baseY = parentNode.y + parentPaddingTop;
        if (!preNode) {
          preNode = {
            x: baseX + margin,
            y: baseY + margin,
          };
        }
        let x = preNode.x;
        let y = preNode.y;

        if (i) {
          x = x + nodeWidth + space;
        }

        if (x + nodeWidth + margin > width + parentLeft) {
          x = baseX + margin;
          y = y + nodeHeight + space;
        }
        Object.assign(node, {
          x,
          y,
        });
        preNode = node;
      });
    };
    const transformParentNodes = (data) => {
      let preNode;
      data.combos?.forEach((combo) => {
        const children = data.nodes?.filter((node) => node.parent === combo.id);

        cols = Math.floor(width / (nodeWidth + space));
        const isOverstep = !!(children.length % cols);
        let rows = Math.floor(children.length / cols);
        if (isOverstep) {
          rows += 1;
        }
        combo.height = rows * (nodeHeight + space) + parentPaddingTop;
        combo.width = width;
        combo.y = preNode ? preNode.y + preNode.height + 100 : 0;
        combo.x = parentLeft;
        childrenMap.value[combo.id] = children;
        preNode = combo;
      });
    };

    const data = transformData(rawData);
    transformParentNodes(data);
    data.combos?.forEach((combo) => {
      transformNodes(combo);
    });

    const highlightNodes = (source, target) => {
      const targetNode = graph.getCellById(target);
      const sourceNode = graph.getCellById(source);
      sourceNode.attr({
        body: {
          opacity: 1,
          strokeWidth: 2,
        },
        'title-text': {
          opacity: 1,
        },
      });
      targetNode.attr({
        body: {
          opacity: 1,
          strokeWidth: 2,
        },
        'title-text': {
          opacity: 1,
        },
      });
    };

    graph.on('cell:click', ({ e, x, y, cell, view }) => {
      const edges = graph.getEdges();
      const nodes = graph.getNodes();
      nodes.forEach((node) => {
        node.attr({
          body: {
            opacity: 0.9,
            strokeWidth: 1,
          },
          'title-text': {
            opacity: 0.5,
          },
        });
      });
      edges.forEach((edge) => {
        const source = edge.getSourceCellId();
        const target = edge.getTargetCellId();
        if (source === cell.id || target === cell.id) {
          highlightNodes(source, target);

          edge.setProp({
            attrs: {
              line: {
                stroke: '#722ed1',
                strokeWidth: 2,
                sourceMarker: 'circlePlus',
                targetMarker: 'classic',
              },
            },
            zIndex: 4,
          });
        } else {
          edge.setProp({
            attrs: {
              line: {
                stroke: '#5f5d61',
                strokeWidth: 0.5,
                targetMarker: '',
                sourceMarker: '',
              },
            },
            zIndex: 2,
          });
        }
      });
    });

    const allNodes = [];
    data.combos?.forEach((combo) => {
      const parentNode = graph.createNode(combo);
      allNodes.push(parentNode);
      const children = childrenMap.value[combo.id];
      // graph.addNode(parentNode);
      const childNodes = children.forEach((node) => {
        const child = graph.createNode(node);
        if (combo.id === node.parent) {
          parentNode.addChild(child);
          allNodes.push(child);
        }
      });
    });

    const layoutEdges = () => {
      const edges = graph.getEdges();
      const edgeLenRecord = {};

      edges.forEach((edge) => {
        // console.log('edge.source >--->', edge.getSource());
        const sourcePoint = edge.getSourcePoint();
        const targetPoint = edge.getTargetPoint();
        const sourceId = edge.getSourceCellId()!;
        if (!edgeLenRecord[sourceId]) {
          edgeLenRecord[sourceId] = 0;
        }
        edgeLenRecord[sourceId] += 1;

        // 是向左偏移还是向右偏移
        const xDirection = targetPoint.x > sourcePoint.x ? 'R' : 'L';
        const edgeOffset = 0;
        // const edgeOffset = edgeLenRecord[sourceId] * 0;
        // -10为了避开左右方向的重叠
        let offsetX = nodeWidth / 2 + margin + edgeOffset - 10;
        offsetX = xDirection === 'L' ? -offsetX : offsetX;

        const offsetY = nodeHeight + margin + edgeOffset;

        const sourceVer = sourcePoint.add(offsetX, 60);
        const targetVer = targetPoint.add(0, -offsetY);
        // const targetVer = targetPoint.add(30, margin);
        // 设置线的必经路线，防止穿过节点
        edge.setVertices([
          {
            x: sourceVer.x,
            y: sourceVer.y,
          },
          {
            x: sourceVer.x,
            y: targetVer.y,
          },
          {
            x: targetVer.x,
            y: targetVer.y,
          },
        ]);
      });
    };
    // const source = graph.getCells();
    const edges = data.edges?.map((edge) => {
      const edgeCell = graph.createEdge(edge);
      return edgeCell;
    });

    graph.resetCells([...allNodes, ...edges]);
    layoutEdges();
  });
</script>

<style scoped lang="scss">
  .traceability-index-wrapper {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .container {
      width: 100%;
      height: 100%;
    }
  }
</style>
