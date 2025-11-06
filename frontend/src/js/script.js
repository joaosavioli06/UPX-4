// =============================
// EcoTrek - Página Index
// =============================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script da página inicial carregado!");

    const linkComoFunciona = document.querySelector(".link-como-funciona");
    const secaoComoFunciona = document.querySelector("#como-funciona");
    const linksMenu = document.querySelectorAll(".navegacao a");
    const paginaAtual = window.location.pathname;

    // Rolagem suave para "Como funciona"
    if (linkComoFunciona && secaoComoFunciona) {
        linkComoFunciona.addEventListener("click", (event) => {
            event.preventDefault();

            secaoComoFunciona.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    // Destacar o link da página atual
    linksMenu.forEach(link => {
        if (paginaAtual.includes(link.getAttribute("href").replace("./", ""))) {
            link.classList.add("ativo");
        }
    });

    // =============================
    // EcoTrek - Página Mapa
    // =============================

    const mapElement = document.getElementById("map");
    if (mapElement && typeof L !== "undefined") {
        const limitesSorocaba = L.latLngBounds(
            [-23.5600, -47.5400],
            [-23.4200, -47.3800]
        );

        const map = L.map("map", {
            center: [-23.5015, -47.4526],
            zoom: 13,
            maxBounds: limitesSorocaba,
            maxBoundsViscosity: 1.0
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        map.setMinZoom(12);
        map.setMaxZoom(17);

        let marcadorInicial = L.marker([-23.5015, -47.4526]).addTo(map)
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
            marcadorAtual.bindPopup(
                "Coordenadas: " + e.latlng.lat.toFixed(5) + ", " + e.latlng.lng.toFixed(5)
            ).openPopup();
        }

        map.on("click", onMapClick);

        // Função de busca por endereço
        function buscarEndereco() {
            const cep = document.getElementById("cep")?.value.trim();
            const endereco = document.getElementById("endereco")?.value.trim();
            if (!cep && !endereco) {
                alert("Por favor, digite um endereço ou CEP.");
                return;
            }

            const busca = cep || endereco;
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(busca + ', Sorocaba, SP')}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);

                        map.setView([lat, lon], 16);

                        if (marcadorInicial) {
                            map.removeLayer(marcadorInicial);
                            marcadorInicial = null;
                        }

                        if (marcadorAtual) {
                            map.removeLayer(marcadorAtual);
                        }

                        marcadorAtual = L.marker([lat, lon]).addTo(map);
                        marcadorAtual.bindPopup(`Endereço localizado:<br>${data[0].display_name}`).openPopup();
                    } else {
                        alert("Endereço não encontrado. Tente ser mais específico.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar o endereço:", error);
                    alert("Erro ao buscar o endereço.");
                });
        }

        // Eventos de tecla Enter
        document.getElementById("cep")?.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                buscarEndereco();
            }
        });

        document.getElementById("endereco")?.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                buscarEndereco();
            }
        });
    }

    // =============================
    // EcoTrek - Modal de denúncia
    // =============================

    const modal = document.getElementById("modal");
    const abrirModal = document.getElementById("abrir-modal");
    const fecharModal = document.getElementsByClassName("fechar-modal")[0];

    if (abrirModal && modal) {
        abrirModal.addEventListener("click", () => {
            const reclamacao = document.getElementById("reclamacao")?.value;
            const ocorrido = document.getElementById("ocorrido")?.value;

            document.getElementById("modal_reclamacao").value = reclamacao || "";
            document.getElementById("modal_ocorrido").value = ocorrido || "";

            modal.showModal();
        });
    }

    if (fecharModal && modal) {
        fecharModal.addEventListener("click", () => modal.close());
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.close();
    });
});
