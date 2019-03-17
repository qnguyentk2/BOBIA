import { toast } from 'react-toastify';

const getPosition = position => {
  let currentPosition;
  switch (position) {
    case 'tl':
      currentPosition = 'TOP_LEFT';
      break;
    case 'tc':
      currentPosition = 'TOP_CENTER';
      break;
    case 'tr':
      currentPosition = 'TOP_RIGHT';
      break;
    case 'bl':
      currentPosition = 'BOTTOM_LEFT';
      break;
    case 'bc':
      currentPosition = 'BOTTOM_CENTER';
      break;
    case 'br':
      currentPosition = 'BOTTOM_RIGHT';
      break;
    default:
      currentPosition = 'TOP_RIGHT';
      break;
  }
  return currentPosition;
};

const notify = {
  success: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.success(message, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    } else {
      toast.success(positionOrMessage, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    }
  },
  error: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.error(message, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    } else {
      toast.error(positionOrMessage, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    }
  },
  warn: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.warn(message, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    } else {
      toast.warn(positionOrMessage, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    }
  },
  info: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.info(message, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    } else {
      toast.info(positionOrMessage, {
        position: toast.POSITION[getPosition(positionOrMessage)]
      });
    }
  }
};

export default notify;
