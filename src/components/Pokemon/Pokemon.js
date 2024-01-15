import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Poke from "../PokemonCard/Poke";
import SearchPokemon from "../Search/SearchPokemon";
import TypeFilter from "../TypeFilter/TypeFilter";
import Stats from "../Stats/Stats";
import PokemonDetails from "../Details/PokemonDetails";
import "./Pokemon.css";
import Gender from "../Gender/Gender";
import OverlayContent from "../Overlay/OverlayContent";

import Loader from "../Loader/Loader";
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
    specialAttack: [70, 150],
    specialDefence: [70, 150],
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
      };
    case "CLOSE_POKEMON":
      return {
        ...state,
        pokemon: null,
        isModalOpen: false,
      };
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
          specialAttack: [70, 150],
          specialDefence: [70, 150],
        },
        filteredResult: state.posts,
      };

    default:
      return { ...state };
  }
};
const Pokemon = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [window, setWindow] = useState(false);
  const toggleWindow = () => {
    setWindow(true);
  }
  const onClose = () => {
    setWindow(false);
  }
  const toggleDetailsScreen = (pokemon) => {
    console.log("Event trigerred");
    dispatch({ type: "POKEMON", payload: pokemon, value: true });
  };

  const closeModal = () => {
    dispatch({ type: "CLOSE_POKEMON" });
  };

  const fetchData = async () => {
    const Pokemon = [];
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${state.offset}&limit=21`
      );
      const data = res.data;
      const results = data.results;
      for (const poke of results) {
        const Purl = await axios.get(poke.url);
        const Pdetails = Purl.data;
        const imageUrl = Pdetails.sprites.other.dream_world.front_default;
        const parts = poke.url.split("/");
        const pokemonId = parts[parts.length - 2];
        const types = Pdetails.types.map((item) => item.type.name);
        const abilities = Pdetails.abilities.map((item) => {
          return item.ability.name;
        });
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
          height: Pdetails.height,
          weight: Pdetails.weight,
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
          console.log("statname", statName)
          const pokemonStat = item.stats[statName];
          console.log("stat", pokemonStat)
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
    setopenstat(false);
    dispatch({ type: "SET_FILTERED_RESULT", payload: filteredResult });
  };

  console.log("Filtered Results", state.filteredResult);
  useEffect(() => {
    fetchData();
  }, [state.offset]);

  useEffect(() => {
    dispatch({ type: "SET_FILTERED_RESULT", payload: state.posts });
  }, [state.posts]);
  const [openstat, setopenstat] = useState(false);
  const toggleClass = () => {
    setopenstat(!openstat)
  };
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggle = () => {
    setOpen(!open)
  }

  return (
    <div>
      <div className="box">

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <SearchPokemon className="searchFilter"
            searchQuery={state.searchQuery}
            handleSearch={handleSearch}
          />
          <button className="hamburger" onClick={toggleWindow}>
            ☰
          </button>
          {window && <div className="filterWindow">
            <span className="closebtn" onClick={onClose}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg></span>
            <h1>&nbsp;&nbsp;Filters</h1>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="smallContent"><h3>Types</h3> (Nomral+5 More)<svg onClick={toggleDropdown} xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>

              </div>
              {isOpen && <OverlayContent searchType={state.searchType} handleSearch={handleFilter} />}
              {!isOpen && <div className="smallContent"><h3>Gender</h3> (Normal+5 More)<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg></div>}
              {!isOpen && <div className="smallContent"><h3>Stats</h3> (Normal+5 More)<svg onClick={toggle} xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg></div>}
              {open && <div className="overlay2">
                <ul>
                  <li>
                    <h3>HP</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput.hp}
                      statename={"hp"}
                    />
                  </li>
                  <li>
                    <h3>Attack</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput.attack}
                      statename={"attack"}
                    />
                  </li>
                  <li><h3>Defense</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput.defense}
                      statename={"defense"}
                    /></li>
                  <li><h3>Speed</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput.speed}
                      statename={"speed"}
                    /></li>
                  <li><h3>Sp.Attack</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput["specialAttack"]}
                      statename={"specialAttack"}
                    /></li>
                  <li><h3>Sp.Defense</h3>
                    <Stats
                      selection={handleStats}
                      range={state.statsInput["specialDefence"]}
                      statename={"specialDefence"}
                    /></li>
                </ul>
              </div>}
            </div>

            <div className="smallbtn">
              <button onClick={() => dispatch({ type: "CLEAR_SEARCH" })} className="resetbtn">Reset</button>
              <button onClick={applyFilters} className="applybtn">Apply</button>
            </div>
          </div>}
        </div>

        <TypeFilter searchType={state.searchType} handleSearch={handleFilter} />
        <Gender />
        <div className="statsFilter">
          <h4>Stats</h4>
          <button
            onClick={toggleClass}
            style={{
              width: "194px",
              height: "57px",
              borderRadius: "8px",
              background: "#C9DDE2",
              cursor: "pointer",
              border: "none", paddingRight: "50%",

            }}
          >
            HP+5 More
          </button>
        </div>

        {openstat && <div style={{ width: "600px", zIndex: "100", background: "white", position: "absolute", left: "60%", top: "38%", borderRadius: "8px", boxShadow: "0px 4px 14px 0px rgba(46, 49, 86, 0.40)", color: "#2E3156", }} >
          <h2>&nbsp;&nbsp;&nbsp;&nbsp;Select Stats</h2>
          <span style={{ position: "absolute", top: "5%", left: "85%" }} onClick={toggleClass}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </span>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "25%" }}>
              <ul className="line">
                <li>HP</li>
                <li>Attack</li>
                <li>Defence</li>
                <li>Speed</li>
                <li>Sp.Attack</li>
                <li>Sp.Defence</li>
              </ul>
            </div>

            <div style={{ width: "70%", paddingLeft: "5%", marginTop: "4%" }}>
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
                range={state.statsInput["specialAttack"]}
                statename={"specialAttack"}
              />
              <Stats
                selection={handleStats}
                range={state.statsInput["specialDefence"]}
                statename={"specialDefence"}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "5%",
              marginTop: "3%",
              marginRight: "7%",
              marginBottom: "5%"
            }}
          >
            <button onClick={() => dispatch({ type: "CLEAR_SEARCH" })} style={{ borderRadius: "8px", border: "1px solid #2E3156", width: "78px", height: "37px" }}>
              Reset
            </button>
            {<button onClick={applyFilters} style={{ borderRadius: "8px", border: "1px solid #2E3156", width: "78px", height: "37px", background: "#2E3156", color: "white" }}>Apply</button>}
          </div>
        </div>}
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
        {state.loading
          ? <Loader />
          : (state.searchQuery || state.searchType || state.statsInput
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

      {state.loading ? <div></div> : <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6%",
          margin: "7%",
        }}
      >
        <button className="pagination" onClick={PrevPage}>Prev</button>
        <button className="pagination" onClick={NextPage}>Next</button>
      </div>}
    </div>
  );
};

export default Pokemon;
