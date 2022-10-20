import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import useEvent from './index'

describe('useEvent()', () => {
  it('should add events to ref object', () => {
    const Component = () => {
      const ref = React.useRef<HTMLDivElement>(null)
      const [foo, setFoo] = React.useState('')
      useEvent(ref, 'click', () => setFoo('bar'))
      return (
        <div data-testid='foo' ref={ref}>
          {foo}
        </div>
      )
    }

    const {unmount} = render(<Component />)
    expect(screen.getByTestId('foo')).toBeEmptyDOMElement()
    fireEvent.click(screen.getByTestId('foo'))
    expect(screen.getByTestId('foo').innerHTML).toBe('bar')
    unmount()
  })

  it('should add events to document', () => {
    const Component = () => {
      const [foo, setFoo] = React.useState('')
      useEvent(document, 'click', () => setFoo('bar'))
      useEvent(document, 'click', () => setFoo('bar'))
      return <div data-testid='foo'>{foo}</div>
    }

    const {unmount} = render(<Component />)
    expect(screen.getByTestId('foo')).toBeEmptyDOMElement()
    fireEvent.click(document)
    expect(screen.getByTestId('foo').innerHTML).toBe('bar')
    unmount()
  })

  it('should add events to window', () => {
    const Component = () => {
      const [foo, setFoo] = React.useState('')
      useEvent(window, 'click', () => setFoo('bar'))
      return <div data-testid='foo'>{foo}</div>
    }

    const {unmount} = render(<Component />)
    expect(screen.getByTestId('foo')).toBeEmptyDOMElement()
    fireEvent.click(window)
    expect(screen.getByTestId('foo').innerHTML).toBe('bar')
    unmount()
  })

  it('should invoke cleanup fn on unmount', () => {
    const cleanup = jest.fn()

    const Component = () => {
      const ref = React.useRef<HTMLDivElement>(null)
      const [foo, setFoo] = React.useState('')
      useEvent(ref, 'click', () => setFoo('bar'), cleanup)
      return (
        <div data-testid='foo' ref={ref}>
          {foo}
        </div>
      )
    }

    const {unmount} = render(<Component />)
    expect(cleanup).not.toBeCalled()
    unmount()
    expect(cleanup).toBeCalled()
  })
})
