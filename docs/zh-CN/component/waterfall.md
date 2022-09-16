<script setup>
const demos = import.meta.globEager('../../examples/waterfall/*.vue')
</script>

:::demo1 You can set `offset` attribute to change the offset top，the default value is 0.

waterfall/basic

:::

# Waterfall API

### Waterfall Attributes

| 属性名          | 描述    | 类型        | 默认      | 可选值               |
|:-------------|:------|:----------|:--------|:------------------|
| `autoHeight` | 自适应高度 | `boolean` | `false` | No                |
| `alignMode`  | 对齐    | `string`  | center  | left/right/center |
