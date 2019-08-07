<template>
  <q-page class="q-pa-lg">
    <q-list bordered separator class="full-width">
      <q-item
        v-for="item in postList"
        clickable
        v-ripple
        tag="a"
        target="_blank"
        :style="`color: ${(readedLinks.includes(item.url)) ? 'grey' : 'unset'}`"
        :href="item.url || 'javascript:void(0)'"
        :key="item.index"
        @click="clickHandler(item)"
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
      readedLinks: JSON.parse(localStorage.getItem('slackReadedLinks')) || [],
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
    clickHandler(item) {
      if (!this.readedLinks.includes(item.url)) {
        this.readedLinks.push(item.url);
      }
      localStorage.setItem('slackReadedLinks', JSON.stringify(this.readedLinks));
    },
  },
  created() {
    this.getPostList();
  },
};
</script>

<style>
</style>
