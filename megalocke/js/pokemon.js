const iconURL = type => `https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${type}.svg`;
const artworkURL = (id, pokedexAltId) => {
    if (pokedexAltId) {
        return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokedexAltId}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

let allPokemonData = [];
let currentActiveGen = '';

const tabContent = document.getElementById('tabContent');
const tabList = document.getElementById('genTabs');
const searchInput = document.getElementById('pokemonSearchInput');
const clearSearchButton = document.getElementById('clearSearchButton');

let searchResultsContainer = document.getElementById('searchResultsContainer');
if (!searchResultsContainer) {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'searchResultsContainer';
    searchResultsContainer.className = 'row g-4';
    searchResultsContainer.style.display = 'none';
    tabContent.parentNode.insertBefore(searchResultsContainer, tabContent.nextSibling);
}

let noResultsMessage = document.getElementById('noResultsMessage');
if (!noResultsMessage) {
    noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'noResultsMessage';
    noResultsMessage.className = 'alert alert-warning text-center mt-4';
    noResultsMessage.style.display = 'none';
    noResultsMessage.textContent = 'No se encontraron Pokémon con ese nombre.';
    document.querySelector('.inner-content').insertBefore(noResultsMessage, tabContent);
}

function filterPokemon(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const allPokemonCards = document.querySelectorAll('.pokemon-card-container');

    // **Limpiar el contenedor de resultados de búsqueda al inicio de cada búsqueda**
    searchResultsContainer.innerHTML = ''; // Esto es crucial para evitar duplicados

    if (lowerCaseSearchTerm.length === 0) {
        noResultsMessage.style.display = 'none';
        disableTabs(false); // Habilitar las pestañas
        searchResultsContainer.style.display = 'none'; // Ocultar el contenedor de búsqueda
        tabContent.style.display = 'block'; // Mostrar el contenido de las pestañas

        // Asegurarse de que solo la pestaña activa actual sea visible
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('show', 'active');
            if (pane.id === currentActiveGen) {
                pane.classList.add('show', 'active');
            }
        });

        // Asegurarse de que las tarjetas en la pestaña activa se muestren, las demás se oculten
        allPokemonCards.forEach(card => {
            const pokemonGen = card.getAttribute('data-pokemon-gen');
            if (pokemonGen === currentActiveGen) {
                card.style.display = ''; // Mostrar la tarjeta si pertenece a la gen activa
            } else {
                card.style.display = 'none'; // Ocultar la tarjeta si no pertenece a la gen activa
            }
        });

    } else {
        let resultsFound = false;

        allPokemonData.forEach(pkmn => { // Iterar sobre los datos originales para evitar clonar duplicados
            const pokemonName = pkmn.name.toLowerCase();
            if (pokemonName.includes(lowerCaseSearchTerm)) {
                resultsFound = true;
                // Crear una nueva tarjeta en lugar de clonar una existente
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 pokemon-card-container';
                col.setAttribute('data-pokemon-name', pkmn.name.toLowerCase());
                col.setAttribute('data-pokemon-gen', `gen-${pkmn.gen.replace(/\s+/g, '-').toLowerCase()}`); // Asegurarse de que la gen se guarde correctamente

                col.innerHTML = `
                    <div class="pokemon-card">
                        <div class="pokemon-img-container">
                            <img class="pokemon-img" src="${artworkURL(pkmn.id, pkmn.pokedex_alt_id)}" alt="${pkmn.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x225/e9ecef/6c757d?text=${pkmn.name}';">
                        </div>
                        <h5>${pkmn.name}</h5>
                        <div class="pokemon-types">
                            ${pkmn.types.map(t => `<img src="${iconURL(t)}" class="type-icon" alt="${t}" title="${t}">`).join('')}
                        </div>
                        <div class="pokemon-details">
                            <p>
                                ${pkmn.abilities.map(t => `<span class="badge bg-secondary">${t}</span>`).join(' ')}
                            </p>
                            <p><strong>Stats:</strong> ${pkmn.stats}</p>
                        </div>
                    </div>
                `;
                searchResultsContainer.appendChild(col);
            }
        });

        noResultsMessage.style.display = resultsFound ? 'none' : 'block';
        disableTabs(true); // Deshabilitar las pestañas durante la búsqueda

        tabContent.style.display = 'none'; // Ocultar el contenido de las pestañas
        searchResultsContainer.style.display = resultsFound ? 'flex' : 'none'; // Mostrar/ocultar el contenedor de búsqueda
    }
}

function disableTabs(disable) {
    const tabButtons = tabList.querySelectorAll('.nav-link');
    tabButtons.forEach(button => {
        if (disable) {
            button.classList.add('disabled');
            button.setAttribute('aria-disabled', 'true');
            button.style.pointerEvents = 'none';
        } else {
            button.classList.remove('disabled');
            button.removeAttribute('aria-disabled');
            button.style.pointerEvents = 'auto';
        }
    });
}

// Definimos la función onSearchInput una sola vez, fuera del fetch, para que no se dupliquen listeners.
function onSearchInput(event) {
    const searchTerm = event.target.value;
    filterPokemon(searchTerm);
    if (searchTerm.length > 0) {
        clearSearchButton.style.display = 'block';
        // disableTabs(true); // Ya se maneja dentro de filterPokemon
    } else {
        clearSearchButton.style.display = 'none';
        // disableTabs(false); // Ya se maneja dentro de filterPokemon
        filterPokemon(''); // Limpiar los resultados y volver a la vista normal
    }
}

if (searchInput) {
    searchInput.removeEventListener('input', onSearchInput); // Asegurarse de no añadir duplicados
    searchInput.addEventListener('input', onSearchInput);
}

if (clearSearchButton) {
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        filterPokemon(''); // Limpiar la búsqueda y volver a la vista normal
        clearSearchButton.style.display = 'none';
        // disableTabs(false); // Ya se maneja dentro de filterPokemon
    });
}

// Fetch solo para cargar datos y crear pestañas y cards (sin crear searchResultsContainer ni listeners)
fetch('data/pokemonData.json')
    .then(response => {
        if (!response.ok) throw new Error('Error cargando el JSON');
        return response.json();
    })
    .then(pokemonData => {
        allPokemonData = pokemonData; // Almacenar todos los datos
        const grouped = {};
        pokemonData.forEach(p => {
            if (!grouped[p.gen]) grouped[p.gen] = [];
            grouped[p.gen].push(p);
        });

        let first = true;
        for (const gen in grouped) {
            const tabId = `gen-${gen.replace(/\s+/g, '-').toLowerCase()}`;

            const tabButton = document.createElement('button');
            tabButton.className = `nav-link ${first ? 'active' : ''}`;
            tabButton.setAttribute('data-bs-toggle', 'tab');
            tabButton.setAttribute('data-bs-target', `#${tabId}`);
            tabButton.setAttribute('type', 'button');
            tabButton.setAttribute('role', 'tab');
            tabButton.setAttribute('aria-controls', tabId);
            tabButton.setAttribute('aria-selected', first ? 'true' : 'false');
            tabButton.textContent = `${gen}`;

            const listItem = document.createElement('li');
            listItem.className = 'nav-item';
            listItem.appendChild(tabButton);
            tabList.appendChild(listItem);

            tabButton.addEventListener('shown.bs.tab', () => {
                currentActiveGen = tabId;
                // Al cambiar de pestaña, limpiar la búsqueda si había algo
                if (searchInput.value.length > 0) {
                    searchInput.value = ''; // Limpiar el input de búsqueda
                    clearSearchButton.style.display = 'none';
                }
                filterPokemon(''); // Llama a filterPokemon para mostrar la pestaña activa y ocultar los resultados de búsqueda
            });

            const pane = document.createElement('div');
            pane.className = `tab-pane fade ${first ? 'show active' : ''}`;
            pane.id = tabId;
            pane.setAttribute('role', 'tabpanel');
            pane.setAttribute('aria-labelledby', `${tabId}-tab`);

            const row = document.createElement('div');
            row.className = 'row g-4';

            grouped[gen].forEach(pkmn => {
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 pokemon-card-container';
                col.setAttribute('data-pokemon-name', pkmn.name.toLowerCase());
                col.setAttribute('data-pokemon-gen', tabId);

                col.innerHTML = `
                    <div class="pokemon-card">
                        <div class="pokemon-img-container">
                            <img class="pokemon-img" src="${artworkURL(pkmn.id, pkmn.pokedex_alt_id)}" alt="${pkmn.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x225/e9ecef/6c757d?text=${pkmn.name}';">
                        </div>
                        <h5>${pkmn.name}</h5>
                        <div class="pokemon-types">
                            ${pkmn.types.map(t => `<img src="${iconURL(t)}" class="type-icon" alt="${t}" title="${t}">`).join('')}
                        </div>
                        <div class="pokemon-details">
                            <p>
                                ${pkmn.abilities.map(t => `<span class="badge bg-secondary">${t}</span>`).join(' ')}
                            </p>
                            <p><strong>Stats:</strong> ${pkmn.stats}</p>
                        </div>
                    </div>
                `;
                row.appendChild(col);
            });

            pane.appendChild(row);
            tabContent.appendChild(pane);

            if (first) {
                currentActiveGen = tabId;
            }
            first = false;
        }

        filterPokemon(''); // Inicializar la vista de la primera pestaña
    })
    .catch(err => {
        console.error('Error:', err);
        const innerContent = document.querySelector('.inner-content');
        if (innerContent) {
            innerContent.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los datos Pokémon. Por favor, inténtalo de nuevo más tarde.</div>`;
        }
    });