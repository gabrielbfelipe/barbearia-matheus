/*
 * Fonte unica de verdade do site.
 * Alterar aqui muda header, servicos, rodape, links de WhatsApp e o JSON-LD.
 *
 * ATENCAO aos campos marcados CONFIRMAR: foram informados no briefing mas nao
 * puderam ser verificados de forma independente (a busca publica nao localizou o
 * estabelecimento e o AppBarber respondeu 429). Confirme com o Matheus antes de
 * publicar e entao mude `confirmado` para true.
 */

const MODO_PROTOTIPO = true; // true = avisa que as fotos da galeria sao ilustrativas

const BARBEARIA = {
  nome: 'Matheus Pereira Barbearia',
  barbeiro: 'Matheus Pereira',

  telefone: '+55 16 99775-2326',   // CONFIRMAR
  whatsapp: '5516997752326',       // CONFIRMAR

  endereco: {                      // CONFIRMAR
    rua: 'Av. Casemiro Perez, 745',
    bairro: 'Vila Harmonia',
    cidade: 'Araraquara',
    estado: 'SP',
    cep: '14802-600'
  },

  instagram: 'https://www.instagram.com/barbearia_matheuspereira/',
  instagramUser: '@barbearia_matheuspereira',
  appbarber: 'https://sites.appbarber.com.br/matheuspereirab-7vpv',
  maps: 'https://www.google.com/maps/search/?api=1&query=Matheus+Pereira+Barbearia+Av.+Casemiro+Perez+745+Araraquara+SP',

  /*
   * Avaliacoes do Google. Deixe nota/total em null enquanto nao confirmar:
   * a secao entao mostra apenas o botao, sem afirmar numero nenhum.
   * Nota do Google muda sozinha -- numero fixo no HTML envelhece mal.
   */
  google: {
    url: 'https://www.google.com/maps/search/?api=1&query=Matheus+Pereira+Barbearia+Araraquara',
    nota: null,
    total: null
  },

  horarios: [                      // CONFIRMAR
    { dias: 'Terça a sexta', abre: '08:00', fecha: '20:30', diasISO: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { dias: 'Sábado', abre: '08:00', fecha: '18:00', diasISO: ['Saturday'] },
    { dias: 'Domingo e segunda', fechado: true, diasISO: ['Sunday', 'Monday'] }
  ],

  mensagemWhatsApp:
    'Olá, Matheus! Vi a Matheus Pereira Barbearia pelo site e gostaria de agendar um horário. Poderia me informar os horários disponíveis?',

  confirmado: false
};
