import React from 'react'

export function gradientColor(percent: any) {
  percent = parseFloat(percent)
  if (percent < 100 && percent >= 90) {
    return '#ff3a31'
  }
  if (percent < 90 && percent >= 80) {
    return '#f85815'
  }
  if (percent < 80 && percent >= 70) {
    return '#ed7000'
  }
  if (percent < 70 && percent >= 60) {
    return '#de8400'
  }
  if (percent < 60 && percent >= 50) {
    return '#ce9700'
  }
  if (percent < 50 && percent >= 40) {
    return '#bba700'
  }
  if (percent < 40 && percent >= 30) {
    return '#a6b500'
  }
  if (percent < 30 && percent >= 20) {
    return '#8fc21b'
  }
  if (percent < 20 && percent >= 10) {
    return '#73ce42'
  }
  if (percent < 10 && percent >= 0) {
    return '#4ed864'
  }
  if (percent == 0) {
    return '#4ed864'
  }
  return '#ff3a31'
}

export function gradientColorAsc(percent: any) {
  percent = parseFloat(percent)
  if (percent < 10 && percent >= 0) {
    return '#ff3a31'
  }
  if (percent < 20 && percent >= 10) {
    return '#f85815'
  }
  if (percent < 30 && percent >= 20) {
    return '#ed7000'
  }
  if (percent < 40 && percent >= 30) {
    return '#de8400'
  }
  if (percent < 50 && percent >= 40) {
    return '#ce9700'
  }
  if (percent < 60 && percent >= 50) {
    return '#bba700'
  }
  if (percent < 70 && percent >= 60) {
    return '#a6b500'
  }
  if (percent < 80 && percent >= 70) {
    return '#8fc21b'
  }
  if (percent < 90 && percent >= 80) {
    return '#73ce42'
  }
  if (percent < 100 && percent >= 90) {
    return '#4ed864'
  }
  if (percent >= 100) {
    return '#4ed864'
  }
  return '#ff3a31'
}

const GradientDot = ({ percent, desc = true }: any) => {
  return (
    <>
      <span
        style={{
          display: 'block',
          height: '0.5rem',
          width: '0.5rem',
          borderRadius: '9999px',
          marginLeft: '0.5rem',
          background: `${desc ? gradientColor(percent) : gradientColorAsc(percent)}`,
        }}
      ></span>
    </>
  )
}

export default GradientDot
