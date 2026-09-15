# Matheus Pereira Barbearia

Site institucional de página única da Matheus Pereira Barbearia — Araraquara/SP.

**No ar:** https://matheuspereira-barbearia.vercel.app/

HTML, CSS e JavaScript puros. Sem build, sem dependências, sem framework.
Abre direto no navegador e publica em qualquer host estático.

---

## O que este site faz

O AppBarber prova que a barbearia existe; ele não constrói nenhum motivo para
escolher *esta* barbearia. O site faz o trabalho que a ferramenta operacional
não faz: posiciona a marca, mostra o espaço e leva a pessoa ao WhatsApp com o
mínimo de atrito.

O caminho é sempre o mesmo: **site → WhatsApp → agendamento**. O AppBarber
aparece uma vez, como ação secundária. É infraestrutura, não vitrine.

---

## Antes de publicar — pendências

Cinco itens dependem do Matheus. Enquanto não forem resolvidos o site funciona,
mas exibe conteúdo provisório claramente marcado.

| # | Pendência | Onde resolver |
| --- | --- | --- |
| 1 | Tabela real de serviços, preços e durações | `js/content.js` → `SERVICOS` |
| 2 | Confirmar endereço, WhatsApp e horários | `js/config.js` (campos marcados `CONFIRMAR`) |
| 3 | Arquivo vetorial do logo | `assets/brand/logo-mp.svg` |
| 4 | Fotos reais de cortes e atendimento | `assets/placeholder/` → `assets/fotos/` |
| 5 | A história real da barbearia | `index.html`, seção `#barbeiro` |

### Por que os dados estão marcados como não confirmados

Endereço, telefone, horários e a nota "5,0 / 22 avaliações" vieram do briefing,
mas **não foi possível confirmá-los de forma independente**: a busca pública não
localizou o estabelecimento e o AppBarber respondeu 429. Só o Instagram foi
verificado. Por isso `config.js` traz `confirmado: false` e a nota do Google
entra como `null`.

Com `nota: null` a seção de avaliações mostra apenas o botão "Ver avaliações no
Google", sem afirmar número nenhum — e o `aggregateRating` fica de fora do
JSON-LD. Dado errado em structured data prejudica mais que a ausência dele.
Nota do Google também muda sozinha, então número fixo no HTML envelhece mal.

---

## Editar o conteúdo

### `js/config.js` — dados do negócio

Fonte única de verdade. Alterar o telefone aqui muda o header, o rodapé, a barra
do mobile, todos os links de WhatsApp e o JSON-LD de uma vez. Não existe um
segundo lugar com o mesmo dado.

### `js/content.js` — serviços e galeria

```js
{ nome: 'Corte', descricao: '...', preco: null, duracao: null }
```

`preco: null` renderiza **"Sob consulta"**. Nenhum valor é inventado. Ao
preencher os preços, a nota de rodapé da seção muda sozinha.

A galeria tem 6 itens por padrão — 5 serviços e um painel de convite montado
pelo próprio JS. A grade é de 3 colunas justamente para fechar em duas fileiras
exatas; alterar a quantidade de serviços pode deixar célula vazia.

---

## Trocar as fotos provisórias

As imagens em `assets/placeholder/` vêm do Unsplash e **não são trabalho do
Matheus**. Enquanto estiverem no ar, a galeria exibe um aviso de "imagens
ilustrativas" — foto de banco não pode passar por portfólio.

Para substituir:

1. Coloque as fotos reais em `assets/fotos/`.
2. Atualize `GALERIA` e `INFANTIL` em `js/content.js`: novo `src`, novo `alt`,
   e **remova** `provisorio: true`.
3. Troque o `src` do fundo do CTA final em `index.html`.
4. Em `js/config.js`, defina `MODO_PROTOTIPO = false`.
5. Apague `assets/placeholder/`.

O aviso some sozinho. Nenhuma edição de estrutura é necessária.

---

## Scripts

Ambos usam Python com Pillow e rodam a partir da raiz do projeto. Só precisam
ser executados de novo se as imagens mudarem.

```bash
python scripts/organizar-imagens.py     # originais -> derivadas responsivas
python scripts/baixar-placeholders.py   # baixa e verifica os provisórios
```

`organizar-imagens.py` mantém os quatro arquivos originais intactos em
`assets/originais/` e nunca amplia uma imagem além do tamanho nativo.
A fachada saiu de **1009 KB para 114 KB** na mesma resolução.

`baixar-placeholders.py` faz um **HEAD em cada ID antes de baixar**. Isso não é
zelo excessivo: na primeira execução 3 dos 19 IDs retornaram 404. O endpoint
aleatório `source.unsplash.com` foi descontinuado e responde 503 — por isso os
IDs são curados e fixos, não sorteados.

---

## Estrutura

```
index.html
css/
  tokens.css     variáveis, reset, tipografia base
  layout.css     header, rodapé, botões, molduras
  sections.css   as 12 seções (media queries junto de cada uma)
  motion.css     monograma, revelações, movimento reduzido
js/
  config.js      dados do negócio
  content.js     serviços e galeria
  site.js        montagem da página, menu, JSON-LD
  motion.js      abertura e monograma
assets/
  brand/         monograma SVG, favicon, foto da placa
  fotos/         fachada, interior, Matheus (+ variantes)
  placeholder/   provisórios do Unsplash (descartável)
  originais/     os 4 arquivos originais, intactos
```

As media queries ficam **junto da seção que governam**. Um `responsive.css` no
fim da cascata é a origem clássica de conflito de especificidade entre
`.section` e `.cta`.

---

## Decisões de design

A paleta não foi escolhida por gosto: foi extraída por quantização das fotos
reais. A fachada é areia quente `#E7DBC4` com letreiro grafite `#1B1914`; o
interior traz o couro `#5A3A2E` do sofá. **Não há dourado na marca**, então não
há dourado no site.

A tipografia é **Jost** (display) e **Manrope** (texto). O letreiro da barbearia
é um sans geométrico tipo Futura — Jost é o equivalente livre mais próximo. Uma
serifada brigaria com a própria placa. Os papéis não se misturam: Jost nunca em
texto corrido, Manrope nunca em título.

O motivo estrutural são **molduras de traço fino**, tradução da vitrine de vidro
e das luminárias LED retangulares do teto do salão.

O hero é um split editorial e não uma foto full-bleed por um motivo concreto: a
fachada é um retrato de 765×1020. Dentro de um painel vertical ela fica nítida;
ocupando um monitor de 1920px seria ampliada 2,5× e apareceria macia.

Todo o movimento está concentrado no monograma MP — a abertura que se desenha e
a transição `MP → MATHEUS PEREIRA → BARBEARIA`. Não há entrada animada em cada
seção, elevação em cada card nem cursor customizado.

`prefers-reduced-motion` é respeitado: o monograma aparece pronto, sem sequência.
Nenhuma seção depende de JavaScript para existir — sem script, o conteúdo
aparece normalmente.

---

## Verificação

- Conferido a 1280px, 768px e 375px, sem scroll horizontal.
- Contraste: mínimo de 5,17:1 no texto secundário. Todos os pares passam AA.
- JSON-LD `BarberShop` validado, com `aggregateRating` corretamente ausente.
- 17 imagens de galeria carregando, nenhum 404.
- Navegação por teclado com foco visível.

Para rodar localmente:

```bash
python -m http.server 8777
```
