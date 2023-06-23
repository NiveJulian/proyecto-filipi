$(document).ready(function(){

    Loader('Cargando ventas');
    verificar_sesion();
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
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">1</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header">1 Notifications</span>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                <i class="fas fa-file mr-2"></i> 3 new reports
                <span class="float-right text-muted text-sm">2 days</span>
                </a>
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
            </div>
            </li>
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
                    <a href="#" class="d-block">${usuario.nombre+' '+usuario.apellido}</a>
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
                    obtener_ventas();
                    CloseLoader();
                }
                else{
                    location.href = "/gasolero/mis_ventas.php";
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
    async function obtener_ventas(){
        let funcion = "obtener_ventas";
        let data = await fetch('/gasolero/Controllers/ventaController.php',{
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: "funcion=" + funcion
        })
        if(data.ok){
            let response = await data.text();
            try {
                let ventas = JSON.parse(response);
                console.log(ventas)
                $('#listar_ventas').DataTable({
                    "data": ventas,
                    "aaSorting": [],
                    "searching": true,
                    "scrollX": true,
                    "autoWidth":false,
                    paging:false,
                    columns:[
                        {
                        "render": function(data,type,datos,meta){
                            let template= `
                                <div class="card bg-ligth">
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-md-10 p-1 m-1">
                                                <ul class="col-ml-4 m-2 fa-ul text-center">
                                                    <li class="small"><span class="fa-li"><i class="fas fa-barcode"></i></i></span>N° Venta: ${datos.id_venta}</li>
                                                    <li class="small"><span class="fa-li"><i class="fas fa-calendar"></i></span>Fecha: ${datos.fecha}</li>
                                                    <li class="small"><span class="fa-li"><i class="fas fa-user-alt"></i></i></span>Cliente: ${datos.cliente}</li>
                                                    <li class="small"><span class="fa-li"><i class="fas fa-dollar-sign"></i></span>Precio: ${datos.total}</li>
                                                </ul>
                                            </div>
                                            <div class="col-md-2 text-center">
                                                <button id="button_ver" class="ver btn bg-success" type="button" data-toggle="modal" data-target="#vista_venta"><i class="fas fa-search"></i></button>
                                                <button id="button_borrar" class="borrar btn bg-danger"><i class="fas fa-window-close"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        `;
                        return template;
                    }}
                ],
                    "destroy": true,
                    "language": espanol
                })
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
                text: 'hubo conflicto2 de codigo: '+data.status
            })
        }
        
    }
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
    "lengthMenu": "M    ostrar _MENU_ registros",
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