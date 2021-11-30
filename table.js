//Set that holds the unique property type
const xlabels = new Set();

//Array will hold the energy star score
const yScore = [];

//Map that holds the key value pairs for the property name and their energy star scores
var rating = new Map();

myChart();

async function myChart()
{
    Chart.defaults.font.family = "'Optima', sans-serif";

    //Retreive data from the  geojson file
    await getData();

    console.log(xlabels);

    //Create the bar graph
    const ctx = document.getElementById('myChart').getContext('2d');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from(xlabels),
            datasets: [{
                label: 'Median Energy Star Score',
                data: yScore,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                        y: {
                                beginAtZero: true
                            }
                    },
            layout: {
                        padding: 80
                    },
            maintainAspectRatio: true
        }
    });
}

//get the energy star from each primary use type
function get_energy_star(type, num)
{

    //if the type variable is not in the map, then add it to the map
    if (!rating.has(type))
    {
        rating.set(type, []);

        if (Number(num) == 0);
        else
        {
            rating.get(type).push(num);
        }
    }
    else
    {
        if (Number(num) == 0);
        else
        {
            //add the energy star value to the array within the map value
            rating.get(type).push(num);
        }
    }
}

//Get the data from the geojson file
async function getData(){

    //Fetch the data from the geojson file
    await fetch("BEWES_Building_Data.geojson").then(response => response.json()).then(data => {addToTable(data);});

    }



//Adds the data to the data cells in the table
function addToTable(data){

    //Get the total number of properties
    var count = Object.keys(data.features).length;
    console.log(count);

    //Holds the last child element
     var last_child;

     //Find the table
     var table = document.querySelector("table");


    //Loop through the data and parse it to the table
    for(var i = 0; i < count; i++)
    {


        var html=   '<tr>'+
                        '<td>' + data.features[i].properties.year + '</td>'+
                        '<td>' + data.features[i].properties.property_n + '</td>'+
                        '<td>' + data.features[i].properties.property_a + '</td>'+
                        '<td>' + data.features[i].properties.primary_us + '</td>'+
                        '<td>' + data.features[i].properties.energy_sta + '</td>'+
                        '<td>' + data.features[i].properties.compliance + '</td>'+
                        '<td>' + data.features[i].properties.site_energ + '</td>'+
                        '<td>' + data.features[i].properties.building_s + '</td>'+
                        '<td>' + data.features[i].properties.lat + '</td>'+
                        '<td>' + data.features[i].properties.long + '</td>'+
                        '<td>' + data.features[i].properties.total_annu + '</td>'+
                        '<td>' + data.features[i].properties.parcel + '</td>'+
                        '<td>' + data.features[i].properties.building_i + '</td>'+
                        '<td>' + data.features[i].properties.ayb + '</td>'+
                        '<td>' + data.features[i].properties.weather_no + '</td>'+
                    '</tr>';

                    //Find the last child element in the table
                    last_child = table.lastElementChild;

                    //Add new elements to the table
                    last_child.insertAdjacentHTML('afterend', html);

        //If the property name has "other", just assign "Other" to the Set
        if (data.features[i].properties.primary_us.toLowerCase().includes("other"))
        {
             xlabels.add("Other");

              //add the property type and energy star rating to the map
             get_energy_star("Other", data.features[i].properties.energy_sta);
        }
        else
        {
            //Add the property type to the xlabels for the graph
            xlabels.add(data.features[i].properties.primary_us);

            //add the property type and energy star rating to the map
            get_energy_star(data.features[i].properties.primary_us, data.features[i].properties.energy_sta);
        }
    }
    console.log(rating);

    // loop though the map keys
    rating.forEach((val, key) => {
                                    //if the array is empty
                                    if (val.length == 0)
                                    {
                                        yScore.push(0);
                                    }
                                    //if the array is not empty
                                    if (val.length > 0)
                                    {
                                        //Convert the values to numbers
                                        for (i = 0; i < val.length; i++)
                                        {
                                            val[i] = Number(val[i]);
                                        }

                                        var med = find_median(val, key);

                                        //replace the current value
                                        rating.set(key, med);

                                        console.log(rating);

                                        yScore.push(med);
                                    }

                                });

    console.log(yScore);


}

//Find the median value in the array
function find_median(arr, k)
{
    //Sort the array in acsending ordeer
    arr.sort( (a,b) => a - b)
    console.log("sorted array: key: " +k + ": " + arr);

    //if the length of the array is odd
    if (arr.length % 2 == 1)
    {
        //return median
         return  arr[(arr.length / 2) - .5];
    }
    else
    {
        // if the length of the array is even
        return (arr[arr.length / 2] + arr[(arr.length / 2) - 1]) / 2;
    }
}

