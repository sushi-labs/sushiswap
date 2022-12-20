export type Datum = {
  vx: number
  vy: number
}

export type SizeInfo = {
  width: number
  height: number
  margin: { top: number; right: number; bottom: number; left: number }
}

export type ZoomLevel = {
  initialMin: number
  initialMax: number
  min: number
  max: number
}

export enum HandleType {
  e = 'e',
  w = 'w',
}
