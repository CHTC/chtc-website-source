---
    layout: blank
---

import { h, Component, render } from 'https://cdn.skypack.dev/preact@10.4.7';
import { useEffect, useState, useRef, useMemo } from 'https://cdn.skypack.dev/preact@10.4.7/hooks'

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

/**
 * A function to convert large numbers into a < 4 char format, i.e. 100,000 to 100k or 10^^9 to 1b
 *
 * It would be interesting to find a solution to this that is better than O(N)
 * @param int An integer
 * @param decimals The amount of decimal places to include
 */
function int_to_small_format(int, decimals=0) {
    if(int < 10**3) {
        return int.toFixed(decimals)
    } else if ( int < 10**6 ) {
        return (int / 10**3).toFixed(decimals) + "K"
    } else if ( int < 10**9 ) {
        return (int / 10**6).toFixed(decimals) + "M"
    } else if ( int < 10**12 ) {
        return (int / 10**9).toFixed(decimals) + "B"
    } else {
        return int.toFixed(decimals)
    }
}

function useOnScreen(ref, rootMargin = "0px") {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting);
            },
            {
                rootMargin,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.unobserve(ref.current);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return isIntersecting;
}


const Counter = ({endValue, numIncrements, sleep, decimals, ...props}) => {

    const ref = useRef();
    const isOnScreen = useOnScreen(ref, "-100px");

    const [index, setIndex] = useState(0);

    let valueArray = [...Array(numIncrements + 1).keys()].map((value, index) => {
        return Math.floor(endValue * (Math.sqrt((index)/numIncrements)))
    })

    useMemo(() => {
        if(isOnScreen){
            new Promise(r => setTimeout(r, sleep)).then(r => {
                if(index < valueArray.length - 1){
                    setIndex(index + 1)
                }
            })
        }
    }, [isOnScreen, index])

    return h("h1", {ref:ref, ...props}, int_to_small_format(valueArray[index], decimals).toString())
}

const StatisticRow = () => {

    const [data, setData] = useState([]);
    useEffect(() => {
        fetch("{{ '/assets/data/college-table.json' | relative_url }}")
            .then(r => r.json())
            .then(d => setData(d))
    }, [])

    if(data){
        return(
            h("div", {className: "row"}, ...[
                h(StatisticCard, {label: "Projects Supported", value: data.reduce((p, c) => {return p + c['NumProj']}, 0), className: "col-6 col-md-3"}, ),
                h(StatisticCard, {label: "HTC Core Hours", value: data.reduce((p, c) => {return p + c['HTCHours']}, 0), className: "col-6 col-md-3"}, ),
                h(StatisticCard, {label: "HPC Core Hours", value: data.reduce((p, c) => {return p + c['HPCHours']}, 0), className: "col-6 col-md-3"}, ),
                h(StatisticCard, {label: "Facilitator Interactions", value: data.reduce((p, c) => {return p + c['CHTC Interactions']}, 0), className: "col-6 col-md-3"}, ),
            ])
        )
    }
}

const StatisticCard = ({label, value, ...props}) => {
    return (
        h("div", {className: "d-flex flex-direction-column", ...props}, ...[
            h(Counter, {endValue: value, numIncrements: 10, sleep:50, decimals:0, className: "text-center", style:{fontSize: "5rem"}}),
            h("h1", {className: "text-center"}, label)
        ])
    )
}

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
                h("th", {className: "text-end"}, "Facilitator Interactions")
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

render(h(StatisticRow), document.getElementById("statistic-row"))
render(h(CollegeTable), document.getElementById("college-table"))
