<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>{{ activeLink.title }}</q-toolbar-title>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=ttop5&repo=to-be-slack&type=star&count=true"
          frameborder="0"
          scrolling="0"
          width="100px"
          height="20px"
        >
        </iframe>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2"
    >
      <q-list separator class="rounded-borders text-primary q-pa-md">
        <q-item-label header>Links</q-item-label>
        <q-item
          v-for="item in typeList"
          clickable
          v-ripple
          exact-active-class="menu-link"
          :key="item.id"
          :to="`/?id=${item.id}`"
          :active="activeLink.id === item.id"
          @click="activeLink = item;"
        >
          <q-item-section>{{ item.title }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="primary" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { axiosInstance } from '../boot/axios';

export default {
  name: 'MyLayout',
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      typeList: [],
      activeLink: {},
    };
  },
  methods: {
    getType() {
      axiosInstance.get('/GetType').then((res) => {
        res.data.Data.forEach((item, index) => {
          if (item.id === '100') {
            res.data.Data.splice(index, 2);
          }
        });
        this.$set(this, 'typeList', res.data.Data);
        this.$set(this, 'activeLink', res.data.Data[0]);
      });
    },
  },
  created() {
    this.getType();
  },
};
</script>

<style lang="stylus" scoped>
  .menu-link
    color white
    background $primary
</style>
