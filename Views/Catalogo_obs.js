$(document).ready(function(){
    $('#cat-carrito').show();
    mostrar_lotes_riesgo();
    buscar_productos();
    function buscar_productos(consulta){
        funcion="buscar";
        $.post('../controladores/ProductoController.php',{consulta,funcion},(response)=>{
            const productos = JSON.parse(response);
            let template= '';
            productos.forEach(producto => {
                template+=`
                <div prodId="${producto.id}" prodStock=${producto.stock} prodNombre="${producto.nombre}"prodPrecio="${producto.precio}"prodDescripcion="${producto.descripcion}"prodCodigo="${producto.codigo}"prodProveedor="${producto.proveedor_id}"prodPresentacion="${producto.presentacion_id}"prodTipo="${producto.tipo_id}"prodAvatar="${producto.avatar}" class="cambiar-avat col-12 col-sm-6 col-md-4 d-flex align-items-stretch">
                    <div class="card bg-light">
                        <div class="card-header text-muted border-bottom-0">
                            <i class="fas fa-lg fa-cubes mr-1"></i>${producto.stock}
                        </div>
                        <div class="card-body pt-0 m-2">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>Codigo: ${producto.id}</b></h2>
                                    <h2 class="lead"><b>${producto.nombre}</b></h2>
                                    <h4 class="lead"><b>$${producto.precio}</b></h4>
                                    <ul class="ml-4 mb-0 fa-ul text-muted">
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-truck"></i></i></span>Proveedor: ${producto.proveedor}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-circle-info"></i></span>Detalle: ${producto.descripcion}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-code"></i></span>Codigo: ${producto.codigo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-box"></i></span>Tipo: ${producto.tipo}</li>
                                        <li class="small"><span class="fa-li"><i class="fa-solid fa-hands-holding"></i></span>Presentacion: ${producto.presentacion}</li>
                                    </ul>
                                </div>
                                <div class="col-5 text-center">
                                    <img src="${producto.avatar}" alt="" class="img-fluid redounded">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                                <button class="agregar-carrito btn btn-sm btn-primary"><i class="fas fa-plus-square mr-2"></i>Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
                `;
            })
            $('#productos').html(template);
        });
    }
    $(document).on('keyup', '#buscar-producto', function(){
        let valor = $(this).val();
        if(valor!=""){
            buscar_productos(valor);
        }
        else{
            buscar_productos();
        }
    });
    function mostrar_lotes_riesgo(){
        funcion="buscar";
        $.post('../controladores/LoteController.php',{funcion},(response)=>{
            const lotes = JSON.parse(response);
            let template='';
            lotes.forEach(lote => {
                if(lote.estado=='warning'){
                    template+=`
                    <tr class="table-warning">
                        <td>${lote.codigo}</td>
                        <td>${lote.nombre}</td>
                        <td>${lote.stock}</td>
                        <td>${lote.proveedor}</td>
                        <td>${lote.presentacion}</td>
                        <td>${lote.descripcion}</td>
                    </tr>
                `;
                }
                if(lote.estado=='danger'){
                    template+=`
                    <tr class="table-danger">
                        <td>${lote.codigo}</td>
                        <td>${lote.nombre}</td>
                        <td>${lote.stock}</td>
                        <td>${lote.proveedor}</td>
                        <td>${lote.presentacion}</td>
                        <td>${lote.descripcion}</td>
                    </tr>
                `;
                }
                
            });
            $('#lotes').html(template);
        })
    }
    
})