import React, { Component } from 'react';
import { CountryGraph } from './CountryGraph';
export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { CountryData: [], ProvinceData: [], countries: [], loading: true };
    }

    componentDidMount() {
        this.GetCountryData();
        this.GetProvinceData();
    }

    render() {
        console.log(this.state.CountryData);
        var graph = new CountryGraph('api/country?Country=Mainland%20China&Province=Anhui');
        return (
            <div>

                <select>
                    {this.state.countries.map((c) => <option key={c.value} value={c.value}>{c.display}</option>)}
                </select>
             {graph.render()}
             </div>
        );
    }


    async GetCountryData() {
        const response = await fetch('api/CountryList');
        var data = await response.json();
        this.setState({ CountryData: data.sort(), loading: false });

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
        this.setState({ ProvinceData: data.sort(), loading: false });
    }

}
var toTitleCase = function (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};