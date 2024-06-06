<template>
  <van-field
    v-model="result"
    is-link
    readonly
    v-bind="$attrs"
    @click="showPicker = true"
  />
  <van-popup v-model:show="showPicker" position="bottom">
    <van-picker
      v-model="selectedValues"
      :columns="dictList.length ? dictList : list"
      :columns-field-names="{
        text: 'label',
      }"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts" setup>
import { fetchDict } from '@/api/common';

const props = defineProps({
  code: String,
  list: Array,
});

//* 获取字典
let dictList = $ref<any>([]);
async function getDict() {
  const { data } = await fetchDict(props.code as string);
  dictList = data || [];
}

watch(
  () => props.code,
  () => {
    if (props.code) {
      getDict();
    }
  },
  {
    immediate: true,
  }
);

const value: any = defineModel();
let result = $ref('');
const showPicker = ref(false);
let selectedValues = $ref([]);

const onConfirm = ({ selectedOptions, selectedValues }: any) => {
  value.value = selectedValues.join(',');
  result = selectedOptions[0]?.label;
  showPicker.value = false;
};
</script>

<style lang="scss" scoped></style>
