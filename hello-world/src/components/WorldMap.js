
import React, { useState, useEffect } from "react"
import { geoEqualEarth, geoPath, geoMercator } from "d3-geo"
import { feature } from "topojson-client"

const cities = []

// const projection = geoEqualEarth()
//   .scale(160)
//   .translate([ 800 / 2, 450 / 2 ])

tooltipHtml = (
    <div></div>
);
tooltipOpacity = 0;

const projection = geoMercator()
    .center([120.31041, 23.34889])
    .scale(6000);

const WorldMap = () => {
    const [geographies, setGeographies] = useState([])

    useEffect(() => {
        fetch("/counties-10t.json")
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(worlddata => {
                    setGeographies(feature(worlddata, worlddata.objects.counties).features)
                })
            })
    }, [])

    const handleCountryClick = countryIndex => {
        console.log("Clicked on country: ", geographies[countryIndex])
    }

    const handleMarkerClick = i => {
        console.log("Marker: ", cities[i])
    }

    const handleContryEnter = countryIndex => {
        this.tooltipOpacity = 1;
        this.tooltipHtml = geographies[countryIndex].properties.COUNTYNAME;
        console.log(this.tooltipHtml)
    }

    return (
        <div style={{ position: "relative" }}>
            <div id="tooltip"
                style={{
                    opacity: this.tooltipOpacity,
                    backgroundColor: 'white',
                    border: 'solid',
                    borderWidth: '2px',
                    borderRadius: '5px',
                    padding: '5px',
                    position: 'absolute'
                }}
            >
                {this.tooltipHtml}
            </div>
            <svg width={800} height={450} viewBox="0 0 800 450">
                <g className="countries">
                    {
                        geographies.map((d, i) => (
                            <path
                                key={`path-${i}`}
                                d={geoPath().projection(projection)(d)}
                                className="country"
                                fill={`rgba(38,50,56,${1 / geographies.length * i})`}
                                stroke="#FFFFFF"
                                strokeWidth={0.5}
                                onClick={() => handleCountryClick(i)}
                                onMouseEnter={() => handleContryEnter(i)}
                            />
                        ))
                    }
                </g>
                <g className="markers">
                    {
                        cities.map((city, i) => (
                            <circle
                                key={`marker-${i}`}
                                cx={projection(city.coordinates)[0]}
                                cy={projection(city.coordinates)[1]}
                                r={city.population / 3000000}
                                fill="#E91E63"
                                stroke="#FFFFFF"
                                className="marker"
                                onClick={() => handleMarkerClick(i)}
                            />
                        ))
                    }
                </g>
            </svg>
        </div>
    )
}

export default WorldMap
