$(document).ready(function(){
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
                <a href="/filippi/Views/catalogo.php" class="nav-link">Inicio</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <!-- Notifications Dropdown Menu -->
            <li class="nav-item dropdown">
                <a class="nav-link" id="count-vehicles" data-toggle="dropdown" href="#">
                    <i class="far fa-bell"></i>
                    <span class="badge badge-danger navbar-badge product-quantity"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> vehículo(s) por vencer pagos</span>
                    <div id="notifications" class="list-group"></div>
                    <a href="#" class="dropdown-item dropdown-footer">Cerrar Notificaciones</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    <span></span>
                </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header"></span>
                    
                    <div class="dropdown-divider"></div>
                        <a href="/filippi/Controllers/Logout.php" class="dropdown-item text-center bg-danger">
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
                <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                </div>
                <div class="info">
                    <a href="/filippi/Views/catalogo.php" class="d-block">${usuario.nombre}</a>
                </div>+
        </div>
    <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                
                    <li class="nav-header">Usuario</li>
                    <li class="nav-item" id="gestion_usuario">
                        <a href="/filippi/Views/Gestion_usuario.php" class="nav-link">
                        <i class="nav-icon fas fa-tags fa-lg"></i>
                        <p>
                            Gestion Usuario
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>

                    <li class="nav-header">Datos</li>

                    <li class="nav-item">
                        <a href="/filippi/Views/catalogo.php" class="nav-link">
                        <i class="nav-icon fas fas fa-tractor"></i>
                        <p>
                            Vehiculos
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/personal.php" class="nav-link">
                        <i class="nav-icon fas fa-user-tie"></i>
                        <p>
                            Personal
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/atributo.php" class="nav-link">
                        <i class="nav-icon fas fa-building"></i>
                        <p>
                            Clientes y Proveedores
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/facturacion.php" class="nav-link">
                        <i class="nav-icon fas fa-file-invoice-dollar"></i>
                        <p>
                            Faturacion
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="/filippi/Views/controlSalida.php" class="nav-link">
                        <i class="nav-icon fas fa-parking"></i>
                        <p>
                            Patio
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
        let data = await fetch('/filippi/Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let repuesta = JSON.parse(response);
                if (repuesta.length !== 0) {
                    llenar_menu_superior(repuesta);
                    llenar_menu_lateral(repuesta);
                    $('#gestion_usuario').show()
                    $('#gestion_catalogo').show();
                    $('#gestion_ventas').show();
                    $('#gestion_lotes').show();
                    $('#gestion_pedidos').show();
                    $('.nav-header').show();
                    buscar_datos();
                } else {
                    location.href = "/filippi/";
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
    function buscar_datos(consulta){
        let funcion="buscar_usuarios_adm";
        $.post('/filippi/Controllers/UsuariosController.php',{consulta,funcion},(response)=>{
           const usuarios = JSON.parse(response);
           let template='';
           usuarios.forEach(usuario => {
                template+=`
                <div usuarioId="${usuario.id}" class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                    <div class="card bg-light d-flex flex-fill">
                        <div class="card-header text-muted border-bottom-0">`;
                            if(usuario.tipo_usuario==3){
                                template+=`<h1 class="badge badge-danger">${usuario.tipo}</h1>`;
                            }
                            if(usuario.tipo_usuario==2){
                                template+=`<h1 class="badge badge-warning">${usuario.tipo}</h1>`;
                            }
                            if(usuario.tipo_usuario==1){
                                template+=`<h1 class="badge badge-info">${usuario.tipo}</h1>`;
                            }
                            let telefono = ''
                            if(usuario.telefono== null || usuario.telefono== ''){
                                telefono= `<b class="badge badge-secondary">Sin telefono registrado</b>`;
                            }
                            else{
                                telefono= usuario.telefono;
                            }
                template+=`</div>
                        <div class="card-body pt-0">
                            <div class="row">
                                <div class="col-7">
                                    <h2 class="lead"><b>${usuario.nombre} ${usuario.apellido}</b></h2>
                                        <p class="text-muted text-sm"><b>Rol: </b> ${usuario.tipo} </p>
                                <ul class="ml-4 mb-0 fa-ul">
                                    <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-id-card"></i></span>  ${usuario.dni}</li>
                                    <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-at"></i></span> Correo: ${usuario.correo}</li>
                                    <li class="small m-1"><span class="fa-li"><i class="fas fa-lg fa-phone"></i></span> Phone #: ${telefono}</li>
                                </ul>
                                </div>
                                    <div class="col-5 text-center">
                                    <img src="${usuario.avatar}" alt="user-avatar" class="img-circle img-fluid">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">`;
                        if(usuario.tipo_usuario==1){
                            if(usuario.tipo_usuario!==1){
                                template+=`
                                        <button class="borrar-usuario btn btn-danger" type="button" data-toggle="modal" data-target="#confirmar">Eliminar</button>
                                `;
                            }
                            // if(usuario.tipo_usuario===2){
                            //     template+=`
                            //         <button class="ascender btn btn-primary" type="button" data-toggle="modal" data-target="#confirmar"><i class="fas fa-sort-amount-up mr-1"></i>Ascender</button>
                            //     `;
                            // }
                            // if(usuario.tipo_usuario===2){
                            //     template+=`
                            //     <button class="descender btn btn-secondary" type="button" data-toggle="modal" data-target="#confirmar"><i class="fas fa-sort-amount-down mr-1"></i>Descender</button>
                            //     `;
                            // }
                        }
                        else{
                            if(usuario.tipo_usuario===2 && usuario.tipo_usuario!=1){
                                template+=`
                                        <button class="borrar-usuario btn btn-danger" type="button" data-toggle="modal" data-target="#confirmar">Eliminar</button>
                                `;
                            }

                        }
                        template+= `
                        </div>
                    </div>
                </div>
                `;
           });
           $('#usuarios').html(template);
        })
    }
    $(document).on('keyup', '#buscar',function(){
        let valor = $(this).val();
        if(valor!=""){
            buscar_datos(valor)
        }
        else{
            buscar_datos()
        }
    })
    $('#form-crear').submit( (e) =>{
        let id = $('#id_edit_prod').val();
        let nombre = $('#nombre').val();
        let apellido = $('#apellido').val();
        let correo = $('#correo').val();
        let telefono = $('#telefono').val();
        let dni = $('#dni').val();
        let pass = $('#pass').val();
        let funcion="crear_usuario";
        $.post('/filippi/Controllers/UsuariosController.php',{ funcion,id,nombre,apellido,correo,telefono,dni,pass },(response)=>{
            if (response=='add'){
                    toastr.success('Usuario '+nombre+ ' con dni #'+dni+' es un nuevo vendedor', 'Añadido!');
                    $('#form-crear').trigger('reset');
            }
            if(response=='noadd'){
                    toastr.error('El usuario no se pudo añadir o ya fue agregado', 'Error!');
                    $('#form-crear').trigger('reset');
            }
            e.preventDefault()
        });
    });
    // $(document).on('click','.ascender',(e)=>{
    //     const elemento= $(this)[0].activeElement.parentElement.parentElement.parentElement;
    //     const id=$(elemento).attr('usuarioId');
    //     funcion="ascender";

    //     $('#id_user').val(id);
    //     $('#funcion').val(funcion);

    // });
    // $(document).on('click','.descender',(e)=>{
    //     const elemento= $(this)[0].activeElement.parentElement.parentElement.parentElement;
    //     const id=$(elemento).attr('usuarioId');
    //     funcion="descender";
        
    //     $('#id_user').val(id);
    //     $('#funcion').val(funcion);

    // });
    $(document).on('click','.borrar-usuario',(e)=>{
        const elemento= $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('usuarioId');
        let funcion= "borrar_usuario";
        
        $('#id_user').val(id);
        $('#funcion').val(funcion);
        e.preventDefault()
    });
    $('#form-confirmar').submit((e)=>{
        let pass = $('#oldpass').val();
        let id_usuario = $('#id_user').val();
        let funcion = $('#funcion').val();
        $.post('/filippi/Controllers/UsuariosController.php',{pass,id_usuario,funcion},(response)=>{
            if(response == 'borrado'){
                toastr.success('Usuario fue borrado', 'Exito!');
                $('#form-confirmar').trigger('reset');
            }
            else{
                toastr.error('Contraseña incorrecta', 'Error!');
                $('#form-confirmar').trigger('reset');
            }
            e.preventDefault()
        })
    })
})
