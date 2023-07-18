<script lang="tsx">
  import { computed, defineComponent, unref } from 'vue';
  import { ElTooltip } from 'element-plus';
  // import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { isArray, isString } from '@p-helper/utils/is';
  import { getSlot } from '@p-helper/utils/helper/tsxHelper';
  import { useDesign } from '@p-helper/hooks/web/useDesign';
  import type { CSSProperties, PropType } from 'vue';

  const props = {
    /**
     * Help text max-width
     * @default: 600px
     */
    maxWidth: { type: String, default: '600px' },
    /**
     * Whether to display the serial number
     * @default: false
     */
    showIndex: { type: Boolean },
    /**
     * Help text font color
     * @default: #ffffff
     */
    color: { type: String, default: '#ffffff' },
    /**
     * Help text font size
     * @default: 14px
     */
    fontSize: { type: String, default: '14px' },
    /**
     * Help text list
     */
    placement: { type: String, default: 'right' },
    /**
     * Help text list
     */
    text: { type: [Array, String] as PropType<string[] | string> },
  };

  export default defineComponent({
    name: 'BasicHelp',
    components: { ElTooltip },
    props,
    setup(props, { slots, attrs }) {
      const { prefixCls } = useDesign('basic-help');

      const getTooltipStyle = computed(
        (): CSSProperties => ({ color: props.color, fontSize: props.fontSize })
      );

      const getOverlayStyle = computed(
        (): CSSProperties => ({ maxWidth: props.maxWidth })
      );

      function renderTitle() {
        const textList = props.text;

        if (isString(textList)) {
          return (
            <div style={unref(getTooltipStyle)}>
              <p>{textList}</p>
            </div>
          );
        }

        if (isArray(textList)) {
          return (
            <div style={unref(getTooltipStyle)}>
              {textList.map((text, index) => {
                return (
                  <p key={text}>
                    {props.showIndex ? `${index + 1}. ` : ''}
                    {text}
                  </p>
                );
              })}
            </div>
          );
        }
        return null;
      }

      return () => {
        return (
          <ElTooltip
            popperClassName={`${prefixCls}__wrap`}
            raw-content
            style={unref(getOverlayStyle)}
            placement={props.placement as 'right'}
            {...attrs}
          >
            <span class={prefixCls}>{getSlot(slots)}</span>
          </ElTooltip>
        );
      };
    },
  });
</script>
