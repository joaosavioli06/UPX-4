// =============================
// EcoTrek - Página Index
// =============================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script da página inicial carregado!");

    const linkComoFunciona = document.querySelector(".link-como-funciona");
    const secaoComoFunciona = document.querySelector("#como-funciona");
    const linksMenu = document.querySelectorAll(".navegacao a");
    const paginaAtual = window.location.pathname;

    if (linkComoFunciona && secaoComoFunciona) {
        linkComoFunciona.addEventListener("click", (event) => {
            event.preventDefault();

            secaoComoFunciona.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    linksMenu.forEach(link => {
        if (paginaAtual.includes(link.getAttribute("href").replace("./", ""))) {
            link.classList.add("ativo");
        }
    });
});

// =============================
// EcoTrek - Página Mapa
// =============================

var map = L.map('map').setView([-23.5015, -47.4526], 13);
var popup = L.popup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marcadorInicial = L.marker([-23.5015, -47.4526]).addTo(map)
    .bindPopup("Sorocaba - SP")
    .openPopup();

let marcadorAtual = null;

function onMapClick(e) {
    if (marcadorInicial) {
        map.removeLayer(marcadorInicial);
        marcadorInicial = null;
    }

    if (marcadorAtual) {
        map.removeLayer(marcadorAtual);
    }

    marcadorAtual = L.marker(e.latlng).addTo(map);
    marcadorAtual.bindPopup("Coordenadas: " + e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5)).openPopup();
}

map.on("click", onMapClick);