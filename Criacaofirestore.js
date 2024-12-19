const admin = require("firebase-admin");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(require("./bi-solucoes-firebase-adminsdk-cpgfc-15958fdd4e.json")),
  databaseURL: "https://bi-solucoes.firebaseio.com"
});

const db = admin.firestore();

// Lista de produtos e farmácias fictícios para vinculação
async function atualizarEstoque() {
  try {
    // Buscar produtos disponíveis
    const produtosSnapshot = await db.collection("produtos").get();
    const empresasSnapshot = await db.collection("empresas").where("endereco.estado", "==", "PE").get();

    if (produtosSnapshot.empty || empresasSnapshot.empty) {
      console.log("Não há produtos ou farmácias em Recife disponíveis.");
      return;
    }

    const produtos = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const empresas = empresasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const batch = db.batch();

    // Atualiza estoque com vínculos aleatórios
    for (let i = 0; i < 10; i++) { // Atualiza 10 registros de exemplo
      const produto = produtos[Math.floor(Math.random() * produtos.length)];
      const empresa = empresas[Math.floor(Math.random() * empresas.length)];

      const estoqueRef = db.collection("estoque").doc();
      batch.set(estoqueRef, {
        idProduto: produto.id,
        nomeProduto: produto.nome,
        idEmpresa: empresa.id,
        nomeFarmacia: empresa.razaoSocial,
        endereco: `${empresa.endereco.logradouro}, ${empresa.endereco.numero} - ${empresa.endereco.cep}`,
        quantidade: Math.floor(Math.random() * 50) + 1, // Quantidade aleatória entre 1 e 50
        preco: produto.preco || (Math.random() * 50 + 5).toFixed(2) // Preço fictício caso não exista
      });
    }

    await batch.commit();
    console.log("Tabela 'estoque' atualizada com sucesso!");

  } catch (error) {
    console.error("Erro ao atualizar a tabela 'estoque':", error);
  }
}

// Executar função
atualizarEstoque();
