$(document).ready(function () {
  Loader("Cargando ventas");
  verificar_sesion();
  let datatable;
  function llenar_menu_superior(usuario) {
    let template = `
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <!-- Notifications Dropdown Menu -->
                    <!-- <li class="nav-item dropdown">
                        <a class="nav-link" id="count-vehicles" data-toggle="dropdown" href="#">
                            <i class="far fa-bell"></i>
                            <span class="badge badge-danger navbar-badge product-quantity"></span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span class="dropdown-item dropdown-header">Hay <span class="product-quantity"></span> vehículo(s) por vencer pagos</span>
                            <div id="notifications" class="list-group"></div>
                        </div>
                    </li>-->
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                        <span>${usuario.nombre}</span>
                            <img src="../Util/img/avatar1.svg" class="img-profile rounded-circle" width="30" height="30">
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
                        </ul>
                    </nav>
                `;
    $("#menu_lateral").html(template);
  }
  async function verificar_sesion() {
    let funcion = "verificar_sesion";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let repuesta = JSON.parse(response);
        if (repuesta.length !== 0) {
          llenar_menu_lateral(repuesta);
          llenar_menu_superior(repuesta);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          $(".nav-header").show();
          listar_ventas();
        } else {
          location.href = "../";
        }
        CloseLoader();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
    }
  }
  function Loader(mensaje) {
    if (mensaje == "" || mensaje == null) {
      mensaje = "Cargando productos...";
    }
    Swal.fire({
      position: "center",
      html: '<i class="fas fa-2x fa-sync-alt fa-spin"></i>',
      title: mensaje,
      showConfirmButton: false,
    });
  }
  function CloseLoader(mensaje, tipo) {
    if (mensaje == "" || mensaje == null) {
      Swal.close();
    } else {
      Swal.fire({
        position: "center",
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
      });
    }
  }
  function listar_ventas() {
    let funcion = "listar";
    datatable = $("#tabla_venta").DataTable({
      ajax: {
        url: "../Controllers/ventaController.php",
        method: "POST",
        dataSrc: "",
        data: { funcion: funcion },
      },
      columns: [
        { data: "id_venta" },
        { data: "fecha" },
        { data: "cliente" },
        { data: "firma" },
        { data: "total" },
        { data: "vendedor" },
        {
          defaultContent: `<button id="button_imprimir" class="imprimir btn btn-secondary"><i class="fas fa-print"></i></button>
                <button id="button_ver" class="ver btn btn-success" type="button" data-toggle="modal" data-target="#vista_venta"><i class="fas fa-search"></i></button>
                <button id="button_borrar" class="borrar btn btn-danger"><i class="fas fa-window-close"></i></button>`,
        },
      ],
      destroy: true,
      language: espanol,
    });
  }
  $("#tabla_venta tbody").on("click", ".imprimir", function () {
    let datos = datatable.row($(this).parents()).data();
    let id = datos.id_venta;
    $.post("../Controllers/PDFController.php", { id }, (response) => {
      console.log(response);
      window.open("../pdf/pdf-" + id + ".pdf", "_blank");
    });
  });
  $("#tabla_venta tbody").on("click", ".borrar", function () {
    let datos = datatable.row($(this).parents()).data();
    let id = datos.id_venta;
    funcion = "borrar_venta";
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success m-1",
        cancelButton: "btn btn-danger m-1",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro que deseas eliminar la Venta: " + id + " ?",
        text: "No podras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Borra esto!",
        cancelButtonText: "No, cancela!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          $.post(
            "../Controllers/detalleVentaController.php",
            { funcion, id },
            (response) => {
              console.log(response);
              if (response == "delete") {
                swalWithBootstrapButtons.fire(
                  "Eliminado!",
                  "Tu venta: " + id + " fue eliminada.",
                  "success"
                );
                listar_ventas();
              } else if (response == "nodelete") {
                swalWithBootstrapButtons.fire(
                  "Cancelado",
                  "No tenes permiso para eliminar esta venta :)",
                  "error"
                );
              }
            }
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Cancelado",
            "Tu venta no fue eliminada :)",
            "error"
          );
        }
      });
  });
  $("#tabla_venta tbody").on("click", ".ver", function () {
    let datos = datatable.row($(this).parents()).data();
    let id = datos.id_venta;
    funcion = "ver";
    $("#codigo_venta").html(datos.id_venta);
    $("#fecha").html(datos.fecha);
    $("#cliente").html(datos.cliente);
    $("#firma").html(datos.firma);
    $("#vendedor").html(datos.vendedor);
    $("#total").html(datos.total);

    $.post(
      "../Controllers/ventaProductoController.php",
      { funcion, id },
      (response) => {
        let registros = JSON.parse(response);
        let template = "";
        registros.forEach((registro) => {
          template += `
                    <tr>
                        <td>${registro.cantidad}</td>
                        <td>${registro.precio}</td>
                        <td>${registro.producto}</td>
                        <td>${registro.descripcion}</td>
                        <td>${registro.codigo}</td>
                        <td>${registro.presentacion}</td>
                        <td>${registro.tipo}</td>
                        <td>${registro.subtotal}</td>
                    </tr>
                `;
          $("#registros").html(template);
        });
      }
    );
  });
});
let espanol = {
  processing: "Procesando...",
  lengthMenu: "Mostrar _MENU_ registros",
  zeroRecords: "No se encontraron resultados",
  emptyTable: "Ningún dato disponible en esta tabla",
  infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
  infoFiltered: "(filtrado de un total de _MAX_ registros)",
  search: "Buscar:",
  infoThousands: ",",
  loadingRecords: "Cargando...",
  paginate: {
    first: "Primero",
    last: "Último",
    next: "Siguiente",
    previous: "Anterior",
  },
  aria: {
    sortAscending: ": Activar para ordenar la columna de manera ascendente",
    sortDescending: ": Activar para ordenar la columna de manera descendente",
  },
  buttons: {
    copy: "Copiar",
    colvis: "Visibilidad",
    collection: "Colección",
    colvisRestore: "Restaurar visibilidad",
    copyKeys:
      "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br /> <br /> Para cancelar, haga clic en este mensaje o presione escape.",
    copySuccess: {
      1: "Copiada 1 fila al portapapeles",
      _: "Copiadas %ds fila al portapapeles",
    },
    copyTitle: "Copiar al portapapeles",
    csv: "CSV",
    excel: "Excel",
    pageLength: {
      "-1": "Mostrar todas las filas",
      _: "Mostrar %d filas",
    },
    pdf: "PDF",
    print: "Imprimir",
    renameState: "Cambiar nombre",
    updateState: "Actualizar",
    createState: "Crear Estado",
    removeAllStates: "Remover Estados",
    removeState: "Remover",
    savedStates: "Estados Guardados",
    stateRestore: "Estado %d",
  },
};
