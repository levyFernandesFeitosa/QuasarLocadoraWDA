<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header style="background-color: #404040; color: white">
      <q-toolbar>
        <div class="header-left">
          <q-btn
            class="menu-btn"
            dense
            round
            flat
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
        </div>
        <div class="header-center">
          <q-toolbar-title>
            <span class="app-title">Locadora de Livros </span>
          </q-toolbar-title>
        </div>

        <div >
          <q-btn-dropdown
            class="MenuBTN"
            color="purple"
            label="Account Settings"
          >
            <div class="row no-wrap q-pa-md" style="background-color: blueviolet;">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                />
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer (Menu Lateral) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="drawer-main"
      :width="200"
      style="background-color: #404040; color: white"
    >
      <div class="logoWDAALL">
        <img :src="logo" alt="Logo WDA" />
      </div>
      <q-list class="drawer-list">
        <div class="drawer-links">
          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </div>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import logo from "src/assets/image.png";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "dashboard",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Locatário",
    link: "/locatario",
    icon: "people",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Editoras",
    link: "/editoras",
    icon: "library_books",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Livros",
    link: "/livros",
    icon: "menu_book",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Aluguéis",
    link: "/alugueis",
    icon: "event",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Usuários",
    link: "/usuario",
    icon: "manage_accounts",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Logout",
    link: "src/pages/LoginPage.vue",
    icon: "logout",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
