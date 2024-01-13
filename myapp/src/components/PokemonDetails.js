// PokemonDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Poke from "./Poke";
import "./style.css";
import DetailPoke from "./DetailPoke";
import EvolutionCard from "./EvolutionCard";
import Loader from "./Loader";
const PokemonDetails = ({ pokemon, onClose }) => {
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chain, setChain] = useState([])
  const [popup, setpopup] = useState(false)
  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.pid}`
      );
      const data = res.data;
      const egg = data.egg_groups.map((egg) => egg.name);
      let text = data.flavor_text_entries.filter((item, index, self) => {
        return (
          item.language.name === "en" &&
          self.findIndex((entry) => entry.flavor_text === item.flavor_text) ===
          index
        );
      });
      text = text.slice(0, 10);
      const overallText = text.map((item) => item.flavor_text).join(" ");
      const over = overallText.replace(/,\s*|\n|\f/g, "");
      text = text.slice(0, 4)
      const description = text.map((item) => item.flavor_text).join(" ");
      const cleanedText = description.replace(/,\s*|\n|\f/g, "");

      const gender =
        data.gender_rate >= 1 && data.gender_rate <= 8
          ? "Male,Female"
          : "genderless";


      setPokemonData({
        id: pokemon.pid,
        name: pokemon.name,
        ImgUrl: pokemon.ImgUrl,
        eggroups: egg,
        text: cleanedText,
        height: pokemon.height,
        weight: pokemon.weight,
        gender,
        types: pokemon.types,
        abilities: pokemon.abilities,
        stats: pokemon.stats,
        over,
      });

      let speciesInfo = data;
      console.log(speciesInfo);
      const evolution_data = [];
      while (speciesInfo !== null) {
        let types = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesInfo.id}`);
        const typePoke = types.data.types.map((a) => a.type.name)
        evolution_data.unshift({
          nameInfo: { id: speciesInfo.id, name: speciesInfo.name },
          image:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" +
            speciesInfo.id +
            ".svg",
          types: typePoke
        });
        speciesInfo = speciesInfo.evolves_from_species
          ? await (await fetch(speciesInfo.evolves_from_species.url)).json()
          : null;
      }


      setChain(evolution_data);
      setLoading(false);
    } catch (e) {
      <h1>Something Went Wrong!</h1>;
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [pokemon]);
  useEffect(() => {
    // console.log(pokemonData.eggroups);
    console.log("chain", chain)
  }, [pokemonData, chain]);
  const padWithZeros = (number, desiredDigits) => {
    const numberString = number.toString();
    const zerosToAdd = Math.max(0, desiredDigits - numberString.length);
    const paddedNumber = '0'.repeat(zerosToAdd) + numberString;
    return paddedNumber;
  }
  const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  const openPopup = () => {
    setpopup(!popup)
  }
  return (
    <div className="overlayStyles">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>

          {loading ? (
            <Loader />
          ) : (
            <>
              <h1 className="headingPokemon">
                {pokemon.name.toUpperCase()} | {padWithZeros(pokemonData.id, 3)} |
              </h1>
              <DetailPoke Imgurl={pokemon.ImgUrl} types={pokemon.types} />
              <p className="description" >{pokemonData.text}..<b onClick={openPopup} style={{ textDecoration: "underline" }}>read more</b></p>
              {popup && <p className="popover">
                <span onClick={openPopup}>&times;</span>
                <br />
                {pokemonData.over}
              </p>}
              <br />
              <div className="container1">
                <div>
                  <p>Height</p>
                  <p style={{ fontWeight: "400" }}>{pokemonData.height}</p>
                </div>
                <div>
                  <p>Weight</p>
                  <p style={{ fontWeight: "400" }}>{pokemonData.weight}</p>
                </div>
                <div>
                  <p>Gender(s)</p>
                  <p style={{ fontWeight: "400" }}>{pokemonData.gender}</p>
                </div>
                <div>
                  <p>Egg Groups</p>
                  <p style={{ fontWeight: "400" }}>{pokemonData.eggroups && pokemonData.eggroups.length ? (
                    capitalize(pokemonData.eggroups.join(',')))
                    : (
                      <p>No egg groups available</p>
                    )}</p>
                </div>
              </div>
              <div
                className="container2"
              >
                <div>
                  <p>Abilities</p>
                  <p style={{ fontWeight: "400" }}>{capitalize(pokemonData.abilities.join(","))}</p>
                </div>
                <div>
                  <p>Types</p>
                  <p style={{ fontWeight: "400" }}>{pokemonData.types.map((a) => <span className="types" style={{ background: typeColor[a] }}>{capitalize(a)}</span>)}</p>
                </div>
                <div>
                  <p>Weak Against</p>
                </div>
              </div>
              <br /><br /><br />
              <div className="statsbox">
                <h2>Stats</h2>
                <div className="innerbox">
                  <div style={{ width: "50%" }}>
                    <p>HP &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp; &nbsp;    <span className="span2">
                        <span className="span3">{pokemonData.stats.hp}</span>
                      </span></p>
                    <p>Defense &nbsp;&nbsp;&nbsp;&nbsp;<span className="span2">
                      <span className="span3">{pokemonData.stats.defense}</span>
                    </span></p>
                    <p>Sp.Attack &nbsp; <span className="span2">
                      <span className="span3">{pokemonData.stats.specialAttack}</span>
                    </span>
                    </p>
                  </div>
                  <div style={{ width: "50%" }}>
                    <p>Attack&nbsp;&nbsp;&nbsp;
                      <span className="span2">
                        <span className="span3">{pokemonData.stats.attack}</span>
                      </span>
                    </p>
                    <p>Speed &nbsp; <span className="span2">
                      <span className="span3">{pokemonData.stats.speed}</span>
                    </span>
                    </p>
                    <p>Sp.Def&nbsp;&nbsp;&nbsp;
                      <span className="span2">
                        <span className="span3">{pokemonData.stats.specialDefence}</span>
                      </span>
                    </p>
                  </div>
                </div>

              </div>
              <br /><br />
              <h2>Evolution Chain</h2>
              <div className="evolutionchain">
                {chain && chain.length > 0 ? (
                  chain.map((poke, index) => {
                    return (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <EvolutionCard
                          Imgurl={poke.image}
                          types={poke.types}
                        ></EvolutionCard>
                        {
                          index !== chain.length - 1 ? (
                            <div className="arrows">
                              <svg style={{
                                position: "absolute", left: `${39 + index * 20}%`,
                                top: "138%",
                                strokeWidth: "1px",
                                stroke: "#2E3156"
                              }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                              </svg>
                            </div>

                          ) : (
                            ""
                          )
                        }
                      </div>

                    )

                  }

                  )

                ) : (
                  <p>No evolution data available</p>
                )}
              </div>


            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
const typeColor = {
  normal: "#DDCBD0",
  fighting: "#FCC1B0",
  flying: "#B2D2E8",
  poison: "#CFB7ED",
  ground: "#F401A6",
  rock: "#C5AEA8",
  bug: "#C1E0C8",
  ghost: "#D7C2D7",
  fire: "rgba(237, 194, 196, 1)",
  water: "rgba(203, 213, 237, 1)",
  electric: "#E2E2A0",
  psychic: "#DDC0CF",
  ice: "#C7D7DF",
  dragon: "#CADCDF",
  grass: "#C0D4C8",
  dark: "#C6C5E3",
  steel: "#C2D4CE",
  fairy: "#E4C0CF",
  unknown: "#C0DFDD",
  shadow: "#CACACA",
};