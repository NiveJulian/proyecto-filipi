$(document).ready(function(){
        Loader('Cargando Productos');
        verificar_sesion();
        toastr.options={
            "preventDuplicates":true
        }
        function llenar_menu_superior(usuario){
            let template = `
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                <a href="/gasolero/Views/catalogo.php" class="nav-link">Inicio</a>
                </li>
                <li class="nav-item d-none d-sm-inline-block">
                <a href="#" class="nav-link">Contacto</a>
                </li>
                <li class="nav-item dropdown" id="cat-carrito" style="display:none;" role="button">
                        <img src="/gasolero/Util/img/carrito.png" class="imagen-carrito nav-link">
                        <span id="contador" class="contador badge badge-danger"></span>
                        </img>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <!-- Notifications Dropdown Menu -->
                
                <li class="nav-item dropdown">
                    <a class="nav-link" data-toggle="dropdown" href="#">
                        <img src="/gasolero/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                        <span>${usuario.nombre}</span>
                    </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <span class="dropdown-item dropdown-header"></span>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                            <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Perfil</a>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                            <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>Configuracion</a>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-divider"></div>
                            <a href="/gasolero/Controllers/Logout.php" class="dropdown-item text-center bg-danger">
                                <i class="fas fa-power-off mr-2"></i>Cerrar Sesion</a>
                        <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item dropdown-footer"></a>
                </div>
                </li>
            </ul>
            `;
            $('#menu_superior').html(template);
        }
        function llenar_menu_lateral(usuario){
            let template = `
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                    <img src="/gasolero/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    </div>
                    <div class="info">
                        <a href="/gasolero/Views/catalogo.php" class="d-block">${usuario.nombre+' '+usuario.apellido}</a>
                    </div>
            </div>
          <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                    
                    <li class="nav-header">Catalogo</li>
                    <li class="nav-item" id="gestion_cliente">
                        <a href="/gasolero/Views/catalogo.php" class="nav-link">
                        <i class="nav-icon fas fa-shopping-cart fa-lg"></i>
                        <p>
                            Catalogo
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-header">Ventas</li>
                    <li class="nav-item" id="gestion_cliente">
                        <a href="/gasolero/Views/mis_ventas.php" class="nav-link">
                        <i class="nav-icon fas fa-list-ul fa-lg"></i>
                        <p>
                            Ventas
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item" id="gestion_cliente">
                        <a href="/gasolero/Views/lote.php" class="nav-link">
                        <i class="nav-icon fas fa-tags fa-lg"></i>
                        <p>
                            Inventario
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>
                    </ul>
                </nav>
            `;
            $('#menu_lateral').html(template);
        }
        async function verificar_sesion(){
            let funcion = "verificar_sesion";
            let data = await fetch('/gasolero/Controllers/UsuariosController.php',{
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'funcion='+funcion
            })
            if(data.ok){
                let response= await data.text();
                try {
                    let repuesta = JSON.parse(response);
                    if (repuesta.length!=0) {
                        llenar_menu_lateral(repuesta);
                        llenar_menu_superior(repuesta);
                        CloseLoader();
                    }
                    else{
                        location.href = "/gasolero/";
                    }
                } catch (error) {
                    console.error(error);
                    console.log(response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'hubo conflicto en el sistema, pongase en contacto con el administrador'
                    })
                }
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: data.statusText,
                    text: 'hubo conflicto de codigo: '+data.status
                })
            }
            
        }
        // async function obtener_productos(){
        //     let funcion = "obtener_productos";
        //     let data = await fetch('/gasolero/Controllers/ProductoController.php',{
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //         body: 'funcion=' + funcion
        //     })
        //     if(data.ok){
        //         let response= await data.text();
        //         try {
        //             let producto = JSON.parse(response);
        //             $('#productos').DataTable({
        //                 "data": producto,
        //                 "aaSorting": [],
        //                 "searching": true,
        //                 "scrollX": false,
        //                 "autoWidth":false,
        //                 paging:false,
        //                 bInfo:false,
        //                 columns:[
        //                     {
        //                 "render": function(data,type,datos,meta){
        //                     let stock = '';
        //                     if (datos.stock==null || datos.stock==0) {
        //                         stock = 'Sin stock'
        //                     } else {
        //                         stock = datos.stock;
        //                     }
        //                     return  `
        //                     <div class="card-catalogo">
        //                         <div class="card bg-light">
        //                             <div class="card-header text-muted border-bottom-0">
        //                                 <h4><i class="fas fa-lg fa-cubes mr-1"></i>${stock}</h4>
        //                             </div>
        //                             <div class="card-body pt-0 m-2">
        //                                 <div class="row">
        //                                     <div class="col-md-6">
        //                                         <h3 class=""><b>${datos.nombre}</b></h3>
        //                                         <h4 class=""><b>$${datos.precio}</b></h4>
        //                                         <ul class="ml-4 mb-0 fa-ul text-muted">
        //                                             <li class="h8"><span class="fa-li"><i class="fas fa-code"></i></span>Codigo: ${datos.codigo}</li>
        //                                         </ul>
        //                                     </div>
        //                                     <div class="col-md-6 text-center">
        //                                         <img src="/gasolero/Util/img/productos/${datos.avatar}" width="250px" alt="" class="img-fluid redounded">
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                             <div class="card-footer text-center">
        //                                     <button id="${datos.id}" 
        //                                             codigo="${datos.codigo}"
        //                                             nombre="${datos.nombre}"
        //                                             precio="${datos.precio}"
        //                                             stock="${datos.stock}"
        //                                             class="agregar-carrito p-2 btn btn-sm btn-primary">
        //                                             Agregar al carrito</button>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 `}
        //                 }
        //             ],
        //             "language": espanol,
        //             "destroy": true
        //             })
        //         } catch (error) {
        //             console.error(error);
        //             console.log(response);
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'Error',
        //                 text: 'hubo conflicto en el sistema, pongase en contacto con el administrador'
        //             })
        //         }
        //     }
        //     else{
        //         Swal.fire({
        //             icon: 'error',
        //             title: data.statusText,
        //             text: 'hubo conflicto2 de codigo: '+data.status
        //         })
        //     }
            
        // }
       
        function Loader(mensaje){
            if (mensaje==''|| mensaje==null) {
                mensaje="Cargando datos...";
            }
            Swal.fire({
                position: 'center',
                html:'<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
                title: mensaje,
                showConfirmButton: false,
            })
        }
        function CloseLoader(mensaje,tipo){
            if (mensaje==''||mensaje==null) {
                Swal.close();
            }
            else{
                Swal.fire({
                    position: 'center',
                    icon: tipo,
                    title: mensaje,
                    showConfirmButton: false,
                })
            }
        }
    })
    let espanol = {
        "processing": "Procesando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "search": "Buscar:",
        "infoThousands": ",",
        "loadingRecords": "Cargando...",
        "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        "aria": {
            "sortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        "buttons": {
            "copy": "Copiar",
            "colvis": "Visibilidad",
            "collection": "Colección",
            "colvisRestore": "Restaurar visibilidad",
            "copyKeys": "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
            "copySuccess": {
                "1": "Copiada 1 fila al portapapeles",
                "_": "Copiadas %ds fila al portapapeles"
            },
            "copyTitle": "Copiar al portapapeles",
            "csv": "CSV",
            "excel": "Excel",
            "pageLength": {
                "-1": "Mostrar todas las filas",
                "_": "Mostrar %d filas"
            },
            "pdf": "PDF",
            "print": "Imprimir",
            "renameState": "Cambiar nombre",
            "updateState": "Actualizar",
            "createState": "Crear Estado",
            "removeAllStates": "Remover Estados",
            "removeState": "Remover",
            "savedStates": "Estados Guardados",
            "stateRestore": "Estado %d"
        }
    };

    // var funcion= '';
    // buscar_lote();
    // var edit=false;
    
    // function buscar_lote(consulta){
    //     funcion="buscar";
    //     $.post('../controladores/LoteController.php',{consulta,funcion},(response)=>{
    //         const lotes = JSON.parse(response);
    //         let template= '';
    //         lotes.forEach(lote => {
    //             template+=`
    //             <div prodId="${lote.id}" prodNombre="${lote.nombre}"prodRecibido="${lote.recibido}"prodStock="${lote.stock}" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch">`;
    //             if(lote.estado=='light'){
    //                 template+=`<div class="card bg-light">`;
    //             }
    //             if(lote.estado=='warning'){
    //                 template+=`<div class="card bg-warning">`;
    //             }
    //             if(lote.estado=='danger'){
    //                 template+=`<div class="card bg-danger">`;
    //             }
    //             template+= `<div class="card-header border-bottom-0">
    //                         <i class="fas fa-lg fa-cubes mr-1"></i>${lote.stock}
    //                     </div>
    //                     <div class="card-body pt-0 m-2">
    //                         <div class="row">
    //                             <div class="col-7">
    //                                 <h2 class="lead"><b>${lote.nombre}</b></h2>
    //                                 <ul class="ml-4 mb-0 fa-ul">
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-truck"></i></i></span>Proveedor: ${lote.proveedor}</li>
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-circle-info"></i></span>Detalle: ${lote.descripcion}</li>
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-code"></i></span>Codigo: ${lote.codigo}</li>
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-box"></i></span>Tipo: ${lote.tipo}</li>
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-calendar-alt"></i></span>Recibido: ${lote.recibido}</li>
    //                                     <li class="small"><span class="fa-li"><i class="fa-solid fa-hands-holding"></i></span>Presentacion: ${lote.presentacion}</li>
    //                                 </ul>
    //                             </div>
    //                             <div class="col-5 text-center">
    //                                 <img src="${lote.avatar}" alt="" class="img-fluid redounded">
    //                             </div>
    //                         </div>
    //                     </div>
    //                         <div class="card-footer text-center">
                                    


    //                                 <button class="borrar btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //             `;
    //         })
    //         $('#lote').html(template);
    //     });
    // }
    // $(document).on('keyup', '#buscar-lote', function(){
    //     let valor = $(this).val();
    //     if(valor!=""){
    //         buscar_lote(valor);
    //     }
    //     else{
    //         buscar_lote();
    //     }
    // });
    // // $(document).on('click', '.editar', (e)=>{ //ARREGLAR
    // //     const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
    // //     const id_producto = $(elemento).attr('prodId');
    // //     const stock = $(elemento).attr('prodNombre');
    // //     const proveedor = $(elemento).attr('prodProveedor');
    // //     const recibido = $(elemento).attr('prodRecibido');

    // //     $('#id_edit_prod').val(id_producto);
    // //     $('#lote-proveedor').val(proveedor).trigger('change');
    // //     $('#recibido').val(recibido).trigger('change');
    // //     $('#stock').val(stock);
    // //     edit=true;
    // // });
    // $(document).on('click', '.borrar', (e)=>{
    //     funcion = "borrar";
    //     const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
    //     const id = $(elemento).attr('prodId');

    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //           confirmButton: 'btn btn-success',
    //           cancelButton: 'btn btn-danger mr-2'
    //         },
    //         buttonsStyling: false
    //       })
          
    //       swalWithBootstrapButtons.fire({
    //         title: 'Estas seguro?',
    //         text: "No vas a ver mas este lote!",
    //         imageWidth: 100,
    //         imageHeight: 100,
    //         showCancelButton: true,
    //         confirmButtonText: 'Si, Borralo porfa!',
    //         cancelButtonText: 'No, Cancela!',
    //         reverseButtons: true
    //       }).then((result) => {
    //         if (result.value) {
    //             $.post('../controladores/LoteController.php',{id,funcion}, (response)=>{
    //                 if(response=='borrado'){
    //                     swalWithBootstrapButtons.fire(
    //                         'Borrado!',
    //                         'El lote fue borrado.',
    //                         'success'
    //                     )
    //                     buscar_lote();
    //                 }
    //                 else{
    //                     swalWithBootstrapButtons.fire(
    //                         'No se pudo borrar!',
    //                         'El lote no fue borrado.',
    //                         'error'
    //                     )
    //                 }
    //             })
    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //           swalWithBootstrapButtons.fire(
    //             'Cancelado',
    //             'Tu lote esta a salvo :)',
    //             'error'
    //           )
    //         }
    //       })
    //       e.preventDefault();
    // });
    
// })