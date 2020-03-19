//import CanvasJSReact from '../canvasjs/canvasjs.react';
import { Line } from 'react-chartjs-2';
var React = require('react');
var Component = React.Component;
//var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : null;

        var CountryData = this.state.CovidData;
        var i;
        var ConfirmedDataPoints = [];
        var DeathsDataPoints = [];
        var RecoveredDataPoints = [];
        //{ x: new Date("2017- 01- 01"), y: 84.927 },
        for (i = 0; i < CountryData.length; i++) {
            var confirmed = { x: null, y: null };
            confirmed.x = new Date(CountryData[i].Key);
            confirmed.y = CountryData[i].Value.Confirmed;
            ConfirmedDataPoints.push(confirmed);

            var death = { x: null, y: null };
            death.x = new Date(CountryData[i].Key);
            death.y = CountryData[i].Value.Deaths;
            DeathsDataPoints.push(death);

            var recovered = { x: null, y: null };
            recovered.x = new Date(CountryData[i].Key);
            recovered.y = CountryData[i].Value.Recovered;
            RecoveredDataPoints.push(recovered);
        }

        var state = {
            labels: ['January', 'February', 'March',
                'April', 'May'],
            datasets: [
                {
                    label: 'Rainfall',
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: [65, 59, 80, 81, 56]
                }
            ]
        }

        return (
            <div>
                <Line
                    data={state}
                    options={{
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
            </div>
        );

    }

    async GetCovidData() {
        //https://localhost:44353/api/country?Country=Mainland%20China&Province=Anhui
        const response = await fetch('api/country?Country=Mainland%20China&Province=Anhui');
        const data = await response.json();
        this.setState({ CovidData: data, loading: false });
    }

}
