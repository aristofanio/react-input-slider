import _css from '@emotion/css';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import { jsx } from '@emotion/core';
import { useRef, useState, useEffect } from 'react';

function getClientPosition(e) {
  var touches = e.touches;

  if (touches && touches.length) {
    var finger = touches[0];
    return {
      x: finger.clientX,
      y: finger.clientY
    };
  }

  return {
    x: e.clientX,
    y: e.clientY
  };
}

var track = {
  position: 'relative',
  display: 'inline-block',
  backgroundColor: '#ddd',
  borderRadius: 5,
  userSelect: 'none',
  boxSizing: 'border-box'
};
var active = {
  position: 'absolute',
  backgroundColor: '#5e72e4',
  borderRadius: 5,
  userSelect: 'none',
  boxSizing: 'border-box'
};
var thumb = {
  position: 'relative',
  display: 'block',
  content: '""',
  width: 18,
  height: 18,
  backgroundColor: '#fff',
  borderRadius: '50%',
  boxShadow: '0 1px 1px rgba(0,0,0,.5)',
  userSelect: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box'
};
var label = {
  position: 'relative',
  display: 'block',
  content: '""',
  userSelect: 'none'
};
var styles = {
  x: {
    track: _extends({}, track, {
      width: 200,
      height: 10
    }),
    active: _extends({}, active, {
      top: 0,
      height: '100%'
    }),
    thumb: _extends({}, thumb),
    label: _extends({}, label)
  },
  y: {
    track: _extends({}, track, {
      width: 10,
      height: 200
    }),
    active: _extends({}, active, {
      left: 0,
      width: '100%'
    }),
    thumb: _extends({}, thumb),
    label: _extends({}, label)
  },
  xy: {
    track: {
      position: 'relative',
      overflow: 'hidden',
      width: 200,
      height: 200,
      backgroundColor: '#5e72e4',
      borderRadius: 0
    },
    active: {},
    thumb: _extends({}, thumb),
    label: _extends({}, label)
  },
  disabled: {
    opacity: 0.5
  }
};

var Slider = function Slider(_ref) {
  var disabled = _ref.disabled,
      axis = _ref.axis,
      _ref$x = _ref.x,
      x = _ref$x === void 0 ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === void 0 ? 0 : _ref$y,
      xmin = _ref.xmin,
      xmax = _ref.xmax,
      ymin = _ref.ymin,
      ymax = _ref.ymax,
      xstep = _ref.xstep,
      ystep = _ref.ystep,
      onChange = _ref.onChange,
      onDragStart = _ref.onDragStart,
      onDragEnd = _ref.onDragEnd,
      onClick = _ref.onClick,
      onAxisClick = _ref.onAxisClick,
      onThumbClick = _ref.onThumbClick,
      onThumbDoubleClick = _ref.onThumbDoubleClick,
      xreverse = _ref.xreverse,
      yreverse = _ref.yreverse,
      _ref$withLabel = _ref.withLabel,
      withLabel = _ref$withLabel === void 0 ? false : _ref$withLabel,
      customStyles = _ref.styles,
      props = _objectWithoutPropertiesLoose(_ref, ["disabled", "axis", "x", "y", "xmin", "xmax", "ymin", "ymax", "xstep", "ystep", "onChange", "onDragStart", "onDragEnd", "onClick", "onAxisClick", "onThumbClick", "onThumbDoubleClick", "xreverse", "yreverse", "withLabel", "styles"]);

  var container = useRef(null);
  var handle = useRef(null);
  var start = useRef({});
  var offset = useRef({});

  var _useState = useState({
    xValue: x,
    yValue: y
  }),
      value = _useState[0],
      setValue = _useState[1];

  useEffect(function () {
    setValue({
      xValue: x,
      yValue: y
    });
  }, [x, y]);

  function getPosition() {
    var top = (y - ymin) / (ymax - ymin) * 100;
    var left = (x - xmin) / (xmax - xmin) * 100;
    if (top > 100) top = 100;
    if (top < 0) top = 0;
    if (axis === 'x') top = 0;
    if (left > 100) left = 100;
    if (left < 0) left = 0;
    if (axis === 'y') left = 0;
    return {
      top: top,
      left: left
    };
  }

  function change(_ref2) {
    var top = _ref2.top,
        left = _ref2.left;
    if (!onChange) return;

    var _container$current$ge = container.current.getBoundingClientRect(),
        width = _container$current$ge.width,
        height = _container$current$ge.height;

    var dx = 0;
    var dy = 0;
    if (left < 0) left = 0;
    if (left > width) left = width;
    if (top < 0) top = 0;
    if (top > height) top = height;

    if (axis === 'x' || axis === 'xy') {
      dx = left / width * (xmax - xmin);
    }

    if (axis === 'y' || axis === 'xy') {
      dy = top / height * (ymax - ymin);
    }

    var x = (dx !== 0 ? parseInt(dx / xstep, 10) * xstep : 0) + xmin;
    var y = (dy !== 0 ? parseInt(dy / ystep, 10) * ystep : 0) + ymin;
    var xValue = xreverse ? xmax - x + xmin : x;
    var yValue = yreverse ? ymax - y + ymin : y;
    setValue({
      xValue: xValue,
      yValue: yValue
    });
    onChange({
      x: xValue,
      y: yValue
    });
  }

  function handleMouseDown(e) {
    if (disabled) return;
    e.preventDefault();
    var dom = handle.current;
    var clientPos = getClientPosition(e);
    start.current = {
      x: dom.offsetLeft,
      y: dom.offsetTop
    };
    offset.current = {
      x: clientPos.x,
      y: clientPos.y
    };
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, {
      passive: false
    });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);

    if (onDragStart) {
      onDragStart(e);
    }
  }

  function getPos(e) {
    var clientPos = getClientPosition(e);
    var left = clientPos.x + start.current.x - offset.current.x;
    var top = clientPos.y + start.current.y - offset.current.y;
    return {
      left: left,
      top: top
    };
  }

  function handleDrag(e) {
    if (disabled) return;
    e.preventDefault();
    change(getPos(e));
  }

  function handleDragEnd(e) {
    if (disabled) return;
    e.preventDefault();
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag, {
      passive: false
    });
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);

    if (onDragEnd) {
      onDragEnd(e);
    }
  }

  function handleClick(e) {
    if (disabled) return;
    var clientPos = getClientPosition(e);
    var rect = container.current.getBoundingClientRect();
    change({
      left: clientPos.x - rect.left,
      top: clientPos.y - rect.top
    });
    if (onAxisClick) onAxisClick(e);
    if (onClick) onClick(e);
  } // semantic alias for handleClick


  function handleAxisClick(e) {
    handleClick(e);
  } // on thumb (element) double-click


  function handleThumbDoubleClick(e) {
    if (onThumbDoubleClick) onThumbDoubleClick(e);
  }

  var pos = getPosition();
  var valueStyle = {};
  if (axis === 'x') valueStyle.width = pos.left + '%';
  if (axis === 'y') valueStyle.height = pos.top + '%';
  if (xreverse) valueStyle.left = 100 - pos.left + '%';
  if (yreverse) valueStyle.top = 100 - pos.top + '%';
  var handleStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: xreverse ? 100 - pos.left + '%' : pos.left + '%',
    top: yreverse ? 100 - pos.top + '%' : pos.top + '%'
  };
  var labelStyle = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    left: xreverse ? 100 - pos.left + '%' : pos.left + '%',
    top: yreverse ? 100 - pos.top + '%' : pos.top + '%'
  };

  if (axis === 'x') {
    handleStyle.top = '50%';
    labelStyle.top = '50%';
  } else if (axis === 'y') {
    handleStyle.left = '50%';
    labelStyle.left = '50%';
  }

  var styles$1 = {
    track: _extends({}, styles[axis].track, customStyles.track),
    active: _extends({}, styles[axis].active, customStyles.active),
    thumb: _extends({}, styles[axis].thumb, customStyles.thumb),
    label: _extends({}, styles[axis].label, customStyles.label),
    disabled: _extends({}, styles.disabled, customStyles.disabled)
  };
  return jsx("div", _extends({}, props, {
    ref: container,
    css: /*#__PURE__*/_css([styles$1.track, disabled && styles$1.disabled], ";label:Slider;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF1Tk0iLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcbmltcG9ydCB7IHVzZVJlZiwgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldENsaWVudFBvc2l0aW9uIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgZGVmYXVsdFN0eWxlcyBmcm9tICcuL3N0eWxlcyc7XG5cbmNvbnN0IFNsaWRlciA9ICh7XG4gIGRpc2FibGVkLFxuICBheGlzLFxuICB4ID0gMCxcbiAgeSA9IDAsXG4gIHhtaW4sXG4gIHhtYXgsXG4gIHltaW4sXG4gIHltYXgsXG4gIHhzdGVwLFxuICB5c3RlcCxcbiAgb25DaGFuZ2UsXG4gIG9uRHJhZ1N0YXJ0LFxuICBvbkRyYWdFbmQsXG4gIG9uQ2xpY2ssXG4gIG9uQXhpc0NsaWNrLFxuICBvblRodW1iQ2xpY2ssXG4gIG9uVGh1bWJEb3VibGVDbGljayxcbiAgeHJldmVyc2UsXG4gIHlyZXZlcnNlLFxuICB3aXRoTGFiZWwgPSBmYWxzZSxcbiAgc3R5bGVzOiBjdXN0b21TdHlsZXMsXG4gIC4uLnByb3BzXG59KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IHVzZVJlZihudWxsKTtcbiAgY29uc3QgaGFuZGxlID0gdXNlUmVmKG51bGwpO1xuICBjb25zdCBzdGFydCA9IHVzZVJlZih7fSk7XG4gIGNvbnN0IG9mZnNldCA9IHVzZVJlZih7fSk7XG5cbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZSh7eFZhbHVlOiB4LCB5VmFsdWU6IHl9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFZhbHVlKHt4VmFsdWU6IHgsIHlWYWx1ZTogeX0pO1xuICB9LCBbeCwgeV0pO1xuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uKCkge1xuICAgIGxldCB0b3AgPSAoKHkgLSB5bWluKSAvICh5bWF4IC0geW1pbikpICogMTAwO1xuICAgIGxldCBsZWZ0ID0gKCh4IC0geG1pbikgLyAoeG1heCAtIHhtaW4pKSAqIDEwMDtcblxuICAgIGlmICh0b3AgPiAxMDApIHRvcCA9IDEwMDtcbiAgICBpZiAodG9wIDwgMCkgdG9wID0gMDtcbiAgICBpZiAoYXhpcyA9PT0gJ3gnKSB0b3AgPSAwO1xuXG4gICAgaWYgKGxlZnQgPiAxMDApIGxlZnQgPSAxMDA7XG4gICAgaWYgKGxlZnQgPCAwKSBsZWZ0ID0gMDtcbiAgICBpZiAoYXhpcyA9PT0gJ3knKSBsZWZ0ID0gMDtcblxuICAgIHJldHVybiB7IHRvcCwgbGVmdCB9O1xuICB9XG5cbiAgZnVuY3Rpb24gY2hhbmdlKHsgdG9wLCBsZWZ0IH0pIHtcbiAgICBpZiAoIW9uQ2hhbmdlKSByZXR1cm47XG5cbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNvbnRhaW5lci5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBkeCA9IDA7XG4gICAgbGV0IGR5ID0gMDtcblxuICAgIGlmIChsZWZ0IDwgMCkgbGVmdCA9IDA7XG4gICAgaWYgKGxlZnQgPiB3aWR0aCkgbGVmdCA9IHdpZHRoO1xuICAgIGlmICh0b3AgPCAwKSB0b3AgPSAwO1xuICAgIGlmICh0b3AgPiBoZWlnaHQpIHRvcCA9IGhlaWdodDtcblxuICAgIGlmIChheGlzID09PSAneCcgfHwgYXhpcyA9PT0gJ3h5Jykge1xuICAgICAgZHggPSAobGVmdCAvIHdpZHRoKSAqICh4bWF4IC0geG1pbik7XG4gICAgfVxuXG4gICAgaWYgKGF4aXMgPT09ICd5JyB8fCBheGlzID09PSAneHknKSB7XG4gICAgICBkeSA9ICh0b3AgLyBoZWlnaHQpICogKHltYXggLSB5bWluKTtcbiAgICB9XG5cbiAgICBjb25zdCB4ID0gKGR4ICE9PSAwID8gcGFyc2VJbnQoZHggLyB4c3RlcCwgMTApICogeHN0ZXAgOiAwKSArIHhtaW47XG4gICAgY29uc3QgeSA9IChkeSAhPT0gMCA/IHBhcnNlSW50KGR5IC8geXN0ZXAsIDEwKSAqIHlzdGVwIDogMCkgKyB5bWluO1xuXG4gICAgY29uc3QgeFZhbHVlID0geHJldmVyc2UgPyB4bWF4IC0geCArIHhtaW4gOiB4O1xuICAgIGNvbnN0IHlWYWx1ZSA9IHlyZXZlcnNlID8geW1heCAtIHkgKyB5bWluIDogeTtcbiAgICBzZXRWYWx1ZSh7eFZhbHVlLCB5VmFsdWV9KTtcbiAgICBvbkNoYW5nZSh7XG4gICAgICB4OiB4VmFsdWUsXG4gICAgICB5OiB5VmFsdWUsXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVNb3VzZURvd24oZSkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGRvbSA9IGhhbmRsZS5jdXJyZW50O1xuICAgIGNvbnN0IGNsaWVudFBvcyA9IGdldENsaWVudFBvc2l0aW9uKGUpO1xuXG4gICAgc3RhcnQuY3VycmVudCA9IHtcbiAgICAgIHg6IGRvbS5vZmZzZXRMZWZ0LFxuICAgICAgeTogZG9tLm9mZnNldFRvcFxuICAgIH07XG5cbiAgICBvZmZzZXQuY3VycmVudCA9IHtcbiAgICAgIHg6IGNsaWVudFBvcy54LFxuICAgICAgeTogY2xpZW50UG9zLnlcbiAgICB9O1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlRHJhZyk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGhhbmRsZURyYWdFbmQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGhhbmRsZURyYWcsIHsgcGFzc2l2ZTogZmFsc2UgfSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVEcmFnRW5kKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIGhhbmRsZURyYWdFbmQpO1xuXG4gICAgaWYgKG9uRHJhZ1N0YXJ0KSB7XG4gICAgICBvbkRyYWdTdGFydChlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3MoZSkge1xuICAgIGNvbnN0IGNsaWVudFBvcyA9IGdldENsaWVudFBvc2l0aW9uKGUpO1xuICAgIGNvbnN0IGxlZnQgPSBjbGllbnRQb3MueCArIHN0YXJ0LmN1cnJlbnQueCAtIG9mZnNldC5jdXJyZW50Lng7XG4gICAgY29uc3QgdG9wID0gY2xpZW50UG9zLnkgKyBzdGFydC5jdXJyZW50LnkgLSBvZmZzZXQuY3VycmVudC55O1xuXG4gICAgcmV0dXJuIHsgbGVmdCwgdG9wIH07XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVEcmFnKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBjaGFuZ2UoZ2V0UG9zKGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWdFbmQoZSkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGhhbmRsZURyYWcpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBoYW5kbGVEcmFnRW5kKTtcblxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGhhbmRsZURyYWcsIHtcbiAgICAgIHBhc3NpdmU6IGZhbHNlXG4gICAgfSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBoYW5kbGVEcmFnRW5kKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIGhhbmRsZURyYWdFbmQpO1xuXG4gICAgaWYgKG9uRHJhZ0VuZCkge1xuICAgICAgb25EcmFnRW5kKGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBpZiAoZGlzYWJsZWQpIHJldHVybjtcblxuICAgIGNvbnN0IGNsaWVudFBvcyA9IGdldENsaWVudFBvc2l0aW9uKGUpO1xuICAgIGNvbnN0IHJlY3QgPSBjb250YWluZXIuY3VycmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIGNoYW5nZSh7XG4gICAgICBsZWZ0OiBjbGllbnRQb3MueCAtIHJlY3QubGVmdCxcbiAgICAgIHRvcDogY2xpZW50UG9zLnkgLSByZWN0LnRvcFxuICAgIH0pO1xuXG4gICAgaWYgKG9uQXhpc0NsaWNrKSBvbkF4aXNDbGljayhlKTtcbiAgICBpZiAob25DbGljaykgb25DbGljayhlKTtcbiAgfVxuXG4gIC8vIHNlbWFudGljIGFsaWFzIGZvciBoYW5kbGVDbGlja1xuICBmdW5jdGlvbiBoYW5kbGVBeGlzQ2xpY2soZSkge1xuICAgIGhhbmRsZUNsaWNrKGUpO1xuICB9XG5cbiAgLy8gb24gdGh1bWIgKGVsZW1lbnQpIGRvdWJsZS1jbGlja1xuICBmdW5jdGlvbiBoYW5kbGVUaHVtYkRvdWJsZUNsaWNrKGUpIHtcbiAgICBpZiAob25UaHVtYkRvdWJsZUNsaWNrKSBvblRodW1iRG91YmxlQ2xpY2soZSk7XG4gIH1cblxuICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbigpO1xuICBjb25zdCB2YWx1ZVN0eWxlID0ge307XG4gIGlmIChheGlzID09PSAneCcpIHZhbHVlU3R5bGUud2lkdGggPSBwb3MubGVmdCArICclJztcbiAgaWYgKGF4aXMgPT09ICd5JykgdmFsdWVTdHlsZS5oZWlnaHQgPSBwb3MudG9wICsgJyUnO1xuICBpZiAoeHJldmVyc2UpIHZhbHVlU3R5bGUubGVmdCA9IDEwMCAtIHBvcy5sZWZ0ICsgJyUnO1xuICBpZiAoeXJldmVyc2UpIHZhbHVlU3R5bGUudG9wID0gMTAwIC0gcG9zLnRvcCArICclJztcblxuICBjb25zdCBoYW5kbGVTdHlsZSA9IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgIGxlZnQ6IHhyZXZlcnNlID8gMTAwIC0gcG9zLmxlZnQgKyAnJScgOiBwb3MubGVmdCArICclJyxcbiAgICB0b3A6IHlyZXZlcnNlID8gMTAwIC0gcG9zLnRvcCArICclJyA6IHBvcy50b3AgKyAnJSdcbiAgfTtcblxuICBjb25zdCBsYWJlbFN0eWxlID0ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScsXG4gICAgbGVmdDogeHJldmVyc2UgPyAxMDAgLSBwb3MubGVmdCArICclJyA6IHBvcy5sZWZ0ICsgJyUnLFxuICAgIHRvcDogeXJldmVyc2UgPyAxMDAgLSBwb3MudG9wICsgJyUnIDogcG9zLnRvcCArICclJ1xuICB9O1xuXG4gIGlmIChheGlzID09PSAneCcpIHtcbiAgICBoYW5kbGVTdHlsZS50b3AgPSAnNTAlJztcbiAgICBsYWJlbFN0eWxlLnRvcCA9ICAnNTAlJztcbiAgfSBlbHNlIGlmIChheGlzID09PSAneScpIHtcbiAgICBoYW5kbGVTdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgbGFiZWxTdHlsZS5sZWZ0ICA9ICc1MCUnO1xuICB9XG5cbiAgY29uc3Qgc3R5bGVzID0ge1xuICAgIHRyYWNrOiB7IC4uLmRlZmF1bHRTdHlsZXNbYXhpc10udHJhY2ssIC4uLmN1c3RvbVN0eWxlcy50cmFjayB9LFxuICAgIGFjdGl2ZTogeyAuLi5kZWZhdWx0U3R5bGVzW2F4aXNdLmFjdGl2ZSwgLi4uY3VzdG9tU3R5bGVzLmFjdGl2ZSB9LFxuICAgIHRodW1iOiB7IC4uLmRlZmF1bHRTdHlsZXNbYXhpc10udGh1bWIsIC4uLmN1c3RvbVN0eWxlcy50aHVtYiB9LFxuICAgIGxhYmVsOiB7IC4uLmRlZmF1bHRTdHlsZXNbYXhpc10ubGFiZWwsIC4uLmN1c3RvbVN0eWxlcy5sYWJlbCB9LFxuICAgIGRpc2FibGVkOiB7IC4uLmRlZmF1bHRTdHlsZXMuZGlzYWJsZWQsIC4uLmN1c3RvbVN0eWxlcy5kaXNhYmxlZCB9LFxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgey4uLnByb3BzfVxuICAgICAgcmVmPXtjb250YWluZXJ9XG4gICAgICBjc3M9e1tzdHlsZXMudHJhY2ssIGRpc2FibGVkICYmIHN0eWxlcy5kaXNhYmxlZF19XG4gICAgICBvbkNsaWNrPXtoYW5kbGVBeGlzQ2xpY2t9XG4gICAgPlxuICAgICAgPGRpdiBjc3M9e3N0eWxlcy5hY3RpdmV9IHN0eWxlPXt2YWx1ZVN0eWxlfSAvPlxuICAgICAgPGRpdlxuICAgICAgICByZWY9e2hhbmRsZX1cbiAgICAgICAgc3R5bGU9e2hhbmRsZVN0eWxlfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e2hhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25DbGljaz17ZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZS5uYXRpdmVFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjc3M9e3N0eWxlcy50aHVtYn0gb25Eb3VibGVDbGljaz17aGFuZGxlVGh1bWJEb3VibGVDbGlja30gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17ey4uLmxhYmVsU3R5bGUsIC4uLnN0eWxlcy5sYWJlbH19XG4gICAgICA+XG4gICAgICB7d2l0aExhYmVsICYmIChcbiAgICAgICAgPGRpdj57KGF4aXMgPT09ICd4eScpID8gYCR7dmFsdWUueFZhbHVlfSwke3ZhbHVlLnlWYWx1ZX1gIDogKChheGlzID09PSAneCcpID8gYCR7dmFsdWUueFZhbHVlfWAgOiBgJHt2YWx1ZS55VmFsdWV9YCl9PC9kaXY+XG4gICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5TbGlkZXIuZGVmYXVsdFByb3BzID0ge1xuICBkaXNhYmxlZDogZmFsc2UsXG4gIGF4aXM6ICd4JyxcbiAgeDogNTAsXG4gIHhtaW46IDAsXG4gIHhtYXg6IDEwMCxcbiAgeTogNTAsXG4gIHltaW46IDAsXG4gIHltYXg6IDEwMCxcbiAgeHN0ZXA6IDEsXG4gIHlzdGVwOiAxLFxuICB4cmV2ZXJzZTogZmFsc2UsXG4gIHlyZXZlcnNlOiBmYWxzZSxcbiAgd2l0aExhYmVsOiBmYWxzZSxcbiAgc3R5bGVzOiB7fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyO1xuIl19 */")),
    onClick: handleAxisClick
  }), jsx("div", {
    css: styles$1.active,
    style: valueStyle
  }), jsx("div", {
    ref: handle,
    style: handleStyle,
    onTouchStart: handleMouseDown,
    onMouseDown: handleMouseDown,
    onClick: function onClick(e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }, jsx("div", {
    css: styles$1.thumb,
    onDoubleClick: handleThumbDoubleClick
  })), jsx("div", {
    style: _extends({}, labelStyle, styles$1.label)
  }, withLabel && jsx("div", null, axis === 'xy' ? value.xValue + "," + value.yValue : axis === 'x' ? "" + value.xValue : "" + value.yValue)));
};

Slider.defaultProps = {
  disabled: false,
  axis: 'x',
  x: 50,
  xmin: 0,
  xmax: 100,
  y: 50,
  ymin: 0,
  ymax: 100,
  xstep: 1,
  ystep: 1,
  xreverse: false,
  yreverse: false,
  withLabel: false,
  styles: {}
};

export default Slider;
