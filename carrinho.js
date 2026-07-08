// carrinho.js — funciona em todas as páginas do site

(function () {

    // ===== ESTILOS DO CARRINHO =====
    const style = document.createElement("style");
    style.textContent = `
        /* BOTÃO FLUTUANTE */
        .carrinho-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 62px;
            height: 62px;
            background: #0B2E6B;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 998;
            box-shadow: 0 6px 24px rgba(11,46,107,.35);
            border: none;
            transition: .3s;
        }

        .carrinho-fab:hover {
            background: #08224f;
            transform: scale(1.08);
        }

        .carrinho-fab-icon {
            font-size: 26px;
            line-height: 1;
        }

        .carrinho-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #F5B400;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
        }

        /* PAINEL DO CARRINHO */
        .carrinho-painel {
            position: fixed;
            top: 0;
            right: -420px;
            width: 420px;
            height: 100vh;
            background: white;
            z-index: 1001;
            box-shadow: -8px 0 40px rgba(0,0,0,.15);
            display: flex;
            flex-direction: column;
            transition: right .35s cubic-bezier(.4,0,.2,1);
        }

        .carrinho-painel.aberto {
            right: 0;
        }

        .carrinho-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,.45);
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity .35s;
        }

        .carrinho-overlay.aberto {
            opacity: 1;
            pointer-events: all;
        }

        /* HEADER DO PAINEL */
        .carrinho-header {
            padding: 24px 24px 20px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #0B2E6B;
            color: white;
        }

        .carrinho-header h3 {
            font-size: 18px;
            font-weight: 700;
        }

        .carrinho-header span {
            font-size: 13px;
            opacity: .75;
            margin-top: 2px;
        }

        .carrinho-fechar {
            background: rgba(255,255,255,.15);
            border: none;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: .2s;
        }

        .carrinho-fechar:hover { background: rgba(255,255,255,.25); }

        /* ITENS */
        .carrinho-itens {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }

        .carrinho-vazio {
            text-align: center;
            padding: 60px 20px;
            color: #aaa;
        }

        .carrinho-vazio .icon { font-size: 52px; margin-bottom: 15px; }
        .carrinho-vazio p { font-size: 15px; }
        .carrinho-vazio a {
            display: inline-block;
            margin-top: 20px;
            background: #0B2E6B;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            transition: .2s;
        }
        .carrinho-vazio a:hover { background: #08224f; }

        .item-carrinho {
            display: flex;
            gap: 14px;
            padding: 16px 0;
            border-bottom: 1px solid #f3f4f6;
            align-items: center;
        }

        .item-carrinho:last-child { border-bottom: none; }

        .item-img {
            width: 64px;
            height: 64px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            flex-shrink: 0;
        }

        .item-sem-img {
            width: 64px;
            height: 64px;
            background: #f3f4f6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }

        .item-info { flex: 1; min-width: 0; }

        .item-nome {
            font-size: 14px;
            font-weight: 600;
            color: #0B2E6B;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .item-preco {
            font-size: 14px;
            color: #F5B400;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .item-qtd-controle {
            display: flex;
            align-items: center;
            gap: 0;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            width: fit-content;
            overflow: hidden;
        }

        .item-btn-qtd {
            width: 30px;
            height: 30px;
            border: none;
            background: #f8f9fa;
            cursor: pointer;
            font-size: 16px;
            font-weight: 700;
            color: #0B2E6B;
            transition: .2s;
        }

        .item-btn-qtd:hover { background: #e5e7eb; }

        .item-qtd-num {
            width: 36px;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
            border: none;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            height: 30px;
            outline: none;
            color: #333;
        }

        .item-remover {
            background: none;
            border: none;
            color: #ccc;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: .2s;
            flex-shrink: 0;
        }

        .item-remover:hover { color: #dc2626; background: #fee2e2; }

        /* RODAPÉ DO CARRINHO */
        .carrinho-footer {
            padding: 20px 24px;
            border-top: 1px solid #e5e7eb;
            background: #f8f9fa;
        }

        .carrinho-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .carrinho-total span:first-child {
            font-size: 14px;
            color: #666;
            font-weight: 600;
        }

        .carrinho-total-valor {
            font-size: 22px;
            font-weight: 700;
            color: #0B2E6B;
        }

        .btn-finalizar {
            width: 100%;
            background: #25d366;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: .3s;
            margin-bottom: 10px;
        }

        .btn-finalizar:hover {
            background: #1ebe5d;
            transform: translateY(-2px);
        }

        .btn-limpar-carrinho {
            width: 100%;
            background: none;
            border: 1px solid #e5e7eb;
            color: #888;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            transition: .2s;
        }

        .btn-limpar-carrinho:hover {
            background: #fee2e2;
            color: #dc2626;
            border-color: #fecaca;
        }

        @media (max-width: 480px) {
            .carrinho-painel { width: 100%; right: -100%; }
            .carrinho-fab { bottom: 20px; right: 20px; }
        }
    `;
    document.head.appendChild(style);

    // ===== HTML DO CARRINHO =====
    const html = `
        <div class="carrinho-overlay" id="carrinhoOverlay" onclick="toggleCarrinho()"></div>

        <button class="carrinho-fab" onclick="toggleCarrinho()" title="Ver carrinho">
            <span class="carrinho-fab-icon">🛒</span>
            <span class="carrinho-badge" id="carrinhoBadge">0</span>
        </button>

        <div class="carrinho-painel" id="carrinhopainel">
            <div class="carrinho-header">
                <div>
                    <h3>🛒 Meu Carrinho</h3>
                    <span id="carrinhoQtdTexto">0 itens</span>
                </div>
                <button class="carrinho-fechar" onclick="toggleCarrinho()">✕</button>
            </div>
            <div class="carrinho-itens" id="carrinhoItens"></div>
            <div class="carrinho-footer" id="carrinhoFooter" style="display:none">
                <div class="carrinho-total">
                    <span>Total estimado:</span>
                    <span class="carrinho-total-valor" id="carrinhoTotal">—</span>
                </div>
                <button class="btn-finalizar" onclick="finalizarCarrinho()">
                    <span>📱</span> Finalizar pelo WhatsApp
                </button>
                <button class="btn-limpar-carrinho" onclick="limparCarrinho()">
                    🗑️ Limpar carrinho
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    // ===== FUNÇÕES =====
    function getCarrinho() {
        return JSON.parse(localStorage.getItem("cardgan_carrinho") || "[]");
    }

    function salvarCarrinho(c) {
        localStorage.setItem("cardgan_carrinho", JSON.stringify(c));
    }

    function renderCarrinho() {
        const carrinho = getCarrinho();
        const container = document.getElementById("carrinhoItens");
        const footer = document.getElementById("carrinhoFooter");
        const badge = document.getElementById("carrinhoBadge");
        const qtdTexto = document.getElementById("carrinhoQtdTexto");

        const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);

        // Badge
        if (totalItens > 0) {
            badge.style.display = "flex";
            badge.textContent = totalItens > 99 ? "99+" : totalItens;
        } else {
            badge.style.display = "none";
        }

        qtdTexto.textContent = `${totalItens} ${totalItens === 1 ? "item" : "itens"}`;

        if (carrinho.length === 0) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <div class="icon">🛒</div>
                    <p>Seu carrinho está vazio.</p>
                    <a href="produtos.html">Ver produtos</a>
                </div>`;
            footer.style.display = "none";
            return;
        }

        container.innerHTML = carrinho.map((item, idx) => `
            <div class="item-carrinho">
                ${item.imagem
                    ? `<img src="${item.imagem}" class="item-img" onerror="this.style.display='none'">`
                    : `<div class="item-sem-img">📦</div>`}
                <div class="item-info">
                    <div class="item-nome">${item.nome}</div>
                    <div class="item-preco">${item.preco}</div>
                    <div class="item-qtd-controle">
                        <button class="item-btn-qtd" onclick="alterarItemQtd(${idx}, -1)">−</button>
                        <input class="item-qtd-num" type="number" value="${item.quantidade}"
                               min="1" onchange="setItemQtd(${idx}, this.value)">
                        <button class="item-btn-qtd" onclick="alterarItemQtd(${idx}, 1)">+</button>
                    </div>
                </div>
                <button class="item-remover" onclick="removerItem(${idx})" title="Remover">✕</button>
            </div>
        `).join("");

        // Tenta calcular total (só se os preços forem no formato R$ 1.234,56)
        let totalCalculado = false;
        let total = 0;
        carrinho.forEach(item => {
            const num = parseFloat(
                item.preco.replace(/[^\d,]/g, "").replace(",", ".")
            );
            if (!isNaN(num)) {
                total += num * item.quantidade;
                totalCalculado = true;
            }
        });

        document.getElementById("carrinhoTotal").textContent =
            totalCalculado
                ? `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "Consultar";

        footer.style.display = "block";
    }

    window.toggleCarrinho = () => {
        const painel = document.getElementById("carrinhopainel");
        const overlay = document.getElementById("carrinhoOverlay");
        painel.classList.toggle("aberto");
        overlay.classList.toggle("aberto");
    };

    window.alterarItemQtd = (idx, delta) => {
        const carrinho = getCarrinho();
        carrinho[idx].quantidade = Math.max(1, carrinho[idx].quantidade + delta);
        salvarCarrinho(carrinho);
        renderCarrinho();
    };

    window.setItemQtd = (idx, valor) => {
        const carrinho = getCarrinho();
        const qtd = Math.max(1, parseInt(valor) || 1);
        carrinho[idx].quantidade = qtd;
        salvarCarrinho(carrinho);
        renderCarrinho();
    };

    window.removerItem = (idx) => {
        const carrinho = getCarrinho();
        carrinho.splice(idx, 1);
        salvarCarrinho(carrinho);
        renderCarrinho();
    };

    window.limparCarrinho = () => {
        if (confirm("Limpar todos os itens do carrinho?")) {
            localStorage.removeItem("cardgan_carrinho");
            renderCarrinho();
        }
    };

    window.finalizarCarrinho = () => {
        const carrinho = getCarrinho();
        if (carrinho.length === 0) return;

        let msg = "Olá! Gostaria de solicitar um orçamento para os seguintes produtos:\n\n";

        carrinho.forEach((item, i) => {
            msg += `${i + 1}. *${item.nome}*\n`;
            msg += `   Qtd: ${item.quantidade}\n`;
            msg += `   Preço unitário: ${item.preco}\n\n`;
        });

        msg += "Por favor, me informe a disponibilidade e condições de pagamento. Obrigado!";

        const url = `https://wa.me/5511944614808?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank");
    };

    // Atualiza quando outro script dispara o evento
    window.addEventListener("carrinhoAtualizado", renderCarrinho);

    // Render inicial
    renderCarrinho();

})();
