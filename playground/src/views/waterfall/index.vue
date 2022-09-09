<template>
  <div class="waterfall-wrapper">
    <Waterfall
      v-model="waterfallData"
      :page-size="pageSize"
      :item-width="300"
      class="waterfall-wrapper-content"
      immediate-load
      @load="onload"
    >
      <template #default="{ item, page, index }">
        <div class="card-content">
          <div class="item">
            <img :src="item.url" alt="" class="waterfall-wrapper-item" />
          </div>
          <div class="content">{{ page }}</div>
          <div class="content">下标{{ index }}</div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, toRefs } from 'vue';
  import type { WaterfallItem } from '@p-helper/components';
  import { getRandomPhotos2 } from '@/api';

  export default defineComponent({
    name: 'Waterfall',
    setup() {
      const waterfallData = ref<WaterfallItem[]>([]);
      const state = reactive({
        pageSize: 4,
      });
      function randomNum(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const queryData = async (page) => {
        if (waterfallData.value.length >= 27) {
          return Promise.resolve([]);
        }
        return getRandomPhotos2({ _page: page, _limit: state.pageSize }).then(
          (res) => {
            const data = (res.data || []).map((item) => ({
              ...item,
              config: {
                height: randomNum(260, 600),
              },
            }));
            waterfallData.value.push(...data);
            return data;
          }
        );
      };

      const onload = ({ page }) => {
        return queryData(page);
      };

      return {
        ...toRefs(state),
        waterfallData,
        onload,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .waterfall-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    &-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-content {
      padding: 10px;
      height: 100%;
    }

    .item {
      width: 100%;
    }

    .waterfall-wrapper-content {
      width: 80%;
      height: 80vh;
      border: 1px solid var(--p-border-color-light);
    }
  }
</style>
