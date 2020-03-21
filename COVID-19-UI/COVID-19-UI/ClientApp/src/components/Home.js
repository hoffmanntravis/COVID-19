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
        var selectedCountry = e.target.value;
        this.state.provinceUrl = `api/CountryProvinces?Country=${selectedCountry}`;
        this.GetCountryProvinceData();
        this.state.provinceReady = false;
        this.provinces = null;

        if (this.state.selectedProvince || this.state.provinces.length == 0) {
            this.state.ready = false;

            this.setState({ selectedCountry: selectedCountry, validationError: e.target.value === "" ? "You must select a Country" : "" })
            this.state.url = `api/LocationOccurrences?Country=${selectedCountry}&Province=${this.state.selectedProvince}`;
        }

    }

    refreshGraphProvinces(e) {
        
        this.state.provinceReady = true;

        if (this.state.provinces.length > 0) {
            this.state.ready = false;
            var selectedProvince = e.target.value;
            var selectedCountry = this.state.selectedCountry;

            this.setState({ selectedProvince: selectedProvince, validationError: e.target.value === "" ? "You must select a Province" : "" })
            this.state.url = `api/LocationOccurrences?Country=${selectedCountry}&Province=${selectedProvince}`;
        }
    }


    render() {
        if (!(this.state.ready))
            this.GetCovidData();
        var graph = new CountryGraph(this.state.CovidData);
        return (
            <div>
                <select value={this.state.selectedCountry} onChange={e => this.refreshGraphCountry(e)}>
                    {this.state.countries.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
                </select>
                <select value={this.state.selectedProvince} onChange={e => this.refreshGraphProvinces(e)}>
                    {this.state.provinces.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
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

    async GetCountryProvinceData() {
        ///api/CountryProvinces?Country=Us
        const response = await fetch(encodeURI(this.state.provinceUrl));
        var data = await response.json();
        if (data != null) {
            this.setState({ ProvinceData: data.sort() });

            var prvoincesFromApi = data.map(c => {
                return { value: c.toLowerCase(), display: toTitleCase(c) }
            });

            this.setState({
                provinces: [{ value: [], display: '(Select your Province)' }].concat(prvoincesFromApi)
            });
        }
        else {
            this.setState({ selectedProvince: "", provinces: [] });
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
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};