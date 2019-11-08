<template>
  <q-page class="q-pa-lg">
<!--    <q-banner v-if="showBanner" inline-actions rounded class="bg-orange text-white q-mb-lg">-->
<!--      本站永久地址：<a target="_blank" href="http://tophub.ttop5.net">tophub.ttop5.net</a>-->
<!--      <template v-slot:action>-->
<!--        <q-btn flat label="我已收藏" @click="showBanner = false" />-->
<!--      </template>-->
<!--    </q-banner>-->

    <q-list bordered separator class="full-width">
      <q-item
        v-for="item in postList"
        clickable
        v-ripple
        tag="a"
        target="_blank"
        :style="`color: ${(readedLinks.includes(item.Url)) ? 'grey' : 'unset'}`"
        :href="escape2Html(item.Url) || 'javascript:void(0)'"
        :key="item.index"
        @click="clickHandler(item)"
      >
        <q-item-section>
          <q-item-label>{{ item.Title }}</q-item-label>
          <q-item-label v-if="item.Desc" caption lines="1">{{ item.Desc }}</q-item-label>
          <img
            v-if="
              item.Url.includes('.gif') ||
              item.Url.includes('.jpg') ||
              item.Url.includes('.png')
            "
            :src="item.Url"
          >
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
      // showBanner: true,
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
      if (str.indexOf('//tieba.baidu.com/') === -1) {
        return str;
      }
      let temp = document.createElement('div');
      temp.innerHTML = str;
      const output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    },
    getPostList() {
      axiosInstance.get(`/GetAllInfoGzip?id=${this.$route.query.id}`).then((res) => {
        this.$set(this, 'postList', res.data.Data);
      });
    },
    clickHandler(item) {
      if (!this.readedLinks.includes(item.Url)) {
        this.readedLinks.push(item.Url);
      }
      localStorage.setItem('slackReadedLinks', JSON.stringify(this.readedLinks));
    },
  },
  created() {
    this.getPostList();
  },
};
</script>

<style lang="stylus" scoped>
  img
    width 50%
    margin-top 5px

  @media (max-width: 768px)
    img
      width 100%
</style>
