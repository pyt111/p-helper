import { registerCombo } from '@antv/g6';
import type { ShapeOptions } from '@antv/g6';

export interface ComboNodesOptions {
  node?: {
    itemWidth?: number;
    itemHeight?: number;
    showCount?: number;
  };
}
export function registerComboNodes(options?: ComboNodesOptions) {
  const itemHeight = options?.node?.itemHeight ?? 0;
  const itemWidth = options?.node?.itemWidth ?? 0;
  const titleHeight = 30;

  // 展开/收起高度
  const expandHeight = 15;
  // const barHeight = showContainerHeight;
  // const height = showContainerHeight + expandHeight + titleHeight;

  registerCombo(
    'dice-er-combo',
    {
      drawShape(cfg = {}, group) {
        const itemCount = options?.node?.showCount;
        cfg.padding = cfg.padding || [0, 0, 0, 0];
        const clintItemHeight = itemHeight ? itemHeight + 18 : itemHeight;
        const children = cfg!.children as any[];

        const showContainerHeight = itemCount
          ? clintItemHeight * itemCount
          : clintItemHeight * (children?.length ?? 2) -
            ((children?.length ?? 1) - 1) * 2;

        const self = this as ShapeOptions;
        const comboWidth = itemWidth; // innerWidth
        const comboHeight = showContainerHeight;
        // 固定高度
        // cfg.fixSize = [comboWidth, comboHeight];

        const boxStyle = {
          // ...style,
          stroke: '#096DD9',
          radius: 4,
        };
        Object.assign(cfg, {
          fixSize: [comboWidth, comboHeight],
          style: {
            // stroke: '#096DD9',
            ...boxStyle,
            radius: [0, 0, 4, 4],
            fill: '',
          },
          labelCfg: {
            style: {
              fill: '#fff',
            },
            refY: -titleHeight / 1.5,
          },
        });

        const style = self.getShapeStyle(cfg);

        // const { selectedIndex, collapsed, icon, stateStyles } = cfg!;
        // const startIndex = (cfg!.startIndex || 0) as number;
        // const list = (cfg!.attrs || []) as Record<string, any>[];
        // const afterList = list.slice(
        //   Math.floor(startIndex),
        //   Math.floor(startIndex + itemCount + 1)
        // );
        // const offsetY = (0.5 - (startIndex % 1)) * itemHeight + 30;

        // 头部形状
        group?.addShape('rect', {
          attrs: {
            x: style.x - 0.5,
            y: style.y - titleHeight,
            fill: boxStyle.stroke,
            height: titleHeight,
            width: style.width + 1,
            radius: [boxStyle.radius, boxStyle.radius, 0, 0],
          },
          // draggable: true,
          name: 'box-path',
        });

        const fontLeft = 12;

        // if (icon && icon.show !== false) {
        //   group.addShape('image', {
        //     attrs: {
        //       x: 8,
        //       y: 8,
        //       height: 16,
        //       width: 16,
        //       ...icon,
        //     },
        //   });
        //   fontLeft += 18;
        // }

        // group.addShape('text', {
        //   attrs: {
        //     x: style.x + fontLeft,
        //     y: style.y - titleHeight + 22,
        //     fill: '#fff',
        //     text: cfg.label,
        //     fontSize: 14,
        //     fontWeight: 500,
        //   },
        // });
        // // 点击+/- => 展开/收起  背景
        // group.addShape('rect', {
        //   attrs: {
        //     x: 0,
        //     y: collapsed ? titleHeight : height - expandHeight,
        //     height: expandHeight,
        //     width: comboWidth,
        //     fill: '#eee',
        //     radius: [0, 0, boxStyle.radius, boxStyle.radius],
        //     cursor: 'pointer',
        //   },
        //   name: collapsed ? 'expand' : 'collapse',
        // });
        // // 点击+/- => 展开/收起  文字
        // group.addShape('text', {
        //   attrs: {
        //     x: comboWidth / 2 - 6,
        //     y: (collapsed ? titleHeight : height - expandHeight) + 12,
        //     text: collapsed ? '+' : '-',
        //     width: comboWidth,
        //     fill: '#000',
        //     radius: [0, 0, boxStyle.radius, boxStyle.radius],
        //     cursor: 'pointer',
        //   },
        //   name: collapsed ? 'expand' : 'collapse',
        // });

        // 边框
        const keyshape = group!.addShape('rect', {
          attrs: {
            ...style,
            // x: 0,
            // y: 0,
            // width: comboWidth,
            // height: collapsed ? 45 : comboHeight - titleHeight - expandHeight,
            // ...boxStyle,
            // fill: '',
          },
          // draggable: true,
        });

        // if (collapsed) {
        //   return keyshape;
        // }

        // const listContainer = group?.addGroup({});
        // 截取剩余展示的列表
        // listContainer.setClip({
        //   type: 'rect',
        //   attrs: {
        //     x: -8,
        //     y: titleHeight,
        //     width: comboWidth + 16,
        //     height: showContainerHeight,
        //     fill: '#fff',
        //   },
        // });
        // listContainer.addShape({
        //   type: 'rect',
        //   attrs: {
        //     x: 1,
        //     y: titleHeight,
        //     width: comboWidth - 2,
        //     height: showContainerHeight,
        //     fill: '#fff',
        //   },
        //   draggable: true,
        // });

        // if (list.length > itemCount) {
        //   const barStyle = {
        //     width: 4,
        //     padding: 0,
        //     boxStyle: {
        //       stroke: '#00000022',
        //     },
        //     innerStyle: {
        //       fill: '#00000022',
        //     },
        //   };
        //
        //   listContainer.addShape('rect', {
        //     attrs: {
        //       y: titleHeight,
        //       x: comboWidth - barStyle.padding - barStyle.width,
        //       width: barStyle.width,
        //       height: barHeight,
        //       ...barStyle.boxStyle,
        //     },
        //   });
        //
        //   // 滚动条
        //   const indexHeight =
        //     afterList.length >= itemCount
        //       ? (itemCount / list.length) * barHeight
        //       : 10;
        //
        //   listContainer.addShape('rect', {
        //     attrs: {
        //       y:
        //         titleHeight +
        //         barStyle.padding +
        //         (startIndex / list.length) * barHeight,
        //       x: comboWidth - barStyle.padding - barStyle.comboWidth,
        //       width: barStyle.width,
        //       height: indexHeight,
        //       ...barStyle.innerStyle,
        //     },
        //   });
        // }
        // if (afterList.length) {
        //   afterList.forEach((e, i) => {
        //     const isSelected =
        //       Math.floor(startIndex) + i === Number(selectedIndex);
        //     let { key = '', type } = e;
        //     if (type) {
        //       key += ` - ${type}`;
        //     }
        //     const label = key.length > 26 ? `${key.slice(0, 24)}...` : key;
        //
        //     listContainer.addShape('rect', {
        //       attrs: {
        //         x: 1,
        //         y: i * itemHeight - itemHeight / 2 + offsetY,
        //         width: comboWidth - 4,
        //         height: itemHeight,
        //         radius: 2,
        //         lineWidth: 1,
        //         cursor: 'pointer',
        //       },
        //       name: `item-${Math.floor(startIndex) + i}-content`,
        //       draggable: true,
        //     });
        //
        //     if (!cfg.hideDot) {
        //       listContainer.addShape('circle', {
        //         attrs: {
        //           x: 0,
        //           y: i * itemHeight + offsetY,
        //           r: 3,
        //           stroke: boxStyle.stroke,
        //           fill: 'white',
        //           radius: 2,
        //           lineWidth: 1,
        //           cursor: 'pointer',
        //         },
        //       });
        //       listContainer.addShape('circle', {
        //         attrs: {
        //           x: comboWidth,
        //           y: i * itemHeight + offsetY,
        //           r: 3,
        //           stroke: boxStyle.stroke,
        //           fill: 'white',
        //           radius: 2,
        //           lineWidth: 1,
        //           cursor: 'pointer',
        //         },
        //       });
        //     }
        //
        //     listContainer.addShape('text', {
        //       attrs: {
        //         x: 12,
        //         y: i * itemHeight + offsetY + 6,
        //         text: `.${label}`,
        //         fontSize: 12,
        //         fill: '#000',
        //         full: e,
        //         fontWeight: isSelected ? 500 : 100,
        //         cursor: 'pointer',
        //       },
        //       name: `item-${Math.floor(startIndex) + i}`,
        //     });
        //   });
        // }

        return keyshape;
      },
      // update(cfg, item) {
      //   console.log(' update cfg >--->', cfg);
      //   // item.update({
      //   //   ...cfg,
      //   //   fixSize: [100, 100],
      //   // });
      // },
      // getAnchorPoints() {
      //   return [
      //     [0, 0],
      //     [1, 0],
      //   ];
      // },
    },
    'rect'
  );
}
