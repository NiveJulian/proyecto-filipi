$(document).ready(function(){
    $('.select2').select2();
    rellenar_clientes();
    calcularTotal();
    contarProductos();
    RecuperarLS_carrito();
    RecuperarLS_carrito_compra();
    //PROCESO DE CARRITO
    $(document).on('click','.agregar-carrito', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        const nombre = $(elemento).attr('prodNombre');
        const codigo = $(elemento).attr('prodCodigo');
        const descripcion = $(elemento).attr('prodDescripcion');
        const precio = $(elemento).attr('prodPrecio');
        const tipo = $(elemento).attr('prodTipo');
        const proveedor = $(elemento).attr('prodProveedor');
        const presentacion = $(elemento).attr('prodPresentacion');
        const avatar = $(elemento).attr('prodAvatar');
        const stock = $(elemento).attr('prodStock');

            const producto={
                'id': id,
                'nombre': nombre,
                'codigo': codigo,
                'precio': precio,
                'descripcion': descripcion,
                'tipo': tipo,
                'proveedor': proveedor,
                'presentacion': presentacion,
                'avatar': avatar,
                'cantidad': 1,
                'stock': stock
            }
            let id_producto;
            let productos;
            productos = RecuperarLS();
            productos.forEach(prod => {
                if(prod.id===producto.id){
                    id_producto=prod.id;
                }
            });
            if(id_producto === producto.id){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Este producto ya existe en el carrito!'
                  })
            }
            else{
                    template=`
                    <tr prodId="${producto.id}">
                        <td>${producto.codigo}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.proveedor}</td>
                        <td>${producto.precio}</td>
                        <td><button class="borrar-producto btn btn-danger"><i class="fas fa-times-circle"></i></button></td>
                    </tr>
                `;
            $('#listas').append(template);
            AgregarLS(producto);
            contarProductos();
            }
            
    })
    $(document).on('click','.borrar-producto', (e)=>{
        const elemento = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(elemento).attr('prodId');
        elemento.remove();
        Eliminar_producto_LS(id);
        contarProductos();
        calcularTotal()
    })
    $(document).on('click','#vaciar-carrito', (e)=>{
        $('#listas').empty();
        EliminarLS();
        contarProductos();
    })
    $(document).on('click', '#procesar-pedido', (e)=>{
        Procesar_pedido();
    })
    $(document).on('click', '#procesar-compra', (e)=>{
        Procesar_compra();
    })
    function RecuperarLS(){
        let productos;
        if(localStorage.getItem('productos')===null){
            productos=[];
        }
        else{
            productos= JSON.parse(localStorage.getItem('productos'))
        }
        return productos
    }
    function AgregarLS(producto){
        let productos;
        productos = RecuperarLS();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos))
    }
    function RecuperarLS_carrito(){
        let productos,id_producto;
        productos = RecuperarLS();
        funcion = "buscar_id";
        productos.forEach(producto => {
            id_producto=producto.id;
            $.post('../controladores/ProductoController.php',{funcion,id_producto},(response)=>{
                let template_carrito='';
                let json = JSON.parse(response);
                template_carrito=`
                    <tr prodId="${json.id}">
                        <td>${json.codigo}</td>
                        <td>${json.nombre}</td>
                        <td>${json.proveedor}</td>
                        <td>${json.precio}</td>
                        <td><button class="borrar-producto btn btn-danger"><i class="fas fa-times-circle"></i></button></td>
                    </tr>
                `;
                $('#listas').append(template_carrito);
            })
        });
    }
    function Eliminar_producto_LS(id) {
        let productos;
        productos = RecuperarLS();
        productos.forEach(function(producto,indice){
            if(producto.id===id){
                productos.splice(indice,1);
            }
        })
        localStorage.setItem('productos', JSON.stringify(productos))
    }
    function EliminarLS(){
        localStorage.clear();
    };
    function contarProductos(){
        let productos;
        let contador=0;
        productos=RecuperarLS();
        productos.forEach(producto => {
            contador++;
        });
        $('#contador').html(contador);
    }
    function Procesar_pedido(){
        let productos;
        productos= RecuperarLS();
        if(productos.length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El carrito esta vacio!'
              })
        }
        else{
            location.href = '../vistas/adm_compra.php'
        }
    }
    function RecuperarLS_carrito_compra(){
        let productos,id_producto;
        productos = RecuperarLS();
        funcion = "buscar_id";
        productos.forEach(producto => {
            id_producto=producto.id;
            $.post('../controladores/ProductoController.php',{funcion,id_producto},(response)=>{
                let template_compra='';
                let json = JSON.parse(response);
                template_compra=`
                <tr prodId="${producto.id}" prodPrecio="${json.precio}">
                        <td>${json.nombre}</td>
                        <td>${json.stock}</td>
                        <td>${json.precio}</td>
                        <td>${json.codigo}</td>
                        <td>${json.descripcion}</td>
                        <td>${json.tipo}</td>
                        <td>${json.presentacion}</td>
                        <td>
                            <input type="number" min="1" class="form-control cantidad_producto" value="${producto.cantidad}">
                        </td>
                        <td class="subtotales">
                            <h5>${json.precio*producto.cantidad}</h5>
                        </td>
                        <td><button class="borrar-producto btn btn-danger"><i class="fas fa-times-circle"></i></button></td>
                </tr>
                `;
                $('#lista-compra').append(template_compra);
            })
        });
    }
    $(document).on('click','#actualizar', (e)=>{
        let productos,precios;
        precios=document.querySelectorAll('.precio');
        productos=RecuperarLS();
        productos.forEach-(producto => {
            producto.precio = precio[indice].textContent;
        });
        localStorage.setItem('productos',JSON.stringify(productos));
        calcularTotal();
    })
    $('#cp').keyup((e)=>{
        let id,cantidad,producto,productos,montos;
        producto = $(this)[0].activeElement.parentElement.parentElement;
        id = $(producto).attr('prodId');
        precio = $(producto).attr('prodPrecio');
        cantidad = producto.querySelector('input').value;
        montos = document.querySelectorAll('.subtotales');
        productos = RecuperarLS();
        productos.forEach(function(prod,indice){
            if(prod.id === id){
                prod.cantidad = cantidad;
                prod.precio = precio;
                montos[indice].innerHTML = `<h5>${cantidad*precio}</h5>`;
            }
        });
        localStorage.setItem('productos',JSON.stringify(productos));
        calcularTotal();
    });

    //PROCESO DE COMPRA
    function calcularTotal(){
        let productos,subtotal,con_iva,total_sin_descuento,pago,vuelto,descuento;
        let total= 0,iva=0.21;
        productos=RecuperarLS();
        productos.forEach(producto => {
            let subtotal_producto= Number(producto.precio * producto.cantidad);
            total=total+subtotal_producto;
        });
        pago=$('#pago').val();
        descuento=$('#descuento').val();

        total_sin_descuento=total.toFixed(2);
        con_iva=parseFloat(total*iva).toFixed(2);
        subtotal=parseFloat(total-con_iva).toFixed(2);

        total= total-descuento;
        vuelto= pago-total;
        $('#subtotal').html(subtotal);
        $('#con_iva').html(con_iva);
        $('#total_sin_descuento').html(total_sin_descuento);
        $('#total').html(total.toFixed(2));
        $('#vuelto').html(vuelto.toFixed(2));
    }
    function Procesar_compra(){
        let cliente = $('#cliente').val();
        if(RecuperarLS().length == 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El carrito esta vacio!'
              }).then(function(){
                location.href = '../vistas/adm_catalogo.php'
              })
        }
        else if(cliente==''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Necesitamos un cliente!'
              })
        }
        else{
            Verificar_stock().then(error=>{
                if(error==0){
                    Registrar_compra(cliente);
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Se realizo la compra',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(function(){
                        EliminarLS();
                        location.href = '../vistas/adm_catalogo.php';
                      })
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Algun producto esta sin stock!'
                      })
                }
            });
            
        }

    }
    async function Verificar_stock(){
        let productos;
        funcion = 'verificar_stock';
        productos = RecuperarLS();
        const response = await fetch('../controladores/ProductoController.php',{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            body:'funcion='+funcion+'&&productos='+JSON.stringify(productos)
        })
        let error = await response.text();

        return error;
    }
    function Registrar_compra(cliente){
        funcion = "registrar_compra";
        let total = $('#total').get(0).textContent;
        let productos=RecuperarLS();
        let json = JSON.stringify(productos);
        $.post('../controladores/CompraController.php',{funcion,total,cliente,json}, (response)=>{
            console.log(response);
        })
    }
    function rellenar_clientes(){
        funcion = 'rellenar_clientes';
        $.post('../controladores/ClienteController.php', { funcion }, (response) => {
            console.log(response);
            let clientes = JSON.parse(response);
            let template = '';
            clientes.forEach(cliente => {
                template+=`
                    <option value="${cliente.id}">${cliente.nombre}</option>
                `;
            });
            $('#cliente').html(template);
        })
    }

})