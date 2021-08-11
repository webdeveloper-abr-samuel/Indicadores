<template>
  <div class="container mt-2 text-center">
    <h1 class="mb-5 main-title">Producto Vendidos</h1>
    <div class="row">
      <div class="col-xl-12 col-xxl-5 d-flex">
        <div class="w-100">
          <div class="row">
              <div class="col-sm-3">
                <div class="card text-black  mb-3" style="max-width: 18rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Asesor</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                  <span style="font-size: 1em; color: black;">
                                    <i class="fas fa-user-tie"></i>
                                  </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3">{{ asesorAct }}</p>
                    </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card text-black  mb-3" style="max-width: 18rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Mas vendidos</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                    <span style="font-size: 1em; color: green;">
                                      <i class="fas fa-sort-numeric-up"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3" v-for="(item, index) in Max" :key="index">
                            {{ item.code }} - ${{ item.total.toLocaleString("es-ES") }}
                        </p>
                    </div>
                </div>
              </div>
              <div class="col-sm-3">
                <div class="card text-black  mb-3" style="max-width: 18rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Menos vendidos</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                    <span style="font-size: 1em; color: tomato;">
                                      <i class="fas fa-sort-numeric-down"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3" v-for="(item, index) in Min" :key="index">
                            {{ item.code }} - ${{ item.total.toLocaleString("es-ES") }}
                        </p>
                    </div>
                </div>

              </div>
              <div class="col-sm-3">
                <div class="card text-black  mb-3" style="max-width: 18rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Total de venta</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                    <span style="font-size: 1em; color: blue;">
                                      <i class="fas fa-hand-holding-usd"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3">{{ totalSales == NaN ? '' : totalSales }}</p>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="col-xl-12 col-xxl-7">
        <div class="card flex-fill w-100">
          <div class="card-header bg-dark text-white">
            <div class="float-end">
              <div class="row g-2">
                <div class="col-auto">
                  <select v-model="asesor" v-on:change="loadData()" class="form-select form-select-sm bg-light border-0">
                      <option value="">Seleccionar Asesor</option>
                      <option  v-for="(item, index) in asesores" :key="index" >{{ item.savedBy }}</option>
                  </select>
                </div>
              </div>
            </div>
            <h5 class="card-title mb-0">Producto - valor</h5>
          </div>
          <div class="card-body pt-2 pb-3">
              <figure class="highcharts-figure">
                <div id="graficabarras"></div>
              </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var Highcharts = require('highcharts')
export default {
  name: "OrdersMade",
  data() {
    return {
      asesor: "",
      Max: [],
      Min: [],
      asesores: [],
      totalSales: "",
      asesorAct: ""
    }
  },
  created() {
    this.loadAsesores()
  },
  methods: {
    async loadData(){
      const value = {
        asesor: this.asesor
      }
      try {
        if (this.asesor != '') {
          this.clear();
          const result = await this.axios.post("/postProduct",value);
          const total = await this.axios.post("/postTotalSale",value);
          let valor = total.data.data[0].cantidad;
          let asesor = total.data.data[0].savedBy;
          this.asesorAct = asesor
          this.totalSales = valor.toLocaleString("es-ES");
          this.Max = result.data.dataMax;
          this.Min = result.data.dataMin;
          this.grafica(result.data.data);
        }else{
          this.clear()
        }
      } catch (error) {
        console.log(error);
      }
    },
    async loadAsesores(){
      try {
        const result = await this.axios.get("/getAsesores");
        this.asesores = result.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    grafica (data) {
        let datos = [];
        data.forEach(element => {
            datos.push({
                name: element.code,
                data: [element.total]
            })    
        });

      const graficabar = document.getElementById('graficabarras');
      Highcharts.chart(graficabar, {
        chart: {
          type: 'column',
        },
        credits: {
          enabled: false
        },
        title: {
          text: '',
        },
        xAxis: {
          labels: {
            enabled: false
          }
        },
        yAxis: {
          title: {
            text: 'Cantidad',
          },
        },
        series: datos,
      })
    },
    clear(){
      this.Max = ''
      this.Min = ''
      this.totalSales = ''
      this.asesorAct = ''
      let data = []
      this.grafica(data)
    }
  },
};
</script>
<style  scoped>
@import "../assets/css/styles.css";
</style>