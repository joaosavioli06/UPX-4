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

            marcadorAtual = L.marker(e.latlng).addTo(map)
                .bindPopup(`Coordenadas: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`)
                .openPopup();

            // Guardar coordenadas para la denuncia
            localStorage.setItem("latitude", e.latlng.lat);
            localStorage.setItem("longitude", e.latlng.lng);
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

                        // Guardar coordenadas de la búsqueda
                        localStorage.setItem("latitude", lat);
                        localStorage.setItem("longitude", lon);
                        
                        const enderecoInput = document.getElementById("endereco");
                        if (cep && enderecoInput) {
                            const endereco = data[0].address?.road || ""; // extrae solo la rua
                            enderecoInput.value = endereco;
                        }
                        
                    } else {
                        alert("Endereço não encontrado. Tente ser mais específico.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar o endereço:", error);
                    alert("Erro ao buscar o endereço.");
                });
        }

        // Eventos da tecla Enter
        document.getElementById("cep")?.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                buscarEndereco();
            }
        });
        document.getElementById("endereco")?.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                buscarEndereco();
            }
        });
    }

    // =============================
    // EcoTrek - Modal de denúncia
    // =============================

    const abrirModal = document.getElementById("enviar"); // botão do formulario
    const modal = document.getElementById("modal");

    if (abrirModal && modal) {
        abrirModal.addEventListener("click", () => {
            const tipo = document.getElementById("reclamacao")?.value;
            const descricao = document.getElementById("ocorrido")?.value;
            const lat = localStorage.getItem("latitude");
            const lng = localStorage.getItem("longitude");

            // validação
            if (!tipo) { alert("Por favor, selecione o tipo de reclamação."); return; }
            if (!descricao) { alert("Por favor, descreva o ocorrido."); return; }
            if (!lat || !lng) { alert("Por favor, clique em um ponto no mapa para selecionar a localização."); return; }

            // Copiar valores ao modal
            document.getElementById("modal_reclamacao").value = tipo;
            document.getElementById("modal_ocorrido").value = descricao;

            modal.showModal();
        });
    }

    // fechar modal
    const fecharModal = document.querySelector(".fechar-modal");
    if (fecharModal && modal) {
        fecharModal.addEventListener("click", () => modal.close());
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.close();
    });
});
