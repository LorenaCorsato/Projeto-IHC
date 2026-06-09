
/* =========================================
   EFEITO CASCATA AO ABRIR A PÁGINA
   ========================================= */
const todosCards = document.querySelectorAll('.photo-card');

todosCards.forEach((card, index) => {
  // Cada card vai demorar 0.08 segundos a mais que o anterior para começar a surgir
  card.style.animationDelay = `${index * 0.08}s`;
});

// Cria o canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const lanternaOverlay = document.querySelector('.lanterna-overlay');
const imagensDaGaleria = document.querySelectorAll('.photo-card img');
const cardsDaGaleria = document.querySelectorAll('.photo-card');

const paramsFiltro = new URLSearchParams(window.location.search);
const filtroDaURL = paramsFiltro.get('filtro');
const filtroSalvo = (filtroDaURL || localStorage.getItem('filtroGaleria') || '').trim().toLowerCase();

if (filtroDaURL) {
  localStorage.setItem('filtroGaleria', filtroSalvo);
}

if (filtroSalvo) {
  cardsDaGaleria.forEach((card) => {
    const categoriaCard = (card.getAttribute('data-category') || '').trim().toLowerCase();
    const corresponde =
      categoriaCard === filtroSalvo ||
      (filtroSalvo === 'flor' && categoriaCard === 'flor') ||
      (filtroSalvo === 'planta' && categoriaCard === 'planta') ||
      (filtroSalvo === 'animal' && categoriaCard === 'animal') ||
      (filtroSalvo === 'ceu' && categoriaCard === 'ceu');

    card.style.display = corresponde ? '' : 'none';
  });
}

const filterOptions = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]'));

function getCheckboxByValue(value) {
  return filterOptions.find((checkbox) => checkbox.value === value);
}

function categoriaCorrespondeFiltro(categoriaCard, filtro) {
  if (filtro === 'animais') {
    return categoriaCard === 'animal';
  }

  if (filtro === 'plantas') {
    return categoriaCard === 'planta';
  }

  if (filtro === 'flores') {
    return categoriaCard === 'flor';
  }

  if (filtro === 'ceu') {
    return categoriaCard === 'ceu';
  }

  return false;
}

function aplicarFiltroPainel() {
  const todosCheckbox = getCheckboxByValue('todos');
  const filtrosAtivos = filterOptions
    .filter((checkbox) => checkbox.checked && checkbox.value !== 'todos')
    .map((checkbox) => checkbox.value);

  if (!todosCheckbox) {
    return;
  }

  if (todosCheckbox.checked || filtrosAtivos.length === 0) {
    cardsDaGaleria.forEach((card) => {
      card.style.display = '';
    });
    todosCheckbox.checked = true;
    return;
  }

  cardsDaGaleria.forEach((card) => {
    const categoriaCard = (card.getAttribute('data-category') || '').trim().toLowerCase();
    const corresponde = filtrosAtivos.some((filtro) => categoriaCorrespondeFiltro(categoriaCard, filtro));

    card.style.display = corresponde ? '' : 'none';
  });
}

filterOptions.forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    const todosCheckbox = getCheckboxByValue('todos');

    if (!todosCheckbox) {
      aplicarFiltroPainel();
      return;
    }

    if (checkbox.value === 'todos' && checkbox.checked) {
      filterOptions.forEach((item) => {
        if (item.value !== 'todos') {
          item.checked = false;
        }
      });
    }

    if (checkbox.value !== 'todos' && checkbox.checked) {
      todosCheckbox.checked = false;
    }

    if (checkbox.value !== 'todos' && !filterOptions.some((item) => item.value !== 'todos' && item.checked)) {
      todosCheckbox.checked = true;
    }

    aplicarFiltroPainel();
  });
});

if (filtroSalvo) {
  const checkboxSelecionado = getCheckboxByValue(
    filtroSalvo === 'animal' ? 'animais' :
    filtroSalvo === 'planta' ? 'plantas' :
    filtroSalvo === 'flor' ? 'flores' :
    filtroSalvo === 'ceu' ? 'ceu' :
    ''
  );

  const todosCheckbox = getCheckboxByValue('todos');
  if (checkboxSelecionado && todosCheckbox) {
    todosCheckbox.checked = false;
    checkboxSelecionado.checked = true;
  }
}

let imagemAtiva = null;
let corDominante = '255, 255, 255'; // Variável para guardar a cor fixa da foto

// 1. EVENTO DE MOVIMENTO DO MOUSE (Apenas move a luz, não calcula mais cores)
document.addEventListener('mousemove', function(event) {
  if (!imagemAtiva) return;
  
  const rect = imagemAtiva.getBoundingClientRect();
  const posX = event.clientX;
  const posY = event.clientY;
  
  // Verifica se o cursor saiu da área da imagem
  if (posX < rect.left || posX > rect.right || posY < rect.top || posY > rect.bottom) {
    lanternaOverlay.style.opacity = '0';
    return;
  } else {
    lanternaOverlay.style.opacity = '1';
  }
  
  // Atualiza a posição da lanterna usando a cor dominante guardada!
  // Mantive o tamanho em 400px e opacidade em 0.4 para o fundo preto
  lanternaOverlay.style.background = `radial-gradient(circle 400px at ${posX}px ${posY}px, rgba(${corDominante}, 0.4), transparent 70%)`;
});

// 2. EVENTOS NAS IMAGENS
imagensDaGaleria.forEach(function(img) {
  
  img.crossOrigin = "Anonymous"; 

  // Quando o mouse ENTRA na foto, calculamos a cor dominante UMA única vez
  img.addEventListener('mouseenter', function() {
    if (img.naturalWidth === 0) return; 
    
    // O TRUQUE MÁGICO: Configura o canvas para 1x1 pixel
    canvas.width = 1;
    canvas.height = 1;
    
    // Desenha a imagem inteira espremida dentro desse único pixel
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, 1, 1);
    
    try {
      // Pega a cor desse único pixel (que agora é a média da imagem toda)
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      corDominante = `${pixel[0]}, ${pixel[1]}, ${pixel[2]}`; // Salva no formato "R, G, B"
    } catch (error) {
      console.warn("Dica: Use o Live Server para evitar bloqueio de CORS.");
      corDominante = '255, 255, 255'; // Branco padrão se falhar
    }
    
    imagemAtiva = img;
  });

  // Quando o mouse SAI da foto
  img.addEventListener('mouseleave', function() {
    lanternaOverlay.style.opacity = '0';
    imagemAtiva = null;
  });
});

/* =========================================
   LÓGICA DO POP-UP (MODAL)
   ========================================= */

// 1. Seleciona os elementos do modal
const modal = document.getElementById('photo-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const btnClose = document.querySelector('.close-modal');

// Seleciona todos os cards da galeria
const cards = document.querySelectorAll('.photo-card');

// 2. Adiciona o evento de clique em CADA card
cards.forEach(card => {
  card.addEventListener('click', function() {
    // Captura os dados de dentro do card que foi clicado
    const fotoSrc = this.querySelector('img').src;
    const titulo = this.querySelector('.scientific-name').innerText;
    const descricao = this.querySelector('p').innerText;
    
    // NOVO: Verifica se o card possui dados técnicos escondidos
    const specsArea = this.querySelector('.tech-specs');
    const specsHTML = specsArea ? specsArea.innerHTML : '';

    // Joga esses dados para dentro do Modal
    modalImg.src = fotoSrc;
    modalTitle.innerText = titulo;
    modalDesc.innerText = descricao;

    // NOVO: Injeta os dados técnicos no modal ou esconde a área se não tiver
    const techSpecsContainer = document.getElementById('modal-tech-specs');
    if (specsHTML) {
      techSpecsContainer.innerHTML = `<ul>${specsHTML}</ul>`;
      techSpecsContainer.style.display = 'block';
    } else {
      techSpecsContainer.innerHTML = '';
      techSpecsContainer.style.display = 'none'; // Esconde a linha divisória se a foto não tiver dados
    }

    // Mostra o modal e bloqueia o scroll da página de fundo
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

// 3. Função para fechar o Modal
function fecharModal() {
  modal.classList.remove('show');
  document.body.style.overflow = ''; // Devolve o scroll da página principal
}

// Fecha ao clicar no "X"
btnClose.addEventListener('click', fecharModal);

// Fecha ao clicar fora do conteúdo (no fundo escuro)
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    fecharModal();
  }
});

/* =========================================
   LÓGICA DO POP-UP FULLSCREEN (SÓ A FOTO)
   ========================================= */

const fullscreenModal = document.getElementById('fullscreen-modal');
const fullscreenImg = document.getElementById('fullscreen-img');
const btnCloseFullscreen = document.querySelector('.close-fullscreen');
const expandIcons = document.querySelectorAll('.expand-icon');
const expandIconModal = document.querySelector('.expand-icon-modal');

// 1. Evento para cada ícone de expandir na galeria
expandIcons.forEach(icon => {
  icon.addEventListener('click', function(event) {
    // BLOQUEIA O CLIQUE: Impede que o card inteiro perceba que foi clicado
    event.stopPropagation(); 
    
    // Procura o card "pai" mais próximo e pega a foto dele
    const card = this.closest('.photo-card');
    const fotoSrc = card.querySelector('img').src;
    
    // Alimenta o modal gigante e mostra
    fullscreenImg.src = fotoSrc;
    fullscreenModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

// 1b. Evento para o ícone de expandir dentro do modal técnico
expandIconModal.addEventListener('click', function(event) {
  event.stopPropagation();
  
  // Pega a foto que está sendo exibida no modal técnico
  const fotoSrc = modalImg.src;
  
  // Alimenta o modal fullscreen e mostra
  fullscreenImg.src = fotoSrc;
  fullscreenModal.classList.add('show');
});

// 2. Função para fechar a tela cheia
function fecharFullscreen() {
  fullscreenModal.classList.remove('show');
  
  // Só libera o scroll da tela se o outro modal técnico também não estiver aberto
  const modalTecnicoAberto = document.getElementById('photo-modal').classList.contains('show');
  if (!modalTecnicoAberto) {
    document.body.style.overflow = ''; 
  }
}

// Fecha no X
btnCloseFullscreen.addEventListener('click', fecharFullscreen);

// Fecha ao clicar no fundo preto
window.addEventListener('click', function(event) {
  if (event.target === fullscreenModal) {
    fecharFullscreen();
  }
});

/* =========================================
   LÓGICA DO PAINEL DE FILTROS
   ========================================= */
const filterBtn = document.getElementById('filter-btn');
const filterPanel = document.getElementById('filter-panel');
const closeFilter = document.querySelector('.close-filter');

// Abre ou fecha o painel ao clicar no botão flutuante
filterBtn.addEventListener('click', function(event) {
  event.stopPropagation(); // Impede que o clique vaze para o body
  filterPanel.classList.toggle('show');
});

// Fecha o painel ao clicar no 'X'
closeFilter.addEventListener('click', function() {
  filterPanel.classList.remove('show');
});

// Fecha o painel se clicar em qualquer lugar fora dele
document.addEventListener('click', function(event) {
  // Se o painel está aberto E o clique não foi dentro do painel
  if (filterPanel.classList.contains('show') && !filterPanel.contains(event.target)) {
    filterPanel.classList.remove('show');
  }
});

// Impede que clicar dentro do painel feche ele acidentalmente
filterPanel.addEventListener('click', function(event) {
  event.stopPropagation();
});