'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _css = _interopDefault(require('@emotion/css'));
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _objectWithoutPropertiesLoose = _interopDefault(require('@babel/runtime/helpers/objectWithoutPropertiesLoose'));
var core = require('@emotion/core');
var react = require('react');

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
    thumb: _extends({}, thumb)
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
    thumb: _extends({}, thumb)
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
    thumb: _extends({}, thumb)
  },
  disabled: {
    opacity: 0.5
  }
};

var Slider = function Slider(_ref) {
  var disabled = _ref.disabled,
      axis = _ref.axis,
      x = _ref.x,
      y = _ref.y,
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
      customStyles = _ref.styles,
      props = _objectWithoutPropertiesLoose(_ref, ["disabled", "axis", "x", "y", "xmin", "xmax", "ymin", "ymax", "xstep", "ystep", "onChange", "onDragStart", "onDragEnd", "onClick", "onAxisClick", "onThumbClick", "onThumbDoubleClick", "xreverse", "yreverse", "styles"]);

  var container = react.useRef(null);
  var handle = react.useRef(null);
  var start = react.useRef({});
  var offset = react.useRef({});

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
    onChange({
      x: xreverse ? xmax - x + xmin : x,
      y: yreverse ? ymax - y + ymin : y
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
  } // on thumb (element) click 


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

  if (axis === 'x') {
    handleStyle.top = '50%';
  } else if (axis === 'y') {
    handleStyle.left = '50%';
  }

  var styles$1 = {
    track: _extends({}, styles[axis].track, customStyles.track),
    active: _extends({}, styles[axis].active, customStyles.active),
    thumb: _extends({}, styles[axis].thumb, customStyles.thumb),
    disabled: _extends({}, styles.disabled, customStyles.disabled)
  };
  return core.jsx("div", _extends({}, props, {
    ref: container,
    css: /*#__PURE__*/_css([styles$1.track, disabled && styles$1.disabled], ";label:Slider;" + (process.env.NODE_ENV === "production" ? "" : "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3TU0iLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3gganN4ICovXG5pbXBvcnQgeyBqc3ggfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcbmltcG9ydCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldENsaWVudFBvc2l0aW9uIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgZGVmYXVsdFN0eWxlcyBmcm9tICcuL3N0eWxlcyc7XG5cbmNvbnN0IFNsaWRlciA9ICh7XG4gIGRpc2FibGVkLFxuICBheGlzLFxuICB4LFxuICB5LFxuICB4bWluLFxuICB4bWF4LFxuICB5bWluLFxuICB5bWF4LFxuICB4c3RlcCxcbiAgeXN0ZXAsXG4gIG9uQ2hhbmdlLFxuICBvbkRyYWdTdGFydCxcbiAgb25EcmFnRW5kLFxuICBvbkNsaWNrLFxuICBvbkF4aXNDbGljayxcbiAgb25UaHVtYkNsaWNrLFxuICBvblRodW1iRG91YmxlQ2xpY2ssXG4gIHhyZXZlcnNlLFxuICB5cmV2ZXJzZSxcbiAgc3R5bGVzOiBjdXN0b21TdHlsZXMsXG4gIC4uLnByb3BzXG59KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IHVzZVJlZihudWxsKTtcbiAgY29uc3QgaGFuZGxlID0gdXNlUmVmKG51bGwpO1xuICBjb25zdCBzdGFydCA9IHVzZVJlZih7fSk7XG4gIGNvbnN0IG9mZnNldCA9IHVzZVJlZih7fSk7XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oKSB7XG4gICAgbGV0IHRvcCA9ICgoeSAtIHltaW4pIC8gKHltYXggLSB5bWluKSkgKiAxMDA7XG4gICAgbGV0IGxlZnQgPSAoKHggLSB4bWluKSAvICh4bWF4IC0geG1pbikpICogMTAwO1xuXG4gICAgaWYgKHRvcCA+IDEwMCkgdG9wID0gMTAwO1xuICAgIGlmICh0b3AgPCAwKSB0b3AgPSAwO1xuICAgIGlmIChheGlzID09PSAneCcpIHRvcCA9IDA7XG5cbiAgICBpZiAobGVmdCA+IDEwMCkgbGVmdCA9IDEwMDtcbiAgICBpZiAobGVmdCA8IDApIGxlZnQgPSAwO1xuICAgIGlmIChheGlzID09PSAneScpIGxlZnQgPSAwO1xuXG4gICAgcmV0dXJuIHsgdG9wLCBsZWZ0IH07XG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2UoeyB0b3AsIGxlZnQgfSkge1xuICAgIGlmICghb25DaGFuZ2UpIHJldHVybjtcblxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY29udGFpbmVyLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IGR4ID0gMDtcbiAgICBsZXQgZHkgPSAwO1xuXG4gICAgaWYgKGxlZnQgPCAwKSBsZWZ0ID0gMDtcbiAgICBpZiAobGVmdCA+IHdpZHRoKSBsZWZ0ID0gd2lkdGg7XG4gICAgaWYgKHRvcCA8IDApIHRvcCA9IDA7XG4gICAgaWYgKHRvcCA+IGhlaWdodCkgdG9wID0gaGVpZ2h0O1xuXG4gICAgaWYgKGF4aXMgPT09ICd4JyB8fCBheGlzID09PSAneHknKSB7XG4gICAgICBkeCA9IChsZWZ0IC8gd2lkdGgpICogKHhtYXggLSB4bWluKTtcbiAgICB9XG5cbiAgICBpZiAoYXhpcyA9PT0gJ3knIHx8IGF4aXMgPT09ICd4eScpIHtcbiAgICAgIGR5ID0gKHRvcCAvIGhlaWdodCkgKiAoeW1heCAtIHltaW4pO1xuICAgIH1cblxuICAgIGNvbnN0IHggPSAoZHggIT09IDAgPyBwYXJzZUludChkeCAvIHhzdGVwLCAxMCkgKiB4c3RlcCA6IDApICsgeG1pbjtcbiAgICBjb25zdCB5ID0gKGR5ICE9PSAwID8gcGFyc2VJbnQoZHkgLyB5c3RlcCwgMTApICogeXN0ZXAgOiAwKSArIHltaW47XG5cbiAgICBvbkNoYW5nZSh7XG4gICAgICB4OiB4cmV2ZXJzZSA/IHhtYXggLSB4ICsgeG1pbiA6IHgsXG4gICAgICB5OiB5cmV2ZXJzZSA/IHltYXggLSB5ICsgeW1pbiA6IHlcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZU1vdXNlRG93bihlKSB7XG4gICAgaWYgKGRpc2FibGVkKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZG9tID0gaGFuZGxlLmN1cnJlbnQ7XG4gICAgY29uc3QgY2xpZW50UG9zID0gZ2V0Q2xpZW50UG9zaXRpb24oZSk7XG5cbiAgICBzdGFydC5jdXJyZW50ID0ge1xuICAgICAgeDogZG9tLm9mZnNldExlZnQsXG4gICAgICB5OiBkb20ub2Zmc2V0VG9wXG4gICAgfTtcblxuICAgIG9mZnNldC5jdXJyZW50ID0ge1xuICAgICAgeDogY2xpZW50UG9zLngsXG4gICAgICB5OiBjbGllbnRQb3MueVxuICAgIH07XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBoYW5kbGVEcmFnKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgaGFuZGxlRHJhZ0VuZCk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlRHJhZywgeyBwYXNzaXZlOiBmYWxzZSB9KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZURyYWdFbmQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgaGFuZGxlRHJhZ0VuZCk7XG5cbiAgICBpZiAob25EcmFnU3RhcnQpIHtcbiAgICAgIG9uRHJhZ1N0YXJ0KGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvcyhlKSB7XG4gICAgY29uc3QgY2xpZW50UG9zID0gZ2V0Q2xpZW50UG9zaXRpb24oZSk7XG4gICAgY29uc3QgbGVmdCA9IGNsaWVudFBvcy54ICsgc3RhcnQuY3VycmVudC54IC0gb2Zmc2V0LmN1cnJlbnQueDtcbiAgICBjb25zdCB0b3AgPSBjbGllbnRQb3MueSArIHN0YXJ0LmN1cnJlbnQueSAtIG9mZnNldC5jdXJyZW50Lnk7XG5cbiAgICByZXR1cm4geyBsZWZ0LCB0b3AgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZURyYWcoZSkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNoYW5nZShnZXRQb3MoZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlRHJhZ0VuZChlKSB7XG4gICAgaWYgKGRpc2FibGVkKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgaGFuZGxlRHJhZyk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGhhbmRsZURyYWdFbmQpO1xuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlRHJhZywge1xuICAgICAgcGFzc2l2ZTogZmFsc2VcbiAgICB9KTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGhhbmRsZURyYWdFbmQpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgaGFuZGxlRHJhZ0VuZCk7XG5cbiAgICBpZiAob25EcmFnRW5kKSB7XG4gICAgICBvbkRyYWdFbmQoZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xuICAgIGlmIChkaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2xpZW50UG9zID0gZ2V0Q2xpZW50UG9zaXRpb24oZSk7XG4gICAgY29uc3QgcmVjdCA9IGNvbnRhaW5lci5jdXJyZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY2hhbmdlKHtcbiAgICAgIGxlZnQ6IGNsaWVudFBvcy54IC0gcmVjdC5sZWZ0LFxuICAgICAgdG9wOiBjbGllbnRQb3MueSAtIHJlY3QudG9wXG4gICAgfSk7XG5cbiAgICBpZiAob25BeGlzQ2xpY2spIG9uQXhpc0NsaWNrKGUpO1xuICAgIGlmIChvbkNsaWNrKSBvbkNsaWNrKGUpO1xuICB9XG5cbiAgLy8gc2VtYW50aWMgYWxpYXMgZm9yIGhhbmRsZUNsaWNrXG4gIGZ1bmN0aW9uIGhhbmRsZUF4aXNDbGljayhlKSB7XG4gICAgaGFuZGxlQ2xpY2soZSk7XG4gIH1cblxuICAvLyBvbiB0aHVtYiAoZWxlbWVudCkgY2xpY2sgXG4gIGZ1bmN0aW9uIGhhbmRsZVRodW1iQ2xpY2soZSkge1xuICAgIGlmIChvblRodW1iQ2xpY2spIG9uVGh1bWJDbGljayhlKTtcbiAgfVxuXG4gIC8vIG9uIHRodW1iIChlbGVtZW50KSBkb3VibGUtY2xpY2tcbiAgZnVuY3Rpb24gaGFuZGxlVGh1bWJEb3VibGVDbGljayhlKSB7XG4gICAgaWYgKG9uVGh1bWJEb3VibGVDbGljaykgb25UaHVtYkRvdWJsZUNsaWNrKGUpO1xuICB9XG5cbiAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oKTtcbiAgY29uc3QgdmFsdWVTdHlsZSA9IHt9O1xuICBpZiAoYXhpcyA9PT0gJ3gnKSB2YWx1ZVN0eWxlLndpZHRoID0gcG9zLmxlZnQgKyAnJSc7XG4gIGlmIChheGlzID09PSAneScpIHZhbHVlU3R5bGUuaGVpZ2h0ID0gcG9zLnRvcCArICclJztcbiAgaWYgKHhyZXZlcnNlKSB2YWx1ZVN0eWxlLmxlZnQgPSAxMDAgLSBwb3MubGVmdCArICclJztcbiAgaWYgKHlyZXZlcnNlKSB2YWx1ZVN0eWxlLnRvcCA9IDEwMCAtIHBvcy50b3AgKyAnJSc7XG5cbiAgY29uc3QgaGFuZGxlU3R5bGUgPSB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJyxcbiAgICBsZWZ0OiB4cmV2ZXJzZSA/IDEwMCAtIHBvcy5sZWZ0ICsgJyUnIDogcG9zLmxlZnQgKyAnJScsXG4gICAgdG9wOiB5cmV2ZXJzZSA/IDEwMCAtIHBvcy50b3AgKyAnJScgOiBwb3MudG9wICsgJyUnXG4gIH07XG5cbiAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgIGhhbmRsZVN0eWxlLnRvcCA9ICc1MCUnO1xuICB9IGVsc2UgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGhhbmRsZVN0eWxlLmxlZnQgPSAnNTAlJztcbiAgfVxuXG4gIGNvbnN0IHN0eWxlcyA9IHtcbiAgICB0cmFjazogeyAuLi5kZWZhdWx0U3R5bGVzW2F4aXNdLnRyYWNrLCAuLi5jdXN0b21TdHlsZXMudHJhY2sgfSxcbiAgICBhY3RpdmU6IHsgLi4uZGVmYXVsdFN0eWxlc1theGlzXS5hY3RpdmUsIC4uLmN1c3RvbVN0eWxlcy5hY3RpdmUgfSxcbiAgICB0aHVtYjogeyAuLi5kZWZhdWx0U3R5bGVzW2F4aXNdLnRodW1iLCAuLi5jdXN0b21TdHlsZXMudGh1bWIgfSxcbiAgICBkaXNhYmxlZDogeyAuLi5kZWZhdWx0U3R5bGVzLmRpc2FibGVkLCAuLi5jdXN0b21TdHlsZXMuZGlzYWJsZWQgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgey4uLnByb3BzfVxuICAgICAgcmVmPXtjb250YWluZXJ9XG4gICAgICBjc3M9e1tzdHlsZXMudHJhY2ssIGRpc2FibGVkICYmIHN0eWxlcy5kaXNhYmxlZF19XG4gICAgICBvbkNsaWNrPXtoYW5kbGVBeGlzQ2xpY2t9XG4gICAgPlxuICAgICAgPGRpdiBjc3M9e3N0eWxlcy5hY3RpdmV9IHN0eWxlPXt2YWx1ZVN0eWxlfSAvPlxuICAgICAgPGRpdlxuICAgICAgICByZWY9e2hhbmRsZX1cbiAgICAgICAgc3R5bGU9e2hhbmRsZVN0eWxlfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e2hhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25Nb3VzZURvd249e2hhbmRsZU1vdXNlRG93bn1cbiAgICAgICAgb25DbGljaz17ZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgZS5uYXRpdmVFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjc3M9e3N0eWxlcy50aHVtYn0gb25Eb3VibGVDbGljaz17aGFuZGxlVGh1bWJEb3VibGVDbGlja30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuU2xpZGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgZGlzYWJsZWQ6IGZhbHNlLFxuICBheGlzOiAneCcsXG4gIHg6IDUwLFxuICB4bWluOiAwLFxuICB4bWF4OiAxMDAsXG4gIHk6IDUwLFxuICB5bWluOiAwLFxuICB5bWF4OiAxMDAsXG4gIHhzdGVwOiAxLFxuICB5c3RlcDogMSxcbiAgeHJldmVyc2U6IGZhbHNlLFxuICB5cmV2ZXJzZTogZmFsc2UsXG4gIHN0eWxlczoge31cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjtcbiJdfQ== */")),
    onClick: handleAxisClick
  }), core.jsx("div", {
    css: styles$1.active,
    style: valueStyle
  }), core.jsx("div", {
    ref: handle,
    style: handleStyle,
    onTouchStart: handleMouseDown,
    onMouseDown: handleMouseDown,
    onClick: function onClick(e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
  }, core.jsx("div", {
    css: styles$1.thumb,
    onDoubleClick: handleThumbDoubleClick
  })));
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
  styles: {}
};

module.exports = Slider;
