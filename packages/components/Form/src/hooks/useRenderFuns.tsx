import { h } from 'vue';
import { ElIcon, ElTooltip } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';

interface TooltipProps {
  content: string;
}
export const useRenderFun = () => {
  const RenderTooltip = (props: TooltipProps) => {
    const slot = {
      default: () => (
        <ElIcon style={'display: flex; height: inherit; align-items: center;'}>
          <Warning style={'width: 1em; height: 1em;'} />
        </ElIcon>
      ),
    };
    return (
      <ElTooltip
        raw-content
        content={props.content}
        v-slots={slot}
        placement={'right'}
      />
    );
  };

  return {
    RenderTooltip: (props: TooltipProps) => {
      return h(RenderTooltip, props);
    },
  };
};
