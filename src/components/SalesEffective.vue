<template>
  <div class="container mt-2 text-center">
    <h1 class="mb-4 main-title">Ventas Efectivas</h1>

    <div class="row d-flex justify-content-center mb-4">                  
      <div class="col-3">
        <input type="number" v-on:change="loadData()" v-model="date" class="form-control" placeholder="Escribir Año. Ej: 2020"/>
      </div>
      <div class="col-3">
        <select v-model="asesor" v-on:change="loadData()" class="form-control">
            <option value="">Seleccionar Asesor</option>
            <option  v-for="(item, index) in asesores" :key="index" >{{ item.savedBy }}</option>
        </select>
      </div>
    </div>

    <div class="row ">
      <div class="col-xl-12 col-xxl-5 ">
        <div class="w-100 ">
          <div class="row d-flex justify-content-center">
            <div class="col-sm-3 mb-3" v-for="(item, index) in datos" :key="index" >
              <div class="card text-black" style="max-width: 100%">
                  <div class="card-body">
                      <div class="row">
                          <div class="col mt-0">
                              <h6 class="card-title">{{ item.name }}</h6>
                          </div>
                      </div>
                        <p  class="text-center" >                              
                          {{ item.porcentaje }}%
                        </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>

    <div class="row d-flex justify-content-center">
      <div class="col-sm-12">
        <figure class="highcharts-figure">
          <div id="graficabarras"></div>
        </figure>
      </div>
    </div>
  </div>
</template>
<script>
var Highcharts = require('highcharts')
export default {
  name: "BusinessVisited",
  data() {
    return {
      asesor: "",
      date: "",
      datos: [],
      asesores: [],
      actived: false
    }
  },
  created() {
    this.loadAsesores()
  },
  methods: {
    async loadData(){
      const value = {
        asesor: this.asesor,
        date: this.date
      }
      try {
        if (this.asesor != '' && this.date != '') {
          this.clear();
          const result = await this.axios.post("/postSalesEffective",value);
          this.datos = result.data.datas
          this.grafica(result.data.datas);
          this.actived = true;
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
            name: element.name,
            y: parseFloat(element.porcentaje)
        })    
      });

      const graficabar = document.getElementById('graficabarras');
      Highcharts.chart(graficabar, {
        chart: {
          type: 'column',
          spacingBottom: 5
        },
        credits: {
          enabled: false
        },
        title: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total Porcentajes'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [{
          name: 'Efectividad del ',
          colorByPoint: true,
          data : datos
        }]
      })
    },
    clear(){
      let data = []
      this.grafica(data)
    },
  },
};
</script>
<style  scoped>
.list-group-item{
  border: none
}

.page-item.active .page-link {
  color: black;
  background-color: white;
  border-color: black
  
}

.page-link {
  color: black
}

.darkmode .pagination a {
 color: black
}

@import "../assets/css/styles.css";
</style>