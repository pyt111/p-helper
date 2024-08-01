import { defineComponent, h } from 'vue';
import type { VNode } from 'vue';

export default defineComponent({
  name: 'VNodeRenderer',

  props: {
    node: {
      type: [String, Object, Function, Array],
      default: null as unknown as
        | null
        | VNode
        | VNode[]
        | (() => VNode | VNode[]),
    },
  },

  // setup(props) {
  //   return () => h(props.node);
  // },

  render(vm) {
    const node = vm.node;
    if (typeof node === 'string') {
      return h('div', node);
    } else if (typeof node === 'function') {
      return vm.node();
    }
    return vm.node;
  },
});
