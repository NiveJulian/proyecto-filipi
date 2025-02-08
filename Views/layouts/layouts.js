// layouts.js

function llenar_menu_superior(usuario) {
  let template = `
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a class="nav-link" data-toggle="dropdown" href="#">
                    <span>${usuario.nombre}</span>
                    <img src=${
                      usuario.avatar
                        ? `../Util/img/${usuario.avatar}`
                        : "../Util/img/avatar1.svg"
                    } class="img-profile rounded-circle" width="30" height="30">
                </a>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                    <span class="dropdown-item dropdown-header">Menu</span>
                    <div class="dropdown-divider"></div>
                    <a href="../Views/profileUser.php" class="dropdown-item text-start bg-ligth">
                        <i class="fas fa-user mr-2"></i>
                        Mi perfil
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="../Controllers/Logout.php" class="dropdown-item text-start bg-danger">
                        <i class="fas fa-power-off mr-2"></i>
                        Cerrar Sesión
                    </a>
                    <div class="dropdown-divider"></div>
                </div>
            </li>
        </ul>
    `;
  $("#menu_superior").html(template);
}

function llenar_menu_lateral(usuario) {
  let template = `
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src=${
                  usuario.avatar
                    ? `../Util/img/${usuario.avatar}`
                    : "../Util/img/avatar1.svg"
                } class="img-profile rounded-circle" width="30" height="30">
            </div>
            <div class="info">
                <a href="../Views/profileUser.php" class="dropdown-item text-white text-uppercase text-start ">${
                  usuario.nombre
                }</a>
            </div>
        </div>
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
                <li class="nav-header">Gestión</li>
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
                    <a href="../Views/consumo.php" class="nav-link">
                        <i class="nav-icon fas fa-gas-pump"></i>
                        <p>
                            Consumo
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

                <li class="nav-header">Relaciones y Recursos</li>
                
                <li class="nav-item">
                    <a href="../Views/Personal.php" class="nav-link">
                        <i class="nav-icon fas fa-user-tie"></i>
                        <p>
                            Personal
                            <span class="badge badge-info right"></span>
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
                            
                <li class="nav-header">Inventario 
                <span class="badge badge-info right">Nuevo</span></li>  
                <li class="nav-item">
                    <a href="../Views/Lotes.php" class="nav-link">
                        <i class="nav-icon fas fa-warehouse"></i>
                        <p>
                            Almacenes
                            <span class="badge badge-info right"></span>
                        </p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="../Views/Productos.php" class="nav-link">
                        <i class="nav-icon fas fa-cart-flatbed-suitcase"></i>
                        <p>
                            Productos
                            <span class="badge badge-info right"></span>
                        </p>
                    </a>
                </li>
            </ul>
        </nav>
    `;
  $("#menu_lateral").html(template);
}

// Exportar las funciones si es necesario
export { llenar_menu_superior, llenar_menu_lateral };
