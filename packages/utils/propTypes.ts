import { createTypes, toType } from 'vue-types';
import type { CSSProperties, VNodeChild } from 'vue';
import type { VueTypeValidableDef, VueTypesInterface } from 'vue-types';

export type VueNode = VNodeChild | JSX.Element;

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
  // readonly trueBool: VueTypeValidableDef<boolean>;
};

const tempPropTypes = createTypes({
  func: undefined,
  bool: undefined,
  string: undefined,
  number: undefined,
  object: undefined,
  integer: undefined,
}) as PropTypes;

// @ts-ignore
class CustomPropTypes extends tempPropTypes {
  static get style() {
    return toType('style', {
      type: [String, Object],
      default: undefined,
    });
  }

  static get VNodeChild() {
    return toType('VNodeChild', {
      type: undefined,
      default: undefined,
    });
  }
}

// propTypes.extend([
//   {
//     name: 'style',
//     getter: true,
//     type: [String, Object],
//     default: undefined,
//   },
//   {
//     name: 'VNodeChild',
//     getter: true,
//     type: undefined,
//   },
// ]);

export { CustomPropTypes as propTypes };
