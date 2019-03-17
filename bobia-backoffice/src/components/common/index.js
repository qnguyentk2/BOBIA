import CommonMessage from './CommonMessage';
import CommonConfirm from './CommonConfirm';
import CommonLoading from './CommonLoading';
import CommonRedirect from './CommonRedirect';
import CommonPagination from './CommonPagination';
import CommonPopup from './CommonPopup';
import LazyImage from './LazyImage';
import DateTimeBlock from './DateTimeBlock';
import ErrorBoundary from './ErrorBoundary';
import Page404 from 'pages/Static/Page404';
import Page500 from 'pages/Static/Page500';
import client from 'apollo';
import queries from 'graphql/queries';
import notify from 'utils/notify';
import check from 'utils/validation';
import rules from 'utils/validation/rules';

const Common = {
  commonProps: {
    queries,
    notify,
    validate: { check, rules }
  },
  commonComps: {
    CommonMessage,
    CommonConfirm,
    CommonLoading,
    CommonRedirect,
    CommonPagination,
    CommonPopup,
    LazyImage,
    DateTimeBlock,
    ErrorBoundary,
    Page404,
    Page500
  },
  client
};

export default Common;
