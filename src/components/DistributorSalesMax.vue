<template>
  <div class="container mt-2 text-center">
    <h1 class="mb-5 main-title">Distribuidores con mayor compra</h1>
    <div class="row">
      <div class="col-xl-4 col-xxl-5">
        <div class="w-100">
          <div class="row">
              <div class="col-sm-12">
                <figure class="highcharts-figure">
                  <div id="graficapie"></div>
                </figure>
              </div>
              <div class="col-sm-12">
                <div class="card text-black  mb-3" style="max-width: 25rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Distribuidor con mayor compra</h6>
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
                            {{ item.distribuidor }} - ${{ item.valorPedido.toLocaleString("es-ES") }}
                        </p>
                    </div>
                </div>
              </div>
              <div class="col-sm-12">
                <div class="card text-black  mb-3" style="max-width: 25rem">
                    <div class="card-body">
                        <div class="row">
                            <div class="col mt-0">
                                <h6 class="card-title">Distribuidor con menor compra</h6>
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
                            {{ item.distribuidor }} - ${{ item.valorPedido.toLocaleString("es-ES") }}
                        </p>
                    </div>
                </div>
              </div>
              
          </div>
        </div>
      </div>
      <div class="col-xl-8 col-xxl-7 mt-3">
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
            <h5 class="card-title mb-0">Distribuidor - valor</h5>
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
          const result = await this.axios.post("/postDistri",value);
          this.Max = result.data.dataMax;
          this.Min = result.data.dataMin;
          this.grafica(result.data.data);
          this.graficaPie()
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
                name: element.distribuidor,
                data: [element.valorPedido]
            })    
        });

      const graficabar = document.getElementById('graficabarras');
      Highcharts.chart(graficabar, {
        chart: {
          type: 'column',
          width: 700
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
    graficaPie () {
      const datos = this.Max.concat(this.Min);

      let datas = []
      datos.forEach(el => {
        datas.push([el.distribuidor,el.valorPedido])
      })

      const graficapie = document.getElementById('graficapie');
      Highcharts.chart(graficapie, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: 285
        },  
        credits: {
          enabled: false
        },
         title: {
          text: '',
        },
        plotOptions: {
          pie: {
            dataLabels: {
                enabled: true,
                distance: -30,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '78%'],
            size: '120%'
          }
        },
        series: [{
            type: 'pie',
            name: 'Compra por',
            innerSize: '50%',
            data: datas
        }]
      })
    },
    clear(){
      this.Max = ''
      this.Min = ''
      let data = []
      this.grafica(data)
    }
  },
};
</script>
<style  scoped>
@import "../assets/css/styles.css";
</style>