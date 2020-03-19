import React, { Component } from 'react';

export class DeserializeStatus extends Component {
    //reminder: this used to be async
    static GetCovidData() {
        const response = fetch('StatusJSON');
        const data = response.json();
        return data;
    }
}