// Variables to hold data
let labels = [];
let cumulative_roi_1500 = {};
let cumulative_roi_percent = {};
let companies = [];
let quarter = "2021Q4";  // Target quarter

// Color palette for different companies
let companyColors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'];

// Initial metric to display
let selectedMetric = 'Cumulative ROI on $1500 ($)';

// Load the CSV file using D3
d3.csv('../../../data/outputs/cumulative_roi_results.csv').then(function(data) {
    // Parse the CSV data
    data.forEach(row => {
        let company = row['Company'];
        let quarter = row['Quarter'];
        let roi_1500 = +row['Cumulative ROI on $1500 ($)'];
        let roi_percent = +row['Cumulative ROI (%)'];

        // Populate labels (quarters)
        if (!labels.includes(quarter)) {
            labels.push(quarter);
        }

        // Initialize company data
        if (!cumulative_roi_1500[company]) {
            cumulative_roi_1500[company] = [];
            cumulative_roi_percent[company] = [];
            companies.push(company);
        }

        // Add data for each company and each metric
        cumulative_roi_1500[company].push(roi_1500);
        cumulative_roi_percent[company].push(roi_percent);
    });

    // Populate the multi-select with companies
    populateCompanySelect();

    // Create the initial chart
    createChart();

    // Populate the table with 2021Q4 results
    populateTable();
});

// Function to populate the multi-select with companies
function populateCompanySelect() {
    let companySelect = document.getElementById('company-select');
    companies.forEach((company) => {
        let option = document.createElement('option');
        option.value = company;
        option.text = company;
        companySelect.add(option);
    });

    // Select all companies by default
    for (let i = 0; i < companySelect.options.length; i++) {
        companySelect.options[i].selected = true;
    }
}

// Function to create datasets based on selected metric and companies
function getDatasets() {
    let datasets = [];
    let data = (selectedMetric === 'Cumulative ROI on $1500 ($)') ? cumulative_roi_1500 : cumulative_roi_percent;

    // Get selected companies
    let selectedCompanies = Array.from(document.getElementById('company-select').selectedOptions).map(option => option.value);

    selectedCompanies.forEach((company, index) => {
        datasets.push({
            label: company,
            data: data[company],
            borderColor: companyColors[index % companyColors.length],  // Assign a distinct color to each company
            backgroundColor: companyColors[index % companyColors.length].replace('1)', '0.2)'),  // Transparent background
            fill: false
        });
    });
    return datasets;
}

// Function to create the chart
let roiChart;
function createChart() {
    let ctx = document.getElementById('roiChart').getContext('2d');
    roiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,  // X-axis labels (quarters)
            datasets: getDatasets()  // Initial datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Return of Investments (All Companies)',
                    font: {
                        size: 18
                    },
                    align: 'center'  // Centralize the title
                }
            }
        }
    });
}

// Function to update chart and table based on dropdown selection
function updateChart() {
    selectedMetric = document.getElementById('metric').value;
    roiChart.data.datasets = getDatasets();
    roiChart.update();
    populateTable();  // Update the table as well
}

// Function to format values as money and percentage
function formatValue(value, type) {
    if (type === 'money') {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else if (type === 'percentage') {
        return value.toFixed(2) + '%';
    }
    return value;
}

// Function to populate the table with 2021Q4 results
function populateTable() {
    let tableBody = document.getElementById('resultTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';  // Clear previous content

    let data = (selectedMetric === 'Cumulative ROI on $1500 ($)') ? cumulative_roi_1500 : cumulative_roi_percent;
    let tableData = [];

    // Get 2021Q4 data for each company
    companies.forEach(company => {
        let q4Index = labels.indexOf(quarter);
        if (q4Index !== -1) {
            tableData.push({
                company: company,
                roi_1500: cumulative_roi_1500[company][q4Index],
                roi_percent: cumulative_roi_percent[company][q4Index]
            });
        }
    });

    // Sort by descending order of the selected metric
    if (selectedMetric === 'Cumulative ROI on $1500 ($)') {
        tableData.sort((a, b) => b.roi_1500 - a.roi_1500);
    } else {
        tableData.sort((a, b) => b.roi_percent - a.roi_percent);
    }

    // Populate the table
    tableData.forEach(row => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td>${row.company}</td><td>${formatValue(row.roi_1500, 'money')}</td><td>${formatValue(row.roi_percent, 'percentage')}</td>`;
        tableBody.appendChild(tr);
    });
}
