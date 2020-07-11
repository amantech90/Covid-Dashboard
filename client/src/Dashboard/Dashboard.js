import React, { Component } from "react";
import "./Dashboard.css";
import SvgComponent from "../Map";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import Death from "../Animation/Death";
import Logo from "../Animation/Logo";
import Recover from "../Animation/Recover";
import Moment from "react-moment";
import Table from "../Table/Table";
export default class Dashboard extends Component {
  state = {
    countryWiseData: {},
    isLoading: true
  };
  componentDidMount() {
    // this.setState({ isLoading: true });
    axios
      .get("/getCountrywiseData/india")
      .then(res => {
        console.log(res);
        if (res.data.status) {
          this.setState({
            countryWiseData: {
              confirmed: res.data.data.confirmed,
              recovered: res.data.data.noOfRecovered,
              death: res.data.data.totalNoOfDeath,
              delta: res.data.data.delta,
              lastupdatedtime: new Date(res.data.data.lastupdatedtime)
            },
            isLoading: false
          });
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    const { countryWiseData, isLoading } = this.state;
    console.log(countryWiseData, isLoading);
    return (
      <>
        <Navbar />
        {isLoading ? (
          <p
            style={{
              fontSize: "20px",
              color: "#fff",
              textAlign: "center",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: "600"
            }}
          >
            Loading ...
          </p>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <p className="last-updated">Last updated</p>
                <p className="updated-time">
                  {" "}
                  <Moment fromNow>{countryWiseData.lastupdatedtime}</Moment>
                </p>
                <div className="info-container">
                  <div className="info-card">
                    <p className="confirmed">Confirmed</p>
                    <Logo width={100} heigth={100} />
                    <p>{countryWiseData.confirmed}</p>
                    {/* <p>[+{countryWiseData.delta.confirmed}]</p> */}
                  </div>
                  <div className="info-card">
                    <p className="recovered">Recovered</p>
                    <Recover width={100} heigth={100} />
                    <p>{countryWiseData.recovered}</p>
                    {/* <p>[+{countryWiseData.delta.recovered}]</p> */}
                  </div>
                  <div className="info-card">
                    <p className="death">Death</p>
                    <Death />
                    <p>{countryWiseData.death}</p>
                    {/* <p>[+{countryWiseData.delta.deaths}]</p> */}
                  </div>
                </div>
                <div className="table-container">
                  <Table />
                </div>
              </div>
              <div className="col-md-6">
                <div className="map-container">
                  <SvgComponent />
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
