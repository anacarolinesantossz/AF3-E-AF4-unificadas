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
// TAREFA 4.1 — Objetos Literais com Métodos
// ════════════════════════════════════════════

const caixa = {
  saldoInicial: 500.00,
  transacoes: [],

  registrarEntrada(valor, descricao) {
    this.transacoes.push({ tipo: "entrada", valor, descricao });
  },

  registrarSaida(valor, descricao) {
    this.transacoes.push({ tipo: "saida", valor, descricao });
  },

  saldoAtual() {
    return this.transacoes.reduce((acc, t) => {
      return t.tipo === "entrada" ? acc + t.valor : acc - t.valor;
    }, this.saldoInicial);
  },

  extrato() {
    this.transacoes.forEach(t => {
      const sinal = t.tipo === "entrada" ? "[+]" : "[-]";
      console.log(`${sinal} R$ ${t.valor.toFixed(2)} — ${t.descricao}`);
    });
  },

  resumo() {
    const entradas = this.transacoes
      .filter(t => t.tipo === "entrada")
      .reduce((acc, t) => acc + t.valor, 0);
    const saidas = this.transacoes
      .filter(t => t.tipo === "saida")
      .reduce((acc, t) => acc + t.valor, 0);
    return {
      entradas: parseFloat(entradas.toFixed(2)),
      saidas:   parseFloat(saidas.toFixed(2)),
      saldo:    parseFloat((this.saldoInicial + entradas - saidas).toFixed(2)),
    };
  },
};

caixa.registrarEntrada(162.25, "Pedido 102 - Mesa 1");
caixa.registrarEntrada(97.90,  "Pedido 103 - Mesa 5");
caixa.registrarSaida(45.00,    "Compra de insumos");
caixa.registrarSaida(120.00,   "Pagamento garçom");

console.log("=== TAREFA 4.1 — Extrato ===");
caixa.extrato();

const { entradas, saidas, saldo } = caixa.resumo();
console.log(`Entradas: R$ ${entradas.toFixed(2)} | Saídas: R$ ${saidas.toFixed(2)} | Saldo: R$ ${saldo.toFixed(2)}`);
// → Entradas: R$ 260.15 | Saídas: R$ 165.00 | Saldo: R$ 595.15

// ════════════════════════════════════════════
// TAREFA 4.2 — Map e Set
// ════════════════════════════════════════════

// a. Map: total vendido por categoria (baseado nos pedidos realizados)
const vendasPorCategoria = new Map();

pedidos.forEach(pedido => {
  pedido.itens.forEach(itemId => {
    const prato = cardapio.find(c => c.id === itemId);
    if (!prato) return;
    const acumulado = vendasPorCategoria.get(prato.categoria) || 0;
    vendasPorCategoria.set(
      prato.categoria,
      parseFloat((acumulado + prato.preco).toFixed(2))
    );
  });
});

console.log("\n=== TAREFA 4.2a — Map: vendas por categoria ===");
vendasPorCategoria.forEach((total, categoria) => {
  console.log(`"${categoria}" → R$ ${total.toFixed(2)}`);
});
// "entrada"   → R$ 141.80
// "principal" → R$ 314.70
// "sobremesa" → R$ 112.00
// "bebida"    → R$ 41.50

// b. Set: categorias únicas presentes nos pedidos + comparação com todas do cardápio
const categoriasPedidas = new Set();
pedidos.forEach(pedido => {
  pedido.itens.forEach(itemId => {
    const prato = cardapio.find(c => c.id === itemId);
    if (prato) categoriasPedidas.add(prato.categoria);
  });
});

const todasCategorias = new Set(cardapio.map(p => p.categoria));
const naoFoiPedida = [...todasCategorias].filter(cat => !categoriasPedidas.has(cat));

console.log("\n=== TAREFA 4.2b — Set: categorias únicas ===");
console.log("Categorias pedidas:", categoriasPedidas);

if (naoFoiPedida.length === 0) {
  console.log("Categorias não pedidas: (nenhuma — todas aparecem nos pedidos)");
} else {
  console.log("Categorias não pedidas:", naoFoiPedida.join(", "));
}
