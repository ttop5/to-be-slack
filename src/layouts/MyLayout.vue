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
            <q-item
              v-for="item in rightTopMenuList"
              clickable
              v-ripple
              tag="a"
              target="_blank"
              :key="item.index"
              :href="item.href"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>{{ item.title }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <div
        id="left-top"
        class="left-top flex justify-between absolute-top"
      >
        <q-select
          v-model="typeClass"
          outlined
          filled
          :options="typeClassOptions"
        />
        <q-btn-dropdown flat label="设置" style="height: 56px;">
          <q-list>
            <q-item clickable v-ripple>
              <q-toggle dense v-model="showEdit">菜单编辑</q-toggle>
            </q-item>
            <q-item clickable v-ripple @click="showAllType">
              <q-item-section avatar style="padding-left: 18px;">
                <q-icon name="fas fa-list" size="22px" />
              </q-item-section>
              <q-item-section>恢复默认</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <q-list separator id="left-list" class="rounded-borders text-primary q-pa-md q-mt-xl">
        <q-item
          v-for="item in typeList"
          v-show="!hideTypeList.includes(item.id)"
          clickable
          v-ripple
          exact-active-class="menu-link"
          :key="item.id"
          :to="`/?id=${item.id}`"
          :active="$route.query.id === item.id"
          @click="clickHandler(item.id)"
        >
          <q-item-section>{{ item.name }}</q-item-section>
          <q-item-section side top>
            <q-btn v-if="showEdit" flat icon="delete" @click="hideType(item.id)" />
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
      allTypeListData: {},
      typeList: [],
      typeListObj: {},
      typeClass: (localStorage.getItem('slackTypeClass') && localStorage.getItem('slackTypeClass').replace(new RegExp('"', 'g'), '')) || '全部',
      typeClassOptions: [],
      hideTypeList: JSON.parse(localStorage.getItem('slackHideTabs')) || ['101'],
      rightTopMenuList: [
        {
          href: 'https://github.com/tophubs/to-be-slack',
          icon: 'fab fa-github',
          title: 'GitHub 仓库',
        },
        {
          href: 'https://github.com/tophubs/to-be-slack/wiki/%E6%9C%8D%E5%8A%A1%E5%85%AC%E5%91%8A',
          icon: 'fas fa-bullhorn',
          title: '服务公告',
        },
        {
          href: 'https://github.com/tophubs/to-be-slack/wiki/%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E#chrome-%E6%8F%92%E4%BB%B6',
          icon: 'fab fa-chrome',
          title: 'Chrome 插件',
        },
        {
          href: 'https://github.com/tophubs/to-be-slack/wiki/%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E#pwa-%E7%A8%8B%E5%BA%8F',
          icon: 'fas fa-mobile-alt',
          title: 'PWA 程序',
        },
        {
          href: 'https://github.com/tophubs/to-be-slack/wiki/%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E#%E6%A1%8C%E9%9D%A2%E7%AB%AF%E7%A8%8B%E5%BA%8F',
          icon: 'fas fa-laptop',
          title: '桌面端程序',
        },
      ],
    };
  },
  watch: {
    typeClass: {
      handler: function saveLinks(newValue) {
        localStorage.setItem('slackTypeClass', JSON.stringify(newValue));
        this.typeList = this.allTypeListData[newValue];
        // this.getType();
      },
    },
    hideTypeList: {
      handler: function saveLinks(newValue) {
        localStorage.setItem('slackHideTabs', JSON.stringify(newValue));
      },
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
    getAllType() {
      axiosInstance.get('/GetAllType').then((res) => {
        this.$set(this, 'allTypeListData', res.data.Data);
        const typeClassOptions = Object.keys(res.data.Data);
        this.$set(this, 'typeClassOptions', typeClassOptions);
        this.$set(this, 'typeList', res.data.Data[this.typeClass]);
      });
    },
    // getTypeClass() {
    //   axiosInstance.get('/GetTypeClass').then((res) => {
    //     const data = ['全部'];
    //     res.data.Data.forEach((item) => {
    //       data.push(item.type);
    //     });
    //     this.$set(this, 'typeClassOptions', data);
    //   });
    // },
    // getType() {
    //   let url = '/GetType';
    //   if (this.typeClass !== '全部') {
    //     url = `/GetType?type=${this.typeClass}`;
    //   }
    //   axiosInstance.get(url).then((res) => {
    //     let data = res.data.Data;
    //     // [] => {} && 去掉不需要的 tab
    //     data.forEach((item, index) => {
    //       this.typeListObj[item.id] = item.title;
    //       if (item.id === '101') {
    //         data.splice(index, 1);
    //       }
    //     });
    //     // 根据热度排序
    //     data = data.sort(this.compare('sort'));
    //     this.$set(this, 'typeList', data);
    //   });
    // },
    hideType(id) {
      if (!this.hideTypeList.includes(id)) {
        this.hideTypeList.push(id);
      }
    },
    showAllType() {
      this.$set(this, 'hideTypeList', ['101']);
    },
    clickHandler(id) {
      localStorage.setItem('slackActiveTab', id);
    },
  },
  created() {
    // this.getTypeClass();
    // this.getType();
    this.getAllType();
  },
  mounted() {
    const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      document.getElementById('left-top').classList.remove('absolute-top');
      document.getElementById('left-list').classList.remove('q-mt-xl');
    }
    this.hideType('101');
  },
};
</script>

<style lang="stylus" scoped>
  .left-top
    z-index 1001
    background-color #f0f0f0
    color #706f70
    padding 0 16px
  .menu-link
    color white
    background $primary
</style>
