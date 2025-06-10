// URLs de los iconos de categoría
const CATEGORY_ICONS = {
    "Physical": "img/fisico.png", // Icono de puño
    "Special": "img/especial.png",   // Icono de estrella
    "Status": "img/estado.png"     // Icono de estado
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
    // Use Bootstrap grid classes for 6 tabs per row
    navItem.classList.add('nav-item', 'col-md-2', 'col-sm-4', 'col-6'); // Adjust col classes for responsiveness
    navItem.setAttribute('role', 'presentation');

    const navLink = document.createElement('button');
    navLink.classList.add('nav-link', 'w-100'); // w-100 makes the button take full width of its column
    if (isFirst) navLink.classList.add('active');
    navLink.setAttribute('id', `${tabId}-tab`);
    navLink.setAttribute('data-bs-toggle', 'tab');
    navLink.setAttribute('data-bs-target', `#${tabId}`);
    navLink.setAttribute('type', 'button');
    navLink.setAttribute('role', 'tab');
    navLink.setAttribute('aria-controls', tabId);
    navLink.setAttribute('aria-selected', isFirst ? 'true' : 'false');
    // Removed the <span> for the type name, keeping only the icon
    navLink.innerHTML = `<img src="${typeIconUrl}" alt="${type}" class="tab-type-icon">`;
    navLink.setAttribute('title', type); // Add title for better accessibility on hover

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
    // Comprueba si el valor no es nulo/indefinido Y si es un número finito
    if (value !== null && typeof value !== 'undefined' && !isNaN(value) && isFinite(value)) {
        return `${value}${suffix}`; // Muestra el valor con el sufijo
    }
    return '-'; // Muestra '-' si el valor no es válido
};

/**
 * Helper function to create a table row for a single Pokémon move.
 * @param {object} move - The move data object.
 * @returns {string} The HTML string for the table row.
 */
function createMoveTableRow(move) {
    const categoryIconUrl = CATEGORY_ICONS[move.tipoMovimiento];
    
    const potenciaDisplay = getDisplayValue(move.potencia);
    const precisionDisplay = getDisplayValue(move.precision, '%');
    const prioridadDisplay = getDisplayValue(move.prioridad);

    // Display a badge for new moves only if 'esNuevo' is explicitly true
    const newBadge = move.esNuevo === true ? '&nbsp;<span class="badge bg-danger"">N</span>' : '';

    return `
        <tr>
            <td data-label="Movimiento">
                <span class="move-name">${move.movimiento}</span>${newBadge}
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
    const pokemonTabsNav = document.querySelector('#pokemonTabs');
    const pokemonTabContent = document.querySelector('#pokemonTabContent');

    if (!pokemonTabsNav || !pokemonTabContent) {
        console.error('Error: No se encontraron los elementos #pokemonTabs o #pokemonTabContent.');
        return; // Exit if essential elements are missing
    }

    fetch('data/movimientosData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(pokemonMovesData => {
            // Group moves by type using reduce for a cleaner approach
            const movesByType = pokemonMovesData.reduce((acc, move) => {
                if (!acc[move.tipo]) {
                    acc[move.tipo] = [];
                }
                acc[move.tipo].push(move);
                return acc;
            }, {});

            const sortedTypes = Object.keys(movesByType).sort();
            let firstTabActivated = false; // Flag to ensure only the first tab is active

            // Add a Bootstrap row to wrap the tab navigation items
            const navRow = document.createElement('div');
            navRow.classList.add('row', 'g-1', 'justify-content-center'); // g-1 for small gutters, justify-content-center to center tabs if less than 6

            sortedTypes.forEach(type => {
                const tabId = `tab-${type.toLowerCase().replace(/ /g, '-')}`;
                const isFirst = !firstTabActivated;
                if (isFirst) firstTabActivated = true;

                const typeIconUrl = `${TYPE_ICON_BASE_URL}${type.toLowerCase()}.svg`;
                
                // Create and append the tab navigation item
                const navItem = createTabNavItem(type, tabId, isFirst, typeIconUrl);
                navRow.appendChild(navItem); // Append to the row
            });
            pokemonTabsNav.appendChild(navRow); // Append the row to the #pokemonTabs container

            sortedTypes.forEach(type => {
                const tabId = `tab-${type.toLowerCase().replace(/ /g, '-')}`;
                const isFirst = document.querySelector(`#${tabId}-tab`).classList.contains('active'); // Check if the tab is already active

                // Create the tab content panel
                const tabPanel = document.createElement('div');
                tabPanel.classList.add('tab-pane', 'fade');
                if (isFirst) tabPanel.classList.add('show', 'active');
                tabPanel.setAttribute('id', tabId);
                tabPanel.setAttribute('role', 'tabpanel');
                tabPanel.setAttribute('aria-labelledby', `${tabId}-tab`);

                // Generate the table rows HTML for the current type's moves
                const tableRowsHtml = movesByType[type].map(createMoveTableRow).join('');

                // Create the full table structure
                const tableContainer = document.createElement('div');
                tableContainer.classList.add('table-container', 'mt-4');
                const typeClassName = `type-${type.toLowerCase()}`; // For type-specific table styling

                tableContainer.innerHTML = `
                    <div class="table-responsive">
                        <table class="table moves-table align-middle">
                            <thead class="table-header-type ${typeClassName}">
                                <tr>
                                    <th scope="col" style="width: 20%;">Movimiento</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Categoría</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Potencia</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Precisión</th>
                                    <th scope="col" class="text-center" style="width: 10%;">Prioridad</th>
                                    <th scope="col" style="width: 40%;">Descripción</th>
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
            // Display a user-friendly error message
            pokemonTabContent.innerHTML = '<p class="text-center text-danger my-5">Error al cargar los movimientos. Por favor, inténtelo de nuevo más tarde.</p>';
        });
});