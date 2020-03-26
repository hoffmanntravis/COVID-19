import React, { Component } from 'react';
import { CountryGraph } from './CountryGraph';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            CountryData: [], ProvinceData: [], countries: [], provinces: [], selectedCountry: "", selectedProvince: "",
            graph: new CountryGraph(), CovidData: [], graphUrl: "", ready: false, url: "", provinceReady: false, provinceUrl: ""
        };
    }

    componentDidMount() {
        this.GetCountryData();
        this.GetProvinceData();
    }

    refreshGraphCountry(e) {

        this.setState({
            provinceUrl: `api/CountryProvinces?Country=${e.target.value}`, provinceReady: false, provinces: [],
            ready: false,
            selectedCountry: e.target.value
        });

        if (this.state.provinces.includes(this.state.selectedProvince)) {
            var occurencesUrl = `api/LocationOccurrences?Country=${e.target.value}&Province=${this.state.selectedProvince}`
        }
        else {
            var occurencesUrl = `api/LocationOccurrences?Country=${e.target.value}`
        }

        this.setState({ url: occurencesUrl });

    }

    refreshGraphProvinces(e) {
        this.setState({});

        var selectedCountry = this.state.selectedCountry;

        this.setState({
            provinceReady: true,
            ready: false,
            selectedProvince: e.target.value,
            selectedCountry: selectedCountry,
            url: `api/LocationOccurrences?Country=${selectedCountry}&Province=${e.target.value}`
        });

    }


    render() {
        if (!(this.state.ready)) {
            this.GetCovidData();
            this.GetCountryProvinceData();
        }

        var graph = new CountryGraph(this.state.CovidData);
        return (
            <div>
                <select value={this.state.selectedCountry} onChange={e => this.refreshGraphCountry(e)}>
                    {this.state.countries.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
                </select>
                <select value={this.state.selectedProvince} onChange={e => this.refreshGraphProvinces(e)}>
                    {this.state.provinces.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
                </select>
                {graph.render()}
            </div>
        );
    }

    async GetCovidData() {
        if (this.state.url) {
            const response = await fetch(encodeURI(this.state.url));
            const data = await response.json();
            this.setState({ CovidData: data, ready: true });
        }
    }

    async GetCountryProvinceData() {
        ///api/CountryProvinces?Country=Us
        if (this.state.provinceUrl) {
            const response = await fetch(encodeURI(this.state.provinceUrl));
            var data = await response.json();
            if (data != null) {
                this.setState({ ProvinceData: data.sort() });

                var provincesFromApi = data.map(c => {
                    return { value: c.toLowerCase(), display: toTitleCase(c) }
                });

                this.setState({
                    provinces: [{ value: [], display: '(Select your Province)' }].concat(provincesFromApi)
                });
            }
            else {
                this.setState({ selectedProvince: "", provinces: [] });
            }
        }
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
    if (str === "us")
        return "US";
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }


    return str.join(' ');
};