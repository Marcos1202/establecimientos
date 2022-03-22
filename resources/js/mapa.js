import {OpenStreetMapProvider} from 'leaflet-geosearch';
const provider = new OpenStreetMapProvider();

document.addEventListener('DOMContentLoaded', () => {

    if(document.querySelector('#mapa')){

        const lat = document.querySelector('#lat').value === '' ? 19.7006 : document.querySelector('#lat').value;
        const lng = document.querySelector('#lng').value === '' ? -101.186: document.querySelector('#lng').value;
        
        const mapa = L.map('mapa').setView([lat, lng], 16);

        //Eliminar pines previos
        let markers = new L.FeatureGroup().addTo(mapa)

        //Buscador
        const buscadoir = document.querySelector('#formbuscador');
        buscadoir.addEventListener('blur', buscarDireccion);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);
        
        let marker;
        
        // agregar el pin
        marker = new L.marker([lat, lng],{
           draggable:true,
           autoPan:true 
        }).addTo(mapa);

        //Agregar pin  a las capas
        markers.addLayer(marker)
        
        const geocoderService =  L.esri.Geocoding.geocodeService({
            apikey:'AAPK47a7cca701534a5698b1c870f584430dn-PMJ9LQjSeMlF-iP_7SWGFl2oX-XL2QXVBg-1kNrJNZ-E4Z2WPH4oI17jMfIu-L'
        });

        reubicarpin(marker)

        function reubicarpin(marker){
            //Detectar movimiento del marker
            marker.on('moveend', function(e){
                marker = e.target;
                const posicion = marker.getLatLng();
                
                //Centrar automaticamente
                mapa.panTo( new L.LatLng(posicion.lat, posicion.lng));

                //Reverse Geocoding cuando el usuario reubica el pin
                geocoderService.reverse().latlng(posicion,16).run(function(error, resultado){
                    //console.log(error)
                    //console.log(resultado.address)
                    marker.bindPopup(resultado.address.LongLabel);
                    marker.openPopup();

                    //lenar campos
                    llenar_inputs(resultado);
                })

            });
        }

        function buscarDireccion(e){
           
            if(e.target.value.length > 8){
                provider.search({query: e.target.value + ' Morelia'})
                    .then( resultado => {
                        if(resultado[0]){

                            //Limpiar los pines previos
                            markers.clearLayers();
                            
                            //Reverse Geocoding cuando el usuario reubica el pin
                            geocoderService.reverse().latlng(resultado[0].bounds[0],16).run(function(error, resultado){
                
                                //llenar campos
                                llenar_inputs(resultado);

                                //Centrar el mapa
                                mapa.setView(resultado.latlng)

                                //Agregar el pin
                                marker = new L.marker(resultado.latlng,{
                                    draggable:true,
                                    autoPan:true 
                                }).addTo(mapa);
                                
                                //Asigar al contenedor el nuevo pin
                                markers.addLayer(marker)
                                

                                marker.bindPopup(resultado.address.LongLabel);
                                marker.openPopup();
                                //Mover el pin
                                reubicarpin(marker)
                                
                            });
                        }else{
                            console.log("Sin resultados")
                        }
                    }).catch( error => {
                        console.log(error)
                });
            }
        }

        function llenar_inputs(resultado){
            document.querySelector('#direccion').value = resultado.address.Address || '';
            document.querySelector('#colonia').value = resultado.address.Neighborhood || '';
            document.querySelector('#lat').value = resultado.latlng.lat || '';
            document.querySelector('#lng').value = resultado.latlng.lng || '';
            
        }
    }
});