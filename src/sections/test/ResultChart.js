import ReactApexChart from 'react-apexcharts';
import merge from 'lodash/merge';
import useResponsive from '../../hooks/useResponsive';
import { BaseOptionChart } from '../../components/chart';

export default function ResultChart({ topics }) {
    const isDesktop = useResponsive('up', 'md');

    const radarChartSeries = [
        {
            name: 'Đánh giá',
            data: Object.values(topics).map((t) => Math.floor((t.count / t.total) * 100) / 10),
        },
    ];

    const radarChartOptions = merge(BaseOptionChart(), {
        plotOptions: { bar: { columnWidth: '16%' } },
        chart: {
            height: 350,
            type: 'basic-bar',
        },
        yaxis: {
            max: 10,
            labels: {
                show: isDesktop
            }
        },
        labels: Object.keys(topics),
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => {
                    if (typeof y !== 'undefined') {
                        return `${y}/10`;
                    }
                    return y;
                },
            },
            x: {
                show: true
            }
        },
    });

    return <ReactApexChart options={radarChartOptions} series={radarChartSeries} type="bar" height={350} />
}