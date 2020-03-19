import CanvasJSReact from '../canvasjs/canvasjs.react';
var React = require('react');
var Component = React.Component;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
            var confirmed = { x: null, y: null};
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

        const options = {
        theme: "light2",
        title: {
            text: "COVID-19 Reported Cases"
        },
        subtitles: [{
            text: "Confirmed, Deaths, Recovered"
        }],
        axisY: {
            includeZero: true
        },
        toolTip: {
            shared: true
        },
        data: [
            {
                type: "area",
                name: "Confirmed",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "######",
                dataPoints: ConfirmedDataPoints
            },
            {
                type: "area",
                name: "Recovered",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "######",
                dataPoints: RecoveredDataPoints
            },
            {
                type: "area",
                name: "Deaths",
                showInLegend: true,
                xValueFormatString: "MMM YYYY",
                yValueFormatString: "######",
                dataPoints: DeathsDataPoints
            }
            ]
            
    }
        return (
            <div>
                {contents}
                <CanvasJSChart options={options}
                /* onRef={ref => this.chart = ref} */
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
