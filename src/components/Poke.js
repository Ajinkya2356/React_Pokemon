import React from "react";
import './style.css'
const Poke = ({ name, Imgurl, id, types }) => {
  const gradientStops = types.map((type, index) => {
    return `${typeColor[type]} ${index * 100}%`;
  });
  const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  const padWithZeros = (number, desiredDigits) => {
    const numberString = number.toString();
    const zerosToAdd = Math.max(0, desiredDigits - numberString.length);
    const paddedNumber = '0'.repeat(zerosToAdd) + numberString;
    return paddedNumber;
  }
  const linearGradient =
    types.length > 1
      ? `linear-gradient(180deg, ${gradientStops.join(", ")})`
      : typeColor[types[0]];
  return (
    <div
      style={{
        background: linearGradient,
      }}
      className="pokemonDesign"
    >

      <img height="100px" width="100px" style={{ marginTop: "15px" }} src={Imgurl} alt="" />
      <p>{capitalize(name)}</p>
      <p>{padWithZeros(id, 3)}</p>
    </div>
  );
};

export default Poke;
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
