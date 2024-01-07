import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Poke from "./Poke";
import SearchPokemon from "./SearchPokemon";
import TypeFilter from "./TypeFilter";
import Stats from "./Stats";
const initialState = {
  loading: true,
  error: "",
  posts: [],
  offset: 0,
  searchQuery: "",
  searchType: "",
  range:[0,210],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_POKEMON":
      return { ...state, loading: false, posts: action.results, error: "" };
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
      return{
        ...state,
        loading:false,
        range:action.stats
      }
    case "CLEAR_SEARCH":
      return {
        ...state,
        searchQuery: "",
        searchType: "",
      };
    case "RESET":
      return { ...state };
    default:
      return { ...state };
  }
};
const Pokemon = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
        Pokemon.push({
          name: poke.name,
          ImgUrl: imageUrl,
          pid: pokemonId,
          types: types,
          hp: Pdetails.stats[0]["base_stat"],
          attack: Pdetails.stats[1]["base_stat"],
          defence: Pdetails.stats[2]["base_stat"],
          specialAttack: Pdetails.stats[3]["base_stat"],
          specialDefence: Pdetails.stats[4]["base_stat"],
          speed: Pdetails.stats[5]["base_stat"],
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
  };
  const handleFilter = (e) => {
    dispatch({
      type: "SEARCH_TYPE",
      keyword: e.target.value.toLowerCase(),
    });
  };
  const handleStats=(e)=>{
    dispatch({
      type:"STATS",
      stats:e.target.value
    })
  }
  const filteredPoke = state.posts.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(state.searchQuery);
    const typeMatch = pokemon.types
      .map((type) => type.toLowerCase())
      .includes(state.searchType);
    if (state.searchQuery !== "" && state.searchType !== "") {
      return nameMatch && typeMatch;
    } else if (state.searchType !== "") {
      return typeMatch;
    }
    return nameMatch || typeMatch;
  });
  console.log(filteredPoke);
  console.log("STATS",state.range);
  useEffect(() => {
    fetchData();
  }, [state.offset]);

  return (
    <div>
      <div>
        <SearchPokemon
          searchQuery={state.searchQuery}
          handleSearch={handleSearch}
        />
        <TypeFilter searchType={state.searchType} handleSearch={handleFilter} />
        <h1>Select Stats</h1>
        <Stats selection={handleStats} range={state.range}/>
        <Stats selection={handleStats} range={state.range}/>
        <Stats selection={handleStats} range={state.range}/>
        <Stats selection={handleStats} range={state.range}/>
        <Stats selection={handleStats} range={state.range}/>
        <Stats selection={handleStats} range={state.range}/>
        
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
        {state.loading
          ? "LOADING"
          : (state.searchQuery || state.searchType
              ? filteredPoke
              : state.posts
            ).map((poke) => (
              <div key={poke.ImgUrl}>
                <Poke
                  name={poke.name}
                  Imgurl={poke.ImgUrl}
                  id={poke.pid}
                  types={poke.types}
                />
              </div>
            ))}
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
