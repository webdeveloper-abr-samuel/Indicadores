<template>
  <div class="container mt-2 text-center">
    <h1 class="mb-5 main-title">Producto Vendidos</h1>

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

    <div class="row  m-0 justify-content-center align-items-center">
      <div class="col-xl-12">
        <div class="w-100">
          <div class="row">
              <div class="col-sm-4">
                <div class="card text-black  mb-3" >
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
              <div class="col-sm-4">
                <div class="card text-black  mb-3">
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
              <div class="col-sm-4">
                <div class="card text-black  mb-3">
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
                        <p class="mt-1 mb-3" v-if="activate && totalSales != ''">{{ totalSales == NaN ? '' : totalSales }}</p>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div class="col-xl-12">
        <div class="card flex-fill w-100">
          <div class="card-header bg-dark text-white">
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
      actual: "",
      Max: [],
      Min: [],
      asesores: [],
      totalSales: "",
      asesorAct: "",
      activate: false
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
          this.clear();
          const result = await this.axios.post("/postProduct",value);
          const total = await this.axios.post("/postTotalSale",value);
          this.activate = true
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
        this.asesor = result.data.data[0].savedBy;
        this.loadData();
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

      Highcharts.setOptions({ colors: [ '#6495ED','#FF7F50', '#3CB371', '#FF0000', '#F4A460'] })

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