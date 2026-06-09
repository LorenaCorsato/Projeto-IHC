document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ANIMAÇÃO DE SCROLL (IntersectionObserver)
  // ==========================================
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


  // ==========================================
  // 2. MUDANÇA DE COR DO MENU NO SCROLL
  // ==========================================
  const menuTopo = document.querySelector('.menu-topo');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      menuTopo.classList.add('menu-rolagem');
    } else {
      menuTopo.classList.remove('menu-rolagem');
    }
  });


  // ==========================================
  // 3. FILTRO DA GALERIA ADAPTADO PARA LIVE SERVER
  // ==========================================
  
  // Captura cliques nos cards da Bento Grid se estiver na Home (index.html)
  const linksFiltro = document.querySelectorAll(".bento-grid a.bento-card");

  linksFiltro.forEach(link => {
    link.addEventListener("click", function() {
      const filtroSelecionado = this.getAttribute("data-filter");
      if (filtroSelecionado) {
        // Salva a escolha do usuário no navegador antes de mudar de página
        localStorage.setItem("filtroGaleria", filtroSelecionado.trim().toLowerCase());
      }
    });
  });

  // Limpa o filtro se o usuário clicar nos links normais do menu topo (evita travar o filtro para sempre)
  const linksMenuPadrao = document.querySelectorAll(".menu-topo nav a");
  linksMenuPadrao.forEach(link => {
    link.addEventListener("click", () => {
      localStorage.removeItem("filtroGaleria");
    });
  });

  // Aplica o filtro na página da Galeria (galeria.html)
  const cardsFotos = document.querySelectorAll(".photo-card");
  
  if (cardsFotos.length > 0) {
    const params = new URLSearchParams(window.location.search);
    const filtroNaURL = params.get("filtro");
    const filtroSalvo = (filtroNaURL || localStorage.getItem("filtroGaleria") || "").trim().toLowerCase();

    if (filtroNaURL) {
      localStorage.setItem("filtroGaleria", filtroSalvo);
    }

    if (filtroSalvo) {
      // Executa a filtragem das fotos
      cardsFotos.forEach(card => {
        const categoriaCard = card.getAttribute("data-category") ? card.getAttribute("data-category").trim().toLowerCase() : "";

        // Comparação flexível para aceitar variações textuais de suas imagens
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
      
      // NOTA: Não removemos o 'filtroGaleria' aqui para evitar o bug do refresh do Live Server.
    }
  }

});