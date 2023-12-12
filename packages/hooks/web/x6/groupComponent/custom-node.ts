import { Graph } from '@antv/x6';
export const registerNode = () => {
  Graph.registerNode(
    'd-node',
    {
      inherit: 'rect',
      width: 100,
      height: 100,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'title',
        },
        {
          tagName: 'rect',
          selector: 'title-rect',
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
          fill: 'rgba(95,149,255,0.05)',
          // refWidth: 1,
          // refHeight: 1,
        },
        title: {
          fill: 'rgba(0,0,0,0.85)',
        },
        'title-rect': {
          ref: 'body',
          refWidth: '100%',
          height: 30,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#5f95ff',
        },
        'title-text': {
          // ref: 'title-rect',
          refY: 1,
          refX: 0,
          textAnchor: 'middle',
          fontWeight: 'bold',
          // fill: '#fff',
          fontSize: 12,
        },
      },
    },
    true
  );
};
