'use server'

export const sendDrilldownLog = async ({
  dataForLog,
  extraFields,
}: {
  dataForLog: Record<string, string>
  extraFields?: Record<string, string>
}) => {
  const url = process.env.GRAFANA_LOKI_API_URL
  const token = process.env.GRAFANA_LOKI_BEARER_TOKEN

  if (!token || !url) {
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
        stream: { Language: 'NodeJS', source: 'Code' },
        values: [valuesArr],
      },
    ],
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(logs),
    })
    if (!res.ok && process.env.NODE_ENV !== 'production') {
      console.error('Loki logging failed:', res.status, await res.text())
    }
  } catch (err) {
    console.error('Error logging to Grafana Loki:', err)
  }
}
