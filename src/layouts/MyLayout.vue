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
        <q-btn-dropdown flat label="更多">
          <q-list>
            <q-item clickable v-ripple tag="a" target="_blank" href="https://github.com/ttop5/to-be-slack">
              <q-item-section avatar>
                <q-icon name="fab fa-github" />
              </q-item-section>
              <q-item-section>GitHub 仓库</q-item-section>
            </q-item>
            <q-item clickable v-ripple tag="a" target="_blank" href="https://github.com/ttop5/to-be-slack/blob/master/README.md#chrome-%E6%8F%92%E4%BB%B6">
              <q-item-section avatar>
                <q-icon name="fab fa-chrome" />
              </q-item-section>
              <q-item-section>Chrome 插件</q-item-section>
            </q-item>
            <q-item clickable v-ripple tag="a" target="_blank" href="https://github.com/ttop5/to-be-slack/blob/master/README.md#pwa">
              <q-item-section avatar>
                <q-icon name="fas fa-mobile-alt" />
              </q-item-section>
              <q-item-section>PWA 应用程序</q-item-section>
            </q-item>
            <q-item clickable v-ripple tag="a" target="_blank" href="https://github.com/ttop5/to-be-slack/blob/master/README.md#%E6%A1%8C%E9%9D%A2%E7%A8%8B%E5%BA%8F">
              <q-item-section avatar>
                <q-icon name="fas fa-laptop" />
              </q-item-section>
              <q-item-section>桌面端应用程序</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list separator class="rounded-borders text-primary q-pa-md">
        <q-item-label header class="flex">
          <q-item-section>Links</q-item-section>
          <q-item-section side top>
            <q-btn-dropdown flat label="设置">
              <q-list>
                <q-item clickable v-ripple>
                  <q-toggle dense v-model="showEdit">菜单编辑</q-toggle>
                </q-item>
                <q-item clickable v-ripple @click="showAll">
                  <q-item-section avatar style="padding-left: 18px;">
                    <q-icon name="fas fa-list" size="22px" />
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
          @click="clickHandler(item.id)"
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
        localStorage.setItem('slackTabs', JSON.stringify(newValue));
      },
      deep: true,
    },
  },
  methods: {
    compare(property) {
      return (obj1, obj2) => {
        const value1 = obj1[property];
        const value2 = obj2[property];
        return value2 - value1;
      };
    },
    getType() {
      axiosInstance.get('/GetType').then((res) => {
        let data = res.data.Data;
        // 默认全部显示
        data.forEach((item) => {
          item.display = true;
          this.typeListObj[item.id] = item.title;
        });
        // 去掉不需要的 tab
        data.forEach((item, index) => {
          if (item.id === '100') {
            data.splice(index, 2);
          }
        });
        // 根据热度排序
        data = data.sort(this.compare('sort'));
        this.$set(this, 'typeList', data);
      });
    },
    showAll() {
      this.getType();
    },
    clickHandler(id) {
      localStorage.setItem('slackActiveTab', id);
    },
  },
  created() {
    if (localStorage.getItem('slackTabs')) {
      this.$set(this, 'typeList', JSON.parse(localStorage.getItem('slackTabs')));
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
