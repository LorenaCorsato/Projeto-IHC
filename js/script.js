document.addEventListener('DOMContentLoaded', () => {

  const elementosAnimados = document.querySelectorAll('.animar-scroll');

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
      }
    });
  }, {
    threshold: 0.3 
  });

  elementosAnimados.forEach((elemento) => {
    observador.observe(elemento);
  });

  const menuTopo = document.querySelector('.menu-topo');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      menuTopo.classList.add('menu-rolagem');
    } else {
      menuTopo.classList.remove('menu-rolagem');
    }
  });

  const linksFiltro = document.querySelectorAll(".bento-grid a.bento-card");

  linksFiltro.forEach(link => {
    link.addEventListener("click", function() {
      const filtroSelecionado = this.getAttribute("data-filter");
      if (filtroSelecionado) {
        localStorage.setItem("filtroGaleria", filtroSelecionado.trim().toLowerCase());
      }
    });
  });

  const linksMenuPadrao = document.querySelectorAll(".menu-topo nav a");
  linksMenuPadrao.forEach(link => {
    link.addEventListener("click", () => {
      localStorage.removeItem("filtroGaleria");
    });
  });

  const cardsFotos = document.querySelectorAll(".photo-card");
  
  if (cardsFotos.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const filtroNaURL = params.get("filtro");
    const filtroSalvo = (filtroNaURL || localStorage.getItem("filtroGaleria") || "").trim().toLowerCase();

    if (filtroNaURL) {
      localStorage.setItem("filtroGaleria", filtroSalvo);
    }

    if (filtroSalvo) {
      cardsFotos.forEach(card => {
        const categoriaCard = card.getAttribute("data-category") ? card.getAttribute("data-category").trim().toLowerCase() : "";

        const corresponde = 
          categoriaCard === filtroSalvo || 
          (filtroSalvo === "flor" && (categoriaCard === "flora" || categoriaCard === "flores" || categoriaCard === "planta")) ||
          (filtroSalvo === "planta" && (categoriaCard === "flora" || categoriaCard === "plantas")) ||
          (filtroSalvo === "animal" && (categoriaCard === "fauna" || categoriaCard === "animais" || categoriaCard === "bicho"));

        if (corresponde) {
          card.style.setProperty("display", "", "important");
        } else {
          card.style.setProperty("display", "none", "important");
        }
      });
    }
  }

});