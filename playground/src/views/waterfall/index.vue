<template>
  <div class="waterfall-wrapper">
    <Waterfall
      v-model="waterfallData"
      :page-size="5"
      :item-width="300"
      class="waterfall-wrapper-content"
      :load-api="onload"
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
  import { defineComponent, ref } from 'vue';
  import { getRandomPhotos2 } from '@/api';

  export default defineComponent({
    name: 'PlayWaterfall',
    setup() {
      const waterfallData = ref<any[]>([]);
      const immediateLoad = ref(true);
      function randomNum(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const queryData = (page, pageSize) => {
        if (waterfallData.value.length >= 27) {
          return Promise.resolve([]);
        }
        // const data = Array.from({ length: pageSize.value }, () => {
        //   return {
        //     page,
        //     config: {
        //       height: randomNum(260, 600),
        //     },
        //   };
        // });

        // console.log('data >--->', data);
        // return new Promise((resolve, reject) => {
        //   resolve(data);
        // });

        return getRandomPhotos2({ _page: page, _limit: pageSize }).then(
          (res) => {
            const data = (res.data || []).map((item) => ({
              ...item,
              config: {
                height: randomNum(260, 600),
              },
            }));
            // waterfallData.value.push(...data);
            return data;
          }
        );
      };

      const onload = ({ page, pageSize }) => {
        return queryData(page, pageSize);
      };

      const loadScroll = ({ page, pageSize }) => {
        queryData(page, pageSize).then((res) => {
          waterfallData.value.push(...res);
        });
      };

      // loadScroll({ page: 1 });

      return {
        waterfallData,
        immediateLoad,
        onload,
        loadScroll,
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
