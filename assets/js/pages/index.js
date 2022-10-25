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

dataBase = {
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

baseConfig = {
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

const cpuChart = new Chart(
    document.getElementById('cpu-stats'),
    cpu_config
);

const projectChart = new Chart(
    document.getElementById('project-stats'),
    project_config
);

const engagementsChart = new Chart(
    document.getElementById('engagement-stats'),
    engagement_config
);



class CollegeTable {
    constructor(id) {
        this.tableBody = document.getElementById(id)
        this.initialize()
    }

    async initialize(){
        const data = await this.getData()
        this.populateTable(data)
    }

    async getData(){
        const response = await fetch("/assets/data/college-table.json")
        const json = await response.json()

        return json
    }

    populateTable(data){
        for(const row of data) {
            let tr = document.createElement("tr")
            for(const field of row){
                let td = document.createElement("td")
                td.textContent = field
                tr.appendChild(td)
            }
            this.tableBody.appendChild(tr)
        }
    }
}

const collegeTable = new CollegeTable("college-data")
