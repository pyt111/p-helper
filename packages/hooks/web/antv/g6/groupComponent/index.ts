import { Util, registerBehavior, registerEdge, registerNode } from '@antv/g6';
import type { IEdge } from '@antv/g6';
import type { IAbstractGraph } from '@antv/g6-core/lib/interface/graph';
export * from './registerComboNodes';

export function registerGroupNode() {
  const isInBBox = (point, bbox) => {
    const { x, y } = point;
    const { minX, minY, maxX, maxY } = bbox;

    return x < maxX && x > minX && y > minY && y < maxY;
  };

  const itemHeight = 30;
  const titleHeight = 30;
  const itemCount = 3;

  // 展开/收起高度
  const expandHeight = 15;
  const showContainerHeight = itemHeight * itemCount;
  const barHeight = showContainerHeight;
  const height = showContainerHeight + expandHeight + titleHeight;
  registerBehavior('dice-er-scroll', {
    getDefaultCfg() {
      return {
        multiple: true,
      };
    },
    getEvents() {
      return {
        // itemHeight,
        wheel: 'scorll',
        click: 'onClick',
        'node:mousemove': 'move',
        'node:mousedown': 'mousedown',
        'node:mouseup': 'mouseup',
      };
    },
    scorll(e) {
      e.preventDefault();
      const graph = this.graph as IAbstractGraph;
      const nodes = graph.getNodes().filter((n) => {
        const bbox = n.getBBox();

        return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox);
      });

      const x = e.deltaX || e.movementX;
      let y = e.deltaY || e.movementY;
      if (!y && navigator.userAgent.indexOf('Firefox') > -1)
        y = (-e.wheelDelta * 125) / 3;

      if (nodes) {
        const edgesToUpdate = new Set<IEdge>();
        nodes.forEach((node) => {
          const model = node.getModel();
          const attrs = (model.attrs || []) as Record<string, any>[];
          if (attrs.length <= itemCount) {
            return;
          }
          const idx = (model.startIndex || 0) as number;
          let startX = (model.startX || 0.5) as number;
          let startIndex = idx + y * 0.02;
          startX -= x;
          if (startIndex < 0) {
            startIndex = 0;
          }
          if (startX > 0) {
            startX = 0;
          }
          const showStartIndex = attrs.length - itemCount;
          if (startIndex > showStartIndex) {
            startIndex = showStartIndex;
          }
          graph.updateItem(node, {
            startIndex,
            startX,
          });
          node.getEdges().forEach((edge: IEdge) => edgesToUpdate.add(edge));
        });
        // G6在根据新属性使用节点对项目进行图形更新时更新相关边
        // 这里需要手动更新相关边，因为节点的新属性｛startIndex，startX｝是自定义的，G6无法识别
        edgesToUpdate.forEach((edge: IEdge) => edge.refresh());
      }
    },
    onClick(e) {
      const graph = this.graph as IAbstractGraph;
      const item = e.item;
      const shape = e.shape;
      if (!item) {
        return;
      }

      if (shape.get('name') === 'collapse') {
        graph.updateItem(item, {
          collapsed: true,
          size: [300, 50],
        });
        setTimeout(() => graph.layout(), 100);
      } else if (shape.get('name') === 'expand') {
        graph.updateItem(item, {
          collapsed: false,
          size: [300, showContainerHeight],
        });
        setTimeout(() => graph.layout(), 100);
      }
    },
    mousedown(e) {
      this._mousedown = true;
    },
    mouseup(e) {
      this._mousedown = false;
    },
    move(e) {
      const graph = this.graph as IAbstractGraph;
      if (this._mousedown) return;
      const name = e.shape.get('name');
      const item = e.item;

      if (name && name.startsWith('item')) {
        graph.updateItem(item, {
          selectedIndex: Number(name.split('-')[1]),
        });
      } else {
        graph.updateItem(item, {
          selectedIndex: NaN,
        });
      }
    },
  });

  registerEdge('dice-er-edge', {
    draw(cfg, group) {
      const edge = group.cfg.item;
      const sourceNode = edge.getSource().getModel();
      const targetNode = edge.getTarget().getModel();

      const sourceIndex = sourceNode.attrs.findIndex(
        (e) => e.key === cfg.sourceKey
      );

      const sourceStartIndex = sourceNode.startIndex || 0;

      let sourceY = titleHeight;
      if (!sourceNode.collapsed && sourceIndex >= sourceStartIndex - 0.5) {
        sourceY =
          titleHeight + (sourceIndex - sourceStartIndex + 0.5) * itemHeight;
        sourceY = Math.min(sourceY, height - expandHeight);
      }

      const targetIndex = targetNode.attrs.findIndex(
        (e) => e.key === cfg.targetKey
      );

      const targetStartIndex = targetNode.startIndex || 0;

      let targetY = titleHeight;

      if (!targetNode.collapsed && targetIndex > targetStartIndex - 0.5) {
        targetY =
          (targetIndex - targetStartIndex + 0.5) * itemHeight + titleHeight;
        targetY = Math.min(targetY, height - expandHeight);
      }

      const startPoint = {
        ...cfg.startPoint,
      };
      const endPoint = {
        ...cfg.endPoint,
      };

      startPoint.y = startPoint.y! + sourceY;
      endPoint.y = endPoint.y! + targetY;

      let shape;
      if (sourceNode.id !== targetNode.id) {
        shape = group.addShape('path', {
          attrs: {
            stroke: 'red',
            path: [
              ['M', startPoint.x, startPoint.y],
              [
                'C',
                endPoint.x! / 3 + (2 / 3) * startPoint.x!,
                startPoint.y,
                endPoint.x! / 3 + (2 / 3) * startPoint.x!,
                endPoint.y,
                endPoint.x,
                endPoint.y,
              ],
            ],
            endArrow: true,
          },
          name: 'path-shape',
        });
      } else if (!sourceNode.collapsed) {
        let gap = Math.abs((startPoint.y - endPoint.y) / 3);
        if (startPoint['index'] === 1) {
          gap = -gap;
        }
        shape = group.addShape('path', {
          attrs: {
            stroke: 'yellow',
            path: [
              ['M', startPoint.x, startPoint.y],
              [
                'C',
                startPoint.x! - gap,
                startPoint.y,
                startPoint.x! - gap,
                endPoint.y,
                startPoint.x,
                endPoint.y,
              ],
            ],
            endArrow: true,
          },
          name: 'path-shape',
        });
      }

      return shape;
    },
    afterDraw(cfg, group) {
      if (!cfg || !group) return;
      const labelCfg = cfg.labelCfg || {};
      const edge = group.cfg.item;
      const sourceNode = edge.getSource().getModel();
      const targetNode = edge.getTarget().getModel();
      if (sourceNode.collapsed && targetNode.collapsed) {
        return;
      }
      const path = group.find(
        (element) => element.get('name') === 'path-shape'
      );

      const labelStyle = Util.getLabelPosition(path, 0.5, 0, 0, true);
      const label = group.addShape('text', {
        attrs: {
          ...labelStyle,
          text: cfg.label || '',
          fill: '#000',
          textAlign: 'center',
          stroke: '#fff',
          lineWidth: 1,
        },
      });
      label.rotateAtStart(labelStyle.rotate);
    },
  });

  registerNode('dice-er-box', {
    draw(cfg, group) {
      const width = 250;
      const boxStyle = {
        stroke: '#096DD9',
        radius: 4,
      };

      const { selectedIndex, collapsed, icon } = cfg as any;
      const startIndex = (cfg.startIndex || 0) as number;
      const list = (cfg.attrs || []) as Record<string, any>[];
      const afterList = list.slice(
        Math.floor(startIndex),
        Math.floor(startIndex + itemCount + 1)
      );
      const offsetY = (0.5 - (startIndex % 1)) * itemHeight + 30;

      group.addShape('rect', {
        attrs: {
          fill: boxStyle.stroke,
          height: titleHeight,
          width,
          radius: [boxStyle.radius, boxStyle.radius, 0, 0],
        },
        draggable: true,
      });

      let fontLeft = 12;

      if (icon && icon.show !== false) {
        group.addShape('image', {
          attrs: {
            x: 8,
            y: 8,
            height: 16,
            width: 16,
            ...icon,
          },
        });
        fontLeft += 18;
      }

      group.addShape('text', {
        attrs: {
          y: 22,
          x: fontLeft,
          fill: '#fff',
          text: cfg.label,
          fontSize: 12,
          fontWeight: 500,
        },
      });
      // 点击+/- => 展开/收起  背景
      group.addShape('rect', {
        attrs: {
          x: 0,
          y: collapsed ? titleHeight : height - expandHeight,
          height: expandHeight,
          width,
          fill: '#eee',
          radius: [0, 0, boxStyle.radius, boxStyle.radius],
          cursor: 'pointer',
        },
        name: collapsed ? 'expand' : 'collapse',
      });
      // 点击+/- => 展开/收起  文字
      group.addShape('text', {
        attrs: {
          x: width / 2 - 6,
          y: (collapsed ? titleHeight : height - expandHeight) + 12,
          text: collapsed ? '+' : '-',
          width,
          fill: '#000',
          radius: [0, 0, boxStyle.radius, boxStyle.radius],
          cursor: 'pointer',
        },
        name: collapsed ? 'expand' : 'collapse',
      });

      // 边框
      const keyshape = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width,
          height: collapsed ? 45 : height,
          ...boxStyle,
        },
        draggable: true,
      });

      if (collapsed) {
        return keyshape;
      }

      const listContainer = group.addGroup({});
      // 截取剩余展示的列表
      listContainer.setClip({
        type: 'rect',
        attrs: {
          x: -8,
          y: titleHeight,
          width: width + 16,
          height: showContainerHeight,
          fill: '#fff',
        },
      });
      listContainer.addShape({
        type: 'rect',
        attrs: {
          x: 1,
          y: titleHeight,
          width: width - 2,
          height: showContainerHeight,
          fill: '#fff',
        },
        draggable: true,
      });

      if (list.length > itemCount) {
        const barStyle = {
          width: 4,
          padding: 0,
          boxStyle: {
            stroke: '#00000022',
          },
          innerStyle: {
            fill: '#00000022',
          },
        };

        listContainer.addShape('rect', {
          attrs: {
            y: titleHeight,
            x: width - barStyle.padding - barStyle.width,
            width: barStyle.width,
            height: barHeight,
            ...barStyle.boxStyle,
          },
        });

        // 滚动条
        const indexHeight =
          afterList.length >= itemCount
            ? (itemCount / list.length) * barHeight
            : 10;

        listContainer.addShape('rect', {
          attrs: {
            y:
              titleHeight +
              barStyle.padding +
              (startIndex / list.length) * barHeight,
            x: width - barStyle.padding - barStyle.width,
            width: barStyle.width,
            height: indexHeight,
            ...barStyle.innerStyle,
          },
        });
      }
      if (afterList.length) {
        afterList.forEach((e, i) => {
          const isSelected =
            Math.floor(startIndex) + i === Number(selectedIndex);
          let { key = '', type } = e;
          if (type) {
            key += ` - ${type}`;
          }
          const label = key.length > 26 ? `${key.slice(0, 24)}...` : key;

          listContainer.addShape('rect', {
            attrs: {
              x: 1,
              y: i * itemHeight - itemHeight / 2 + offsetY,
              width: width - 4,
              height: itemHeight,
              radius: 2,
              lineWidth: 1,
              cursor: 'pointer',
            },
            name: `item-${Math.floor(startIndex) + i}-content`,
            draggable: true,
          });

          if (!cfg.hideDot) {
            listContainer.addShape('circle', {
              attrs: {
                x: 0,
                y: i * itemHeight + offsetY,
                r: 3,
                stroke: boxStyle.stroke,
                fill: 'white',
                radius: 2,
                lineWidth: 1,
                cursor: 'pointer',
              },
            });
            listContainer.addShape('circle', {
              attrs: {
                x: width,
                y: i * itemHeight + offsetY,
                r: 3,
                stroke: boxStyle.stroke,
                fill: 'white',
                radius: 2,
                lineWidth: 1,
                cursor: 'pointer',
              },
            });
          }

          listContainer.addShape('text', {
            attrs: {
              x: 12,
              y: i * itemHeight + offsetY + 6,
              text: `.${label}`,
              fontSize: 12,
              fill: '#000',
              full: e,
              fontWeight: isSelected ? 500 : 100,
              cursor: 'pointer',
            },
            name: `item-${Math.floor(startIndex) + i}`,
          });
        });
      }

      return keyshape;
    },
    // update() {
    //
    // },
    getAnchorPoints() {
      return [
        [0, 0],
        [1, 0],
      ];
    },
  });
}
