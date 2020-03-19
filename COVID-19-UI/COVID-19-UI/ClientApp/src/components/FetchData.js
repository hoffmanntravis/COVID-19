import React, { Component } from 'react';
//import { DeserializeStatus } from './DeserializeStatus'
export class FetchData extends Component {
    static displayName = FetchData.name;


    constructor(props) {
        super(props);
        this.state = { CovidData: [], loading: true };
    }

    componentDidMount() {
        this.GetCovidData();
    }


    render() {
        //this should really happen outside of javascript.  Build out api a bit more to return robust objects.
        return true;
    }

    async  GetCovidData() {
        const response = await fetch('StatusJSON');
        const data = await response.json();
        this.setState({ CovidData: data, loading: false });
        console.log(data);
    }

}
