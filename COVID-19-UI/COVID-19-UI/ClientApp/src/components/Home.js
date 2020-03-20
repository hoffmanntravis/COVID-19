import React, { Component } from 'react';
import { CountryGraph } from './CountryGraph';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { CountryData: [], ProvinceData: [], countries: [], selectedCountry: "", selectedProvince: "" };
    }

    componentDidMount() {
        this.GetCountryData();
        this.GetProvinceData();
    }
    refreshGraph(e, graph) {
        this.setState({ selectedCountry: e.target.value, validationError: e.target.value === "" ? "You must select a Country" : "" })
        var url = `api/country?Country=${this.state.selectedCountry}&Province=${this.state.selectedProvince}`;
        graph.dataUrl = "TEST";
        console.log(graph.dataUrl);
        graph.updateData(url);
    }
    refresh() {
        console.log(this.state.selectedCountry);
        //this.state.launchUrl = `api/country?Country=${this.state.selectedCountry}&Province=${this.state.selectedProvince}`;
        this.graph.dataUrl = `api/country?Country=${this.state.selectedCountry}&Province=${this.state.selectedProvince}`
    }
    render() {
        var graph = new CountryGraph();
        return (
            <div>
                <select
                    value={this.state.selectedCountry}
                    onChange={e => this.refreshGraph(e, graph)}
                >
                    {this.state.countries.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}

                </select>

            </div>
        );
    }


    handleChange = (event) => {
        event.preventDefault(); // May or may not be necessary depending on what you are doing

        this.state.selectedCountry = event.target;

        this.state.launchUrl = `api/country?Country=${this.state.selectedCountry}&Province=${this.state.selectedProvince}`;

        fetch(this.state.launchUrl )
            .then((response) => response.json())
            .then((data) => {
                //this.graph.CovidData = data;
            });
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