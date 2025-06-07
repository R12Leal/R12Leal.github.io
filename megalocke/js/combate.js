    // Función auxiliar para renderizar una única tarjeta Pokémon
    function renderPokemonCard(pokemonData) {
        const pokemonCard = document.createElement('div');
        pokemonCard.className = 'pokemon-card';

        // Generar iconos de tipo
        const typeIcons = pokemonData.types.map(type => `
            <img src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${type}.svg" alt="${type} Type Icon">
        `).join('');

        // Generar lista de movimientos
        const moveList = pokemonData.movimientos.map(move => `
            <li>${move}</li>
        `).join('');

        pokemonCard.innerHTML = `
            <div class="main-info">
                <img src="${pokemonData.sprite_url}" alt="${pokemonData.name}">
                <p class="pokemon-name">${pokemonData.name}</p>
            </div>
            <div class="pokemon-types">
                ${typeIcons}
            </div>
            <div class="divider"></div>
            <div class="info-group">
                <p><strong>Hab:</strong> ${pokemonData.hab}</p>
                <p><strong>Objeto:</strong> ${pokemonData.objeto}</p>
            </div>
            <div class="pokemon-moves">
                <strong>Movimientos:</strong>
                <ul class="lista-con-iconos">
                    ${moveList}
                </ul>
            </div>
        `;
        return pokemonCard;
    }

    // Función principal para renderizar el contenido de todos los entrenadores
    // Ahora acepta un término de búsqueda opcional
    async function renderContent(searchTerm = '') {
        const allTrainersContainer = document.getElementById('allTrainersContainer');
        allTrainersContainer.innerHTML = ''; // Limpiar cualquier contenido previo al recargar

        try {
            const response = await fetch('data/combateData.json'); // Asegúrate de que data.json esté en la misma carpeta
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allProfilesData = await response.json(); // Esperamos que sea un array de perfiles

            if (!Array.isArray(allProfilesData)) {
                console.error("Error: 'data.json' debe ser un array de objetos de perfil de entrenador.");
                allTrainersContainer.innerHTML = "<p style='color: red;'>Error al cargar los datos: Formato incorrecto de 'data.json'. Se esperaba un array.</p>";
                return;
            }

            // Lógica de filtrado para el buscador
            let filteredProfiles = allProfilesData;
            const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

            if (lowerCaseSearchTerm) {
                filteredProfiles = allProfilesData.filter(profile => {
                    // 1. Buscar por nombre de entrenador
                    if (profile.trainer.nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
                        return true;
                    }

                    // 2. Buscar por nombre de Pokémon
                    if (profile.display_type === "single" && profile.pokemon_team) {
                        if (profile.pokemon_team.some(pokemon =>
                            pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
                        )) {
                            return true;
                        }
                    } else if (profile.display_type === "multi-team" && profile.teams) {
                        if (profile.teams.some(team =>
                            team.pokemons.some(pokemon =>
                                pokemon.name.toLowerCase().includes(lowerCaseSearchTerm)
                            )
                        )) {
                            return true;
                        }
                    }
                    return false; // Si no hay coincidencias en el nombre del entrenador o los Pokémon de este perfil
                });
            }

            // Mostrar mensaje si no hay resultados después del filtrado
            if (filteredProfiles.length === 0 && lowerCaseSearchTerm) {
                allTrainersContainer.innerHTML = `<p class="no-results">No se encontraron resultados para "${searchTerm}".</p>`;
                return; // Terminar la función si no hay nada que mostrar
            }
            // Si filteredProfiles.length es 0 y no hay searchTerm, significa que data.json está vacío.
            if (filteredProfiles.length === 0 && !lowerCaseSearchTerm) {
                 allTrainersContainer.innerHTML = `<p class="no-results">No hay entrenadores para mostrar.</p>`;
                 return;
            }


            // Iterar sobre los perfiles filtrados y renderizar el contenido
            filteredProfiles.forEach((profileData, profileIndex) => {
                // 1. Crear el contenedor principal para este entrenador y su equipo
                const mainPageContainer = document.createElement('div');
                mainPageContainer.className = 'main-page-container';

                // 2. Crear y añadir el bloque de información del entrenador
                const trainerInfoBlock = document.createElement('div');
                trainerInfoBlock.className = 'trainer-info-block';
                trainerInfoBlock.innerHTML = `
                    <img src="${profileData.trainer.sprite_url}" alt="${profileData.trainer.nombre}" class="trainer-sprite">
                    <div class="trainer-details">
                        <p><strong>Entrenador/a:</strong> ${profileData.trainer.nombre}</p>
                        <p><strong>Level CAP</strong> <span class="lvl-cap-tag">${profileData.trainer.level}</span></p>
                    </div>
                `;
                mainPageContainer.appendChild(trainerInfoBlock);

                // 3. Crear la sección del equipo Pokémon
                const pokemonTeamSection = document.createElement('div');
                pokemonTeamSection.className = 'pokemon-team-section';

                // Lógica condicional basada en 'display_type' del perfil actual
                if (profileData.display_type === "single") {
                    // Para equipos individuales (cuadrícula de Pokémon)
                    const pokemonGridForSingle = document.createElement('div');
                    pokemonGridForSingle.className = 'pokemon-grid'; // Reusa la clase de cuadrícula

                    if (profileData.pokemon_team && Array.isArray(profileData.pokemon_team)) {
                        profileData.pokemon_team.forEach(pokemon => {
                            const card = renderPokemonCard(pokemon);
                            pokemonGridForSingle.appendChild(card);
                        });
                    } else {
                        console.warn(`Perfil de ${profileData.trainer.nombre}: 'pokemon_team' no es un array válido para display_type 'single'.`);
                        pokemonGridForSingle.innerHTML = "<p style='color: orange;'>Advertencia: Datos de equipo 'single' incompletos o incorrectos.</p>";
                    }
                    pokemonTeamSection.appendChild(pokemonGridForSingle);

                } else if (profileData.display_type === "multi-team") {
                    // Para múltiples equipos (estructura de pestañas)
                    const multiTeamTabsContainer = document.createElement('div');
                    multiTeamTabsContainer.className = 'tabs-container';

                    const tabsNav = document.createElement('div');
                    tabsNav.className = 'tabs-nav';
                    const tabsContent = document.createElement('div');
                    tabsContent.className = 'tabs-content';

                    if (profileData.teams && Array.isArray(profileData.teams)) {
                        profileData.teams.forEach((team, teamIndex) => {
                            // Generar un ID único para cada pestaña y panel dentro de cada entrenador
                            // Es importante usar el índice original o un ID único persistente si el orden filtrado cambia
                            // Aquí usamos el índice en el array filtrado, que es suficiente para la unicidad actual
                            const tabId = `trainer-${profileIndex}-team-${teamIndex}`;

                            // Crear botón de pestaña
                            const tabButton = document.createElement('button');
                            tabButton.textContent = team.name;
                            tabButton.setAttribute('data-tab-id', tabId);
                            tabsNav.appendChild(tabButton);

                            // Crear panel de contenido de la pestaña
                            const tabPane = document.createElement('div');
                            tabPane.id = tabId;
                            tabPane.className = 'tab-pane';

                            const pokemonGrid = document.createElement('div');
                            pokemonGrid.className = 'pokemon-grid';

                            team.pokemons.forEach(pokemon => {
                                const card = renderPokemonCard(pokemon);
                                pokemonGrid.appendChild(card);
                            });

                            tabPane.appendChild(pokemonGrid);
                            tabsContent.appendChild(tabPane);

                            // Activar la primera pestaña de cada entrenador por defecto
                            if (teamIndex === 0) {
                                tabButton.classList.add('active');
                                tabPane.classList.add('active');
                            }
                        });

                        // Añadir el listener para cambiar de pestaña para ESTE conjunto de pestañas
                        tabsNav.addEventListener('click', (event) => {
                            const clickedButton = event.target;
                            if (clickedButton.tagName === 'BUTTON') {
                                // Desactivar pestaña activa actual dentro de ESTE contenedor de pestañas
                                const currentActiveButton = tabsNav.querySelector('.active');
                                if (currentActiveButton) {
                                    currentActiveButton.classList.remove('active');
                                }
                                const currentActivePane = tabsContent.querySelector('.active');
                                if (currentActivePane) {
                                    currentActivePane.classList.remove('active');
                                }

                                // Activar la nueva pestaña
                                clickedButton.classList.add('active');
                                const targetTabId = clickedButton.getAttribute('data-tab-id');
                                document.getElementById(targetTabId).classList.add('active');
                            }
                        });
                    } else {
                        console.warn(`Perfil de ${profileData.trainer.nombre}: 'teams' no es un array válido para display_type 'multi-team'.`);
                        tabsContent.innerHTML = "<p style='color: orange;'>Advertencia: Datos de equipos 'multi-team' incompletos o incorrectos.</p>";
                    }

                    multiTeamTabsContainer.appendChild(tabsNav);
                    multiTeamTabsContainer.appendChild(tabsContent);
                    pokemonTeamSection.appendChild(multiTeamTabsContainer);

                } else {
                    console.warn(`Tipo de visualización desconocido para el perfil de ${profileData.trainer.nombre}:`, profileData.display_type);
                    pokemonTeamSection.innerHTML = "<p style='color: orange;'>Advertencia: Tipo de visualización no reconocido para este perfil.</p>";
                }

                mainPageContainer.appendChild(pokemonTeamSection);
                allTrainersContainer.appendChild(mainPageContainer);
            });

        } catch (error) {
            console.error('Error al cargar o renderizar los datos:', error);
            // Mostrar un mensaje de error global
            allTrainersContainer.innerHTML = "<p style='color: red;'>Error grave al cargar los datos. Por favor, verifica 'data.json' y la consola del navegador.</p>";
        }
    }

    // Cargar los datos cuando el DOM esté completamente cargado y configurar el buscador
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn'); // Obtener referencia al botón de borrar

        // Renderizar el contenido inicial (sin término de búsqueda)
        renderContent();

        // Añadir listener al campo de búsqueda para filtrar en tiempo real
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value;
            renderContent(searchTerm); // Volver a renderizar con el término de búsqueda actual

            // Mostrar u ocultar el botón de borrar
            if (searchTerm.length > 0) {
                clearSearchBtn.style.display = 'block'; // Mostrar la X
            } else {
                clearSearchBtn.style.display = 'none'; // Ocultar la X
            }
        });

        // Añadir listener al botón de borrar la búsqueda
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = ''; // Vaciar el campo de búsqueda
            renderContent(''); // Volver a renderizar con un término de búsqueda vacío
            clearSearchBtn.style.display = 'none'; // Ocultar la X después de borrar
        });
    });