<script setup>
const demos = import.meta.globEager('../../examples/waterfall/*.vue')
</script>

# Vue3 瀑布流

## 描述
瀑布流布局，如果没有设置元素高度则会根据图片加载后的高度布局，<br>
分页是根据modelValue数组的宽度与page、pageSize计算的，modelValue是一个一维数组。 

## 基础用法

:::demo1 You can set `offset` attribute to change the offset top，the default value is 0.

waterfall/basic

:::

# API

### Waterfall Attributes

| Attribute                | Description                                            | Type                                                      | Accepted Values                        | Default |
|:-------------------------|:-------------------------------------------------------|:----------------------------------------------------------|:---------------------------------------|:--------|
| `modelValue`             | 要渲染的数据                                                 | `array`                                                   | No                                     | `[]`    |
| `loadApi`                | 方法=>返回一个需要渲染的数组, 如果不传则需要自己更新modelValue                           | (arg?: WaterfallPagination) => Promise<any[]> / any[]     | No                                     | `null`  |
| `page`                   | 分页， 当前第几页                                              | `number`                                                  | -                                      | 1       |
| `pageSize`               | 每页大小                                                   | `number`                                                  | -                                      | 10      |
| `immediateLoad`          | 是否立即滚动加载 通过父级的@load函数返回一个promise                       | `boolean`                                                 | -                                      | false   |
| `scrollDelay`            | 滚动条下拉加载延迟                                              | `number`                                                  | -                                      | 500     |
| `autoHeight`             | 自适应高度                                                  | `boolean`                                                 | No                                     | `false` |
| `alignMode`              | 对齐                                                     | `string`                                                  | left/right/center                      | center  |
| `itemWidth`              | 每个元素的宽度                                                | `number`                                                  | -                                      | -       |
| `gap`                    | 元素之间的间隔                                                | `number`                                                  | -                                      | 5       |
| `col`                    | 分布多少列，    默认根据容器宽度自动计算列数                               | `number`                                                  | -                                      | -       |
| `shadow`                 | 阴影                                                     | `string`                                                  | always                 / hover / never | center  |
| `updateIntervalTime`     | 每次更新位置执行方法的时间间隔 ms                                     | `number`                                                  | No                                     | 50      |
| `transitionIntervalTime` | 元素展示过渡 [间隔] 时间 ms                                      | `number`                                                  | No                                     | 50      |
| `transitionDuration`     | 元素展示【过渡动画】时间 ms                                        | `number`                                                  | No                                     | 500     |
| `transitionProgressive`  | 元素展示是否递进过渡 根据当前元素所在下标计算 index * transitionIntervalTime | `boolean`                                                 | No                                     | false   |

## Drawer Events

| Name   | Description                                      | Parameter |
| ------ |--------------------------------------------------| --------- |
| loadScroll   | 有滚动条的情况下，滚动到底部触发的事件                              | —         |
| opened | Triggered after Drawer opening animation ended   | —         |
| close  | Triggered before Drawer closing animation begins | —         |
| closed | Triggered after Drawer closing animation ended   | —         |