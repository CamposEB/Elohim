/* ==========================================================
   Padaria Elohim — js/config.js
   TODOS os dados editáveis do site ficam aqui.
   Campos vazios ('' ou []) fazem o elemento correspondente
   ser ocultado automaticamente.
   ========================================================== */
(function () {
  'use strict';

  /* Fotos de bancos gratuitos (Unsplash e Pexels), usadas de forma ILUSTRATIVA.
     Substitua por fotos reais da padaria: coloque os arquivos em assets/img/
     e troque o campo "src" por 'assets/img/nome-da-foto.jpg'. */
  var unsplash = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&q=75&w=' + (w || 900); };
  var pexels = function (id, w) { return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 900); };

  window.SITE = {
    name: 'Padaria Elohim',

    /* ---------- Contato ---------- */
    whatsapp: '5521968340086',               // 55 + DDD + número, só dígitos
    phoneLabel: '(21) 96834-0086',
    addressLines: ['R. Dicknes, 23 - Cangulo', 'Duque de Caxias - RJ, 25220-440'],
    addressFull: 'R. Dicknes, 23 - Cangulo, Duque de Caxias - RJ, 25220-440',
    mapsUrl: 'https://maps.app.goo.gl/EyTMTnu1t4V2ibax8',

    /* Horário de funcionamento (ainda não informado = seção oculta).
       Exemplo: [['Segunda a sábado', '5h às 20h'], ['Domingo', '5h às 13h']] */
    hours: [],

    /* Instagram: só o usuário, sem @ (ex.: 'padariaelohim'). Vazio = oculto. */
    instagram: '',

    /* ---------- Mensagens do WhatsApp ---------- */
    messages: {
      general: 'Olá! Vim pelo site da Padaria Elohim e gostaria de mais informações.',
      cta: 'Olá! Vim pelo site da Padaria Elohim e gostaria de conhecer os produtos.',
      product: function (name) { return 'Olá! Vim pelo site da Padaria Elohim e gostaria de saber mais sobre: ' + name + '.'; }
    },

    /* ---------- Sobre ---------- */
    /* História real da padaria (trajetória, valores). Vazio = bloco oculto.
       Não preencha com informações não confirmadas. */
    story: '',

    /* ---------- Produtos ---------- */
    productsNote: 'Imagens e itens ilustrativos. Consulte a disponibilidade e os valores pelo WhatsApp.',

    /* Categorias sem nenhum produto não aparecem nos filtros. */
    categories: [
      { id: 'paes', label: 'Pães' },
      { id: 'bolos', label: 'Bolos' },
      { id: 'doces', label: 'Doces e sobremesas' },
      { id: 'salgados', label: 'Salgados' },
      { id: 'cafes', label: 'Cafés e bebidas' },
      { id: 'especialidades', label: 'Especialidades da casa' }
    ],

    /* price: deixe '' para não exibir preço (ex.: price: '7,50' mostra "R$ 7,50"). */
    products: [
      { category: 'paes', name: 'Pães fresquinhos', description: 'Pãezinhos dourados para o café da manhã e para o lanche da tarde.', price: '',
        image: { src: pexels(29349524), alt: 'Pães dourados em uma cesta', pos: 'center' } },
      { category: 'paes', name: 'Pães de forma e rústicos', description: 'Opções para o dia a dia, para sanduíches, torradas e para a mesa da família.', price: '',
        image: { src: unsplash('1681511230184-623f9f4dea9a'), alt: 'Pães assados sobre uma grade de resfriamento', pos: 'center' } },
      { category: 'paes', name: 'Pães alongados', description: 'Pães macios e dourados, prontos para receber o seu recheio preferido.', price: '',
        image: { src: pexels(16521891), alt: 'Pães alongados sobre uma tábua', pos: 'center' } },
      { category: 'paes', name: 'Croissants', description: 'Massa folhada dourada, perfeita para acompanhar um café.', price: '',
        image: { src: pexels(13870808), alt: 'Croissants dourados sobre papel manteiga', pos: 'center' } },
      { category: 'bolos', name: 'Bolos', description: 'Bolos para o café, para a sobremesa e para comemorar com quem você gosta.', price: '',
        image: { src: unsplash('1734262399605-1651c15f4094'), alt: 'Vitrine com diferentes tipos de bolos', pos: 'center' } },
      { category: 'cafes', name: 'Cafés', description: 'Aquela pausa quentinha para começar bem o dia ou recarregar a tarde.', price: '',
        image: { src: pexels(12801409), alt: 'Café com arte na espuma sobre mesa de madeira', pos: 'center' } },
      { category: 'cafes', name: 'Café com acompanhamento', description: 'Um café e uma delícia para dividir, ou não, em um momento só seu.', price: '',
        image: { src: unsplash('1699559510594-12624b72312c'), alt: 'Xícara de café e pães doces sobre a mesa', pos: 'center' } }
    ],

    /* ---------- Galeria ---------- */
    gallery: [
      { src: unsplash('1699559510594-12624b72312c', 1200), alt: 'Café e pães doces sobre a mesa' },
      { src: pexels(13870808, 800), alt: 'Croissants dourados' },
      { src: pexels(16521892, 800), alt: 'Pãezinhos dourados em close' },
      { src: unsplash('1734262399605-1651c15f4094', 800), alt: 'Vitrine de bolos' },
      { src: pexels(12801409, 1200), alt: 'Café com arte na espuma sobre mesa de madeira' },
      { src: pexels(16521891, 800), alt: 'Pães alongados sobre uma tábua' }
    ]
  };
})();
