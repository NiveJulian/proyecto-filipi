$(document).ready(function(){
    verificar_sesion();
    $('#form-login').submit((e)=>{
        let dni = $('#dni').val();
        let pass = $('#pass').val();
        login(dni,pass);
        e.preventDefault();
    })
    async function login(dni,pass){
        let funcion = "login";
        let data = await fetch('/gasolero/Controllers/UsuariosController.php',{
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'funcion='+funcion+'&&dni='+dni+'&&pass='+pass
        })
        if(data.ok){
            let response= await data.text();
            try {
                let repuesta = JSON.parse(response);
                if (repuesta.mensaje=='success') {
                    location.href = "/gasolero/Views/catalogo.php";
                } else if (repuesta.mensaje=='error') {
                    toastr.error('Contraseña o DNI incorrectos.', 'Error!')
                    $('#form-login').trigger('reset');
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
                    location.href = "/gasolero/Views/catalogo.php";
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
})