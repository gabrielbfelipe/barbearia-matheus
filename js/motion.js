/*
 * motion.js -- movimento do site.
 *
 * Duas coisas apenas:
 *   1. a abertura, onde o monograma se desenha e assenta no cabecalho;
 *   2. a secao do monograma, onde MP vira MATHEUS PEREIRA vira BARBEARIA.
 *
 * Fora isso, so revelacoes discretas em tres pontos. Quem pediu menos
 * movimento no sistema nao ve nenhum deles.
 */
(function () {
  'use strict';

  var doc = document;
  var raiz = doc.documentElement;

  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  raiz.classList.add('js');

  /*
   * stroke-dasharray precisa do comprimento real de cada traco, que so o
   * navegador sabe calcular. Sem isso a animacao de desenho nao existe.
   */
  function medirTracos(ctx) {
    Array.prototype.forEach.call((ctx || doc).querySelectorAll('.mp-traco'), function (p) {
      var c = p.getTotalLength();
      p.style.setProperty('--comprimento', c);
    });
  }

  /* -------------------------------------------------------------- Abertura */

  function abrir() {
    var tela = doc.getElementById('abertura');
    if (!tela) { return; }

    /* Roda uma vez por sessao -- quem volta ao site nao espera de novo. */
    var jaViu = false;
    try { jaViu = sessionStorage.getItem('mp-abertura') === '1'; } catch (e) { jaViu = false; }

    if (jaViu || menosMovimento.matches) {
      tela.remove();
      raiz.classList.add('abertura-pronta');
      return;
    }

    tela.hidden = false;
    medirTracos(tela);

    /* forca o layout antes de animar, senao o dasharray entra junto com a animacao */
    void tela.offsetWidth;

    raiz.classList.add('abrindo');

    window.setTimeout(function () {
      tela.remove();
      raiz.classList.remove('abrindo');
      raiz.classList.add('abertura-pronta');
      try { sessionStorage.setItem('mp-abertura', '1'); } catch (e) { /* modo privado */ }
    }, 1600);
  }

  /* ------------------------------------------------------ Revelar no scroll */

  function revelar() {
    var alvos = doc.querySelectorAll('.revelar');
    if (!alvos.length) { return; }

    if (menosMovimento.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(alvos, function (el) { el.classList.add('is-visivel'); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        e.target.classList.add('is-visivel');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    Array.prototype.forEach.call(alvos, function (el) { obs.observe(el); });
  }

  /* ------------------------------------------- Monograma: MP -> nome -> marca */

  function monograma() {
    var secao = doc.getElementById('monograma');
    var caixa = doc.getElementById('monograma-palavras');
    if (!secao || !caixa) { return; }

    medirTracos(secao);

    var palavras = Array.prototype.slice.call(caixa.children);

    if (menosMovimento.matches) {
      secao.classList.add('is-visivel');
      palavras.forEach(function (p, i) {
        p.classList.toggle('is-ativa', i === palavras.length - 1);
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (e.isIntersecting) { secao.classList.add('is-visivel'); }
        });
      }, { threshold: 0.35 });
      obs.observe(secao);
    } else {
      secao.classList.add('is-visivel');
    }

    /*
     * A palavra acompanha o quanto a secao ja atravessou a tela: entrando,
     * "MP"; no meio, o nome; saindo, "Barbearia".
     */
    var ultima = -1;

    function acompanhar() {
      var r = secao.getBoundingClientRect();
      var alturaTotal = r.height + window.innerHeight;
      var avanco = (window.innerHeight - r.top) / alturaTotal;

      if (avanco < 0 || avanco > 1) { return; }

      var i = Math.min(palavras.length - 1, Math.floor(avanco * palavras.length));
      if (i === ultima) { return; }

      ultima = i;
      palavras.forEach(function (p, n) { p.classList.toggle('is-ativa', n === i); });
    }

    var agendado = false;
    window.addEventListener('scroll', function () {
      if (agendado) { return; }
      agendado = true;
      window.requestAnimationFrame(function () {
        acompanhar();
        agendado = false;
      });
    }, { passive: true });

    acompanhar();
  }

  /* ------------------------------------------------------------------ Init */

  abrir();
  revelar();
  monograma();
})();
