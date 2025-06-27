// URLs de los iconos de categoría
const CATEGORY_ICONS = {
    "Physical": "img/fisico.png",
    "Special": "img/especial.png",
    "Status": "img/estado.png"
};
// URL base para los iconos de tipo de Pokémon
const TYPE_ICON_BASE_URL = `https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/`;

/**
 * Helper function to create a tab navigation item (button with icon).
 * @param {string} type - The Pokémon type.
 * @param {string} tabId - The ID for the tab and its content.
 * @param {boolean} isFirst - True if this is the first tab to be activated.
 * @param {string} typeIconUrl - The URL for the type icon.
 * @returns {HTMLLIElement} The created list item containing the tab button.
 */
function createTabNavItem(type, tabId, isFirst, typeIconUrl) {
    const navItem = document.createElement('li');
    navItem.classList.add('nav-item', 'col-md-2', 'col-sm-4', 'col-6');
    navItem.setAttribute('role', 'presentation');

    const navLink = document.createElement('button');
    navLink.classList.add('nav-link', 'w-100');
    if (isFirst) navLink.classList.add('active');
    navLink.setAttribute('id', `${tabId}-tab`);
    navLink.setAttribute('data-bs-toggle', 'tab');
    navLink.setAttribute('data-bs-target', `#${tabId}`);
    navLink.setAttribute('type', 'button');
    navLink.setAttribute('role', 'tab');
    navLink.setAttribute('aria-controls', tabId);
    navLink.setAttribute('aria-selected', isFirst ? 'true' : 'false');
    navLink.innerHTML = `<img src="${typeIconUrl}" alt="${type}" class="tab-type-icon">`;
    navLink.setAttribute('title', type);

    navItem.appendChild(navLink);
    return navItem;
}

/**
 * Helper function to safely display values that might be null or undefined.
 * It also intelligently adds a suffix only if the value is a valid number.
 * @param {*} value - The value to display.
 * @param {string} [suffix=''] - An optional suffix (e.g., '%').
 * @returns {string} The formatted display string or '-' if null/undefined.
 */
const getDisplayValue = (value, suffix = '') => {
    if (value !== null && typeof value !== 'undefined' && !isNaN(value) && isFinite(value)) {
        return `${value}${suffix}`;
    }
    return '-';
};

/**
 * Helper function to create a table row for a single Pokémon move.
 * @param {object} move - The move data object.
 * @returns {string} The HTML string for the table row.
 */
function createMoveTableRow(move) {
    const categoryIconUrl = CATEGORY_ICONS[move.tipoMovimiento];
    const typeIconUrl = `${TYPE_ICON_BASE_URL}${move.tipo.toLowerCase()}.svg`;
    
    const potenciaDisplay = getDisplayValue(move.potencia);
    const precisionDisplay = getDisplayValue(move.precision, '%');
    const prioridadDisplay = getDisplayValue(move.prioridad);

    const newBadge = move.esNuevo === true ? '&nbsp;<span class="badge bg-danger">N</span>' : '';

    return `
        <tr>
            <td data-label="Movimiento">
                <span class="move-name">${move.movimiento}</span>${newBadge}
            </td>
            <td data-label="Tipo" class="text-center">
                <img src="${typeIconUrl}" alt="${move.tipo}" class="category-icon-table" title="${move.tipo}">
            </td>
            <td data-label="Categoría" class="text-center">
                <img src="${categoryIconUrl}" alt="${move.tipoMovimiento}" class="category-icon-table" title="${move.tipoMovimiento}">
            </td>
            <td data-label="Potencia" class="text-center fw-bold">${potenciaDisplay}</td>
            <td data-label="Precisión" class="text-center fw-bold">${precisionDisplay}</td>
            <td data-label="Prioridad" class="text-center fw-bold">${prioridadDisplay}</td>
            <td data-label="Descripción" class="move-description">${move.descripcion}</td>
        </tr>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.container.my-4');
    const pokemonTabsNav = document.querySelector('#pokemonTabs');
    const pokemonTabContent = document.querySelector('#pokemonTabContent');
    let allPokemonMoves = []; // Store all moves globally

    if (!mainContainer || !pokemonTabsNav || !pokemonTabContent) {
        console.error('Error: No se encontraron los elementos necesarios.');
        return;
    }
    
    // --- INICIO DE MODIFICACIONES PARA EL BUSCADOR CON BOTÓN DE LIMPIEZA ---

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-wrapper', 'mb-4');

    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text'); 
    searchInput.setAttribute('id', 'moveSearchInput');
    searchInput.setAttribute('placeholder', '🔍 Buscar movimiento...');
    searchInput.classList.add('form-control', 'w-100');

    const clearButton = document.createElement('span');
    clearButton.classList.add('search-clear-btn');
    clearButton.innerHTML = '&times;'; // Símbolo de multiplicación (la 'X')
    clearButton.setAttribute('title', 'Limpiar búsqueda');

    // Container for search results table
    const searchResultsTableContainer = document.createElement('div');
    searchResultsTableContainer.classList.add('table-responsive'); // Keep this for responsiveness
    searchResultsTableContainer.innerHTML = `
        <table class="table moves-table align-middle">
            <thead class="table-header-type bg-primary text-white">
                <tr>
                    <th scope="col" style="width: 15%;">Movimiento</th>
                    <th scope="col" class="text-center" style="width: 10%;">Tipo</th>
                    <th scope="col" class="text-center" style="width: 10%;">Categoría</th>
                    <th scope="col" class="text-center" style="width: 10%;">Potencia</th>
                    <th scope="col" class="text-center" style="width: 10%;">Precisión</th>
                    <th scope="col" class="text-center" style="width: 10%;">Prioridad</th>
                    <th scope="col" style="width: 35%;">Descripción</th>
                </tr>
            </thead>
            <tbody id="searchResultsBody">
                </tbody>
        </table>
    `;

    // New container for the "no results" message
    const noResultsMessageContainer = document.createElement('div');
    noResultsMessageContainer.classList.add('no-results-message', 'text-center', 'mt-4');
    noResultsMessageContainer.style.display = 'none'; // Hidden by default

    // Overall search results wrapper, which will contain either the table or the message
    const searchResultsWrapper = document.createElement('div');
    searchResultsWrapper.classList.add('search-results-wrapper', 'mt-4'); // Use a wrapper to control visibility
    searchResultsWrapper.style.display = 'none'; // Hidden by default

    searchResultsWrapper.appendChild(searchResultsTableContainer);
    searchResultsWrapper.appendChild(noResultsMessageContainer);


    // Añadir los elementos al DOM
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(clearButton);
    mainContainer.insertBefore(searchWrapper, pokemonTabsNav);
    mainContainer.appendChild(searchResultsWrapper); // Add search results wrapper at the end

    // Function to perform and display search
    const performSearch = (searchTerm) => {
        const resultsBody = document.getElementById('searchResultsBody');
        resultsBody.innerHTML = ''; // Clear previous results

        if (searchTerm.length === 0) {
            // No search term, show tabs and hide search results
            mainContainer.classList.remove('tabs-hidden');
            searchResultsWrapper.style.display = 'none'; // Hide the entire search results wrapper
            clearButton.classList.remove('visible');
            return;
        }

        // Search term present, hide tabs and show search results
        mainContainer.classList.add('tabs-hidden');
        searchResultsWrapper.style.display = 'block'; // Show the entire search results wrapper
        clearButton.classList.add('visible');

        const filteredMoves = allPokemonMoves.filter(move => {
            const moveName = move.movimiento.toLowerCase();
            const moveDescription = move.descripcion.toLowerCase();
            return moveName.includes(searchTerm) || moveDescription.includes(searchTerm);
        });

        if (filteredMoves.length > 0) {
            searchResultsTableContainer.style.display = 'block'; // Show the table
            noResultsMessageContainer.style.display = 'none'; // Hide the message
            const resultsHtml = filteredMoves.map(createMoveTableRow).join('');
            resultsBody.innerHTML = resultsHtml;
        } else {
            searchResultsTableContainer.style.display = 'none'; // Hide the table
            noResultsMessageContainer.style.display = 'block'; // Show the message
            noResultsMessageContainer.innerHTML = `
                <div class="alert alert-warning text-center" role="alert">
                    No se encontraron movimientos que coincidan con la búsqueda.
                </div>
            `;
        }
    };

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        performSearch(searchTerm);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = ''; // Clear the input value
        performSearch(''); // Perform search with empty term to reset
        searchInput.focus(); // Return focus to the input
    });
    
    // --- FIN DE MODIFICACIONES ---

    fetch('data/movimientosData.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(pokemonMovesData => {
            allPokemonMoves = pokemonMovesData; // Store all moves

            const movesByType = pokemonMovesData.reduce((acc, move) => {
                if (!acc[move.tipo]) acc[move.tipo] = [];
                acc[move.tipo].push(move);
                return acc;
            }, {});

            const sortedTypes = Object.keys(movesByType).sort();
            let firstTabActivated = false;

            const navRow = document.createElement('div');
            navRow.classList.add('row', 'g-1', 'justify-content-center');

            sortedTypes.forEach(type => {
                const tabId = `tab-${type.toLowerCase().replace(/ /g, '-')}`;
                const isFirst = !firstTabActivated;
                if (isFirst) firstTabActivated = true;
                const typeIconUrl = `${TYPE_ICON_BASE_URL}${type.toLowerCase()}.svg`;
                const navItem = createTabNavItem(type, tabId, isFirst, typeIconUrl);
                navRow.appendChild(navItem);
            });
            pokemonTabsNav.appendChild(navRow);

            sortedTypes.forEach(type => {
                const tabId = `tab-${type.toLowerCase().replace(/ /g, '-')}`;
                const isFirst = document.querySelector(`#${tabId}-tab`).classList.contains('active');
                const tabPanel = document.createElement('div');
                tabPanel.classList.add('tab-pane', 'fade');
                if (isFirst) tabPanel.classList.add('show', 'active');
                tabPanel.setAttribute('id', tabId);
                tabPanel.setAttribute('role', 'tabpanel');
                tabPanel.setAttribute('aria-labelledby', `${tabId}-tab`);

                const tableRowsHtml = movesByType[type].map(createMoveTableRow).join('');
                
                const tableContainer = document.createElement('div');
                tableContainer.classList.add('table-container', 'mt-4');
                const typeClassName = `type-${type.toLowerCase()}`;

                tableContainer.innerHTML = `
                    <div class="table-responsive">
                        <table class="table moves-table align-middle">
                            <thead class="table-header-type ${typeClassName}">
                                <tr>
                                    <th scope="col" style="width: 15%;">Movimiento</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Tipo</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Categoría</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Potencia</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Precisión</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Prioridad</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRowsHtml}
                            </tbody>
                        </table>
                    </div>
                `;
                tabPanel.appendChild(tableContainer);
                pokemonTabContent.appendChild(tabPanel);
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos de movimientos:', error);
            pokemonTabContent.innerHTML = '<p class="text-center text-danger my-5">Error al cargar los movimientos. Por favor, inténtelo de nuevo más tarde.</p>';
        });
});