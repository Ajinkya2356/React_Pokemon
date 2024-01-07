import React from "react";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
const Stats = ({ selection, range }) => {
  const stats = ["HP", "Attack", "Defence", "Speed", "Sp.attack", "Sp.defence"];
  console.log(range);
  return (
    <div><div style={{ width: "500px" }}>
        <Grid container spacing={2} alignItems="center" className="p-0">
          <Grid item>0</Grid>
          <Grid item xs>
            <Slider
              size="small"
              getAriaLabel={() => "Stats range"}
              value={range}
              onChange={selection}
              valueLabelDisplay="auto"
              max={210}
              {...stats}
            />
          </Grid>
          <Grid item>210</Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Stats;
