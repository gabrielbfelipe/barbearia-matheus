/*
 * Conteudo editavel do site: servicos e galeria.
 * Nenhum preco inventado -- preco: null renderiza "Sob consulta".
 */

const SERVICOS = [
  {
    nome: 'Corte',
    descricao: 'Corte masculino adaptado ao seu formato de rosto e ao estilo que você procura.',
    preco: null,
    duracao: null
  },
  {
    nome: 'Barba',
    descricao: 'Modelagem, alinhamento e acabamento com toalha quente.',
    preco: null,
    duracao: null
  },
  {
    nome: 'Corte e barba',
    descricao: 'O atendimento completo, do corte ao acabamento final.',
    preco: null,
    duracao: null,
    destaque: true
  },
  {
    nome: 'Sobrancelha',
    descricao: 'Acabamento masculino, discreto, feito na navalha.',
    preco: null,
    duracao: null
  },
  {
    nome: 'Corte infantil',
    descricao: 'Atendimento no tempo da criança, sem pressa e sem susto.',
    preco: null,
    duracao: null
  }
];

/* Filtros da galeria. A ordem aqui e a ordem dos botoes. */
const CATEGORIAS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'degrade', rotulo: 'Degradê' },
  { id: 'classico', rotulo: 'Clássico' },
  { id: 'moderno', rotulo: 'Moderno' },
  { id: 'barba', rotulo: 'Barba' },
  { id: 'infantil', rotulo: 'Infantil' }
];

/*
 * Galeria.
 * `provisorio: true` marca foto de banco de imagens -- NAO e trabalho do Matheus.
 * Ao receber as fotos reais: troque `src`, remova `provisorio` e desligue
 * MODO_PROTOTIPO em config.js.
 */
const GALERIA = [
  { src: 'assets/placeholder/degrade-01.webp', cat: 'degrade', alt: 'Barbeiro finalizando um degradê com navalha', provisorio: true, alto: true },
  { src: 'assets/placeholder/degrade-02.webp', cat: 'degrade', alt: 'Acabamento do degradê com pente e navalhete', provisorio: true },
  { src: 'assets/placeholder/degrade-04.webp', cat: 'degrade', alt: 'Cliente tendo o cabelo cortado na cadeira', provisorio: true },
  { src: 'assets/placeholder/degrade-05.webp', cat: 'degrade', alt: 'Detalhe do degradê sendo executado', provisorio: true },

  { src: 'assets/placeholder/classico-02.webp', cat: 'classico', alt: 'Barbeiro cortando cabelo com máquina', provisorio: true },
  { src: 'assets/placeholder/classico-03.webp', cat: 'classico', alt: 'Finalização do corte com spray', provisorio: true, alto: true },
  { src: 'assets/placeholder/classico-04.webp', cat: 'classico', alt: 'Corte clássico sendo executado com tesoura', provisorio: true },

  { src: 'assets/placeholder/moderno-02.webp', cat: 'moderno', alt: 'Corte moderno sendo finalizado', provisorio: true },
  { src: 'assets/placeholder/moderno-04.webp', cat: 'moderno', alt: 'Corte trabalhado com tesoura', provisorio: true, alto: true },
  { src: 'assets/placeholder/moderno-05.webp', cat: 'moderno', alt: 'Máquina de corte em uso', provisorio: true },

  { src: 'assets/placeholder/barba-01.webp', cat: 'barba', alt: 'Barba sendo aparada com tesoura', provisorio: true },
  { src: 'assets/placeholder/barba-02.webp', cat: 'barba', alt: 'Acabamento de barba com navalha', provisorio: true, alto: true },
  { src: 'assets/placeholder/barba-04.webp', cat: 'barba', alt: 'Barba finalizada', provisorio: true },

  { src: 'assets/placeholder/infantil-01.webp', cat: 'infantil', alt: 'Menino atendido na cadeira da barbearia', provisorio: true },
  { src: 'assets/placeholder/infantil-02.webp', cat: 'infantil', alt: 'Criança durante o corte de cabelo', provisorio: true, alto: true },
  { src: 'assets/placeholder/infantil-03.webp', cat: 'infantil', alt: 'Barbeiro ajustando o cabelo de um menino', provisorio: true },
  { src: 'assets/placeholder/infantil-04.webp', cat: 'infantil', alt: 'Criança usando capa de barbeiro após o corte', provisorio: true }
];

/* Fotos usadas na faixa do atendimento infantil. */
const INFANTIL = [
  { src: 'assets/placeholder/infantil-02.webp', alt: 'Criança durante o corte de cabelo', provisorio: true },
  { src: 'assets/placeholder/infantil-04.webp', alt: 'Criança usando capa de barbeiro após o corte', provisorio: true },
  { src: 'assets/placeholder/infantil-03.webp', alt: 'Barbeiro ajustando o cabelo de um menino', provisorio: true }
];
