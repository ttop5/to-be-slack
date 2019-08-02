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
        <q-toolbar-title>{{ typeListObj[$route.query.id] }}</q-toolbar-title>
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
        <q-item-label header class="flex">
          <q-item-section>Links</q-item-section>
          <q-item-section side top>
            <q-btn-dropdown flat label="菜单定制">
              <q-list>
                <q-item clickable v-ripple>
                  <q-toggle dense v-model="showEdit">编辑开关</q-toggle>
                </q-item>
                <q-item clickable v-ripple @click="showAll">
                  <q-item-section avatar style="padding-left: 12px;">
                    <q-icon name="list" size="28px" />
                  </q-item-section>
                  <q-item-section>恢复默认</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-item-section>
        </q-item-label>
        <q-item
          v-for="item in typeList"
          v-show="item.display"
          clickable
          v-ripple
          exact-active-class="menu-link"
          :key="item.id"
          :to="`/?id=${item.id}`"
          :active="$route.query.id === item.id"
        >
          <q-item-section>{{ item.title }}</q-item-section>
          <q-item-section side top>
            <q-btn v-if="showEdit" flat icon="delete" @click="item.display = false;" />
          </q-item-section>
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
      showEdit: false,
      typeList: [],
      typeListObj: {},
    };
  },
  watch: {
    typeList: {
      handler: function saveLinks(newValue) {
        localStorage.setItem('slackLinks', JSON.stringify(newValue));
      },
      deep: true,
    },
  },
  methods: {
    getType() {
      axiosInstance.get('/GetType').then((res) => {
        res.data.Data.forEach((item) => {
          item.display = true;
          this.typeListObj[item.id] = item.title;
        });
        res.data.Data.forEach((item, index) => {
          if (item.id === '100') {
            res.data.Data.splice(index, 2);
          }
        });
        this.$set(this, 'typeList', res.data.Data);
      });
    },
    showAll() {
      this.getType();
    },
  },
  created() {
    if (localStorage.getItem('slackLinks')) {
      this.$set(this, 'typeList', JSON.parse(localStorage.getItem('slackLinks')));
      this.typeList.forEach((item) => {
        this.typeListObj[item.id] = item.title;
      });
    } else {
      this.getType();
    }
  },
};
</script>

<style lang="stylus" scoped>
  .menu-link
    color white
    background $primary
</style>
