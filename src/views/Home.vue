<template>
  <div>
<div class="page-flex">
  <!-- ! Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-start">
        <div class="sidebar-head">
            <a class="sidebar-toggle m-auto transparent-btn btn-link" type="button">
                <img class="rotated img-tam row align-items-start" src="../assets/img/disco.png">
            </a>
        </div>
        <!-- MENU -->
        <div class="sidebar-body">
            <ul class="sidebar-body-menu">
                <li>
                  <a class="isActive" href="#" @click="componentName='SalesMade'">
                    <span class="icon save-money" aria-hidden="true"></span>
                    <p class="board-title">Ventas hechas</p>
                  </a>
                  <ul class="cat-sub-menu"></ul>
                </li>
                <li>
                  <a class="isActive" href="#" @click="componentName='OrdersMade'">
                    <span class="icon note" aria-hidden="true"></span>
                    <p class="board-title">Pedidos Hechos</p>
                  </a>
                  <ul class="cat-sub-menu"></ul>
                </li>
                <li>
                  <a class="isActive" href="#" @click="componentName='ProductSales'">
                    <span class="icon package" aria-hidden="true"></span>
                    <p class="board-title">Productos vendidos</p>
                  </a>
                </li>
                <li>
                  <a class="isActive" href="#" @click="componentName='DistributorSalesMax'">
                    <span class="icon distribution" aria-hidden="true"></span>
                    <p class="board-title">Distribuidores</p>
                  </a>
                </li>
                <li>
                  <a class="isActive" href="#" @click="componentName='BusinessVisited'">
                    <span class="icon visitor" aria-hidden="true"></span>
                    <p class="board-title">Negocios visitados</p>
                  </a>
                </li>
                <li>
                  <a class="isActive" href="#" @click="componentName='SalesEffective'">
                    <span class="icon efecty" aria-hidden="true"></span>
                    <p class="board-title">Ventas efectivas</p>
                  </a>
                </li>           
            </ul>
        </div>
    </div>
  </aside>
  <div class="main-wrapper">
    <nav class="main-nav--bg">
      <div class="container main-nav">
        <div class="main-nav-start">
          <a class="navbar-brand" href="/">
            <span class="img-fluid icon logo-nav" aria-hidden="true"></span>
          </a>  
        </div>   
        <div class="main-nav-end">
          <button class="sidebar-toggle transparent-btn" title="Menu" type="button">
            <span class="sr-only">Toggle menu</span>
            <span class="icon menu-toggle--gray" aria-hidden="true"></span>
          </button>
          <button class="theme-switcher gray-circle-btn" type="button" title="Switch theme">
            <span class="sr-only">Switch theme</span>
            <i class="sun-icon" data-feather="sun" aria-hidden="true"></i>
            <i class="moon-icon" data-feather="moon" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </nav>  
    <main class="main users chart-page" id="skip-target">
      <div class="container">        
        <!-- content -->
        <component v-bind:is="componentName"></component>
      </div>
    </main>
  </div>
</div>
    
  </div>
</template>
<script>
import SalesMade from '../components/SalesMade.vue';
import OrdersMade from '../components/OrdersMade.vue'
import ProductSales from '../components/ProductSales.vue';
import DistributorSalesMax from '../components/DistributorSalesMax.vue';
import BusinessVisited from '../components/BusinessVisited.vue';
import SalesEffective from '../components/SalesEffective.vue';

export default {
  name: 'Home',
  components: {
    SalesMade,
    OrdersMade,
    ProductSales,
    DistributorSalesMax,
    BusinessVisited,
    SalesEffective
  },
  data() {
    return {
      componentName: "SalesMade",
    }
  },
}
</script>
<style>
  .isActive {
    opacity: 1 !important;  
  }

/* body {
    background-image: url(../assets/img/fondo-2.png);
    background-size: 100% 100%;
    background-position: center;
    transition: background .3s;
} */

</style>
