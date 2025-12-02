'use server'

export const sendDrilldownLog = async ({
  dataForLog,
  extraFields,
}: {
  dataForLog: Record<string, string>
  extraFields?: Record<string, string>
}) => {
  const url = process.env.GRAFANA_LOKI_API_URL
<<<<<<< HEAD

  if (!url) {
=======
  const token = process.env.GRAFANA_LOKI_BEARER_TOKEN

  if (!token || !url) {
>>>>>>> a4c5bb944 (feat: tracking interaction and swap data)
    return
  }

  const logLine = Object.entries(dataForLog)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')

  const valuesArr: (string | Record<string, string>)[] = [
    (Math.floor(Date.now() / 1000) * 1000000000).toString(),
    logLine,
  ]

  if (extraFields) {
    valuesArr.push(extraFields)
  }

  const logs = {
    streams: [
      {
<<<<<<< HEAD
        stream: {
          Language: 'NodeJS',
          source: 'Code',
          service_name: 'sushiswap:web',
        },
=======
        stream: { Language: 'NodeJS', source: 'Code' },
>>>>>>> a4c5bb944 (feat: tracking interaction and swap data)
        values: [valuesArr],
      },
    ],
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
<<<<<<< HEAD
=======
        Authorization: `Bearer ${token}`,
>>>>>>> a4c5bb944 (feat: tracking interaction and swap data)
      },
      body: JSON.stringify(logs),
    })
    if (!res.ok && process.env.NODE_ENV !== 'production') {
<<<<<<< HEAD
      console.error('Loki logging failed:', res?.status, await res?.text())
=======
      console.error('Loki logging failed:', res.status, await res.text())
>>>>>>> a4c5bb944 (feat: tracking interaction and swap data)
    }
  } catch (err) {
    console.error('Error logging to Grafana Loki:', err)
  }
}
