"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _ReactSlider = _interopRequireDefault(require("../ReactSlider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('<ReactSlider>', function () {
  it('can render', function () {
    var tree = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, null)).toJSON();

    expect(tree).toMatchSnapshot();
  });
  describe('event handlers', function () {
    beforeEach(function () {
      // https://github.com/facebook/jest/issues/890#issuecomment-209698782
      Object.defineProperty(document, 'addEventListener', {
        writable: true,
        value: jest.fn()
      });
      Object.defineProperty(document, 'removeEventListener', {
        writable: true,
        value: jest.fn()
      });
    });
    it('does not call any event handlers if the value does not change', function () {
      var onBeforeChange = jest.fn();
      var onChange = jest.fn();
      var onAfterChange = jest.fn();

      var testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
        onBeforeChange: onBeforeChange,
        onChange: onChange,
        onAfterChange: onAfterChange,
        thumbClassName: "test-thumb",
        min: 0,
        step: 1
      }));

      var testInstance = testRenderer.root;
      var thumb = testInstance.findByProps({
        className: 'test-thumb test-thumb-0 '
      });
      var _document = document,
          addEventListener = _document.addEventListener;
      expect(addEventListener).not.toHaveBeenCalled(); // simulate focus on thumb

      thumb.props.onFocus();
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(addEventListener.mock.calls[1][0]).toBe('keyup');
      expect(addEventListener.mock.calls[2][0]).toBe('focusout');
      var onKeyDown = addEventListener.mock.calls[0][1];
      expect(onBeforeChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'ArrowLeft',
        preventDefault: function preventDefault() {}
      });
      expect(onBeforeChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'Home',
        preventDefault: function preventDefault() {}
      });
      expect(onBeforeChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'PageDown',
        preventDefault: function preventDefault() {}
      });
      expect(onBeforeChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onAfterChange).not.toHaveBeenCalled();
    });
    it('calls onBeforeChange only once before onChange', function () {
      var onBeforeChange = jest.fn();
      var onChange = jest.fn();

      var testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
        onBeforeChange: onBeforeChange,
        onChange: onChange,
        thumbClassName: "test-thumb",
        min: 0,
        step: 1
      }));

      var testInstance = testRenderer.root;
      var thumb = testInstance.findByProps({
        className: 'test-thumb test-thumb-0 '
      });
      var _document2 = document,
          addEventListener = _document2.addEventListener;
      expect(addEventListener).not.toHaveBeenCalled(); // simulate focus on thumb

      thumb.props.onFocus();
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(addEventListener.mock.calls[1][0]).toBe('keyup');
      expect(addEventListener.mock.calls[2][0]).toBe('focusout');
      var onKeyDown = addEventListener.mock.calls[0][1];
      expect(onBeforeChange).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'ArrowRight',
        preventDefault: function preventDefault() {}
      });
      expect(onBeforeChange).toHaveBeenCalledTimes(1);
      expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
      expect(onBeforeChange.mock.invocationCallOrder[0]).toBeLessThan(onChange.mock.invocationCallOrder[0]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(1, 0); // simulate keydown

      onKeyDown({
        key: 'ArrowRight',
        preventDefault: function preventDefault() {}
      });
      expect(onBeforeChange).toHaveBeenCalledTimes(1);
      expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(2, 0);
    });
    it('calls onChange for every change', function () {
      var onChange = jest.fn();

      var testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
        onChange: onChange,
        thumbClassName: "test-thumb",
        min: 0,
        step: 1
      }));

      var testInstance = testRenderer.root;
      var thumb = testInstance.findByProps({
        className: 'test-thumb test-thumb-0 '
      });
      var _document3 = document,
          addEventListener = _document3.addEventListener;
      expect(addEventListener).not.toHaveBeenCalled(); // simulate focus on thumb

      thumb.props.onFocus();
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(addEventListener.mock.calls[1][0]).toBe('keyup');
      expect(addEventListener.mock.calls[2][0]).toBe('focusout');
      var onKeyDown = addEventListener.mock.calls[0][1];
      expect(onChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'ArrowRight',
        preventDefault: function preventDefault() {}
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(1, 0); // simulate keydown

      onKeyDown({
        key: 'ArrowLeft',
        preventDefault: function preventDefault() {}
      });
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(0, 0);
    });
    it('calls onAfterChange only once after onChange', function () {
      var onChange = jest.fn();
      var onAfterChange = jest.fn();

      var testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
        onChange: onChange,
        onAfterChange: onAfterChange,
        thumbClassName: "test-thumb",
        min: 0,
        step: 1
      }));

      var testInstance = testRenderer.root;
      var thumb = testInstance.findByProps({
        className: 'test-thumb test-thumb-0 '
      });
      var _document4 = document,
          addEventListener = _document4.addEventListener;
      expect(addEventListener).not.toHaveBeenCalled(); // simulate focus on thumb

      thumb.props.onFocus();
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toBe('keydown');
      expect(addEventListener.mock.calls[1][0]).toBe('keyup');
      expect(addEventListener.mock.calls[2][0]).toBe('focusout');
      var onKeyDown = addEventListener.mock.calls[0][1];
      var onKeyUp = addEventListener.mock.calls[1][1];
      expect(onChange).not.toHaveBeenCalled();
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'ArrowRight',
        preventDefault: function preventDefault() {}
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(1, 0);
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keydown

      onKeyDown({
        key: 'ArrowRight',
        preventDefault: function preventDefault() {}
      });
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenCalledWith(2, 0);
      expect(onAfterChange).not.toHaveBeenCalled(); // simulate keyup

      onKeyUp();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onAfterChange).toHaveBeenCalledTimes(1);
      expect(onAfterChange).toHaveBeenCalledWith(2, 0);
      expect(onAfterChange.mock.invocationCallOrder[0]).toBeGreaterThan(onChange.mock.invocationCallOrder[1]);
    });
  });
  it('should replace state value when props value changes', function () {
    var mockRenderThumb = jest.fn();
    var mockFirstValue = 40;
    var mockSecondValue = 80;

    var testRenderer = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
      thumbClassName: "test-thumb",
      renderThumb: mockRenderThumb,
      value: mockFirstValue,
      min: 0,
      step: 1
    }));

    expect(mockRenderThumb).toHaveBeenCalledTimes(1);
    expect(mockRenderThumb.mock.calls[0][1].value).toBe(mockFirstValue);

    _reactTestRenderer.default.act(function () {
      testRenderer.update( /*#__PURE__*/_react.default.createElement(_ReactSlider.default, {
        thumbClassName: "test-thumb",
        renderThumb: mockRenderThumb,
        value: mockSecondValue,
        min: 0,
        step: 1
      }));
    });

    expect(mockRenderThumb).toHaveBeenCalledTimes(2);
    expect(mockRenderThumb.mock.calls[1][1].value).toBe(mockSecondValue);
  });
});