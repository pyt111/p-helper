<template>
  <div
    ref="wWrapperRef"
    :class="[ns.b(), ns.m(props.mode)]"
    :style="styleConfig"
  >
    <div
      v-infinite-scroll="onscroll"
      :infinite-scroll-distance="300"
      :infinite-scroll-disabled="scrollDisabled"
      :infinite-scroll-immediate="props.immediateLoad"
      :infinite-scroll-delay="props.scrollDelay"
      :class="ns.m('box')"
    >
      <template v-if="props.mode === 'css'">
        <template v-for="(item, i) in props.modelValue || []" :key="i">
          <div class="page-box">
            <slot :item="item" />
          </div>
        </template>
      </template>
      <template v-else-if="waterfalls">
        <template v-for="({ list }, page) in waterfalls" :key="page">
          <div class="page-box">
            <template
              v-for="({ item, style, ready, index }, i) in list || []"
              :key="item.id || i"
            >
              <div
                :class="[ns.b('item'), ready ? ns.is('ready') : 'opacity__0']"
                :style="style"
              >
                <div
                  :class="[
                    ns.be('item', 'body'),
                    ns.is(`${props.shadow}-shadow`),
                  ]"
                >
                  <slot :item="item" :page="page" :index="index" />
                </div>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>

    <div
      :class="[ns.bm('message', 'box'), ns.is(isShowMessageBox ? 'show' : '')]"
    >
      <p v-if="!noMore" :class="[ns.e('loading')]">Loading...</p>
      <p v-if="noMore">没有更多</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    ref,
  } from 'vue';
  import { isFunction, isPromise } from '@vue/shared';
  import { useNamespace } from '@p-helper/hooks';
  import { sleep } from '@p-helper/utils';
  import { waterfallProps } from './waterfall';
  import { useWaterfall } from './useWaterfall';

  defineOptions({
    name: 'PWaterfall',
  });
  const props = defineProps(waterfallProps);
  const wWrapperRef = ref();
  const ns = useNamespace('waterfall');
  const instance = getCurrentInstance();

  const options = computed(() => ({
    ...props,
  }));

  const loading = ref(false);
  const noMore = ref(false);
  const isShowMessageBox = ref(false);

  const scrollDisabled = computed(() => loading.value);

  const { waterfalls, pagination, stopOb, tasks } = useWaterfall(
    wWrapperRef,
    options
  );

  const styleConfig = computed(() => {
    const config = {
      '--gap': `${props.gap}px`,
      '--col': props.col,
    };
    if (props.itemWidth) {
      Object.assign(config, {
        '--itemWidth':
          typeof props.itemWidth === 'string'
            ? props.itemWidth
            : `${props.itemWidth}px`,
        '--transitionDuration': `${props.transitionDuration}ms`,
      });
    }
    return config;
  });

  const closeMessage = () => {
    sleep(1000).then(() => {
      isShowMessageBox.value = false;
    });
  };

  // 滑动请求下一页
  const onscroll = async () => {
    const taskSize = tasks.value.size();
    if (taskSize) return;
    if (!isFunction(instance?.attrs.onLoad)) return;

    const page = pagination.value.page;
    const loadFn = instance?.attrs.onLoad.bind(null, {
      page: waterfalls.value[page] ? page + 1 : page, // 如果已经存在当前页面的数据 则请求下一页
    });
    const pl: Promise<any> = loadFn();

    if (!isPromise(pl)) return;

    isShowMessageBox.value = true;
    if (noMore.value) {
      closeMessage();
      return;
    }
    loading.value = true;

    try {
      const res = await pl;
      noMore.value = !res.length;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      loading.value = false;
      closeMessage();
    }
  };

  onMounted(() => {
    // if (!props.api)
  });

  onBeforeUnmount(() => {
    stopOb();
  });
</script>
