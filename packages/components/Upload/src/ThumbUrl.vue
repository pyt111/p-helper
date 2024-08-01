<template>
  <span class="upload-thumb">
    <ElImage
      v-if="fileUrl"
      :src="fileUrl"
      :width="104"
      :preview-src-list="previewSrcList"
    />
  </span>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { propTypes } from '@p-helper/utils/propTypes';
  import { ElImage } from 'element-plus';

  export default defineComponent({
    components: { ElImage },
    props: {
      fileUrl: propTypes.string.def(''),
      fileName: propTypes.string.def(''),
    },
    computed: {
      previewSrcList() {
        return [this.fileUrl];
      },
    },
  });
</script>
