import { useMemo } from 'react'

export function useTableOptions() {
  return useMemo(() => {
    const options = {
      maintainAspectRatio: false,
      elements: {
        line: {
          borderJoinStyle: 'round',
        },
        point: {
          radius: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        decimation: {
          enabled: true,
          algorithm: 'lttb',
          samples: 10,
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'blue',
            maxTicksLimit: 10,
          },
        },
        y: {
          grid: {
            color: 'green',
            borderWidth: 0,
            borderDash: [3, 3],
          },
          ticks: {
            color: 'red',

            fontWeight: 300,
            fontSize: '14px',
            lineHeight: '21px',
          },
        },
      },
    }
    return options
  }, [])
}
