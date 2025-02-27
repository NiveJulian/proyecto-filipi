$(document).ready(function(){
    Loader('Cargando Datos');
    verificar_sesion();
    toastr.options={
        "preventDuplicates":true
    }
    // LAYOUTS
    function llenar_menu_superior(usuario){
        let template = `
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
                <a href="../Views/catalogo.php" class="nav-link">Inicio</a>
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
                    <img src="../Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" heigth="30">
                    <span></span>
                </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-item dropdown-header"></span>
                    
                    <div class="dropdown-divider"></div>
                        <a href="../Controllers/Logout.php" class="dropdown-item text-center bg-danger">
                            <i class="fas fa-power-off mr-2"></i>Cerrar Sesion</a>
                    <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer"></a>
            </div>
            </li>
        </ul>
        `;
        $('#menu_superior').html(template);
    }
    function llenar_menu_lateral(usuario) {
        let template = `
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                            <div class="image">
                            <img src="../Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" height="30">
                            </div>
                            <div class="info">
                                <a href="../Views/catalogo.php" class="d-block">${usuario.nombre}</a>
                            </div>
                    </div>
                <!-- Sidebar Menu -->
                        <nav class="mt-2 sticky-top">
                            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                <a href="../Views/dashboard.php" class="nav-link active">
                                  <i class="nav-icon fas fa-tachometer-alt"></i>
                                  <p>
                                    Dashboard
                                    <span class="badge badge-info right"></span>
        
                                  </p>
                                </a>
                            
                                <li class="nav-header">Usuario</li>
                                <li class="nav-item" id="gestion_usuario">
                                    <a href="../Views/Gestion_usuario.php" class="nav-link">
                                    <i class="nav-icon fas fa-tags fa-lg"></i>
                                    <p>
                                        Gestión Usuario
                                        <span class="badge badge-info right"></span>
                                    </p>
                                    </a>
                                </li>
        
                                <li class="nav-header">Datos</li>
        
                                <li class="nav-item">
                                    <a href="../Views/catalogo.php" class="nav-link">
                                    <i class="nav-icon fas fa-tractor"></i>
                                    <p>
                                        Vehículos
                                        <span class="badge badge-info right"></span>
                                    </p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="../Views/Personal.php" class="nav-link">
                                    <i class="nav-icon fas fa-user-tie"></i>
                                    <p>
                                        Personal
                                        <span class="badge badge-info right">Nuevo</span>
                                    </p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a href="../Views/atributo.php" class="nav-link">
                                    <i class="nav-icon fas fa-building"></i>
                                    <p>
                                        Clientes y Proveedores
                                        <span class="badge badge-info right"></span>
                                    </p>
                                    </a>
                                </li>
                                <li class="nav-item">
                                  <a href="../Views/facturacion.php" class="nav-link">
                                  <i class="nav-icon fas fa-file-invoice-dollar"></i>
                                  <p>
                                      Facturación
                                      <span class="badge badge-info right"></span>
                                  </p>
                                  </a>
                              </li>
                                <li class="nav-item">
                                    <a href="../Views/controlSalida.php" class="nav-link">
                                    <i class="nav-icon fas fa-parking"></i>
                                    <p>
                                        Patio
                                        <span class="badge badge-info right"></span>
                                    </p>
                                    </a>
                                </li>
    
                                <li class="nav-header">Inventario</li>
                                 <li class="nav-item">
                                    <a href="../Views/Lotes.php" class="nav-link">
                                    <i class="nav-icon fas fa-warehouse"></i>
                                    <p>
                                        Almacenes
                                        <span class="badge badge-info right"></span>
                                    </p>
                                    </a>
                                </li>
    
                            </ul>
                        </nav>
                    `;
        $("#menu_lateral").html(template);
      }
    // FIN LAYOUTS
    // VERIFICACIONES
    async function verificar_sesion(){
        let funcion = "verificar_sesion";
        let data = await fetch('../Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion
        })
        if(data.ok){
            let response= await data.text();
            try {
                let respuesta = JSON.parse(response);
                if (respuesta.length !== 0) {
                    llenar_menu_superior(respuesta);
                    llenar_menu_lateral(respuesta);
                    CloseLoader();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Usuario no puede ingresar'
                    })
                    location.href = "../index.php";
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

    var slider = $("#cantidadCopias");
    var output = $("#outputCopias");
    // Muestra el valor inicial
    output.text(slider.val());
    // Actualiza el valor del output cuando el slider cambia
    slider.on("input", function() {
        output.text($(this).val());
    });
    // Maneja el clic del botón
    $("#enviarBtn").on("click", function() {
        var valorSlider = $("#cantidadCopias").val();
        let dataToSend = {
            cantidadCopias: valorSlider
        };
    
        $.ajax({
            type: 'POST',
            url: '../Controllers/rifaController.php',  
            data: dataToSend,
        });
    });

    $("#generarPdfBtn").on("click", function () {
        let rangoNumeracionInicio = $("#rangoNumeracionInicio").val();
        let rangoNumeracionFin = $("#rangoNumeracionFin").val();
    
        console.log(rangoNumeracionInicio, rangoNumeracionFin);
    
        // Validar que el rango de numeración sea válido
        if (parseInt(rangoNumeracionInicio) > parseInt(rangoNumeracionFin)) {
            alert("El rango de numeración es inválido. Asegúrate de que el valor de inicio sea menor o igual al valor final.");
            return;
        }
    
        // Enviar el rango de numeración al archivo PHP para generar el PDF
        $.ajax({
            type: 'POST',
            url: '../Controllers/rifaController.php',
            data: {
                rangoNumeracionInicio: rangoNumeracionInicio,
                rangoNumeracionFin: rangoNumeracionFin,
                funcion: "rifa"
            },
            success: function (response) {
                console.log(response);
    
                window.open("../Util/pdf/pdf-rifa-" + rangoNumeracionInicio + "-to-" + rangoNumeracionFin + ".pdf", '_blank');
            },
            error: function (error) {
                // Manejar el error si es necesario
                console.error(error);
            }
        });
    });
    
    

    // LOADER
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
    // FIN LOADER
})
