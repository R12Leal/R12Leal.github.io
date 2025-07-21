const Pokedex = {
  container: document.getElementById('pokedex-container'),
  searchBar: document.getElementById('pokemon-search'),
  clearButton: document.getElementById('clear-search'),
  localJsonPath: 'data/pokemonData.json',
  allPokemonData: [],

  typeTranslations: {
    'normal': 'Normal', 'fire': 'Fuego', 'water': 'Agua', 'grass': 'Planta',
    'electric': 'Eléctrico', 'ice': 'Hielo', 'fighting': 'Lucha', 'poison': 'Veneno',
    'ground': 'Tierra', 'flying': 'Volador', 'psychic': 'Psíquico', 'bug': 'Bicho',
    'rock': 'Roca', 'ghost': 'Fantasma', 'dragon': 'Dragón', 'steel': 'Acero',
    'fairy': 'Hada', 'dark': 'Siniestro',
  },

  spanishToEnglishTypeMap: {},

  buildSpanishToEnglishMap() {
    for (const englishType in this.typeTranslations) {
      const spanishType = this.typeTranslations[englishType];
      this.spanishToEnglishTypeMap[spanishType.toLowerCase()] = englishType;
    }
  },

  showLoading() {
    if (this.container) this.container.innerHTML = '<div class="loading">Cargando Pokédex...</div>';
  },

  displayError(message) {
    if (this.container) this.container.innerHTML = `<div class="error-message" role="alert">${message}</div>`;
  },

  clearContainer() {
    if (this.container) this.container.innerHTML = '';
  },

  async fetchLocalPokemonData() {
    try {
      const response = await fetch(this.localJsonPath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error al cargar el JSON local:", error);
      this.displayError(`No se pudieron cargar los datos. Revisa la ruta y el formato de ${this.localJsonPath}.`);
      return null;
    }
  },

  createTypeSpan(spanishType) {
    const englishType = this.spanishToEnglishTypeMap[spanishType.toLowerCase()] || 'normal';
    return `<span class="type ${englishType}">${spanishType}</span>`;
  },

  createStatBar(stat) {
    const value = stat.value;
    let colorClass = '';

    if (value > 100) {
      colorClass = 'stat-green';
    } else if (value < 40) {
      colorClass = 'stat-red';
    } else {
      colorClass = 'stat-yellow';
    }

    return `
      <div class="stat-item">
        <span class="stat-name"><strong>${stat.name.replace('-', ' ')}</strong></span>
        <div class="stat-bar-background">
          <div class="stat-bar ${colorClass}" style="width: 0%;" data-value="${value}">${value}</div>
        </div>
      </div>
    `;
  },

  createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const primaryType = this.spanishToEnglishTypeMap[pokemon.types[0].toLowerCase()] || 'normal';
    card.style.setProperty('--card-border-color', `var(--color-type-${primaryType})`);

    const typesHtml = pokemon.types.map(type => this.createTypeSpan(type)).join('');
    const statsHtml = pokemon.stats.map(stat => this.createStatBar(stat)).join('');
    const newFormLabel = pokemon.nuevaForma ? `<div class="new-form-label">Nueva forma</div>` : '';

    card.innerHTML = `
      <div class="card-inner" role="button" tabindex="0" aria-pressed="false" aria-label="Ficha de ${pokemon.name}">
        <div class="card-face card-front">
          ${newFormLabel}
          <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
          <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image">
          <h2 class="pokemon-name">${pokemon.name}</h2>
          <div class="pokemon-types">${typesHtml}</div>
        </div>
        <div class="card-face card-back">
          <h3 class="content-section-title">Estadísticas Base</h3>
          <div class="pokemon-stats-bars">${statsHtml}</div>
          <h3 class="content-section-title">Datos</h3>
          <p class="evolution-info">${pokemon.evolution}</p>
        </div>
      </div>
    `;

    let animationTimeout = null;

    function animateStats() {
      card.querySelectorAll('.stat-bar').forEach(bar => {
        const value = bar.getAttribute('data-value');
        const percentage = Math.min(100, (value / 255) * 100);
        bar.style.width = `${percentage}%`;
      });
    }

    card.querySelector('.card-inner').addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      card.querySelector('.card-inner').setAttribute('aria-pressed', card.classList.contains('is-flipped'));

      if (animationTimeout) clearTimeout(animationTimeout);

      if (card.classList.contains('is-flipped')) {
        animationTimeout = setTimeout(animateStats, 400);
      } else {
        card.querySelectorAll('.stat-bar').forEach(bar => {
          bar.style.width = '0%';
        });
      }
    });

    // Soporte para teclado: activar flip con Enter o Espacio
    card.querySelector('.card-inner').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.querySelector('.card-inner').click();
      }
    });

    this.container.appendChild(card);
  },

  renderPokemon(pokemonList) {
    this.clearContainer();
    if (pokemonList.length > 0) {
      pokemonList.forEach(pokemon => this.createPokemonCard(pokemon));
    } else {
      this.displayError("No se encontraron Pokémon que coincidan con tu búsqueda.");
    }
  },

  filterPokemon() {
    const searchTerm = this.searchBar.value.trim().toLowerCase();

    if (searchTerm === '') {
      this.renderPokemon(this.allPokemonData);
      return;
    }

    const filteredPokemon = this.allPokemonData.filter(pokemon => {
      const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);

      const typeMatch = pokemon.types.some(type => {
        const typeLower = type.toLowerCase();
        const englishType = this.spanishToEnglishTypeMap[typeLower] || '';
        return typeLower.includes(searchTerm) || englishType.includes(searchTerm);
      });

      return nameMatch || typeMatch;
    });

    this.renderPokemon(filteredPokemon);
  },

  clearSearch() {
    if (this.searchBar) {
      this.searchBar.value = '';
      this.filterPokemon();
      this.searchBar.focus();
    }
  },

  async init() {
    if (!this.container || !this.searchBar || !this.clearButton) {
      console.error("Faltan elementos HTML esenciales. Revisa los IDs en tu index.html.");
      return;
    }

    this.showLoading();
    this.buildSpanishToEnglishMap();

    this.allPokemonData = await this.fetchLocalPokemonData();

    if (this.allPokemonData) {
      this.renderPokemon(this.allPokemonData);
      this.searchBar.addEventListener('input', () => this.filterPokemon());
      this.clearButton.addEventListener('click', () => this.clearSearch());
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Pokedex.init();
});
