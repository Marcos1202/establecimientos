<template>
    <div class="container my-5">
        <h2>Restaurantes</h2>
        <div class="row">
            <div class="col-md-4 mt-4" v-for="restaurante in this.restaurantes" v-bind:key="restaurante.id">
                <div class="card">
                    <div class="card-body">
                        <img :src="`storage/${restaurante.imagen_principal}`" alt="Card del restaurante" class="card-img-top">
                        <h3 class="card-title text-primary font-weight-bold">
                            {{restaurante.nombre}}
                        </h3>
                        <p class="card-text">{{restaurante.direccion}}</p>
                        <p class="card-text">
                            <span class="font-weight-bold">
                                Horario: 
                            </span>
                            {{restaurante.apertura}}-
                            {{restaurante.cierre}}
                        </p>
                        <router-link :to="{name:'establecimiento',params:{id:restaurante.id}}">
                            <a  class="btn btn-primary d-block">Ver lugar</a>
                        </router-link>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
  
    mounted() {
        axios.get('/api/categoria/restaurante')
            .then(respuesta => {
                this.$store.commit("AGREGAR_RESTAURANTES", respuesta.data )
            })
    },
     computed:{
        restaurantes(){
            return this.$store.state.restaurantes
        }
    }
}
</script>