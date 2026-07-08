const params = new URLSearchParams(window.location.search);

const categoria = params.get("categoria");

const produtos = document.querySelectorAll(".produto-card");

if(categoria){

    produtos.forEach(produto => {

        if(produto.dataset.categoria !== categoria){

            produto.style.display = "none";

        }

    });

}