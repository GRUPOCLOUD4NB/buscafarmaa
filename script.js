// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTaKdJDxa_z8i0isR0Eijp0PSRRfG6CAU",
  authDomain: "bi-solucoes.firebaseapp.com",
  projectId: "bi-solucoes",
  storageBucket: "bi-solucoes.firebasestorage.app",
  messagingSenderId: "761304787557",
  appId: "1:761304787557:web:f4ff7f285ffb5792bab48c",
  measurementId: "G-6DNLBKCWXB"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para cadastrar usuário
document.getElementById("cadastroForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
      await db.collection("users").add({
          nome,
          email,
          senha,
          dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert("Usuário cadastrado com sucesso!");
      e.target.reset();
  } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário. Tente novamente.");
  }
});

// Função para login de usuário
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  try {
      const snapshot = await db
          .collection("users")
          .where("email", "==", email)
          .where("senha", "==", senha)
          .get();

      if (!snapshot.empty) {
          alert("Login realizado com sucesso!");
      } else {
          alert("E-mail ou senha incorretos.");
      }
  } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert("Erro ao realizar login. Tente novamente.");
  }
});
