import { Edge, Graph, Vertice } from "../src";

import { BigNumber } from "@ethersproject/bignumber";
import seedrandom from "seedrandom";
import { ConstantProductRPool, RToken } from "../src/PrimaryPools";

type Topology = [number, number[][]]

function createTopology(t: Topology): [Graph, Vertice, Vertice] {
  const tokens: RToken[] = []
  for (let i = 0; i < t[0]; ++i) {
    tokens.push({ name: '' + i, address: '' + i })
  }
  const bn = BigNumber.from(1e6)
  const pools = t[1].map((e, i) => {
    return new ConstantProductRPool(
      "" + i,
      tokens[e[0]],
      tokens[e[1]],
      0.003,
      bn,
      bn,
    );
  });
  const g = new Graph(pools, tokens[0], 0); // just a dummy
  g.edges.forEach((e) => {
    e.amountInPrevious = 1
    e.amountOutPrevious = 1
    const edge = t[1][parseInt(e.pool.address)]
    console.assert(edge[0] == parseInt(e.vert0.token.name), 'internal Error 28')
    console.assert(edge[1] == parseInt(e.vert1.token.name), 'internal Error 29')
    e.direction = edge[0] == parseInt(e.vert0.token.name)
  })
  g.getOrCreateVertice(tokens[0])
  g.getOrCreateVertice(tokens[tokens.length - 1])
  return [g, g.tokens.get(tokens[0].address) as Vertice, g.tokens.get(tokens[tokens.length - 1].address) as Vertice]
}

function createCorrectTopology(t: Topology, paths: number): [Graph, Vertice, Vertice] {
  const tokens: RToken[] = []
  for (let i = 0; i < t[0]; ++i) {
    tokens.push({ name: '' + i, address: '' + i })
  }
  const bn = BigNumber.from(1e6)
  const pools = t[1].map((e, i) => {
    return new ConstantProductRPool(
      "" + i,
      tokens[e[0]],
      tokens[e[1]],
      0.003,
      bn,
      bn,
    );
  });
  const g = new Graph(pools, tokens[0], 0); // just a dummy
  const from = g.getOrCreateVertice(tokens[0]);
  const to = g.getOrCreateVertice(tokens[tokens.length - 1]);
  for (let i = 0; i < paths; ++i) {
    const p = generatePath(g, from, to, new Set<Vertice>())
    if (p === undefined) return [g, from, to]
    else applyPath(p, from, to)
  }
  return [g, from, to]
}
function generatePath(g: Graph, from: Vertice, to: Vertice, used: Set<Vertice>): Edge[] | undefined {
  if (from === to) return []
  used.add(from)
  let edges = from.edges.filter((e) => !used.has(from.getNeibour(e) as Vertice))
  while (edges.length) {
    const r = Math.floor(rnd() * from.edges.length)
    const edge = from.edges[r]
    const p = generatePath(g, from.getNeibour(edge) as Vertice, to, used)
    if (p !== undefined) return [edge, ...p]
    edges.splice(r, 1)
  }
  return undefined
}
function applyPath(p: Edge[], from: Vertice, to: Vertice) {
  let v = from
  p.forEach((e) => {
    if (e.amountInPrevious == 0) {
      e.direction = v == e.vert0
      e.amountInPrevious = 1
      e.amountOutPrevious = 1
    } else {
      if (e.direction == (v == e.vert0)) {
        e.amountInPrevious++
        e.amountOutPrevious++
      } else {
        e.amountInPrevious--
        e.amountOutPrevious--
      }
    }
    console.assert(e.amountOutPrevious >= 0)
    console.assert(e.amountInPrevious >= 0)
    v = v.getNeibour(e) as Vertice
  })
  console.assert(v === to)
}

it('Simple topology', () => {
  const topology: Topology = [2, [[0, 1]]]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(2)
  expect(res.vertices.length).toEqual(2)
  expect(res.vertices[0]).toEqual(g[1])
  expect(res.vertices[1]).toEqual(g[2])
})

it('Line topology', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(2)
  expect(res.vertices.length).toEqual(5)
  expect(res.vertices[0]).toEqual(g[1])
  expect(res.vertices[4]).toEqual(g[2])
})

it('Verts after the last', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 2],
      [2, 4],
      [4, 3],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(3)
  expect(res.vertices.length).toEqual(1)
  expect(res.vertices[0].token.name).toEqual('3')
})

it('Fork topology', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 4],
      [0, 2],
      [2, 4],
      [1, 3],
      [3, 4],
      [0, 4],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(2)
  expect(res.vertices.length).toEqual(5)
  expect(res.vertices[0]).toEqual(g[1])
  expect(res.vertices[4]).toEqual(g[2])
})

it('Unreached verts', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 4],
      [2, 3],
      [3, 4],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(2)
  expect(res.vertices.length).toEqual(3)
  expect(res.vertices[0]).toEqual(g[1])
  expect(res.vertices[2]).toEqual(g[2])
})

it('Dead end', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 4],
      [0, 3],
      [3, 2],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(3)
  expect(res.vertices.length).toEqual(2)
})

it('Cycle from begin', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(0)
  expect(res.vertices.length).toEqual(4)
})

it('Cycle not from begin', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 1],
    ],
  ]
  const g = createTopology(topology)
  const res = g[0].topologySort(g[1], g[2])
  expect(res.status).toEqual(0)
  expect(res.vertices.length).toEqual(3)
})

const testSeed = '0' // Change it to change random generator values
const rnd: () => number = seedrandom(testSeed) // random [0, 1)
function getRandomTopology(tokens: number, density: number): Topology {
  const edges = []
  for (let i = 0; i < tokens; ++i) {
    for (let j = 0; j < tokens; ++j) {
      if (i == j) continue
      const r = rnd()
      if (r < density) edges.push([i, j])
      if (r < density * density) edges.push([i, j])
    }
  }
  return [tokens, edges]
}

function vertIndex(v: Vertice): number {
  return parseInt(v.token.name)
}
function getEdge(i: number, res: {status: number, vertices: Vertice[]}): [number, number] {
  return [vertIndex(res.vertices[i]), vertIndex(res.vertices[i - 1])]
}
function findEdge(edge: [number, number], t: Topology): number {
  for (let j = 0; j < t[1].length; j++) {
    if (t[1][j][0] == edge[0] && t[1][j][1] == edge[1]) {
      return j
    }
  }
  return -1
}

// 0 - cycle, 2 - ok, 3 - deadend, 4 - not connected
function checkTopologySort(t: Topology) {
  //, res: [number, Vertice]) {
  //console.log(t);
  const g = createTopology(t)
  const res = g[0].topologySort(g[1], g[2])
  //console.log('Result:', res.status, res.vertices.map(vertIndex));

  if (res.status === 0) {
    // check cycle really exists
    expect(res.vertices.length).toBeGreaterThan(1)
    for (let i = res.vertices.length - 1; i >= 1; i--) {
      const edge = getEdge(i, res)
      expect(findEdge(edge, t)).not.toEqual(-1)
    }

    // remove arbitrary edge from the cycle and launch checkTopologySort again
    const r = Math.floor(rnd() * (res.vertices.length - 1) + 1)
    console.assert(r >= 1 && r < res.vertices.length, 'Inernal Error 137')
    const edge = getEdge(r, res)
    const index = findEdge(edge, t)
    const nextEdgeList = [...t[1]]
    nextEdgeList.splice(index, 1)
    const t2: Topology = [t[0], nextEdgeList]
    checkTopologySort(t2) // recursion till the end of all cycles
    return 0
  }
  if (res.status === 2) {
    // check topology is correct
    expect(res.vertices[0]).toEqual(g[1])
    expect(res.vertices[res.vertices.length - 1]).toEqual(g[2])
    const vertPlace = new Map<number, number>()
    const notLastVert = new Set<number>()
    res.vertices.forEach((e, i) => vertPlace.set(vertIndex(e), i))
    t[1].forEach(([a, b]) => {
      const p1 = vertPlace.get(a)
      const p2 = vertPlace.get(b)
      if (p1 !== undefined) {
        expect(p2).toBeDefined()
        expect(p1 as number).toBeLessThan(p2 as number)
        notLastVert.add(a)
      }
    })
    expect(notLastVert.size).toEqual(res.vertices.length - 1)
    expect(notLastVert.has(vertIndex(g[2]))).toBeFalsy()
    return 2
  }
  if (res.status == 3 && res.vertices[res.vertices.length - 1] === g[1]) {
    // No way between start and end verts
    expect(res.vertices.length).toBeGreaterThan(0)
    const verts = new Set<number>()
    res.vertices.forEach((e) => verts.add(vertIndex(e)))
    expect(verts.has(vertIndex(g[1]))).toBeTruthy()
    expect(verts.has(vertIndex(g[2]))).toBeFalsy()
    const vertsReached = new Set<number>()
    t[1].forEach(([a, b]) => {
      const p1 = verts.has(a)
      const p2 = verts.has(b)
      if (p1) expect(p2).toBeTruthy()
      if (p1) vertsReached.add(b)
    })
    expect(vertsReached.size).toEqual(res.vertices.length - 1)
    expect(vertsReached.has(vertIndex(g[1]))).toBeFalsy()

    // add edge
    const nextEdgeList = [...t[1]]
    nextEdgeList.push([vertIndex(res.vertices[0]), vertIndex(g[2])])
    const t2: Topology = [t[0], nextEdgeList]
    const nextRes = checkTopologySort(t2)
    expect(nextRes).not.toEqual(4)
    return 4
  }
  if (res.status === 3) {
    expect(res.vertices.length).toBeGreaterThan(0)
    const verts = new Set<number>()
    res.vertices.forEach((e) => verts.add(vertIndex(e)))
    expect(verts.has(vertIndex(g[1]))).toBeFalsy()
    expect(verts.has(vertIndex(g[2]))).toBeFalsy()
    const vertsReached = new Set<number>()
    t[1].forEach(([a, b]) => {
      const p1 = verts.has(a)
      const p2 = verts.has(b)
      if (p1) expect(p2).toBeTruthy()
      if (p2) vertsReached.add(b)
    })
    expect(vertsReached.size).toEqual(res.vertices.length)

    // remove all dead end
    const nextEdgeList = t[1].filter(([_, b]) => !verts.has(b))
    const t2: Topology = [t[0], nextEdgeList]
    const nextRes = checkTopologySort(t2)
    expect(nextRes).toEqual(2)
    return 3
  }
  expect(true).toBeFalsy()
  return 1
}

it('test test', () => {
  const topology: Topology = [
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 1],
    ],
  ]
  const res = checkTopologySort(topology)
  expect(res).toEqual(0)
})

it('random topology test (tokens=5, dencity=0.3', () => {
  for (let i = 0; i < 30; ++i) {
    const topology: Topology = getRandomTopology(5, 0.3)
    checkTopologySort(topology)
  }
})

it('random topology test (tokens=5, dencity=0.7', () => {
  for (let i = 0; i < 10; ++i) {
    const topology: Topology = getRandomTopology(5, 0.7)
    checkTopologySort(topology)
  }
})

it('random topology test (tokens=10, dencity=0.3', () => {
  for (let i = 0; i < 10; ++i) {
    const topology: Topology = getRandomTopology(10, 0.3)
    checkTopologySort(topology)
  }
})

it('random topology clean test', () => {
  for (let i = 0; i < 100; ++i) {
    let g: [Graph, Vertice, Vertice]
    do {
      const t = getRandomTopology(5, 0.5)
      g = createCorrectTopology(t, 10)
    } while (g[0].topologySort(g[1], g[2]).status !== 0) // find topology with cycles

    const {vertices} = g[0].cleanTopology(g[1], g[2])
    const res = g[0].topologySort(g[1], g[2])
    expect(res.status).toEqual(2)
    expect(res.vertices.length).toEqual(vertices.length)
  }
})
