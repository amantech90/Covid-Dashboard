import React, { Component } from "react";
import "./Table.css";
import axios from "axios";
export default class Table extends Component {
  state = {
    stateWiseData: [],
    isLoading: true,
    sorting: true,
    sortingNo: false,
  };
  componentDidMount() {
    axios
      .get("/api/v1/covid19/getAllStateData/india")
      .then((res) => {
        if (res.data.status) {
          let duplicateDataArray = [];
          for (let i = 1; i < res.data.data.length; i++) {
            duplicateDataArray.push({
              id: Math.random(),
              active: res.data.data[i].active,
              confirmed: res.data.data[i].confirmed,
              recovered: res.data.data[i].recovered,
              stateName: res.data.data[i].state,
              death: res.data.data[i].deaths,
            });

            // console.log(res.data.data[i].state.toLowerCase());
          }
          this.setState({
            stateWiseData: duplicateDataArray,
            isLoading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  }
  compareBy(key) {
    return function (a, b) {
      if ("" + a[key] < "" + b[key]) return -1;
      if ("" + a[key] > "" + b[key]) return 1;
      return 0;
    };
  }
  sort = (key) => {
    this.setState({ sorting: !this.state.sorting });
    if (!this.state.sorting) {
      let reverse = [...this.state.stateWiseData];
      this.setState({ stateWiseData: reverse.reverse() });
    } else {
      let arrayCopy = [...this.state.stateWiseData];
      arrayCopy.sort(this.compareBy(key));
      //arrayCopy.reverse(); for descending
      this.setState({ stateWiseData: arrayCopy });
    }
  };
  sortEggsInNest(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  sortNo = (key) => {
    this.setState({ sortingNo: !this.state.sortingNo });
    if (!this.state.sortingNo) {
      let reverse = [...this.state.stateWiseData];
      this.setState({ stateWiseData: reverse.reverse() });
    } else {
      let arrayCopy = [...this.state.stateWiseData];
      arrayCopy.sort((a, b) => {
        return a[key] - b[key];
      });
      //arrayCopy.reverse(); for descending
      this.setState({ stateWiseData: arrayCopy });
    }
  };
  render() {
    const { isLoading, stateWiseData } = this.state;
    console.log(stateWiseData);
    return isLoading ? (
      <p
        style={{
          fontSize: "20px",
          color: "#fff",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          fontWeight: "600",
        }}
      >
        Loading ...
      </p>
    ) : (
      <table>
        <thead>
          <tr>
            <th className="death" onClick={() => this.sort("stateName")}>
              State
            </th>
            <th className="confirmed" onClick={() => this.sortNo("confirmed")}>
              Confirmed
            </th>
            <th className="recovered" onClick={() => this.sortNo("recovered")}>
              Recovered
            </th>
            <th className="death" onClick={() => this.sortNo("death")}>
              Death
            </th>
          </tr>
        </thead>
        <tbody>
          {stateWiseData.map((state) => (
            <tr key={state.id}>
              <td>{state.stateName}</td>
              <td>{state.confirmed}</td>
              <td>{state.recovered}</td>
              <td>{state.death}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
