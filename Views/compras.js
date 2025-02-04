$(document).ready(function () {
  Loader("Cargando Productos");
  verificar_sesion();
  var datatable;
  $(".select2").select2();
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
          await obtener_perfil(repuesta);
          await obtener_info(repuesta);
        } else {
          location.href = "../";
        }
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
  function rellenar_estado_pago() {
    funcion = "rellenar_estado";
    $.post("../controladores/EstadoController.php", { funcion }, (response) => {
      // console.log(response)
      let estados = JSON.parse(response);
      let template = "";
      estados.forEach((estado) => {
        template += `
                    <option value="${estado.id}" >${estado.nombre}</option>
                `;
      });
      $("#estado_compra").html(template);
    });
  }
  function listar_compras() {
    funcion = "listar_compras";
    $.post(
      "../controladores/MisComprasController.php",
      { funcion },
      (response) => {
        let datos = JSON.parse(response);
        datatable = $("#compras").DataTable({
          data: datos,
          columns: [
            { data: "numeracion" },
            { data: "codigo" },
            { data: "fecha_compra" },
            { data: "fecha_entrega" },
            { data: "total" },
            { data: "estado" },
            { data: "proveedor" },
            {
              defaultContent: `
                    <button  class="imprimir btn btn-secondary"><i class="fas fa-print"></i></button>
                    <button  class="ver btn btn-success" type="button" data-toggle="modal" data-target="#vista_compra"><i class="fas fa-search"></i></button>
                    <button  class="editar btn btn-info" type="button" data-toggle="modal" data-target="#cambiarEstado"><i class="fas fa-pencil-alt"></i></button>`,
            },
          ],
          destroy: true,
          language: espanol,
        });
      }
    );
  }
  $("#compras tbody").on("click", ".editar", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    let estado = datos.estado;
    $("#id_estado").val(id);
    funcion = "cambiarEstado";
    $.post(
      "../controladores/EstadoController.php",
      { funcion, estado },
      (response) => {
        let id_estado = JSON.parse(response);
        $("#estado_compra").val(id_estado[0]["id"]).trigger("change");
      }
    );
  });
  $("#form-editar").submit((e) => {
    let id_estado = $("#id_estado").val();
    let id_compra = $("#estado_compra").val();
    funcion = "editarEstado";
    $.post(
      "../controladores/MisComprasController.php",
      { funcion, id_compra, id_estado },
      (response) => {
        if ((response = "edit")) {
          $("#estado_compra").val("").trigger("change");
          $("#edit").hide("slow");
          $("#edit").show(1000);
          $("#edit").hide(2000);
          $("#form-crear").trigger("reset");
          listar_compras();
        } else {
          $("#noedit").hide("slow");
          $("#noedit").show(1000);
          $("#noedit").hide(2000);
          $("#form-crear").trigger("reset");
        }
      }
    );
    e.preventDefault();
  });
  $("#compras tbody").on("click", ".ver", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    funcion = "ver";
    $("#codigo_compra").html(datos.codigo);
    $("#fecha_compra").html(datos.fecha_compra);
    $("#fecha_entrega").html(datos.fecha_entrega);
    $("#estado").html(datos.estado);
    $("#proveedor").html(datos.proveedor);
    $("#total").html(datos.total);

    $.post(
      "../controladores/LoteController.php",
      { funcion, id },
      (response) => {
        let registros = JSON.parse(response);
        let template = "";
        $("#detalles").html(template);
        registros.forEach((registro) => {
          template += `
                    <tr>
                        <td>${registro.numeracion}</td>
                        <td>${registro.codigo}</td>
                        <td>${registro.cantidad}</td>
                        <td>${registro.producto}</td>
                        <td>${registro.precio_compra}</td>
                        <td>${registro.tipo}</td>
                        <td>${registro.presentacion}</td>
                    </tr>
                `;
          $("#detalles").html(template);
        });
      }
    );
  });
  $("#compras tbody").on("click", ".imprimir", function () {
    let datos = datatable.row($(this).parents()).data();
    let codigo = datos.codigo;
    codigo = codigo.split(" | ");
    let id = codigo[0];
    funcion = "imprimir";
    $.post(
      "../controladores/MisComprasController.php",
      { id, funcion },
      (response) => {
        console.log(response);
        window.open("../pdf/pdf-compra-" + id + ".pdf", "_blank");
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
