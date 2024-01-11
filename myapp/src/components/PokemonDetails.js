// PokemonDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Poke from "./Poke";
import "./style.css";
const PokemonDetails = ({ pokemon, onClose }) => {
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chain, setChain] = useState([])
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
      text = text.slice(0, 4);
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
  return (
    <div className="overlayStyles">
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>

          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <h2>
                {pokemonData.name} || {pokemonData.id}
              </h2>
              <img src={pokemonData.ImgUrl} alt="" />
              <p>{pokemonData.text}</p>
              <h5>Egg groups</h5>
              {pokemonData.eggroups && pokemonData.eggroups.length ? (
                pokemonData.eggroups.map((a) => <p key={a}>{a}</p>)
              ) : (
                <p>No egg groups available</p>
              )}
              <div
                style={{ display: "flex", justifyContent: "center", gap: "5%" }}
              >
                <p>Height - {pokemonData.height} decimeter</p>
                <p>Weight - {pokemonData.weight} hectograms</p>
                <p>Gender = {pokemonData.gender}</p>
                <p>Types - {pokemonData.types.join(",")}</p>
                <p>Abilites - {pokemonData.abilities.join(",")}</p>
              </div>

              <div
                style={{ display: "flex", justifyContent: "center", gap: "5%" }}
              >
                <p>HP - {pokemonData.stats.hp}</p>
                <p>Defense - {pokemonData.stats.defense}</p>
                <p>Sp.Attack - {pokemonData.stats.specialAttack}</p>
                <p>Sp.Def - {pokemonData.stats.specialDefence}</p>
                <p>Attack - {pokemonData.stats.attack}</p>
                <p>Speed - {pokemonData.stats.speed}</p>
              </div>

              <h4>Evolution Chain</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                {chain && chain.length > 0 ? (
                  chain.map((poke) => (
                    <Poke
                      key={poke.nameInfo.id}
                      name={poke.nameInfo.name}
                      id={poke.nameInfo.id}
                      Imgurl={poke.image}
                      types={poke.types}
                    />
                  ))

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
