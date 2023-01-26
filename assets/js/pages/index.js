import { h, Component, render } from 'https://cdn.skypack.dev/preact@10.4.7';
import { useEffect, useState } from 'https://cdn.skypack.dev/preact@10.4.7/hooks'

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
];

let getDemoData = (length, multiple) => {
    return [...Array(length).keys()].map(x => Math.floor(Math.random()*multiple))
}

const dataBase = {
    backgroundColor: 'rgb(197, 5, 12, .5)',
    borderColor: 'rgb(197, 5, 12)',
    borderWidth: 2,
    borderRadius: 5
}

const cpu_data = {
    labels: labels,
    datasets: [{
        ...dataBase,
        data: getDemoData(6, 100),
    }]
};
const project_data = {
    labels: labels,
    datasets: [{
        ...dataBase,
        backgroundColor: 'rgb(0, 0, 0, .5)',
        borderColor: 'rgb(0, 0, 0)',
        data: getDemoData(6, 200),
    }]
};
const engagements_data = {
    labels: labels,
    datasets: [{
        ...dataBase,
        data: getDemoData(6,40),
    }]
};

const baseConfig = {
    type: 'bar',
    options: {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
            },
            maintainAspectRatio: false
        }
    }
}

const cpu_config = {
    type: 'bar',
    options: {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Core Hours Utilized'
            },
            maintainAspectRatio: false
        }
    },
    data: cpu_data
};
cpu_config.options.plugins.title.text = 'Core Hours Utilized'

const project_config = {
    type: 'bar',
    options: {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Research Projects'
            },
            maintainAspectRatio: false
        }
    },
    data: project_data,
};
const engagement_config = {
    type: 'bar',
    options: {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Facilitator Engagements'
            },
            maintainAspectRatio: false
        }
    },
    data: engagements_data,
};

// const cpuChart = new Chart(
//     document.getElementById('cpu-stats'),
//     cpu_config
// );
//
// const projectChart = new Chart(
//     document.getElementById('project-stats'),
//     project_config
// );
//
// const engagementsChart = new Chart(
//     document.getElementById('engagement-stats'),
//     engagement_config
// );

const CollegeTable = (props) => {

    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("/assets/data/college-table.json")
            .then(r => r.json())
            .then(d => setData(d))
    }, [])

    return (
        h("table", {className: "table-responsive my-4"},
            h("thead", {},
                h("th", {}, "College"),
                h("th", {className: "text-end"}, "Projects Supported"),
                h("th", {className: "text-end"}, "HTC Core Hours"),
                h("th", {className: "text-end"}, "HPC Core Hours"),
                h("th", {className: "text-end"}, "CHTC Interactions")
            ),
            h("tbody", {},
                ...data.map(v => {
                    return (
                        h("tr", {},
                            h("td", {}, v["College"]),
                            h("td", {className: "text-end"}, v["NumProj"].toLocaleString()),
                            h("td", {className: "text-end"}, v["HTCHours"].toLocaleString()),
                            h("td", {className: "text-end"}, v["HPCHours"].toLocaleString()),
                            h("td", {className: "text-end"}, v["CHTC Interactions"].toLocaleString()),
                        )
                    )
                }),
                h('tr', {className: "bg-dark text-light"},
                    h("td", {}, "Total"),
                    h("td", {className: "text-end"}, data.reduce((p, c) => {return p + c['NumProj']}, 0).toLocaleString()),
                    h("td", {className: "text-end"}, data.reduce((p, c) => {return p + c['HTCHours']}, 0).toLocaleString()),
                    h("td", {className: "text-end"}, data.reduce((p, c) => {return p + c['HPCHours']}, 0).toLocaleString()),
                    h("td", {className: "text-end"}, data.reduce((p, c) => {return p + c['CHTC Interactions']}, 0).toLocaleString()),
                )
            )
        )
    )
}

render(h(CollegeTable), document.getElementById("college-table"))
