document.addEventListener('DOMContentLoaded', () => {

  const elementosAnimados = document.querySelectorAll('.animar-scroll');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        
 
      } //else {
        //entrada.target.classList.remove('visivel');
      //}
    });
  }, {
    threshold: 0.3 
  });

  elementosAnimados.forEach((elemento) => {
    observador.observe(elemento);
  });

});

document.addEventListener('DOMContentLoaded', () => {
  const menuTopo = document.querySelector('.menu-topo');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      menuTopo.classList.add('menu-rolagem');
    } else {
      menuTopo.classList.remove('menu-rolagem');
    }
  });
});