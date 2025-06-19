const iconURL = type => `https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${type}.svg`;
const artworkURL = (id, pokedexAltId) => {
    if (pokedexAltId) {
        return `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/${pokedexAltId}.png`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
};

let allPokemonData = [];
let currentActiveGen = '';
let originalActiveGenTabText = ''; // NEW: To store the original text of the active tab

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
    // **MODIFICADO: Mensaje de "no encontrado" actualizado**
    noResultsMessage.textContent = 'No se encontraron Pokémon con ese nombre o habilidad.';
    document.querySelector('.inner-content').insertBefore(noResultsMessage, tabContent);
}

function updateActiveTabName(name) {
    const activeTabButton = tabList.querySelector('.nav-link.active');
    if (activeTabButton) {
        activeTabButton.textContent = name;
    }
}

function filterPokemon(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const allPokemonCards = document.querySelectorAll('.pokemon-card-container');
    const activeTabButton = tabList.querySelector('.nav-link.active');


    searchResultsContainer.innerHTML = ''; 

    if (lowerCaseSearchTerm.length === 0) {
        noResultsMessage.style.display = 'none';
        disableTabs(false);
        searchResultsContainer.style.display = 'none';
        tabContent.style.display = 'block';

        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('show', 'active');
            if (pane.id === currentActiveGen) {
                pane.classList.add('show', 'active');
            }
        });

        allPokemonCards.forEach(card => {
            const pokemonGen = card.getAttribute('data-pokemon-gen');
            if (pokemonGen === currentActiveGen) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
        // NEW: Revert tab name to original
        if (activeTabButton && originalActiveGenTabText) {
            activeTabButton.textContent = originalActiveGenTabText;
        }

    } else {
        let resultsFound = false;
        // NEW: Store original tab text if not already stored
        if (activeTabButton && !originalActiveGenTabText) {
            originalActiveGenTabText = activeTabButton.textContent;
        }
        // NEW: Change tab name to "Resultados"
        updateActiveTabName('¡Resultados de la búsqueda! ✓');

        allPokemonData.forEach(pkmn => {
            const pokemonName = pkmn.name.toLowerCase();
            
            // **NUEVO: Comprueba si alguna habilidad coincide con el término de búsqueda**
            const hasMatchingAbility = pkmn.abilities.some(ability => 
                ability.toLowerCase().includes(lowerCaseSearchTerm)
            );

            // **MODIFICADO: La condición ahora comprueba el nombre O la habilidad**
            if (pokemonName.includes(lowerCaseSearchTerm) || hasMatchingAbility) {
                resultsFound = true;
                const col = document.createElement('div');
                col.className = 'col-lg-3 col-md-4 col-sm-6 pokemon-card-container';
                col.setAttribute('data-pokemon-name', pkmn.name.toLowerCase());
                col.setAttribute('data-pokemon-gen', `gen-${pkmn.gen.replace(/\s+/g, '-').toLowerCase()}`);

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
        disableTabs(true);

        tabContent.style.display = 'none';
        searchResultsContainer.style.display = resultsFound ? 'flex' : 'none';
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

function onSearchInput(event) {
    const searchTerm = event.target.value;
    filterPokemon(searchTerm);
    if (searchTerm.length > 0) {
        clearSearchButton.style.display = 'block';
    } else {
        clearSearchButton.style.display = 'none';
        filterPokemon('');
    }
}

if (searchInput) {
    searchInput.removeEventListener('input', onSearchInput);
    searchInput.addEventListener('input', onSearchInput);
}

if (clearSearchButton) {
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        filterPokemon('');
        clearSearchButton.style.display = 'none';
        // NEW: Reset original tab text when clearing search
        const activeTabButton = tabList.querySelector('.nav-link.active');
        if (activeTabButton && originalActiveGenTabText) {
            activeTabButton.textContent = originalActiveGenTabText;
            originalActiveGenTabText = ''; // Clear the stored original text
        }
    });
}

fetch('data/pokemonData.json')
    .then(response => {
        if (!response.ok) throw new Error('Error cargando el JSON');
        return response.json();
    })
    .then(pokemonData => {
        allPokemonData = pokemonData;
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
                // NEW: Reset originalActiveGenTabText when a new tab is selected
                originalActiveGenTabText = tabButton.textContent; 
                if (searchInput.value.length > 0) {
                    searchInput.value = '';
                    clearSearchButton.style.display = 'none';
                }
                filterPokemon('');
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
                originalActiveGenTabText = tabButton.textContent; // Initialize original text for the first active tab
            }
            first = false;
        }

        filterPokemon('');
    })
    .catch(err => {
        console.error('Error:', err);
        const innerContent = document.querySelector('.inner-content');
        if (innerContent) {
            innerContent.innerHTML = `<div class="alert alert-danger" role="alert">Error al cargar los datos Pokémon. Por favor, inténtalo de nuevo más tarde.</div>`;
        }
    });