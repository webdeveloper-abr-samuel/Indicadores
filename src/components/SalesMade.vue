<template>
  <div class="container  mt-2 text-center">
    <h1 class="mb-5 main-title">Ventas Hechas</h1>
    <div class="row text-center mb-4">
      <div class="col-md-6">
        <div class="card text-black cardHigth mb-3">
            <div class="card-body">
              <div class="col-auto p-3 mt-1">
                  <h2 class="card-title">{{ actual }}</h2>
              </div>
            </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
              <h6 class="p-3">Seleccione Asesor</h6>
                <select v-model="asesor" v-on:change="loadData()" class="form-select form-select-sm bg-light border-0">
                    <option value="">Seleccionar Asesor</option>
                    <option  v-for="(item, index) in asesores" :key="index" >{{ item.savedBy }}</option>
                </select>
          </div>
        </div>
      </div>      
    </div>

    <div class="row m-0 justify-content-center align-items-center">
      <div class="col-xl-12">
        <div class="w-100">
          <div class="row">              
              <div class="col-sm-4">
                <div class="card text-black  mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Aprobadas</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                    <span style="font-size: 1em; color: green;">
                                      <i class="fas fa-check-circle"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3">{{ data.SI }}</p>
                    </div>
                </div>
              </div>              
              <div class="col-sm-4">
                <div class="card text-black  mb-3" >
                      <div class="card-body">
                          <div class="row">
                              <div class="col mt-0">
                                  <h6 class="card-title">No Aprobadas</h6>
                              </div>
                              <div class="col-auto">
                                  <div class="stat text-primary">
                                      <span style="font-size: 1em; color: tomato;">
                                        <i class="fas fa-times-circle"></i>
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <p class="mt-1 mb-3">{{ data.NO }}</p>
                      </div>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="card text-black  mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Total</h6>
                            </div>
                            <div class="col-auto">
                                <div class="stat text-primary">
                                    <span style="font-size: 1em; color: black;">
                                      <i class="fas fa-list-ol"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="mt-1 mb-3">{{ data.Cantidad }}</p>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="col-xl-12">
        <div class="card flex-fill w-100">
          <div class="card-header bg-dark text-white">
            <h5 class="card-title mb-0">Ventas - Asesor</h5>
          </div>
          <div class="card-body">
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
  name: "SalesMade",
  data() {
    return {
      asesor: "",
      actual: "",
      data: [],
      asesores: []
    }
  },
  created() {
    var f = new Date()    
    this.actual = f.toDateString()
    this.loadAsesores()
  },
  methods: {
    async loadData(){
      const value = {
        asesor: this.asesor
      }
      try {
        if (this.asesor != '') {
          this.clear()
          const result = await this.axios.post("/postSalesMade",value);
          this.data = result.data.data[0];
          this.grafica(result.data.data[0])
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
        this.asesor = result.data.data[0].savedBy;
        this.loadData();
      } catch (error) {
        console.log(error);
      }
    },
    grafica (data) {
      let aprovados = []
      let noaprovados = []
      aprovados.push(data.SI);
      noaprovados.push(data.NO);
      const graficabar = document.getElementById('graficabarras')

      Highcharts.setOptions({ colors: [ '#50B432', '#ED561B'] })

      Highcharts.chart(graficabar, {
        chart: {
          type: 'column',
        },
        responsive: {
          rules: [{
              condition: {
                  maxWidth: 500
              },
              chartOptions: {
                  legend: {
                      align: 'center',
                      verticalAlign: 'bottom',
                      layout: 'horizontal'
                  },
                  yAxis: {
                      labels: {
                          align: 'left',
                          x: 0,
                          y: -5
                      },
                      title: {
                          text: null
                      }
                  },
                  subtitle: {
                      text: null
                  },
                  credits: {
                      enabled: false
                  }
              }
          }]
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
        series: [
          {
            name: "Aprovados",
            data: aprovados,
          },
          {
            name: "No Aprovados",
            data: noaprovados,
          },
        ],
      })
    },
    clear(){
      this.data = ''
      let data = []
      this.grafica(data)
    }
  },
};
</script>
<style  scoped>
@import "../assets/css/styles.css";
</style>