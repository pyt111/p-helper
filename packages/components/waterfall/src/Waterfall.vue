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
      :infinite-scroll-immediate="immediateLoadBool"
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
                :class="[
                  ns.b('item'),
                  ready ? ns.is('ready') : 'opacity__0',
                  page < pagination.page || noMore ? 't-r' : '',
                ]"
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

    <slot name="loadMessage">
      <div
        :class="[
          ns.bm('message', 'box'),
          ns.is(isShowMessageBox ? 'show' : ''),
        ]"
      >
        <p v-if="!noMore" :class="[ns.e('loading')]">Loading...</p>
        <p v-if="noMore">没有更多</p>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    getCurrentInstance,
    onBeforeUnmount,
    ref,
    unref,
  } from 'vue';
  import { isFunction } from '@vue/shared';
  import { useNamespace } from '@p-helper/hooks';
  import { sleep } from '@p-helper/utils';
  import { useVModel } from '@vueuse/core';
  import { waterfallProps } from './waterfall';
  import { useWaterfall } from './useWaterfall';

  defineOptions({
    name: 'PWaterfall',
  });
  const props = defineProps(waterfallProps);
  const emit = defineEmits([
    'update:modelValue',
    'update:immediateLoad',
    'loadScroll',
  ]);
  const data = useVModel(props, 'modelValue', emit);
  const immediateLoadBool = useVModel(props, 'immediateLoad', emit, {
    passive: true,
  });
  const wWrapperRef = ref();
  const ns = useNamespace('waterfall');
  const instance = getCurrentInstance();

  const options = computed(() => ({
    ...props,
  }));

  const loading = ref(false);
  const noMore = ref(false);
  const isShowMessageBox = ref(false);
  const getLoadPage = computed(() => {
    const pageVal = pagination.value.page;
    return {
      ...pagination.value,
      page: waterfalls.value[pageVal] ? pageVal + 1 : pageVal, // 如果已经存在当前页面的数据 则请求下一页
    };
  });

  const { waterfalls, pagination, stopOb, tasks } = useWaterfall(
    wWrapperRef,
    options as any
  );

  const scrollDisabled = computed(() => loading.value);

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

  const checkLoadApi = () => {
    const isFn = isFunction(props.loadApi);
    if (!isFn) {
      immediateLoadBool.value = false;
    }
    return isFn;
  };

  checkLoadApi();

  const closeMessage = () => {
    sleep(1000).then(() => {
      isShowMessageBox.value = false;
    });
  };

  // 滑动请求下一页
  const onscroll = async () => {
    // await nextTick();
    const taskSize = tasks.value.size();
    if (taskSize) {
      return;
    }

    const params = unref(getLoadPage);
    emit('loadScroll', params);

    // 没有LoadApi 上面滚动到底发射事件出去 通过自定义外部数据
    if (!checkLoadApi()) {
      return;
    }

    isShowMessageBox.value = true;
    if (noMore.value) {
      closeMessage();
      return;
    }

    try {
      loading.value = true;
      const res = await props.loadApi(params);
      if (res?.length) {
        data.value.push(...res);
      }
      noMore.value = !res.length;
    } catch (err: any) {
      throw new Error(err);
    } finally {
      loading.value = false;
      closeMessage();
    }
  };

  onBeforeUnmount(() => {
    stopOb();
  });
</script>
