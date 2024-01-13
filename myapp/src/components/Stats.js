import React from "react";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import "./Pokemon.css"
const Stats = ({ selection, range, statename }) => {
  return (
    <div >
      <div style={{
        width: "350px", marginTop: "3%", background: "#F1F3F3", borderRadius: "8px;"
        , border: "1px solid #2E3156",borderRadius:"8px",padding:"0 5%"
      }}>
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
              name={statename}
              
            />
          </Grid>
          <Grid item>210</Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Stats;
