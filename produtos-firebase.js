// produtos-firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ==========================================
// FIREBASE
// ==========================================

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


// ==========================================
// NORMALIZAR CATEGORIA
// ==========================================

function normalizarCategoria(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

}


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    const grid = document.getElementById("grid-produtos");

    if (!grid) {
        console.error("grid-produtos não encontrado.");
        return;
    }

    grid.innerHTML = `
        <div style="
            grid-column:1/-1;
            text-align:center;
            padding:60px;
            color:#aaa;
        ">
            Carregando produtos...
        </div>
    `;

    try {

        const snap = await getDocs(
            collection(db, "produtos")
        );

        const produtos = [];

        snap.forEach((doc) => {

            produtos.push({
                id: doc.id,
                ...doc.data()
            });

        });

        console.log("PRODUTOS CARREGADOS:", produtos);

        if (produtos.length === 0) {

            grid.innerHTML = `
                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:60px;
                ">
                    <h3>Nenhum produto cadastrado.</h3>
                </div>
            `;

            return;
        }


        // ==========================================
        // MOSTRAR TODOS OS PRODUTOS
        // ==========================================

        grid.innerHTML = produtos.map((produto) => {

            return `
                <div
                    class="produto-card"
                    data-categoria="${normalizarCategoria(produto.categoria)}"
                >

                    <img
                        src="${produto.imagem || "assets/postesimagem.jpg"}"
                        alt="${produto.nome || "Produto"}"
                        onerror="this.src='assets/postesimagem.jpg'"
                    >

                    <div class="produto-info">

                        <h3>
                            ${produto.nome || "Produto"}
                        </h3>

                        <p>
                            ${produto.descricao || ""}
                        </p>

                        <span class="preco">
                            ${produto.preco || "Consultar"}
                        </span>

                        <a
                            href="produto.html?id=${produto.id}"
                            class="btn-produto-detalhes"
                        >
                            Ver Detalhes
                        </a>

                    </div>

                </div>
            `;

        }).join("");


        // ==========================================
        // INICIAR FILTROS
        // ==========================================

        iniciarFiltros();


    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR PRODUTOS:",
            erro
        );

        grid.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
            ">
                <h3>Erro ao carregar produtos.</h3>
                <p>Abra o console do navegador para verificar o erro.</p>
            </div>
        `;

    }

}


// ==========================================
// FILTROS
// ==========================================

function iniciarFiltros() {

    const botoes = document.querySelectorAll(".filtro");
    const cards = document.querySelectorAll(".produto-card");

    botoes.forEach((botao) => {

        botao.addEventListener("click", function () {

            const categoria =
                normalizarCategoria(
                    botao.dataset.categoria
                );


            // Tirar ativo de todos
            botoes.forEach((btn) => {
                btn.classList.remove("ativo");
            });


            // Ativar botão clicado
            botao.classList.add("ativo");


            // Mostrar/esconder produtos
            cards.forEach((card) => {

                const categoriaProduto =
                    normalizarCategoria(
                        card.dataset.categoria
                    );


                // TODOS
                if (categoria === "") {

                    card.style.display = "";

                    return;
                }


                // CATEGORIA
                if (categoriaProduto === categoria) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


    // ==========================================
    // VERIFICAR CATEGORIA VINDO DA HOME
    // ==========================================

    const params =
        new URLSearchParams(window.location.search);

    const categoriaURL =
        normalizarCategoria(
            params.get("categoria")
        );


    if (categoriaURL) {

        const botaoCategoria =
            Array.from(botoes).find((botao) => {

                return normalizarCategoria(
                    botao.dataset.categoria
                ) === categoriaURL;

            });


        if (botaoCategoria) {

            botaoCategoria.click();

        }

    }

}


// ==========================================
// INICIAR
// ==========================================

carregarProdutos();
