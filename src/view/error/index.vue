<template>
  <van-empty image="error" description="未找到该页面">
    <van-button round type="primary" @click="back">带我回家</van-button>
  </van-empty>
</template>

<script lang="ts" setup>
const router = useRouter();
const back = () => {
  router.push('/home');
};
</script>
