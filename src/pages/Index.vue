<template>
  <q-page class="q-pa-lg">
    <q-list bordered separator class="full-width">
      <q-item
        v-for="item in postList"
        clickable
        v-ripple
        tag="a"
        target="_blank"
        :href="item.url"
        :key="item.index"
      >
        {{ item.title }}
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { axiosInstance } from '../boot/axios';

export default {
  name: 'PageIndex',
  data() {
    return {
      postList: [],
    };
  },
  watch: {
    '$route'() {
      this.getPostList();
    },
  },
  methods: {
    getPostList() {
      axiosInstance.get(`/GetTypeInfo?id=${this.$route.query.id}`).then((res) => {
        this.$set(this, 'postList', res.data.Data);
      });
    },
  },
  created() {
    this.getPostList();
  },
};
</script>

<style>
</style>
