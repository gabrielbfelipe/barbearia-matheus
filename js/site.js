/*
 * site.js -- monta a pagina a partir de config.js e content.js.
 * Tudo que e dado do negocio sai de um lugar so, para nao existir duas
 * versoes do mesmo telefone no HTML.
 */
(function () {
  'use strict';

  var doc = document;
  var $  = function (s, ctx) { return (ctx || doc).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(s)); };

  var end = BARBEARIA.endereco;
  var enderecoCurto    = end.rua + ' — ' + end.cidade + '/' + end.estado;
  var enderecoCompleto = end.rua + ', ' + end.bairro + ', ' + end.cidade + '/' + end.estado;

  /* ---------------------------------------------------------------- Links */

  function linkWhatsApp() {
    return 'https://wa.me/' + BARBEARIA.whatsapp +
           '?text=' + encodeURIComponent(BARBEARIA.mensagemWhatsApp);
  }

  function preencherLinks() {
    $$('[data-whatsapp]').forEach(function (a) {
      a.href = linkWhatsApp();
      a.target = '_blank';
      a.rel = 'noopener';
    });

    $$('[data-appbarber]').forEach(function (a) { a.href = BARBEARIA.appbarber; });
    $$('[data-maps]').forEach(function (a) { a.href = BARBEARIA.maps; });
    $$('[data-google]').forEach(function (a) { a.href = BARBEARIA.google.url; });

    $$('[data-telefone]').forEach(function (a) {
      a.href = 'tel:+' + BARBEARIA.whatsapp;
      if (!a.textContent.trim()) { a.textContent = BARBEARIA.telefone; }
    });

    $$('[data-instagram]').forEach(function (a) {
      a.href = BARBEARIA.instagram;
      if (!a.textContent.trim()) { a.textContent = BARBEARIA.instagramUser; }
    });

    $$('[data-endereco-curto]').forEach(function (n) { n.textContent = enderecoCurto; });
    $$('[data-endereco-completo]').forEach(function (n) {
      n.innerHTML = '<strong>' + end.rua + '</strong><br>' +
                    end.bairro + ' — ' + end.cidade + '/' + end.estado + '<br>CEP ' + end.cep;
    });
    $$('[data-endereco-linhas]').forEach(function (n) {
      n.innerHTML = end.rua + '<br>' + end.bairro + '<br>' + end.cidade + '/' + end.estado;
    });

    /* Duas linhas deliberadas -- deixar quebrar sozinho partia "Vila Harmonia". */
    $$('[data-endereco-hero]').forEach(function (n) {
      n.innerHTML = end.rua + '<br>' + end.bairro + ' — ' + end.cidade + '/' + end.estado;
    });

    $$('[data-ano]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------- Servicos */

  function montarServicos() {
    var grade = $('#servicos-grade');
    if (!grade) { return; }

    grade.innerHTML = SERVICOS.map(function (s) {
      /* Sem preco confirmado nao se inventa numero. */
      var preco = s.preco
        ? '<span class="servico__preco">' + s.preco + '</span>'
        : '<span class="servico__preco servico__preco--vazio">Sob consulta</span>';

      var duracao = s.duracao
        ? '<span class="servico__duracao">' + s.duracao + '</span>'
        : '';

      return '<article class="servico">' +
               '<h3 class="servico__nome">' + s.nome + '</h3>' +
               '<p class="servico__desc">' + s.descricao + '</p>' +
               '<div class="servico__rodape">' + preco + duracao + '</div>' +
             '</article>';
    }).join('');

    /*
     * Cinco servicos numa grade de quatro colunas deixavam uma celula vazia do
     * tamanho de um card. O espaco vira convite em vez de buraco.
     */
    grade.insertAdjacentHTML('beforeend',
      '<div class="servico servico--convite">' +
        '<p class="servico__nome">Não achou o que procura?</p>' +
        '<p class="servico__desc">Fale com o Matheus e combine o atendimento do seu jeito.</p>' +
        '<a class="link-linha" href="' + linkWhatsApp() + '" target="_blank" rel="noopener">Chamar no WhatsApp</a>' +
      '</div>');

    var temPreco = SERVICOS.some(function (s) { return s.preco; });
    var nota = $('#servicos-nota');
    if (nota) {
      nota.textContent = temPreco
        ? 'Valores conforme tabela vigente.'
        : 'Valores e durações serão atualizados conforme a tabela vigente da barbearia.';
    }
  }

  /* -------------------------------------------------------------- Galeria */

  function montarGaleria() {
    var grade = $('#galeria-grade');
    var barra = $('#filtros');
    if (!grade || !barra) { return; }

    barra.innerHTML = CATEGORIAS.map(function (c, i) {
      return '<button class="filtro" type="button" data-cat="' + c.id + '" ' +
             'aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + c.rotulo + '</button>';
    }).join('');

    grade.innerHTML = GALERIA.map(function (f) {
      return '<figure class="galeria__item' + (f.alto ? ' galeria__item--alto' : '') + '" ' +
               'data-cat="' + f.cat + '"' + (f.provisorio ? ' data-provisorio="true"' : '') + '>' +
               '<img src="' + f.src + '" alt="' + f.alt + '" loading="lazy" ' +
                    'width="1200" height="800">' +
             '</figure>';
    }).join('');

    var itens = $$('.galeria__item', grade);

    barra.addEventListener('click', function (e) {
      var btn = e.target.closest('.filtro');
      if (!btn) { return; }

      var cat = btn.dataset.cat;

      $$('.filtro', barra).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      grade.classList.add('is-trocando');
      window.setTimeout(function () {
        itens.forEach(function (it) {
          it.classList.toggle('is-oculto', cat !== 'todos' && it.dataset.cat !== cat);
        });
        grade.classList.remove('is-trocando');
      }, 180);
    });
  }

  /* ------------------------------------------------------------- Infantil */

  function montarInfantil() {
    var alvo = $('#infantil-fotos');
    if (!alvo || typeof INFANTIL === 'undefined') { return; }

    alvo.innerHTML = INFANTIL.map(function (f) {
      return '<figure' + (f.provisorio ? ' data-provisorio="true"' : '') + '>' +
               '<img src="' + f.src + '" alt="' + f.alt + '" loading="lazy" ' +
                    'width="1200" height="1600">' +
             '</figure>';
    }).join('');
  }

  /* ------------------------------------------------------------- Horarios */

  function montarHorarios() {
    var lista = $('#horarios');
    if (!lista) { return; }

    lista.innerHTML = BARBEARIA.horarios.map(function (h) {
      var faixa = h.fechado
        ? '<span class="horarios__faixa horarios__faixa--fechado">Fechado</span>'
        : '<span class="horarios__faixa">' + h.abre + ' — ' + h.fecha + '</span>';

      return '<li><span class="horarios__dias">' + h.dias + '</span>' + faixa + '</li>';
    }).join('');
  }

  /* ----------------------------------------------------------- Avaliacoes */

  /*
   * So mostra numero se ele tiver sido confirmado em config.js.
   * Nota do Google muda sozinha -- numero fixo no HTML envelhece mal.
   */
  function montarAvaliacoes() {
    var alvo = $('#avaliacoes-nota');
    if (!alvo) { return; }

    var g = BARBEARIA.google;
    if (g.nota == null || g.total == null) { return; }

    alvo.innerHTML =
      '<p class="avaliacoes__nota">' +
        '<b>' + String(g.nota).replace('.', ',') + '</b>' +
        '<span>' + g.total + ' avaliações no Google</span>' +
      '</p>';
  }

  /* --------------------------------------------- Aviso de fotos provisorias */

  /*
   * Foto de banco nao pode passar por trabalho do Matheus. Enquanto houver
   * placeholder na pagina, o aviso fica visivel.
   */
  function avisarProvisorio() {
    var aviso = $('#aviso-galeria');
    if (!aviso) { return; }

    var temProvisorio = typeof MODO_PROTOTIPO !== 'undefined' && MODO_PROTOTIPO &&
                        doc.querySelector('[data-provisorio="true"]');

    if (!temProvisorio) { return; }

    aviso.textContent =
      'Imagens ilustrativas. Esta galeria será substituída pelas fotos reais dos ' +
      'cortes feitos na barbearia.';
    aviso.hidden = false;
  }

  /* ------------------------------------------------------------ Cabecalho */

  function ligarCabecalho() {
    var topo = $('#topo');
    var btn  = $('#btn-menu');
    var nav  = $('#nav');

    if (topo) {
      var marcarScroll = function () {
        topo.classList.toggle('is-fixo', window.scrollY > 24);
      };
      marcarScroll();
      window.addEventListener('scroll', marcarScroll, { passive: true });
    }

    if (!btn || !nav) { return; }

    var fechar = function () {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-aberto');
      doc.body.style.overflow = '';
    };

    btn.addEventListener('click', function () {
      var aberto = btn.getAttribute('aria-expanded') === 'true';
      if (aberto) { fechar(); return; }

      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Fechar menu');
      nav.classList.add('is-aberto');
      doc.body.style.overflow = 'hidden';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { fechar(); }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fechar(); }
    });
  }

  /* --------------------------------------------------------------- Schema */

  /*
   * JSON-LD montado a partir do config para nunca divergir da pagina.
   * Campo nao confirmado e OMITIDO, nunca chutado: dado errado em structured
   * data prejudica mais que a ausencia dele.
   */
  function injetarSchema() {
    var dias = {
      Monday: 'https://schema.org/Monday',
      Tuesday: 'https://schema.org/Tuesday',
      Wednesday: 'https://schema.org/Wednesday',
      Thursday: 'https://schema.org/Thursday',
      Friday: 'https://schema.org/Friday',
      Saturday: 'https://schema.org/Saturday',
      Sunday: 'https://schema.org/Sunday'
    };

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'BarberShop',
      name: BARBEARIA.nome,
      description: 'Barbearia em Araraquara especializada em cortes masculinos, ' +
                   'barba e estilos personalizados.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: end.rua,
        addressLocality: end.cidade,
        addressRegion: end.estado,
        postalCode: end.cep,
        addressCountry: 'BR'
      },
      telephone: BARBEARIA.telefone,
      priceRange: '$$',
      image: new URL('assets/fotos/fachada-765.webp', location.href).href,
      url: location.origin + location.pathname,
      sameAs: [BARBEARIA.instagram, BARBEARIA.appbarber],
      employee: {
        '@type': 'Person',
        name: BARBEARIA.barbeiro,
        jobTitle: 'Barbeiro'
      }
    };

    var expediente = BARBEARIA.horarios
      .filter(function (h) { return !h.fechado; })
      .map(function (h) {
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.diasISO.map(function (d) { return dias[d]; }),
          opens: h.abre,
          closes: h.fecha
        };
      });

    if (expediente.length) { schema.openingHoursSpecification = expediente; }

    /* Sem nota confirmada, aggregateRating fica de fora do schema. */
    if (BARBEARIA.google.nota != null && BARBEARIA.google.total != null) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: BARBEARIA.google.nota,
        reviewCount: BARBEARIA.google.total
      };
    }

    var tag = doc.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(schema);
    doc.head.appendChild(tag);
  }

  /* ----------------------------------------------------------------- Init */

  preencherLinks();
  montarServicos();
  montarGaleria();
  montarInfantil();
  montarHorarios();
  montarAvaliacoes();
  avisarProvisorio();
  ligarCabecalho();
  injetarSchema();
})();
