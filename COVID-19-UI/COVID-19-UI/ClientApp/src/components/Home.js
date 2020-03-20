import React, { Component } from 'react';
import { CountryGraph } from './CountryGraph';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { CountryData: [], ProvinceData: [], countries: [], selectedCountry: "", selectedProvince: "", graph: new CountryGraph(), CovidData: [], graphUrl: "", ready: false, url: "" };
    }

    componentDidMount() {
        this.GetCountryData();
        this.GetProvinceData();
    }

    refreshGraph(e) {
        var selectedCountry = e.target.value;
        this.setState({ selectedCountry: selectedCountry, validationError: e.target.value === "" ? "You must select a Country" : "" })
        this.state.url = `api/country?Country=${selectedCountry}&Province=${this.state.selectedProvince}`;
        console.log(this.state.graphUrl);
        console.log(this.state.selectedCountry);
        this.state.ready = false;
    }


    render() {
        if (!(this.state.ready))
            this.GetCovidData();
        var graph = new CountryGraph(this.state.CovidData);
        return (
            <div>
                <select value={this.state.selectedCountry} onChange={e => this.refreshGraph(e, graph)}>
                {this.state.countries.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
            </select>
                {this.state.selectedCountry && graph.render()}
            </div>
        );
    }

    async GetCovidData() {
        //https://localhost:44353/api/country?Country=Mainland%20China&Province=Anhui
        const response = await fetch(encodeURI(this.state.url));
        const data = await response.json();
        this.setState({ CovidData: data, ready: true });
    }

    async GetCountryData() {
        const response = await fetch('api/CountryList');
        var data = await response.json();
        this.setState({ CountryData: data.sort() });

        var countriesFromApi = data.map(c => {
            return { value: c.toLowerCase(), display: toTitleCase(c) }
        });

        this.setState({
            countries: [{ value: '', display: '(Select your Country)' }].concat(countriesFromApi)
        });
    }
    async GetProvinceData() {
        const response = await fetch('api/ProvinceList');
        const data = await response.json();
        this.setState({ ProvinceData: data.sort() });
    }

}



var toTitleCase = function (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = { CountryData: [], ProvinceData: [], countries: [], selectedCountry: "", selectedProvince: "", CovidData: [], graphUrl: "https://localhost:44353/api/country?Country=Mainland%20China&Province=Anhui", ready: false };
    }
    componentDidMount() {

    }
    render() {
        this.GetCovidData();
        var graph = new CountryGraph(this.state.CovidData);

        return (
            <div>
                {graph.render()}
           </div>
        );
    }

}
