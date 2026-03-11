document.addEventListener('DOMContentLoaded', function() {// Espera a que el DOM esté completamente cargado
    var usuarioInput = document.getElementById('usuario');
    if (usuarioInput) {
        usuarioInput.addEventListener('input', function(e) {//cada que se escribe en el input
            let val = e.target.value;// Obtener el valor actual del input
            let nuevo = val.replace(/[^a-zA-Z0-9_-]/g, '');
            if (val !== nuevo) {
                e.target.value = nuevo;
                mostrarAdvertencia(true);
            } else {
                mostrarAdvertencia(false);
            }
        });
        if (!document.getElementById('usuario-advertencia')) {// Insertar advertencia si no existe
            var adv = document.createElement('div');
            adv.id = 'usuario-advertencia';
            adv.textContent = 'Solo se permiten letras, números, guion medio y guion bajo.';
            usuarioInput.parentNode.insertBefore(adv, usuarioInput.nextSibling);// Insertar advertencia después del input
        }
    }
    function mostrarAdvertencia(mostrar) {//true o false
        var adv = document.getElementById('usuario-advertencia');
        if (adv) adv.style.display = mostrar ? 'block' : 'none';
    }
});

function validarUsuarioInput(e) {
    const regex = /^[a-zA-Z0-9_-]*$/; // Permite letras números Y guiones
    const advertencia = document.getElementById('usuario-advertencia');
    if (!regex.test(e.target.value)) {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
        if (advertencia) advertencia.style.display = 'block';
    } else {
        if (advertencia) advertencia.style.display = 'none';
    }
}

function regresar() {
    window.location.replace('home.php');
};

function initSidebarAutoClose() {
  Array.from(document.querySelectorAll('.sidebar-list a, .sidebar-list button')).forEach(function(link) {
    link.addEventListener('click', function() {
      document.querySelector('.panel-sidebar').classList.remove('open');
    });
  });
}

function mostrarFormEditarPerfil() {
  var form = document.getElementById('formEditarPerfil');
  var btn = document.getElementById('btnEditarPerfil');
  if (form && btn) {
    form.style.display = 'block';
    btn.style.display = 'none';
  }
}

function cancelarFormEditarPerfil() {
  var form = document.getElementById('formEditarPerfil');
  var btn = document.getElementById('btnEditarPerfil');
  if (form && btn) {
    form.style.display = 'none';
    btn.style.display = 'inline-block';
  }
}