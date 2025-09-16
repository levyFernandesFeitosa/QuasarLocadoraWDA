<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header style="background-color: #404040; color: white;">
      <q-toolbar >
        <div class="header-left">
          <q-btn class="menu-btn" dense round
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
        
        <div class="header-right" style=" widows: 10%; margin-top: 1%; font-size: 2.5vh; color: rgba(159, 252, 255, 1);">
          <div>admin</div>
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
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Locatário",
    link: "/locatario",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Editoras",
    link: "/editoras",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Livros",
    link: "/livros",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Aluguéis",
    link: "/aluguéis",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Usuários",
    link: "/usuário",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
  {
    title: "Logout",
    link: "src/pages/LoginPage.vue",
    style: "padding-top: 7%; padding-bottom: 7%;",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}




</script>
