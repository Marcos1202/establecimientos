<?php

namespace App\Http\Controllers;

use App\Imagen;
use App\Establecimiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;

class ImagenController extends Controller
{
    public function store(Request $request){
        
        //leer la imagen
        $ruta_imagen = $request->file('file')->store('establecimientos', 'public');
        
        //Resize a la imagen
        $imagen = Image::make(public_path("storage/{$ruta_imagen}"))->fit(800, 450);
        $imagen->save();

        //Almacenar con modelo
        $imagenDB = new Imagen;
        $imagenDB->id_establecimiento = $request['uuid'];
        $imagenDB->ruta_imagen = $ruta_imagen;
        $imagenDB->save();

        $respuesta = [
            'archivo' => $ruta_imagen
        ];

        return response()->json($respuesta);

    }
    //Elimina una imagen de la base de datos y del servidor
    public function destroy(Request $request){
        
        
        // Validación
        $uuid = $request->get('uuid');

        $establecimiento = Establecimiento::where('uuid', $uuid)->first();
        $this->authorize('delete', $establecimiento);


        $imagen = $request->get('imagen');
        
        if(File::exists('storage/'.$imagen)){
            //Eliminar imagen del servidor
            File::delete('storage/'.$imagen);

            //Elimina imagen de la base de datos
            Imagen::where('ruta_imagen', $imagen)->delete();

            $respuesta = [
                'mensaje' => 'Imagen Eliminada',
                'imagen_eliminar' => $imagen,
            ];
        }
        

    

        return response()->json($respuesta);
    }
        
}
