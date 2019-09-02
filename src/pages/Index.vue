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
        :href="escape2Html(item.url) || 'javascript:void(0)'"
        :key="item.index"
        @click="clickHandler(item)"
      >
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label v-if="item.desc" caption lines="2">{{ item.desc }}</q-item-label>
        </q-item-section>
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
    escape2Html(str) {
      let temp = document.createElement('div');
      temp.innerHTML = str;
      const output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    },
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
