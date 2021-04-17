import React, { Component } from "react";
import { mapInfo } from "./helper/mapsSvg";
import axios from "axios";
class SvgComponent extends Component {
  state = {
    pathsInArray: [],
    stateData: [],
    style: {},
    loading: false,
  };

  componentDidMount() {
    this.getStateData();
  }

  arrangePath = async () => {
    let fakeArray = [];
    for (let key in mapInfo.paths) {
      for (let stateKey in mapInfo.names) {
        if (key === stateKey) {
          fakeArray.push({
            key: key,
            path: mapInfo.paths[key],
            stateName: mapInfo.names[stateKey],
          });
        }
      }
    }
    this.setState({
      pathsInArray: fakeArray,
    });
  };

  getStateData = async () => {
    this.setState({ loading: true });
    axios
      .get("/getAllStateData/india")
      .then((res) => {
        console.log(res, "from");
        if (res.data.status) {
          this.arrangePath();
          let duplicateDataArray = [];
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < this.state.pathsInArray.length; j++) {
              if (
                res.data.data[i].state.toLowerCase() ===
                this.state.pathsInArray[j].stateName.toLowerCase()
              ) {
                let fillColor = "#ececec";
                if (
                  res.data.data[i].confirmed >= 1 &&
                  res.data.data[i].confirmed < 50
                ) {
                  fillColor = "#DC143C";
                } else if (
                  res.data.data[i].confirmed >= 50 &&
                  res.data.data[i].confirmed < 100
                ) {
                  fillColor = "#B22222";
                } else if (res.data.data[i].confirmed >= 100) {
                  fillColor = "#FF0000";
                }
                duplicateDataArray.push({
                  id: this.state.pathsInArray[j].key,
                  active: res.data.data[i].active,
                  confirmed: res.data.data[i].confirmed,
                  recovered: res.data.data[i].recovered,
                  stateName: res.data.data[i].state,
                  path: this.state.pathsInArray[j].path,
                  death: res.data.data[i].deaths,
                  fillColor: fillColor,
                });
              }
            }
            // console.log(res.data.data[i].state.toLowerCase());
          }
          this.setState({ stateData: duplicateDataArray, loading: false });
        }
      })
      .catch((err) => console.log(err));
  };

  showTooltip = (stateName) => {
    this.setState({
      style: { [stateName]: true },
    });
  };
  hideTooltip = (stateName) => {
    this.setState({
      style: { [stateName]: false },
    });
  };
  render() {
    const { style, stateData, loading } = this.state;

    return loading ? (
      <p>Loading data ...</p>
    ) : (
      <svg
        fill="#ececec"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.1}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 800 1000"
        style={{ margin: "auto", position: "relative" }}
      >
        {stateData.map((path) => (
          <path
            key={Math.random(path.key)}
            data-toggle="tooltip"
            data-placement="right"
            title="Tooltip on right"
            onClick={() => alert("Other action")}
            className={style[path.stateName] === true ? "zoom-in" : ""}
            onMouseEnter={() => this.showTooltip(path.stateName)}
            onMouseLeave={() => this.hideTooltip(path.stateName)}
            d={path.path}
            fill={path.fillColor}
          >
            <title>
              {path.stateName} {"\n"} Confirmed Cases : {path.confirmed} {"\n"}
              Active Cases : {path.active}
              {"\n"}
              Recoverd Cases : {path.recovered}
              {"\n"}
              Death Cases : {path.death}
              {"\n"}
            </title>
          </path>
        ))}
      </svg>
    );
  }
}

export default SvgComponent;
