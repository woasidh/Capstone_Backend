import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';

const trueVal = true;

const data = {
    ups : 0,
    downs : 0,
    num: 0,
    labels: ['00:00', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    datasets: [
        {
            label: '이해 O',
            num: 1,
            data: [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: false,
            radius : 0,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)'
        },{
            label: '합계',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: false,
            radius : 1,
            backgroundColor: 'rgb(0, 0, 0, 0.2)',
            borderColor: 'rgba(0, 0, 0, 0.4)'
        },
        {
            label: '이해 X',
            data: [-5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fill: false,
            radius : 0,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgba(54, 162, 235, 0.2)'
        },
    ],
};

function Index(props) {
    const socket = props.socket;
    const [compData, setcompData] = useState(data);
    const [chartRef, setchartRef] = useState(React.createRef());
    const [refresh, setrefresh] = useState(0);
    const [ups, setups] = useState(0);
    const [downs, setdowns] = useState(0);
    const [total, settotal] = useState(0);
    const [currentTime, setcurrentTime] = useState(0);

    function updateData() {
        let ups = chartRef.current.data.ups;
        let downs = -1*chartRef.current.data.downs;
        let total = (ups + downs)/2;
        chartRef.current.data.labels.pop();
        chartRef.current.data.datasets[0].data.pop();
        chartRef.current.data.datasets[2].data.pop();
        let num = chartRef.current.data.num + 1;
        let newTime;
        console.log(num);
        if(num<60){
            if(num<10){
                newTime = `00:0${(chartRef.current.data.num + 1)}`
            }else{
                newTime = `00:${(chartRef.current.data.num + 1)}`
            }
        }else{
            let hour = parseInt(num/60);
            let minute = num%60;
            console.log(hour, minute);
            if(minute<10){
                newTime = `${hour}:0${minute}`
            }else{
                newTime = `${hour}:${minute}`
            }
        }
        setcompData({
            ups : 0,
            downs : 0,
            num: chartRef.current.data.num + 1,
            labels: [newTime].concat(chartRef.current.data.labels),
            datasets: [
                {
                    label: '이해 O',
                    data: [ups].concat(chartRef.current.data.datasets[0].data),
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    radius : 0,
                    borderColor: 'rgba(255, 99, 132, 0.2)'
                },{
                    label: '합계',
                    data: [total].concat(chartRef.current.data.datasets[1].data),
                    fill: false,
                    radius : 1,
                    backgroundColor: 'rgb(0, 0, 0, 0.2)',
                    borderColor: 'rgba(0, 0, 0, 0.4)'
                },
                {
                    label: '이해 X',
                    data: [downs].concat(chartRef.current.data.datasets[2].data),
                    fill: false,
                    radius : 0,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgba(54, 162, 235, 0.2)'
                },
            ],
        })
        setrefresh(refresh + 1);
        props.setColor(total);
    }

    const config = {
        maintainAspectRatio: false,
        scales: {
            y: {
                min: -10,
                max: 10
            }
        },
        /* plugins: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 1
                    }
                }
            }
        } */
    }

    useEffect(() => {
        settotal(ups + downs);
    }, [ups, downs])

    useEffect(() => {
        socket.on("sendIsUnderstood", function (data) {
            if (data.type == 'up') {
                chartRef.current.data.ups = chartRef.current.data.ups+1;
            } else {
                chartRef.current.data.downs = chartRef.current.data.downs+1;
            }
        });
        setInterval(() => {
            setcurrentTime(currentTime + 1);
            updateData();
        }, 60000);
    }, [])

    function upup() {
        chartRef.current.data.ups = chartRef.current.data.ups+1;
    }

    function downdown() {
        chartRef.current.data.downs = chartRef.current.data.downs+1;
    }

    return (
        <>
{/*             <div style={{ height: '2vh', width: '100%' }}>
                <button onClick={upup} style={{ backgroundColor: "black", height: '1vh', width: '40%' }}></button>
                <button onClick={downdown} style={{ backgroundColor: "pink", height: '1vh', width: '40%' }}></button>
            </div> */}
            <div style={{ height: '34vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Line num={refresh} ref={chartRef} data={compData} options={config} />
            </div>
        </>
    )
}

export default Index
