<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header style="background-color: #303030; color: white">
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
            :label="$q.screen.xs ? 'Eu' : 'Usuário'"
            content-class="menu-transparente"
          >
            <div class="modalMenu  q-pa-md">
              <div class="colomn q-pr-lg">
                <div class="text-h5 q-mb-md">Informações:</div>
                <div class="info">👤 Nome do Usuário: <span>Caio Cesar</span></div>
                <div class="info">📧 Email: <span>admin@gmail.com</span></div>
                <div class="info">🔑 Permissão: <span>ADMIN</span></div>
                <q-btn
                  class="MenuBTN" id="MenuBTN"
                  color="primary"
                  label="Logout"
                  href="src/pages/LoginPage.vue"
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
      :width="
        $q.screen.xs ? 180 : 
        $q.screen.sm ? 220 : 
        $q.screen.md ? 200 : 
        $q.screen.lg ? 300 : 
        300"
      style="background-color: #303030; color: white"
    >
      <div class="logoWDAALL">
        <img :src="logo" alt="WDA GROUP LOGO.png" />
      </div>
      <q-list class="drawer-list" >
        <div class="drawer-links" >
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
