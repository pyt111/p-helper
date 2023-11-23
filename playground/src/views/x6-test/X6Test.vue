<template>
  <div ref="g6ContentRef" class="x6-test-wrapper">
    <!--    <BasicX6 @register="register" />-->
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { registerComboNodes, useG6 } from '@p-helper/hooks';
  import G6 from '@antv/g6';

  defineOptions({
    name: 'X6Test',
  });

  const g6ContentRef = ref();
  const combos = [
    {
      id: 0,
      type: 'dice-er-combo',
      label: 'Employee',
      index: '3',
    },
    {
      id: 1,
      type: 'dice-er-combo',
      label: 'dept',
      index: '2',
    },
    {
      id: 2,
      type: 'dice-er-combo',
      label: 'CG',
      index: '1',
    },
  ];
  const rawData = [
    {
      id: 'info',
      label: 'Employee',
      comboId: 0,
      attrs: [
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'key',
          type: 'varchar(255)',
        },
        // {
        //   key: 'gender',
        //   type: 'enum(M, F)',
        // },
        // {
        //   key: 'birthday',
        //   type: 'date',
        // },
        // {
        //   key: 'hometown',
        //   type: 'varchar(255)',
        // },
        // {
        //   key: 'country',
        //   type: 'varchar(255)',
        // },
        // {
        //   key: 'nation',
        //   type: 'varchar(255)',
        // },
        // {
        //   key: 'jobId',
        //   type: 'number(3)',
        //   relation: [
        //     {
        //       key: 'id',
        //       nodeId: 'dept',
        //     },
        //   ],
        // },
        // {
        //   key: 'phone',
        //   type: 'varchar(255)',
        // },
        // {
        //   key: 'deptId',
        //   type: 'number(6)',
        //   relation: [
        //     {
        //       key: 'id',
        //       nodeId: 'dept',
        //     },
        //   ],
        // },
        // {
        //   key: 'startTime',
        //   type: 'date',
        // },
        // {
        //   key: 'leaveTime',
        //   type: 'date',
        // },
      ],
    },
    {
      id: 'dept',
      label: 'Department',
      comboId: 1,
      attrs: [
        {
          key: 'id',
          type: 'number(6)',
        },
        {
          key: 'title',
          type: 'varchar(255)',
        },
        // {
        //   key: 'desc',
        //   type: 'text',
        // },
        // {
        //   key: 'parent',
        //   type: 'number(6)',
        //   relation: [
        //     {
        //       key: 'dc',
        //       nodeId: 'pt',
        //     },
        //   ],
        // },
        {
          key: 'manager',
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
    const edges = [
      {
        source: '0_0',
        target: '1_0',
        style: {
          endArrow: true,
        },
      },
      {
        source: '0_0',
        target: '1_1',
        style: {
          endArrow: true,
        },
      },
      {
        source: '0_0',
        target: '1_2',
        style: {
          endArrow: true,
        },
      },
      {
        source: '0_1',
        target: '1_2',
        style: {
          endArrow: true,
        },
      },
      {
        source: '0_0',
        target: '1_2',
        style: {
          endArrow: true,
        },
      },
    ];

    data.forEach((node, index) => {
      // nodes.push({
      //   ...node,
      // });
      if (node.attrs) {
        node.attrs.forEach((attr, i) => {
          nodes.push({
            comboId: node.comboId,
            id: `${index}_${i}`,
            size: [nodeConfig.itemWidth, nodeConfig.itemHeight],
            label: `${attr.key}`,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            // label: attr.type + '-' + attr.key,
            // x: index * 100 + 50,
          });
          // if (attr.relation) {
          //   attr.relation.forEach((relation) => {
          //     edges.push({
          //       // id: node.id + i,
          //       source: node.id,
          //       target: relation.nodeId,
          //       sourceKey: attr.key,
          //       targetKey: relation.key,
          //       label: relation.label,
          //     });
          //   });
          // }
        });

        console.log('nodes >--->', nodes);
      }
    });

    return {
      nodes,
      edges,
      combos,
    };
  };

  const { getGraphInstance } = useG6(g6ContentRef, {
    layout: {
      type: 'comboCombined',
    },
  });
  registerComboNodes({
    node: nodeConfig,
  });
  // const [register, { setProps, getGraphInstance }] = useX6x({});
  onMounted(() => {
    const instance = getGraphInstance();
    instance.updateLayout({
      outerLayout: new G6.Layout['grid']({
        rows: 1,
        sortBy: 'index',
      }),
      innerLayout: new G6.Layout['dagre']({
        rankdir: 'LR',
        // align: 'UL',
        nodesep: 5,
        ranksep: 10,
      }),
    });
    const data = dataTransform(rawData);
    console.log('data >--->', data);
    instance.data(data);
    instance.render();
  });
</script>

<style scoped lang="scss">
  .x6-test-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
