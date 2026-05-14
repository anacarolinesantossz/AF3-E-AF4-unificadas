// ══ DADOS BASE ══
const cardapio = [
  { id: 1,  nome: "Bruschetta Caprese",    preco: 28.90, categoria: "entrada",   disponivel: true  },
  { id: 2,  nome: "Carpaccio de Salmão",   preco: 42.00, categoria: "entrada",   disponivel: true  },
  { id: 3,  nome: "Risoto de Cogumelos",   preco: 56.90, categoria: "principal", disponivel: true  },
  { id: 4,  nome: "Filé ao Molho Madeira", preco: 68.50, categoria: "principal", disponivel: false },
  { id: 5,  nome: "Salmão Grelhado",       preco: 72.00, categoria: "principal", disponivel: true  },
  { id: 6,  nome: "Tiramisu",              preco: 24.00, categoria: "sobremesa", disponivel: true  },
  { id: 7,  nome: "Petit Gâteau",          preco: 32.00, categoria: "sobremesa", disponivel: true  },
  { id: 8,  nome: "Suco Natural",          preco: 12.00, categoria: "bebida",    disponivel: true  },
  { id: 9,  nome: "Água com Gás",          preco:  8.00, categoria: "bebida",    disponivel: true  },
  { id: 10, nome: "Espresso",              preco:  9.50, categoria: "bebida",    disponivel: true  },
];

const pedidos = [
  { id: 101, mesa: 3, itens: [1, 3, 8],     horario: "19:15", status: "entregue"   },
  { id: 102, mesa: 1, itens: [2, 5, 6, 10], horario: "19:30", status: "preparando" },
  { id: 103, mesa: 5, itens: [3, 7, 9],     horario: "19:45", status: "aguardando" },
  { id: 104, mesa: 2, itens: [1, 5, 7, 8],  horario: "20:00", status: "aguardando" },
  { id: 105, mesa: 4, itens: [2, 3, 6],     horario: "20:15", status: "preparando" },
];

// ════════════════════════════════════════════
// TAREFA 3.1 — Funções Modulares e Higher-Order
// ════════════════════════════════════════════

// a. calcularTotalPedido — usa find + reduce
function calcularTotalPedido(pedidoId) {
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (!pedido) return "Pedido não encontrado";
  return pedido.itens.reduce((acc, id) => {
    const prato = cardapio.find(c => c.id === id);
    return acc + (prato ? prato.preco : 0);
  }, 0);
}

console.log("=== TAREFA 3.1a — calcularTotalPedido ===");
console.log(calcularTotalPedido(102)); // 147.5
console.log(calcularTotalPedido(999)); // "Pedido não encontrado"

// b. aplicarDesconto — closure: retorna função que aplica o percentual
function aplicarDesconto(percentual) {
  return (preco) => parseFloat((preco * (1 - percentual / 100)).toFixed(2));
}

const desconto10 = aplicarDesconto(10);
const desconto20 = aplicarDesconto(20);

console.log("\n=== TAREFA 3.1b — aplicarDesconto (closure) ===");
console.log(desconto10(100));    // 90
console.log(desconto20(100));    // 80
console.log(desconto10(56.90)); // 51.21

// c. processarPedidos — higher-order function
function processarPedidos(listaPedidos, callback) {
  listaPedidos.forEach(callback);
}

console.log("\n=== TAREFA 3.1c — processarPedidos (3 usos) ===");

// Uso 1: listar mesas
console.log("-- Uso 1: listar mesas --");
processarPedidos(pedidos, p => console.log(`Mesa ${p.mesa}`));

// Uso 2: contar pedidos com status "aguardando"
let count = 0;
processarPedidos(pedidos, p => { if (p.status === "aguardando") count++; });
console.log(`Pedidos aguardando: ${count}`);

// Uso 3: gerar array de totais por pedido
const totais = [];
processarPedidos(pedidos, p => totais.push({ id: p.id, mesa: p.mesa, total: calcularTotalPedido(p.id) }));
console.log("Totais:", totais);

// ════════════════════════════════════════════
// TAREFA 3.2 — Recursividade
// ════════════════════════════════════════════

const combo = {
  nome: "Super Combo Família",
  preco: 0,
  subItens: [
    { nome: "Bruschetta",     preco: 28.90, subItens: [] },
    { nome: "Combo Casal",    preco: 10,
      subItens: [
        { nome: "Risoto", preco: 56.90, subItens: [] },
        { nome: "Salmão", preco: 72.00, subItens: [] },
      ]
    },
    { nome: "Sobremesa Dupla", preco: 5,
      subItens: [
        { nome: "Tiramisu",     preco: 24.00, subItens: [] },
        { nome: "Petit Gâteau", preco: 32.00, subItens: [] },
      ]
    },
  ]
};

// Caso base: sem subItens → retorna preco do item.
// Caso recursivo: preco do item + reduce chamando calcularPrecoCombo em cada sub-item.
function calcularPrecoCombo(item) {
  if (item.subItens.length === 0) return item.preco;
  return item.preco + item.subItens.reduce((acc, sub) => acc + calcularPrecoCombo(sub), 0);
}

console.log("\n=== TAREFA 3.2 — calcularPrecoCombo ===");
console.log(calcularPrecoCombo(combo).toFixed(2)); // "228.80"

// ════════════════════════════════════════════
// TAREFA 3.3 — Tratamento de Erros com try/catch
// ════════════════════════════════════════════

function adicionarPrato(nome, preco, categoria) {
  const categoriasValidas = ["entrada", "principal", "sobremesa", "bebida"];

  if (typeof nome !== "string" || nome.trim() === "") {
    throw new Error("Nome não pode ser vazio");
  }
  if (typeof preco !== "number" || isNaN(preco) || preco <= 0) {
    throw new Error("Preço deve ser um número positivo");
  }
  if (!categoriasValidas.includes(categoria)) {
    throw new Error("Categoria inválida. Use: entrada, principal, sobremesa, bebida");
  }
  if (cardapio.some(p => p.nome.toLowerCase() === nome.trim().toLowerCase())) {
    throw new Error("Prato já existe no cardápio");
  }

  const novo = {
    id: cardapio.length + 1,
    nome: nome.trim(),
    preco,
    categoria,
    disponivel: true,
  };
  cardapio.push(novo);
  return novo;
}

console.log("\n=== TAREFA 3.3 — adicionarPrato com try/catch ===");

try {
  adicionarPrato("", 25, "entrada");
} catch (e) {
  console.log(`Erro: ${e.message}`); // Erro: Nome não pode ser vazio
}

try {
  adicionarPrato("Ceviche", -10, "entrada");
} catch (e) {
  console.log(`Erro: ${e.message}`); // Erro: Preço deve ser um número positivo
}

try {
  adicionarPrato("Ceviche", 35, "lanche");
} catch (e) {
  console.log(`Erro: ${e.message}`); // Erro: Categoria inválida. Use: entrada, principal, sobremesa, bebida
}

try {
  const novo = adicionarPrato("Ceviche", 35, "entrada");
  console.log("Adicionado:", novo); // Sucesso!
} catch (e) {
  console.log(`Erro: ${e.message}`);
}
