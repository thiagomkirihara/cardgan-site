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
// CATEGORIA DA URL
// ==========================================

const params = new URLSearchParams(window.location.search);

const categoriaFiltro = params.get("categoria");


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

        // Busca os produtos no Firestore
        const snap = await getDocs(
            collection(db, "produtos")
        );

        let produtos = [];

        snap.forEach((doc) => {

            produtos.push({
                id: doc.id,
                ...doc.data()
            });

        });

        console.log("PRODUTOS DO FIREBASE:", produtos);


        // ==========================================
        // FILTRO VINDO DA URL
        // ==========================================

        if (categoriaFiltro) {

            produtos = produtos.filter((produto) => {

                return produto.categoria === categoriaFiltro;

            });

            document.querySelectorAll(".filtro").forEach((botao) => {

                botao.classList.remove("ativo");

                if (
                    botao.dataset.categoria === categoriaFiltro
                ) {

                    botao.classList.add("ativo");

                }

            });

        }


        // ==========================================
        // NENHUM PRODUTO
        // ==========================================

        if (produtos.length === 0) {

            grid.innerHTML = `
                <div style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:60px;
                    color:#aaa;
                ">

                    <div style="
                        font-size:48px;
                        margin-bottom:15px;
                    ">
                        📦
                    </div>

                    <p>
                        Nenhum produto encontrado.
                    </p>

                </div>
            `;

            return;
        }


        // ==========================================
        // MOSTRAR PRODUTOS
        // ==========================================

        grid.innerHTML = produtos.map((produto) => {

            return `

                <div
                    class="produto-card"
                    data-categoria="${produto.categoria || ""}"
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


        // Depois que os cards foram criados,
        // ativa os filtros
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
                color:#aaa;
            ">

                Erro ao carregar produtos.

            </div>
        `;

    }

}


// ==========================================
// FILTROS
// ==========================================

function iniciarFiltros() {

    const botoes = document.querySelectorAll(".filtro");

    console.log("BOTÕES DE FILTRO:", botoes.length);


    botoes.forEach((botao) => {

        botao.onclick = function () {

            const categoria = botao.dataset.categoria;

            console.log(
                "Filtro selecionado:",
                categoria
            );


            // Remove ativo de todos
            botoes.forEach((btn) => {

                btn.classList.remove("ativo");

            });


            // Ativa o botão clicado
            botao.classList.add("ativo");


            // Pega todos os produtos
            const cards = document.querySelectorAll(
                ".produto-card"
            );


            cards.forEach((card) => {

                // BOTÃO TODOS
                if (!categoria) {

                    card.style.display = "";

                    return;

                }


                // CATEGORIA ESPECÍFICA
                if (
                    card.dataset.categoria === categoria
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        };

    });

}


// ==========================================
// INICIA A PÁGINA
// ==========================================

carregarProdutos();
