<template>
  <div class="serchFiled">
    <van-field
      v-model="result"
      v-bind="$attrs"
      @update:model-value="onChange"
    />
    <div v-show="showPicker" class="suggestion">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="suggestion-item"
        @click="handlerSelect(item)"
      >
        {{ item.enBaseName }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { fetchCorpByName } from '@/api/common';
import { debounce } from 'lodash-es';

const emit = defineEmits(['change', 'clearCode']);

const onChange = debounce((val: string) => {
  emit('clearCode');
  getchCorpByName(val);
}, 500);

//* 获取数据
let list = $ref<any[]>([]);
const result: any = defineModel();
let showPicker = $ref(false);

async function getchCorpByName(name: string) {
  const { data } = await fetchCorpByName(name);
  if (data.length) {
    list = data || [];
    showPicker = true;
  } else {
    showPicker = false;
  }
}

function handlerSelect(item: any) {
  result.value = item.enBaseName;
  emit('change', item);
  showPicker = false;
}
</script>

<style lang="scss" scoped>
.serchFiled {
  position: relative;
  .suggestion {
    background-color: #fff;
    width: 100%;
    max-height: 207px;
    overflow-y: auto;
    position: absolute;
    right: 0;
    z-index: 999;
    border: 1px solid #eee;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    &-item {
      height: 30px;
      font-size: 28px;
      padding: 16px;
    }
  }
}
</style>
