import {
  llenar_menu_superior,
  llenar_menu_lateral,
} from "./layouts/layouts.js";

$(document).ready(function () {
  Loader("Cargando Productos");
  verificar_sesion();
  let funcion = "";
  async function obtenerPermisos(rol_id) {
    let funcion = "obtener_permisos";
    let data = await fetch("../Controllers/UsuariosController.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "funcion=" + funcion + "&rol_id=" + rol_id,
    });
    if (data.ok) {
      let response = await data.text();
      try {
        let respuesta = JSON.parse(response);
        return respuesta;
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
        return [];
      }
    } else {
      Swal.fire({
        icon: "error",
        title: data.statusText,
        text: "hubo conflicto de codigo: " + data.status,
      });
      return [];
    }
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
        let respuesta = JSON.parse(response);
        if (respuesta.length !== 0) {
          llenar_menu_superior(respuesta);
          let permisos = await obtenerPermisos(respuesta.id_tipo);
          llenar_menu_lateral(respuesta, permisos);
          $("#gestion_usuario").show();
          $("#gestion_catalogo").show();
          $("#gestion_ventas").show();
          $("#gestion_lotes").show();
          $("#gestion_pedidos").show();
          cargarAlmacenes();
          rellenar_tipo_producto();
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

  $("#modalAlmacen").on("show.bs.modal", async function (event) {
    let button = $(event.relatedTarget);
    let id = button.data("id");
    if (id) {
      $.ajax({
        url: "../Controllers/LoteController.php",
        type: "POST",
        data: { funcion: "obtener_almacen", id: id },
        dataType: "json",
        success: async function (response) {
          $("#idAlmacen").val(response[0].id);
          $("#nombreAlmacen").val(response[0].nombre);
          $("#ubicacionAlmacen").val(response[0].ubicacion);
          $("#tipo_producto").val(response[0].tipo_producto);
          $("#estadoAlmacen").val(response[0].estado);
          $("#modalTitulo").text("Editar Almacén");
        },
      });
    } else {
      $("#formAlmacen")[0].reset();
      $("#modalTitulo").text("Crear Almacén");
    }
  });

  $("#tablaAlmacenes tbody").on(
    "click",
    "tr td:first-child",
    async function () {
      let idAlmacen = $(this).closest("tr").data("id");
      $(this).closest("tr").addClass("cursor-pointer");
      await cargarProductosAlmacen(idAlmacen);
      $("#modalProductos").modal("show");
    }
  );

  async function cargarProductosAlmacen(idAlmacen) {
    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: { funcion: "listar_productos", idAlmacen },
      dataType: "json",
      success: function (response) {
        let tbody = $("#tablaProductos tbody");
        tbody.empty();

        if (response.length === 0) {
          tbody.append(
            '<tr><td colspan="3" class="text-center">No hay productos</td></tr>'
          );
        } else {
          response.forEach(function (producto) {
            let fila = `
                      <tr>
                          <td>${producto.nombre}</td>
                          <td>${producto.descripcion}</td>
                          <td>${producto.stock}</td>
                      </tr>
                  `;
            tbody.append(fila);
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "hubo conflicto en el sistema, pongase en contacto con el administrador",
        });
      },
    });
  }

  async function cargarAlmacenes() {
    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      data: { funcion: "listar_almacenes" },
      dataType: "json",
      success: function (response) {
        let tbody = $("#tablaAlmacenes tbody");
        tbody.empty();
        response.forEach(function (almacen) {
          let fila = `
                    <tr data-id=${almacen.id}>
                        <td>${almacen.nombre}</td>
                        <td>${almacen.ubicacion}</td>
                        <td>${almacen.tipo_producto}</td>
                        <td>${almacen.estado}</td>
                        <td>${almacen.cantidad_productos}</td>
                        <td>
                            <button class="btn btn-sm btn-warning editar-almacen text-center" data-toggle="modal" data-target="#modalAlmacen" data-id="${almacen.id}"><i class="fas fa-pencil text-black"></i></button>
                            <button class="btn btn-sm btn-danger eliminar-almacen" data-id="${almacen.id}"><i class="fas fa-trash text-black"></i></button>
                        </td>
                    </tr>
                `;
          tbody.append(fila);
        });
      },
    });
  }

  $("#guardarAlmacen").click(function (e) {
    e.preventDefault();
    let nombre = $("#nombreAlmacen").val();
    let ubicacion = $("#ubicacionAlmacen").val();
    let tipoProducto = $("#tipo_producto").val();
    let estado = $("#estadoAlmacen").val();

    if (!nombre || !ubicacion || !tipoProducto || !estado) {
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Todos los campos son obligatorios.",
      });
      return;
    }

    let id = $("#idAlmacen").val();
    let funcion = id ? "editar_almacen" : "crear_almacen";

    $.ajax({
      url: "../Controllers/LoteController.php",
      type: "POST",
      dataType: "json",
      data: {
        funcion: funcion,
        id: id,
        nombre: nombre,
        ubicacion: ubicacion,
        tipo_producto: tipoProducto,
        estado: estado,
      },
      success: function (response) {
        if (!response.success) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: response.message,
          });
          $("#modalAlmacen").modal("hide");
          cargarAlmacenes();
        }
      },
      error: function (xhr, status, error) {
        console.error("Error en la petición AJAX:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo conectar con el servidor.",
        });
      },
    });
  });

  $(document).on("click", ".eliminar-almacen", function () {
    var id = $(this).data("id");

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#e0e0e0",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "../Controllers/LoteController.php",
          type: "POST",
          data: { funcion: "eliminar_almacen", id: id },
          success: function (response) {
            Swal.fire({
              title: "Eliminado",
              text: "El almacén ha sido eliminado correctamente.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            cargarAlmacenes();
          },
          error: function () {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el almacén.",
              icon: "error",
            });
          },
        });
      }
    });
  });

  $("#guardarTipoProducto").on("click", function (e) {
    e.preventDefault();

    let nombreTipoProducto = $("#nombreTipoProducto").val().trim();

    if (nombreTipoProducto === "") {
      toastr.error("El nombre del tipo de producto es obligatorio.", "Error");
      return;
    }

    let funcion = "crear_tipo_producto";

    $.ajax({
      type: "POST",
      url: "../Controllers/ProductoController.php",
      data: {
        funcion: funcion,
        tipo_producto: nombreTipoProducto,
      },
      success: function (response) {
        if (response.trim() === "add") {
          toastr.success("Tipo de producto registrado con éxito!", "Éxito");

          $("#nombreTipoProducto").val("");

          $("#modalTipoProducto").modal("hide");

          rellenar_tipo_producto();
        } else if (response.trim() === "error_nombre_existente") {
          toastr.warning(
            "Este tipo de producto ya está registrado.",
            "Atención"
          );
        } else {
          toastr.error(
            "Ocurrió un error al registrar el tipo de producto.",
            "Error"
          );
        }
      },
      error: function (xhr, status, error) {
        toastr.error("Error en la solicitud AJAX: " + error, "Error");
      },
    });
  });

  function rellenar_tipo_producto() {
    let funcion = "rellenar_tipo_producto";
    $.post("../Controllers/LoteController.php", { funcion }, (response) => {
      let tipoProducto = JSON.parse(response);
      let template = "";

      $("#tipo_producto").empty();

      tipoProducto.forEach((type) => {
        template += `
                        <option value="${type.id}">${type.nombre}</option>
                    `;
      });
      $("#tipo_producto").html(template);
    });
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
});
