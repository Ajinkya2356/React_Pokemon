import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Poke from "./Poke";
import SearchPokemon from "./SearchPokemon";
import TypeFilter from "./TypeFilter";
import Stats from "./Stats";
import PokemonDetails from "./PokemonDetails";
const initialState = {
  loading: true,
  error: "",
  posts: [],
  offset: 0,
  searchQuery: "",
  searchType: "",
  statsInput: {
    hp: [70, 150],
    attack: [70, 150],
    defense: [70, 150],
    speed: [70, 150],
    "special-attack": [70, 150],
    "special-defense": [70, 150],
  },
  filteredResult: [],
  pokemon: null,
  isModalOpen: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_POKEMON":
      return {
        ...state,
        loading: false,
        posts: action.results,
        error: "",
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        posts: [],
        error: "Something Went Wrong",
      };
    case "SET_OFFSET":
      return { ...state, loading: true, offset: action.offset };
    case "SEARCH":
      return {
        ...state,
        loading: false,
        searchQuery: action.keyword,
      };
    case "SEARCH_TYPE":
      return {
        ...state,
        loading: false,
        searchType: action.keyword,
      };
    case "STATS":
      return {
        ...state,
        loading: false,
        statsInput: action.stats,
      };
    case "SET_FILTERED_RESULT":
      return {
        ...state,
        filteredResult: action.payload,
      };
    case "POKEMON":
      return {
        ...state,
        pokemon: action.payload,
        isModalOpen: action.value,
      }
    case "CLOSE_POKEMON":
      return {
        ...state,
        pokemon: null,
        isModalOpen: false,
      }
    case "CLEAR_SEARCH":
      return {
        ...state,
        searchQuery: "",
        searchType: "",
        statsInput: {
          hp: [70, 150],
          attack: [70, 150],
          defense: [70, 150],
          speed: [70, 150],
          "special-attack": [70, 150],
          "special-defense": [70, 150],
        },
        filteredResult: state.posts,
      };

    default:
      return { ...state };
  }
};
const Pokemon = () => {
  const [state, dispatch] = useReducer(reducer, initialState);


  const toggleDetailsScreen = (pokemon) => {
    console.log("Event trigerred")
    dispatch({ type: "POKEMON", payload: pokemon, value: true })
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_POKEMON" })
  };

  const fetchData = async () => {
    const Pokemon = [];
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${state.offset}&limit=20`
      );
      const data = res.data;
      const results = data.results;
      for (const poke of results) {
        const Purl = await axios.get(poke.url);
        const Pdetails = Purl.data;
        const imageUrl = Pdetails.sprites.other.showdown.front_default;
        const parts = poke.url.split("/");
        const pokemonId = parts[parts.length - 2];
        const types = Pdetails.types.map((item) => item.type.name);
        const abilities=Pdetails.abilities.map((item)=>{
          return item.ability.name;
        })
        Pokemon.push({
          name: poke.name,
          ImgUrl: imageUrl,
          pid: pokemonId,
          types: types,
          stats: {
            hp: Pdetails.stats[0]["base_stat"],
            attack: Pdetails.stats[1]["base_stat"],
            defense: Pdetails.stats[2]["base_stat"],
            specialAttack: Pdetails.stats[3]["base_stat"],
            specialDefence: Pdetails.stats[4]["base_stat"],
            speed: Pdetails.stats[5]["base_stat"],
          },
          height:Pdetails.height,
          weight:Pdetails.weight,
          abilities,
        });
        
      }

      dispatch({ type: "FETCH_POKEMON", results: Pokemon });
    } catch (err) {
      dispatch({ type: "ERROR" });
    }
  };
  const NextPage = () => {
    dispatch({ type: "SET_OFFSET", offset: state.offset + 20 });
  };
  const PrevPage = () => {
    dispatch({ type: "SET_OFFSET", offset: Math.max(0, state.offset - 20) });
  };
  const handleSearch = (e) => {
    dispatch({
      type: "SEARCH",
      keyword: e.target.value.toLowerCase(),
    });
    dispatch({
      type: "SET_FILTERED_RESULT",
      payload: state.posts.filter((item) =>
        item.name.includes(e.target.value.toLowerCase())
      ),
    });
  };
  const handleFilter = (e) => {
    dispatch({
      type: "SEARCH_TYPE",
      keyword: e.target.value.toLowerCase(),
    });
    dispatch({
      type: "SET_FILTERED_RESULT",
      payload: state.posts.filter((item) =>
        item.types
          .map((type) => type.toLowerCase())
          .includes(e.target.value.toLowerCase())
      ),
    });
  };
  const handleStats = (e) => {
    dispatch({
      type: "STATS",
      stats: { ...state.statsInput, [e.target.name]: e.target.value },
    });
  };
  const applyFilters = () => {
    const filteredResult = state.posts.filter((item) => {
      if (
        Object.values(state.statsInput).some(
          (range) => range[0] !== 70 || range[1] !== 150
        )
      ) {
        let satisfies = true;
        Object.entries(state.statsInput).forEach(([statName, statValues]) => {
          const pokemonStat = item.stats[statName];
          const [minValue, maxValue] = statValues.map(Number);

          if (!(minValue <= pokemonStat && pokemonStat <= maxValue)) {
            satisfies = false;
          }
        });
        return satisfies;
      } else {
        return true;
      }
    });

    dispatch({ type: "SET_FILTERED_RESULT", payload: filteredResult });
  };

  console.log("Filtered Results", state.filteredResult);
  useEffect(() => {
    fetchData();
  }, [state.offset]);

  useEffect(() => {
    dispatch({ type: "SET_FILTERED_RESULT", payload: state.posts });
  }, [state.posts]);

  return (
    <div>
      <div>
        <SearchPokemon
          searchQuery={state.searchQuery}
          handleSearch={handleSearch}
        />
        <TypeFilter searchType={state.searchType} handleSearch={handleFilter} />
        <h1>Select Stats</h1>
        <Stats
          selection={handleStats}
          range={state.statsInput.hp}
          statename={"hp"}
        />
        <Stats
          selection={handleStats}
          range={state.statsInput.attack}
          statename={"attack"}
        />
        <Stats
          selection={handleStats}
          range={state.statsInput.defense}
          statename={"defense"}
        />
        <Stats
          selection={handleStats}
          range={state.statsInput.speed}
          statename={"speed"}
        />
        <Stats
          selection={handleStats}
          range={state.statsInput["special-attack"]}
          statename={"special-attack"}
        />
        <Stats
          selection={handleStats}
          range={state.statsInput["special-defense"]}
          statename={"special-defense"}
        />
        {<button onClick={applyFilters}>Apply</button>}
        <button onClick={() => dispatch({ type: "CLEAR_SEARCH" })}>
          Reset
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "5%",
        }}
      >
        {
          state.loading
            ? "LOADING"
            : ((state.searchQuery || state.searchType || state.statsInput)
              ? state.filteredResult
              : state.posts
            ).map((poke) => (
              <div key={poke.ImgUrl} onClick={() => toggleDetailsScreen(poke)}>
                <Poke
                  name={poke.name}
                  Imgurl={poke.ImgUrl}
                  id={poke.pid}
                  types={poke.types}
                />
              </div>
            ))}
        <div>
          {state.isModalOpen && state.pokemon ? (
            <PokemonDetails pokemon={state.pokemon} onClose={closeModal} />
          ) : null}
        </div>
        {state.error ? state.error : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6%",
        }}
      >
        <button onClick={PrevPage}>Prev</button>
        <button onClick={NextPage}>Next</button>
      </div>
    </div>
  );
};

export default Pokemon;
