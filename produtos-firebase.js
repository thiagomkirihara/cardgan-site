// produtos-firebase.js
// Carrega produtos do Firebase na página produtos.html

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgF1ZX49xae0bGJDO9FsmtBfISA1GI3Wg",
    authDomain: "cardgan-engenharia.firebaseapp.com",
    projectId: "cardgan-engenharia",
    storageBucket: "cardgan-engenharia.firebasestorage.app",
    messagingSenderId: "9870650048",
    appId: "1:9870650048:web:530aae0e79873bbd9d1b25"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const categoriaFiltro = params.get("categoria");

const categoriaLabels = {
    postes: "Postes", caixas: "Caixas", disjuntores: "Disjuntores",
    cabos: "Cabos", conectores: "Conectores", acessorios: "Acessórios"
};

async function carregarProdutos() {
    const grid = document.getElementById("grid-produtos");
    if (!grid) return;

    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#aaa;font-size:16px;">
        Carregando produtos...
    </div>`;

    try {
        const q = query(collection(db, "produtos"), orderBy("criadoEm", "desc"));
        const snap = await getDocs(q);

        let produtos = [];
        snap.forEach(doc => produtos.push({ id: doc.id, ...doc.data() }));

        if (categoriaFiltro) {
            produtos = produtos.filter(p => p.categoria === categoriaFiltro);
            document.querySelectorAll(".filtro").forEach(btn => {
                btn.classList.remove("ativo");
                if (btn.dataset.categoria === categoriaFiltro) btn.classList.add("ativo");
            });
        }

        if (produtos.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#aaa;">
                <div style="font-size:48px;margin-bottom:15px;">📦</div>
                <p style="font-size:16px;">Nenhum produto encontrado nesta categoria.</p>
            </div>`;
            return;
        }

        grid.innerHTML = produtos.map(p => `
            <div class="produto-card" data-categoria="${p.categoria || ''}">
                <img src="${p.imagem || 'assets/postesimagem.jpg'}"
                     alt="${p.nome}"
                     onerror="this.src='assets/postesimagem.jpg'">
                <div class="produto-info">
                    <h3>${p.nome}</h3>
                    <p>${p.descricao || ''}</p>
                    <span class="preco">${p.preco}</span>
                    <a href="produto.html?id=${p.id}" class="btn-produto-detalhes">Ver Detalhes</a>
                </div>
            </div>
        `).join("");

    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:#aaa;">
            Erro ao carregar produtos. Tente novamente.
        </div>`;
    }
}

function iniciarFiltros() {
    document.querySelectorAll(".filtro").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filtro").forEach(b => b.classList.remove("ativo"));
            btn.classList.add("ativo");

            const cat = btn.dataset.categoria;
            document.querySelectorAll(".produto-card").forEach(card => {
                card.style.display = (!cat || card.dataset.categoria === cat) ? "block" : "none";
            });
        });
    });
}

carregarProdutos().then(() => iniciarFiltros());
