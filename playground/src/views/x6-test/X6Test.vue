<template>
  <div ref="g6ContentRef" class="x6-test-wrapper">
    <!--    <BasicX6 @register="register" />-->
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import {
    registerComboNodes,
    registerGroupNode,
    useG6,
  } from '@p-helper/hooks';
  import G6 from '@antv/g6';

  defineOptions({
    name: 'X6Test',
  });

  const g6ContentRef = ref();
  // const combos = [
  //   {
  //     id: 0,
  //     type: 'dice-er-combo',
  //     label: 'Employee',
  //     index: '3',
  //   },
  //   {
  //     id: 1,
  //     type: 'dice-er-combo',
  //     label: 'dept',
  //     index: '2',
  //   },
  //   {
  //     id: 2,
  //     type: 'dice-er-combo',
  //     label: 'CG',
  //     index: '1',
  //   },
  //   {
  //     id: 3,
  //     type: 'dice-er-combo',
  //     label: 'CG1',
  //     index: '0',
  //   },
  //   {
  //     id: 4,
  //     type: 'dice-er-combo',
  //     label: 'CG1',
  //     index: '0',
  //   },
  // ];
  const rawData = [
    {
      id: 'info',
      label: '1',
      attrs: [
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'key',
          type: 'varchar(255)',
        },
        {
          key: 'gender',
          type: 'enum(M, F)',
        },
        {
          key: 'birthday',
          type: 'date',
        },
        {
          key: 'hometown',
          type: 'varchar(255)',
        },
        {
          key: 'country',
          type: 'varchar(255)',
        },
        {
          key: 'nation',
          type: 'varchar(255)',
        },
        {
          key: 'jobId',
          type: 'number(3)',
          relation: [
            {
              key: 'id',
              nodeId: 'job',
            },
          ],
        },
        {
          key: 'phone',
          type: 'varchar(255)',
        },
        {
          key: 'deptId',
          type: 'number(6)',
          relation: [
            {
              key: 'id',
              nodeId: 'dept',
            },
            {
              key: 'id2',
              nodeId: 'Gc2',
            },
          ],
        },
        {
          key: 'startTime',
          type: 'date',
        },
        {
          key: 'leaveTime',
          type: 'date',
        },
      ],
    },
    {
      id: 'dept',
      label: '2',
      attrs: [
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        {
          key: 'desc',
          type: 'text',
        },
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        {
          key: 'desc',
          type: 'text',
        },
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        {
          key: 'desc',
          type: 'text',
        },
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        {
          key: 'desc',
          type: 'text',
        },
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        {
          key: 'desc',
          type: 'text',
        },
        {
          key: 'parent',
          type: 'number(6)',
          relation: [
            {
              key: 'id',
              nodeId: 'dept',
            },
            {
              key: 'id',
              nodeId: 'Gc',
            },
            {
              key: 'id1',
              nodeId: 'Gc3',
            },
          ],
        },
        {
          key: 'manager',
          type: 'number(6)',
        },
      ],
    },
    {
      id: 'Gc2',
      label: '3',
      attrs: [
        {
          key: 'id2',
          type: 'number(6)',
        },
        {
          key: 'title2',
          type: 'varchar(255)',
        },
        {
          key: 'desc3',
          type: 'text',
          relation: [
            {
              key: 'id1',
              nodeId: 'Gc3',
            },
          ],
        },
        {
          key: 'parent4',
          type: 'number(6)',
        },
      ],
    },
    {
      id: 'Gc3',
      label: '4',
      attrs: [
        {
          key: 'id1',
          type: 'number(6)',
        },
        {
          key: 'title2',
          type: 'varchar(255)',
          relation: [
            {
              key: 'desc3',
              nodeId: 'Gc4',
            },
          ],
        },
        {
          key: 'desc3',
          type: 'text',
        },
        {
          key: 'parent4',
          type: 'number(6)',
        },
      ],
    },
    {
      id: 'Gc4',
      label: '5',
      attrs: [
        {
          key: 'id1',
          type: 'number(6)',
        },
        {
          key: 'title2',
          type: 'varchar(255)',
        },
        {
          key: 'desc3',
          type: 'text',
        },
        {
          key: 'parent4',
          type: 'number(6)',
        },
      ],
    },
  ];
  const nodeConfig = {
    itemWidth: 200,
    itemHeight: 50,
    // showCount: 10,
  };

  const dataTransform = (data) => {
    const nodes = [];
    const edges = [];

    data.forEach((node, i) => {
      nodes.push({
        ...node,
        x: 50,
        y: 100,
      });
      if (node.attrs) {
        node.attrs.forEach((attr) => {
          if (attr.relation) {
            attr.relation.forEach((relation) => {
              edges.push({
                source: node.id,
                target: relation.nodeId,
                sourceKey: attr.key,
                targetKey: relation.key,
                label: relation.label,
              });
            });
          }
        });
      }
    });

    return {
      nodes,
      edges,
    };
  };
  const { getGraphInstance } = useG6(g6ContentRef, {
    // width: 1000,
    // height: 600,
    fitView: true,
    defaultNode: {
      type: 'dice-er-box',
      size: [500, 200],
    },
    defaultEdge: {
      type: 'dice-er-edge',
    },
    modes: {
      default: [
        'dice-er-scroll',
        {
          type: 'scroll-canvas',
        },
        {
          type: 'drag-canvas',
        },
        // 'drag-node',
        // 'collapse-expand-combo',
      ],
    },
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      controlPoints: true,
      nodesep: 150,
      // nodesepFunc: (cfg) => {
      //   console.log('arg   >--->', cfg.nodeConfig.height);
      //   return 20;
      // },
      // ranksepFunc: () => 50,
    },
  });
  const { itemHeight } = registerGroupNode({
    // autoHeight: true,
    itemCount: 10,
  });
  // const [register, { setProps, getGraphInstance }] = useX6x({});
  onMounted(() => {
    const instance = getGraphInstance();

    const data = dataTransform(rawData);
    console.log('data >--->', data);
    instance.data(data);
    instance.render();
    instance.moveTo(-200, 0, true);
  });
</script>

<style scoped lang="scss">
  .x6-test-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
