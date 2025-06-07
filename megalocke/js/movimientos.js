// URLs de los iconos de categoría (genéricos)
        const categoryIcons = {
            "Physical": "img/fisico.webp", // Icono de puño
            "Special": "img/especial.webp",   // Icono de estrella
            "Status": "img/estado.webp"     // Icono de estado
        };
document.addEventListener('DOMContentLoaded', () => {
    const pokemonMovesListContainer = document.querySelector('#pokemon-moves-list');

    // Carga los datos desde el archivo JSON externo
    fetch('data/movimientosData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(pokemonMovesData => {
            pokemonMovesData.forEach(move => {
                const moveCard = document.createElement('div');
                moveCard.classList.add('move-card'); // Añadir clase para estilos

                const typeIconUrl = `https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${move.tipo.toLowerCase()}.svg`;
                const categoryIconUrl = categoryIcons[move.tipoMovimiento];

                moveCard.innerHTML = `
                    <div class="move-card-header">
                        <span class="move-name">${move.movimiento}</span>
                        <span class="move-pp">PP: ${move.pp}</span>
                    </div>
                    <div class="move-details">
                        <div class="detail-item">
                            <span class="detail-label">Categoría:</span>
                            <img src="${categoryIconUrl}" alt="Categoría ${move.tipoMovimiento}" class="category-icon">
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tipo:</span>
                            <img src="${typeIconUrl}" alt="Tipo ${move.tipo}" class="type-icon">
                        </div>
                    </div>
                    <div class="move-description">${move.descripcion}</div>
                `;
                pokemonMovesListContainer.appendChild(moveCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos de Pokémon:', error);
            pokemonMovesListContainer.innerHTML = '<p style="text-align: center; color: var(--text-color-dark);">Error al cargar los movimientos Pokémon. Por favor, inténtelo de nuevo más tarde.</p>';
        });
});