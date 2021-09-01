<template>
  <div class="container mt-2 text-center">
    <h1 class="mb-4 main-title">Negocios Visitados</h1>
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

    <div class="col-xl-12 col-xxl-7">
        <div class="card flex-fill w-100">
          <div class="d-flex justify-content-center mt-5 mb-5" v-if="spinner">
            <div class="sk-chase">
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
            </div>
          </div>

          <div class="table-responsive" v-if="actived">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Barrio</th>
                  <th scope="col">Visitas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in datosPaginados" :key="index">
                  <td>
                    {{ item.barrio }} 
                  </td>
                  <td>
                    <div class="progress">
                      <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" role="progressbar" v-bind:style="{'width' : item.visita+'%'}" aria-valuenow="25" aria-valuemin="0" :aria-valuemax="visted">{{ item.visita.toLocaleString("es-ES") }}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <nav class="text-black" aria-label="Page navigation example">
              <ul class="pagination justify-content-center">
                <li class="page-item" v-on:click="getPreviousPage()">
                  <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                <li class="page-item" v-for="(paginas, index) in totalPaginas()" :key="index" v-on:click="getDataPagina(paginas)" v-bind:class="isActive(paginas)">
                  <a class="page-link" href="#">{{paginas}}</a>
                </li>
                <li class="page-item" v-on:click="getNextPage()">
                  <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>      
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BusinessVisited",
  data() {
    return {
      asesor: "",
      actual: "",
      datos: [],
      asesores: [],
      elementos : 15,
      paginaActual: 1,
      datosPaginados: [],
      actived: false,
      visted : "",
      spinner: false
    }
  },
  created() {
    var f = new Date()    
    this.actual = f.toDateString()
    this.loadAsesores();
  },
  methods: {
    async loadData(){
      const value = {
        asesor: this.asesor
      }
      try {
        if (this.asesor != '') {
          this.clear();
          this.spinner = true;  
          this.actived = false;       
          const result = await this.axios.post("/postVisit",value);
          this.datos = result.data.data;
          this.visted = result.data.visited[0].barrio
          this.spinner = false;
          this.actived = true
          this.getDataPagina(1)
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
    clear(){
      this.Max = ''
      this.Min = ''
      this.datosPaginados = []
    },
    totalPaginas(){
      return Math.ceil(this.datos.length / this.elementos)
    },
    getDataPagina(noPagina){
      this.paginaActual = noPagina
      this.datosPaginados = [];
      let ini = (noPagina * this.elementos) - this.elementos;
      let fin = (noPagina * this.elementos);

      this.datosPaginados = this.datos.slice(ini,fin)
    },
    getPreviousPage(){
      if (this.paginaActual > 1) {
        this.paginaActual--;
      }
      this.getDataPagina(this.paginaActual)
    },
    getNextPage(){
      if (this.paginaActual < this.totalPaginas()) {
        this.paginaActual++;
      }
      this.getDataPagina(this.paginaActual)
    },
    isActive(noPagina){
      return noPagina == this.paginaActual ? 'active' : ''
    }
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