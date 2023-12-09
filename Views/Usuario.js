$(document).ready(function(){
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
    let edit = false;
    function llenar_menu_superior(usuario){
        let template = `
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="/filippi/Views/catalogo.php" class="nav-link">Inicio</a>
            </li>
            <li class="nav-item dropdown" id="cat-carrito" role="button">
                    <img src="/filippi/Util/img/carrito.png" class="imagen-carrito nav-link">
                    <span id="contador" class="contador badge badge-danger"></span>
                    </img>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <!-- Notifications Dropdown Menu -->
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <i class="far fa-bell"></i>
                <span class="badge badge-danger navbar-badge product-quantity"></span>
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" >
                    <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> Productos por agotarse</span>
                    <div id="notifications"></div>

                    <a href="#" class="dropdown-item dropdown-footer">Ver Todas las Notificaciones</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <img src="/filippi/Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    <span>${usuario.nombre}</span>
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
                    <a href="/filippi/Views/catalogo.php" class="d-block">${usuario.nombre+' '+usuario.apellido}</a>
                </div>
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

                    <li class="nav-header">Vender</li>

                    <li class="nav-item" id="gestion_catalogo">
                        <a href="/filippi/Views/catalogo.php" class="nav-link">
                        <i class="nav-icon fas fa-shopping-cart fa-lg"></i>
                        <p>
                            Catalogo
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>

                    <li class="nav-header">Control</li>
                    <li class="nav-item" id="gestion_ventas">
                        <a href="/filippi/Views/compras.php" class="nav-link">
                        <i class="nav-icon far fa-credit-card fa-lg"></i>
                        <p>
                            Mis Compras
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item" id="gestion_ventas">
                        <a href="/filippi/Views/atributo.php" class="nav-link">
                        <i class="nav-icon fas fa-clipboard fa-lg"></i>
                        <p>
                            Gestion Atributo
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>

                    <li class="nav-item" id="gestion_ventas">
                        <a href="/filippi/Views/mis_ventas.php" class="nav-link">
                        <i class="nav-icon fas fa-list-ul fa-lg"></i>
                        <p>
                            Ventas
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    <li class="nav-item" id="gestion_pedidos">
                        <a href="/filippi/Views/pedidos.php" class="nav-link">
                        <i class="nav-icon fas fa-file-alt"></i>
                        <p>
                            Pedidos
                            <span class="badge badge-info right"></span>
                        </p>
                        </a>
                    </li>
                    
                    
                    <li class="nav-item" id="gestion_lotes">
                        <a href="/filippi/Views/lotes.php" class="nav-link">
                        <i class="nav-icon fas fa-tags fa-lg"></i>
                        <p>
                            Inventario
                            <span class="badge badge-info right">Nuevo</span>
                        </p>
                        </a>
                    </li>

                    <li class="nav-item">
                        <a href="/filippi/Views/Productos.php" class="nav-link">
                        <i class="nav-icon fas fa-shopping-bag"></i>
                        <p>
                            Productos
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
        let data = await fetch('/filippi/Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let repuesta = JSON.parse(response);
                if (repuesta.length!==0) {
                    llenar_menu_lateral(repuesta);
                    llenar_menu_superior(repuesta);
                    $('#gestion_usuario').show()
                    $('#gestion_catalogo').show();
                    $('#gestion_ventas').show();
                    $('#gestion_lotes').show();
                    $('#gestion_pedidos').show();
                    $('.nav-header').show();
                    buscar_usuarios();
                }
                else{
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
    function buscar_usuarios(dato) {
        let funcion='buscar_usuario';
        $.post('/filippi/Controllers/UsuariosController.php', {dato,funcion},(response)=>{
            let nombre= '';
            let apellido= '';
            let edad= '';
            let dni= '';
            let tipo= '';
            let telefono= '';
            let localidad= '';
            let correo= '';
            let sexo= '';
            let adicional= '';
            const usuario = JSON.parse(response);
                nombre+=`${usuario.nombre}`;
                apellido+=`${usuario.apellido}`;
                edad+=`${usuario.edad}`;
                dni+=`${usuario.dni}`;
            if(usuario.tipo=='root'){
                tipo+=`<h1 class="badge badge-danger ml-2">${usuario.tipo}</h1>`;
            }
            if(usuario.tipo=='vendedor'){
                tipo+=`<h1 class="badge badge-warning ml-2">${usuario.tipo}</h1>`;
            }
            if(usuario.tipo=='administrador'){
                tipo+=`<h1 class="badge badge-info ml-2">${usuario.tipo}</h1>`;
            }
            telefono+=`${usuario.telefono}`;
            correo+=`${usuario.correo}`;
            sexo+=`${usuario.sexo}`;
            $('#nombre_us').html(nombre);
            $('#apellido_us').html(apellido);
            $('#edad_us').html(edad);
            $('#dni_us').html(dni);
            $('#us_tipo').html(tipo);
            $('#telefono_us').html(telefono);
            $('#localidad_us').html(localidad);
            $('#correo_us').html(correo);
            $('#sexo_us').html(sexo);
            $('#adicional_us').html(adicional);
            $('#avatar3').attr('src',usuario.avatar);
            $('#avatar2').attr('src',usuario.avatar);
            $('#avatar1').attr('src',usuario.avatar);
        })
    }
    $(document).on('click', '.edit', (e)=>{
        let funcion='capturar_datos';
        edit = true;
        $.post('../controladores/UsuariosController.php', {funcion,id_usuario}, (response)=>{
            const usuario = JSON.parse(response);
            $('#telefono').html(usuario.telefono);
            $('#localidad').val(usuario.localidad);
            $('#correo').val(usuario.correo);
            $('#sexo').val(usuario.sexo);
            $('#adicional').val(usuario.adicional);
        });
    })
    $('#form-usuario').submit(e=>{
        if(edit==true){
            let telefono=$('#telefono').val();
            let localidad=$('#localidad').val();
            let correo=$('#correo').val();
            let sexo=$('#sexo').val();
            let adicional=$('#adicional').val();
            let funcion='editar_usuario';
            $.post('../controladores/UsuariosController.php',{id_usuario,funcion,telefono,localidad,correo,sexo,adicional},(response)=>{
                if(response=='editado'){
                    $('#editado').hide('slow');
                    $('#editado').show(1000);
                    $('#editado').hide(2000);
                    $('#form-usuario').trigger('reset');
                }
                edit=false;
                buscar_usuarios(id_usuario);
            })
            
        }
        else{
            $('#noeditado').hide('slow');
                    $('#noeditado').show(1000);
                    $('#noeditado').hide(2000);
                    $('#form-usuario').trigger('reset');
        }
        e.preventDefault();
    });
    $('#form-pass').submit(e=>{
        let oldpass=$('#oldpass').val();
        let newpass=$('#newpass').val();
        let funcion='cambiar_contra';
        $.post('../controladores/UsuariosController.php',{id_usuario,funcion,oldpass,newpass}, (response)=>{
            if(response=='update'){
                $('#update').hide('slow');
                $('#update').show(1000);
                $('#update').hide(2000);
                $('#form-pass').trigger('reset');
            }
            else{
                $('#noupdate').hide('slow');
                $('#noupdate').show(1000);
                $('#noupdate').hide(2000);
                $('#form-pass').trigger('reset');
            }
        })
        e.preventDefault()
    })
    $('#form-photo').submit(e=>{
        let formData = new FormData($('#form-photo')[0]);
        $.ajax({
            url:'../controladores/UsuariosController.php',
            type:'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false
        }).done(function(response){
            
            const json = JSON.parse(response);
            if(json.alert=='edit') {
                $('#avatar1').attr('src',json.ruta);
                $('#edit').hide('slow');
                $('#edit').show(1000);
                $('#edit').hide(5000);
                $('#form-photo').trigger('reset');
                buscar_usuarios();
            }
            else{
                $('#noedit').hide('slow');
                $('#noedit').show(1000);
                $('#noedit').hide(2000);
                $('#form-photo').trigger('reset');
                buscar_usuarios();
            }
        });
        e.preventDefault();
    })


})