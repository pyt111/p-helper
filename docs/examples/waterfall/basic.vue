<template>
  <div class="waterfall-basic-wrapper">
    <p-waterfall
      v-model="waterfallData"
      :page-size="5"
      :item-width="300"
      align-mode="center"
      class="waterfall-wrapper-content p-border"
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
    </p-waterfall>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  // WaterfallBasic
  const waterfallData = ref([]);
  function randomNum(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const queryData = async (page, pageSize) => {
    if (page >= 15) {
      return Promise.resolve([]);
    }
    const data = Array.from({ length: pageSize }, () => {
      return {
        page,
        config: {
          height: randomNum(260, 600),
        },
      };
    });

    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  const onload = ({ page, pageSize }) => {
    return queryData(page, pageSize);
  };
</script>

<style scoped>
  .waterfall-basic-wrapper {
    height: 500px;
    border: 1px solid var(--p-border-color);
  }
</style>
