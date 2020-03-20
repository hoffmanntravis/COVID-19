//import CanvasJSReact from '../canvasjs/canvasjs.react';
import { Line } from 'react-chartjs-2';
var React = require('react');
var Component = React.Component;
//var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class CountryGraph extends Component {
    constructor(covidData, props) {
        super(props);
        this.state = { CovidData: covidData, dataUrl: "", ready: false }
    };
    componentDidMount() {
        console.log("Mounted and calling GetCovidData() in CountryGraph.js");
        this.GetCovidData();

    }
    componentDidUpdate(prevProps) {
        console.log("Updating and calling GetCovidData() in CountryGraph.js");
        this.GetCovidData();
    }

    render() {

        var CountryData = this.state.CovidData;
        var ConfirmedDataPoints = [];
        var DeathsDataPoints = [];
        var RecoveredDataPoints = [];
        if (CountryData) {
            for (var i = 0; i < CountryData.length; i++) {
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

                var TotalConfirmed = ConfirmedDataPoints[ConfirmedDataPoints.length - 1].y;
                var TotalDeaths = DeathsDataPoints[DeathsDataPoints.length - 1].y;
                var TotalRecovered = RecoveredDataPoints[RecoveredDataPoints.length - 1].y;

            }

            var state = {
                datasets: [
                    {
                        label: `Confirmed: ${TotalConfirmed}`,
                        fill: true,
                        lineTension: 0.2,
                        backgroundColor: 'rgba(102,178,255,.5)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: ConfirmedDataPoints
                    },
                    {
                        label: `Deaths: ${TotalDeaths}`,
                        fill: true,
                        lineTension: 0.2,
                        backgroundColor: 'rgba(180,0,0,.5)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: DeathsDataPoints
                    },
                    {
                        label: `Recovered: ${TotalRecovered}`,
                        fill: true,
                        lineTension: 0.2,
                        backgroundColor: 'rgba(0,128,0,.5)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 2,
                        data: RecoveredDataPoints
                    }
                ]
            }
            var options = {
                responsive: true,
                title: {
                    display: true,
                    text: 'COVID-19 Status',
                    fontSize: 20
                },
                legend: {
                    display: true,
                    position: 'right'
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                    }]
                }
            }

            return (
                <div>
                    <Line
                        data={state}
                        options={options}
                    />
                </div >
            );

        }
    }

}
