<script setup>
const demos = import.meta.globEager('../../examples/waterfall/*.vue')
</script>

:::demo1 You can set `offset` attribute to change the offset top，the default value is 0.

waterfall/basic

:::

# Waterfall API

### Waterfall Attributes

| Attribute    | Description | Type      | Accepted Values   | Default |
|:-------------|:------------|:----------|:------------------|:--------|
| `autoHeight` | 自适应高度       | `boolean` | No                | `false` |
| `alignMode`  | 对齐          | `string`  | left/right/center | center  |
