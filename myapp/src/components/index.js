  const applyFilters = () => {
    const initial = {
      hp: [70, 150],
      attack: [70, 150],
      defense: [70, 150],
      speed: [70, 150],
      "special-attack": [70, 150],
      "special-defense": [70, 150],
    };

    const filteredPoke = state.posts.filter((pokemon) => {
      const nameMatch = pokemon.name.toLowerCase().includes(state.searchQuery);
      const typeMatch = pokemon.types
        .map((type) => type.toLowerCase())
        .includes(state.searchType);
      const statsMatch = Object.entries(state.statsInput).every(
        ([statName, statValues]) => {
          const pokemonStat = parseInt(pokemon.stats[statName]);
          const minValue = parseInt(statValues[0]);
          const maxValue = parseInt(statValues[1]);
          return minValue <= pokemonStat && maxValue >= pokemonStat;
        }
      );
      if (state.searchQuery !== "" && state.searchType !== "") {
        return nameMatch && typeMatch;
      }
      if (state.searchType !== "") {
        return typeMatch;
      }

      if (!isEquivalent(state.statsInput, initial)) {
        return (
          (state.searchQuery !== "" &&
            state.searchType !== "" &&
            nameMatch &&
            typeMatch &&
            statsMatch) ||
          (state.searchType !== "" && typeMatch && statsMatch) ||
          statsMatch
        );
      }

      return nameMatch || typeMatch || statsMatch;
    });

    console.log("Filter", filteredPoke);
    return filteredPoke;
  };