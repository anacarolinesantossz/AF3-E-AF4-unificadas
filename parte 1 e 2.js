// GASTROCONTROL — AF3 / AF4
// Disciplina: Algoritmos e Linguagem de Programação
// Partes 1 e 2
// ══ DADOS BASE ══════════════════════════════════════════

const cardapio = [
  { id: 1,  nome: "Bruschetta Caprese",    preco: 28.90, categoria: "entrada",   disponivel: true  },
  { id: 2,  nome: "Carpaccio de Salmão",   preco: 42.00, categoria: "entrada",   disponivel: true  },
  { id: 3,  nome: "Risoto de Cogumelos",   preco: 56.90, categoria: "principal", disponivel: true  },
  { id: 4,  nome: "Filé ao Molho Madeira", preco: 68.50, categoria: "principal", disponivel: false },
  { id: 5,  nome: "Salmão Grelhado",       preco: 72.00, categoria: "principal", disponivel: true  },
  { id: 6,  nome: "Tiramisu",              preco: 24.00, categoria: "sobremesa", disponivel: true  },
  { id: 7,  nome: "Petit Gâteau",          preco: 32.00, categoria: "sobremesa", disponivel: true  },
  { id: 8,  nome: "Suco Natural",          preco: 12.00, categoria: "bebida",    disponivel: true  },
  { id: 9,  nome: "Água com Gás",          preco: 8.00,  categoria: "bebida",    disponivel: true  },
  { id: 10, nome: "Espresso",              preco: 9.50,  categoria: "bebida",    disponivel: true  },
];

const pedidos = [
  { id: 101, mesa: 3, itens: [1, 3, 8],     horario: "19:15", status: "entregue"   },
  { id: 102, mesa: 1, itens: [2, 5, 6, 10], horario: "19:30", status: "preparando" },
  { id: 103, mesa: 5, itens: [3, 7, 9],     horario: "19:45", status: "aguardando" },
  { id: 104, mesa: 2, itens: [1, 5, 7, 8],  horario: "20:00", status: "aguardando" },
  { id: 105, mesa: 4, itens: [2, 3, 6],     horario: "20:15", status: "preparando" },
];

// ════════════════════════════════════════════════════════
// PARTE 1 — STRINGS, ARRAYS E LOOPS

// ── Tarefa 1.1a — Recibo Formatado 

function gerarRecibo(pedidoId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (!pedido) return "Pedido não encontrado.";

  // busca cada prato pelo id dentro do cardápio
  const itensPedido = pedido.itens.map(id => cardapio.find(p => p.id === id));

  const subtotal = itensPedido.reduce((acc, p) => acc + p.preco, 0);
  const servico  = parseFloat((subtotal * 0.1).toFixed(2));
  const total    = parseFloat((subtotal + servico).toFixed(2));

  const barra  = "═".repeat(33);
  const tracos = "-".repeat(33);

  let recibo = "";
  recibo += barra + "\n";
  recibo += "      SABOR & ARTE — RECIBO\n";
  recibo += barra + "\n";
  recibo += `Mesa: ${pedido.mesa} | Horário: ${pedido.horario}\n`;
  recibo += tracos + "\n";

  itensPedido.forEach((prato, i) => {
    const label = `${i + 1}. ${prato.nome}`;
    const valor = `R$ ${prato.preco.toFixed(2).replace(".", ",")}`;
    recibo += `${label.padEnd(26)}${valor}\n`;
  });

  recibo += tracos + "\n";
  recibo += `${"Subtotal:".padEnd(26)}R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
  recibo += `${"Serviço (10%):".padEnd(26)}R$ ${servico.toFixed(2).replace(".", ",")}\n`;
  recibo += `${"TOTAL:".padEnd(26)}R$ ${total.toFixed(2).replace(".", ",")}\n`;
  recibo += barra;

  return recibo;
}

console.log("\n── T1.1a: Recibo do Pedido 102 ──────────────────");
console.log(gerarRecibo(102));

// ── Tarefa 1.1b — Buscar Prato (case-insensitive) ───────

function buscarPrato(termo) {
  return cardapio.filter(p => p.nome.toLowerCase().includes(termo.toLowerCase()));
}

console.log("\n── T1.1b: Busca por 'sal' ────────────────────────");
console.log(buscarPrato("sal").map(p => p.nome));

// ── Tarefa 1.1c — Resumo por Categoria (reduce) ─────────

// primeiro reduce: acumula qtd e soma por categoria
const acumulado = cardapio.reduce((acc, prato) => {
  const cat = prato.categoria;
  if (!acc[cat]) acc[cat] = { qtd: 0, soma: 0 };
  acc[cat].qtd++;
  acc[cat].soma += prato.preco;
  return acc;
}, {});

// segundo reduce: transforma soma em precoMedio
const resumoCategoria = Object.entries(acumulado).reduce((obj, [cat, dados]) => {
  obj[cat] = {
    qtd: dados.qtd,
    precoMedio: parseFloat((dados.soma / dados.qtd).toFixed(2)),
  };
  return obj;
}, {});

console.log("\n── T1.1c: Resumo por Categoria ───────────────────");
console.log(resumoCategoria);

// ════════════════════════════════════════════════════════
// ── Tarefa 1.2 — filter, map e reduce nos Pedidos ───────
// Regra: sem for/while — apenas filter, map, reduce, find
// ════════════════════════════════════════════════════════

// a) Nomes dos pratos do pedido 104
const nomesPedido104 = pedidos
  .find(p => p.id === 104)
  .itens
  .map(id => cardapio.find(p => p.id === id).nome);

console.log("\n── T1.2a: Nomes dos pratos — Pedido 104 ─────────");
console.log(nomesPedido104);

// b) Valor total de cada pedido → { id, mesa, total }
const totaisPedidos = pedidos.map(pedido => ({
  id:    pedido.id,
  mesa:  pedido.mesa,
  total: pedido.itens.reduce(
    (acc, id) => acc + cardapio.find(p => p.id === id).preco,
    0
  ),
}));

console.log("\n── T1.2b: Total por pedido ───────────────────────");
console.log(totaisPedidos);

// c) Total combinado dos pedidos com status "aguardando"
const totalAguardando = pedidos
  .filter(p => p.status === "aguardando")
  .reduce(
    (acc, pedido) =>
      acc + pedido.itens.reduce(
        (soma, id) => soma + cardapio.find(p => p.id === id).preco,
        0
      ),
    0
  );

console.log("\n── T1.2c: Total dos pedidos aguardando ───────────");
console.log(`R$ ${totalAguardando.toFixed(2)}`);

// d) Prato mais caro entre todos os pedidos "preparando"
const pratoMaisCaro = pedidos
  .filter(p => p.status === "preparando")
  .flatMap(p => p.itens)
  .map(id => cardapio.find(p => p.id === id))
  .reduce((caro, prato) => (prato.preco > caro.preco ? prato : caro));

console.log("\n── T1.2d: Prato mais caro nos pedidos preparando ─");
console.log(`${pratoMaisCaro.nome} — R$ ${pratoMaisCaro.preco.toFixed(2)}`);

// ════════════════════════════════════════════════════════
// ── Tarefa 1.3 — Matriz: Grid de Ocupação de Mesas ──────
// ════════════════════════════════════════════════════════

const ocupacao = [
  // Almoço  Tarde  Jantar  Noite
  [1, 0, 1, 0],   // Mesa 1
  [1, 1, 1, 0],   // Mesa 2
  [0, 0, 1, 1],   // Mesa 3
  [1, 0, 0, 1],   // Mesa 4
  [0, 0, 1, 0],   // Mesa 5
];

const nomesTurnos = ["Almoço", "Tarde", "Jantar", "Noite"];

// a) Taxa de ocupação por turno (loops aninhados)
console.log("\n── T1.3a: Ocupação por Turno ─────────────────────");

for (let j = 0; j < nomesTurnos.length; j++) {
  let ocupadas = 0;
  for (let i = 0; i < ocupacao.length; i++) {
    ocupadas += ocupacao[i][j];
  }
  const taxa = (ocupadas / ocupacao.length) * 100;
  console.log(`${nomesTurnos[j]}: ${taxa}% ocupado — ${ocupadas}/${ocupacao.length} mesas`);
}

// b) Mesas livres no turno Jantar
console.log("\n── T1.3b: Mesas livres no Jantar ─────────────────");

const idxJantar = nomesTurnos.indexOf("Jantar");
const mesasLivres = [];

for (let i = 0; i < ocupacao.length; i++) {
  if (ocupacao[i][idxJantar] === 0) mesasLivres.push(`Mesa ${i + 1}`);
}

const resultadoLivres = mesasLivres.length > 0 ? mesasLivres.join(", ") : "Nenhuma";
console.log(`Mesa(s) livre(s) no Jantar: ${resultadoLivres}`);

// c) Mesa mais e menos ocupada ao longo do dia
function encontrarMaisOcupada(grid) {
  let maiorQtd = -1;
  let menorQtd = Infinity;
  let mesaMaior = 0;
  let mesaMenor = 0;

  for (let i = 0; i < grid.length; i++) {
    let soma = 0;
    for (let j = 0; j < grid[i].length; j++) {
      soma += grid[i][j];
    }
    if (soma > maiorQtd) { maiorQtd = soma; mesaMaior = i + 1; }
    if (soma < menorQtd) { menorQtd = soma; mesaMenor = i + 1; }
  }

  // retorna as duas mesas com suas respectivas contagens
  return {
    mesa:          mesaMaior,
    qtdOcupada:    maiorQtd,
    mesaMaisLivre: mesaMenor,
    qtdLivre:      menorQtd,
  };
}

console.log("\n── T1.3c: Mesa mais e menos ocupada ──────────────");

// destructuring do resultado (qtdOcupada evita conflito com o array nomesTurnos)
const { mesa, qtdOcupada, mesaMaisLivre, qtdLivre } = encontrarMaisOcupada(ocupacao);
console.log(
  `Mesa mais ocupada: Mesa ${mesa} (${qtdOcupada}/4 turnos) | Mesa mais livre: Mesa ${mesaMaisLivre} (${qtdLivre}/4 turnos)`
);

// ════════════════════════════════════════════════════════
// PARTE 2 — PILHA, FILA E ALGORITMOS
// ════════════════════════════════════════════════════════

// ── Tarefa 2.1 — Pilha: Sistema de Undo / Redo ──────────
// Pilha = LIFO: push para empilhar, pop para desempilhar

const historico    = []; // ações executadas
const pilhaRefazer = []; // ações desfeitas (redo)

function executarAcao(descricao) {
  historico.push(descricao);
  // nova ação invalida o redo, igual ao comportamento do Word/VS Code
  pilhaRefazer.length = 0;
}

function desfazer() {
  if (historico.length === 0) return "Nada para desfazer.";
  const acao = historico.pop();
  pilhaRefazer.push(acao);
  return `Ação desfeita: ${acao}`;
}

function refazerAcao() {
  if (pilhaRefazer.length === 0) return "Nada para refazer.";
  const acao = pilhaRefazer.pop();
  historico.push(acao);
  return `Ação refeita: ${acao}`;
}

console.log("\n── T2.1: Sistema Undo / Redo ─────────────────────");

executarAcao("Adicionar prato 'Lasanha' ao cardápio");
executarAcao("Remover prato 'Filé ao Molho Madeira'");
executarAcao("Alterar preço do Risoto para R$ 59,90");

console.log(desfazer());       // Alterar...
console.log(desfazer());       // Remover...
console.log(refazerAcao());    // Remover... (refeita)
console.log(desfazer());       // Remover... (desfeita de novo)
console.log(desfazer());       // Adicionar...
console.log(desfazer());       // pilha vazia

// ── Tarefa 2.2 — Fila: Pedidos da Cozinha (FIFO) ────────
// Fila = FIFO: push para enfileirar, shift para desenfileirar

const filaCozinha = [];

function novoPedido(pedidoId, mesa) {
  filaCozinha.push({ pedidoId, mesa });
  console.log(`Pedido ${pedidoId} (Mesa ${mesa}) adicionado à fila.`);
}

function statusFila() {
  if (filaCozinha.length === 0) return "Nenhum pedido na fila.";
  const prox = filaCozinha[0];
  return `Fila: ${filaCozinha.length} pedidos | Próximo: Pedido ${prox.pedidoId} (Mesa ${prox.mesa})`;
}

function prepararProximo() {
  if (filaCozinha.length === 0) return "Nenhum pedido na fila.";
  const pedido = filaCozinha.shift(); // retira o primeiro da fila
  return `Preparando Pedido ${pedido.pedidoId} (Mesa ${pedido.mesa})... Restam ${filaCozinha.length} na fila.`;
}

function tempoEstimado() {
  if (filaCozinha.length === 0) return "Nenhum pedido na fila.";
  const minutos = filaCozinha.length * 15;
  const qtd = filaCozinha.length;
  return `Tempo estimado: ${minutos} min (${qtd} pedido${qtd > 1 ? "s" : ""} × 15 min cada)`;
}

console.log("\n── T2.2: Fila da Cozinha ─────────────────────────");

novoPedido(103, 5);
novoPedido(104, 2);
novoPedido(105, 4);

console.log(statusFila());
console.log(prepararProximo());
console.log(prepararProximo());
console.log(tempoEstimado());
console.log(prepararProximo());
console.log(prepararProximo()); // fila vazia
