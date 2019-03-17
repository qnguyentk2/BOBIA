import { toast } from 'react-toastify';

const positionMap = {
  tl: 'TOP_LEFT',
  tc: 'TOP_CENTER',
  tr: 'TOP_RIGHT',
  bl: 'BOTTOM_LEFT',
  bc: 'BOTTOM_CENTER',
  br: 'BOTTOM_RIGHT'
};

const generateOptions = position => ({
  style: { top: '50px' },
  position: toast.POSITION[position ? positionMap[position] : positionMap['tr']]
});

const notify = {
  success: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.success(message, generateOptions(positionOrMessage));
    } else {
      toast.success(positionOrMessage, generateOptions(positionOrMessage));
    }
  },
  error: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.error(message, generateOptions(positionOrMessage));
    } else {
      toast.error(positionOrMessage, generateOptions(positionOrMessage));
    }
  },
  warn: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.warn(message, generateOptions(positionOrMessage));
    } else {
      toast.warn(positionOrMessage, generateOptions(positionOrMessage));
    }
  },
  info: function(positionOrMessage, message) {
    if (arguments.length > 1) {
      toast.info(message, generateOptions(positionOrMessage));
    } else {
      toast.info(positionOrMessage, generateOptions(positionOrMessage));
    }
  }
};

export default notify;
