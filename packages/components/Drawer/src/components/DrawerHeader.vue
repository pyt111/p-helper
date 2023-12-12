<template>
  <BasicTitle v-if="!isDetail" :class="prefixCls">
    <slot name="title" />
    {{ !$slots.title ? title : '' }}
  </BasicTitle>

  <div v-else :class="['el-drawer__title', prefixCls, `${prefixCls}--detail`]">
    <span :class="`${prefixCls}__twrap`">
      <span
        v-if="showDetailBack"
        :class="`${prefixCls}__back`"
        @click="handleClose"
      >
        <el-icon size="20">
          <Back />
        </el-icon>
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="`${prefixCls}__toolbar`">
      <slot name="titleToolbar" />
    </span>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTitle } from '@p-helper/components/Basic';

  import { useDesign } from '@p-helper/hooks/web/useDesign';

  import { propTypes } from '@p-helper/utils/propTypes';
  import { Back } from '@element-plus/icons-vue';

  export default defineComponent({
    name: 'BasicDrawerHeader',
    components: { BasicTitle, Back },
    props: {
      isDetail: propTypes.bool,
      showDetailBack: propTypes.bool,
      title: propTypes.string,
    },
    emits: ['close'],
    setup(_, { emit }) {
      const { prefixCls } = useDesign('basic-drawer-header');

      function handleClose() {
        emit('close');
      }

      return { prefixCls, handleClose };
    },
  });
</script>
