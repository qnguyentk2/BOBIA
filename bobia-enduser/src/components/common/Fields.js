import React, { PureComponent, memo } from 'react';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import classNames from 'classnames';
import { Label } from 'reactstrap';
import Select from 'react-select';
import Creatable from 'react-select/lib/Creatable';
import AsyncSelect from 'react-select/lib/Async';
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import Editor from 'draft-js-plugins-editor';
import {
  Editor as DefaultEditor,
  convertFromRaw,
  convertToRaw,
  EditorState,
  ContentState
} from 'draft-js';
import createInlineToolbarPlugin, {
  Separator
} from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from 'draft-js-buttons';
import { SketchPicker } from 'react-color';
import Common from 'components/common';
import { isJSON } from 'utils';
import uploadImg from 'assets/images/icons/upload-book.png';

moment.locale('vi', {
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split(
    '_'
  ),
  monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split(
    '_'
  ),
  monthsParseExact: true,
  weekdays: 'Chủ nhật_Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy'.split('_'),
  weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysParseExact: true,
  meridiemParse: /sa|ch/i,
  isPM: function(input) {
    return /^ch$/i.test(input);
  },
  meridiem: function(hours, minutes, isLower) {
    if (hours < 12) {
      return isLower ? 'sa' : 'SA';
    } else {
      return isLower ? 'ch' : 'CH';
    }
  },
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [năm] YYYY',
    LLL: 'D MMMM [năm] YYYY HH:mm',
    LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
    l: 'DD/M/YYYY',
    ll: 'D MMM YYYY',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd, D MMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Hôm nay lúc] LT',
    nextDay: '[Ngày mai lúc] LT',
    nextWeek: 'dddd [tuần tới lúc] LT',
    lastDay: '[Hôm qua lúc] LT',
    lastWeek: 'dddd [tuần rồi lúc] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    ss: '%d giây',
    m: 'một phút',
    mm: '%d phút',
    h: 'một giờ',
    hh: '%d giờ',
    d: 'một ngày',
    dd: '%d ngày',
    M: 'một tháng',
    MM: '%d tháng',
    y: 'một năm',
    yy: '%d năm'
  },
  dayOfMonthOrdinalParse: /\d{1,2}/,
  ordinal: function(number) {
    return number;
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
});

export const DatePicker = memo(props => {
  const handleChange = value => {
    props.onChange(props.name, value ? moment(value).format('MM/DD/YYYY') : '');
  };

  // const handleBlur = () => {
  //   props.onBlur(props.name, true);
  // };

  const dateConverter = input => {
    if (input) {
      if (typeof input === 'string') {
        if (props.value) {
          return moment(props.value, 'MM/DD/YYYY').format('DD/MM/YYYY');
        }
        return moment().format('DD/MM/YYYY');
      }
      return moment(props.value).format('DD/MM/YYYY');
    }
    return moment().format('DD/MM/YYYY');
  };

  return (
    <ReactDatePicker
      className="form-control"
      dateFormat="dd/MM/YYYY"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      name={props.name}
      onChange={handleChange}
      selected={moment(dateConverter(props.value), 'DD/MM/YYYY').toDate()}
    />
  );
});

export const InputFeedback = memo(({ error }) =>
  error ? <div className={classNames('input-feedback')}>{error}</div> : null
);

export const CheckboxGroup = memo(props => {
  const handleChange = event => {
    const target = event.currentTarget;
    let valueArray = [...props.value] || [];

    if (target.checked) {
      valueArray.push(target.id);
    } else {
      valueArray.splice(valueArray.indexOf(target.id), 1);
    }

    props.onChange(props.id, valueArray);
  };

  const handleBlur = () => {
    props.onBlur(props.id, true);
  };

  const {
    value,
    error,
    touched,
    label,
    className,
    inputClassName,
    labelClassName,
    style,
    children,
    list
  } = props;

  const classes = classNames(
    'input-field',
    {
      'is-success': value || (!error && touched),
      'is-error': !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
      <fieldset style={style}>
        {label && <h2>{label}</h2>}
        {list && list === true ? (
          <div className={className}>
            {React.Children.map(children, child => {
              return React.cloneElement(child, {
                field: {
                  value: value.includes(child.props.id),
                  onChange: handleChange,
                  onBlur: handleBlur
                }
              });
            })}
          </div>
        ) : (
          React.Children.map(children, child => {
            return React.cloneElement(child, {
              field: {
                inputClassName: inputClassName,
                labelClassName: labelClassName,
                value: value.includes(child.props.id),
                onChange: handleChange,
                onBlur: handleBlur
              }
            });
          })
        )}

        {touched && <InputFeedback error={error} />}
      </fieldset>
    </div>
  );
});

export const Checkbox = memo(
  ({
    field: { name, value, onChange, onBlur },
    form: { errors, touched, setFieldValue },
    id,
    label,
    className,
    inputClassName,
    labelClassName,
    toggle,
    ...props
  }) => {
    if (toggle && toggle === true) {
      return (
        <div className="onoffswitch">
          <input
            id={id}
            type="checkbox"
            value={value}
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            className="onoffswitch-checkbox"
          />
          <label className="onoffswitch-label" htmlFor={id}>
            <span className="onoffswitch-inner" />
            <span className="onoffswitch-switch" />
          </label>
        </div>
      );
    }

    return (
      <div className="checkbox">
        <input
          name={name}
          id={id}
          type="checkbox"
          value={value}
          checked={value}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClassName}
          {...props}
        />
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
);

export const SingleCheckbox = memo(props => {
  if (props.toggle && props.toggle === true) {
    return (
      <div className="onoffswitch">
        <input
          name={props.name}
          id={props.id}
          type="checkbox"
          value={props.value}
          defaultChecked={
            typeof props.value === 'string' && props.checkifequal
              ? props.value === props.checkifequal
              : props.value
          }
          onChange={props.onChange}
          onBlur={props.onBlur}
          className="onoffswitch-checkbox"
          {...props}
        />
        <label className="onoffswitch-label" htmlFor={props.id}>
          <span className="onoffswitch-inner" />
          <span className="onoffswitch-switch" />
        </label>
      </div>
    );
  }

  return (
    <>
      <input
        name={props.name}
        id={props.id}
        type="checkbox"
        value={props.value}
        defaultChecked={
          typeof props.value === 'string' && props.checkifequal
            ? props.value === props.checkifequal
            : props.value
        }
        onChange={props.onChange}
        onBlur={props.onBlur}
        className={props.className}
        {...props}
      />
      <label
        className={props.labelClassName}
        htmlFor={props.id}
        style={{ cursor: 'pointer' }}
      >
        {props.label}
      </label>
    </>
  );
});

export const RadioButton = memo(
  ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    containerClassName,
    inline,
    labelClassName,
    inputClassName,
    ...props
  }) => {
    if (inline && inline === true) {
      return (
        <div className={containerClassName}>
          <input
            name={name}
            id={id}
            type="radio"
            value={id}
            checked={id === value}
            onChange={onChange}
            onBlur={onBlur}
            className={inputClassName || 'radio-button'}
            {...props}
          />
          <label className={labelClassName} htmlFor={id}>
            {label}
          </label>
        </div>
      );
    }
    return (
      <>
        <div className={className}>
          <input
            name={name}
            id={id}
            type="radio"
            value={id}
            checked={id === value}
            onChange={onChange}
            onBlur={onBlur}
            className={className || 'radio-button'}
            {...props}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      </>
    );
  }
);

export const RadioButtonGroup = memo(
  ({
    value,
    error,
    touched,
    id,
    label,
    className,
    containerClassName,
    labelClassName,
    inputClassName,
    children,
    inline
  }) => {
    const classes = classNames(
      'input-field',
      {
        'is-success': value || (!error && touched),
        'is-error': !!error && touched
      },
      className
    );
    if (inline && inline === true) {
      const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, {
          inline,
          containerClassName,
          labelClassName,
          inputClassName
        })
      );
      return (
        <div className={classes}>
          {childrenWithProps}
          {touched && <InputFeedback error={error} />}
        </div>
      );
    }
    return (
      <div className={classes}>
        <fieldset>
          <Label>{label}</Label>
          {children}
          {touched && <InputFeedback error={error} />}
        </fieldset>
      </div>
    );
  }
);

export const DropdownList = memo(props => {
  const handleChange = value => {
    if (props.saveName) {
      props.onChange(props.saveName, value);
    } else {
      props.onChange(value);
    }
  };

  const handleBlur = () => {
    if (props.saveName) {
      props.onBlur(props.saveName, true);
    }
  };

  if (props.creatable && props.creatable === true) {
    if (props.async && props.async === true) {
      return (
        <AsyncCreatableSelect
          name={props.name}
          id={props.id}
          className={props.className}
          styles={props.customStyles}
          formatCreateLabel={props.formatCreateLabel}
          options={props.options}
          onChange={handleChange}
          onBlur={handleBlur}
          value={props.value}
          placeholder={props.value ? props.value : props.placeholder}
          noOptionsMessage={props.noOptionsMessage}
          isMulti={props.isMulti}
          isDisabled={props.isDisabled}
          isClearable={props.isClearable}
          isSearchable={props.isSearchable}
          loadOptions={props.loadOptions}
          cacheOptions
          defaultOptions
        />
      );
    }
    return (
      <Creatable
        name={props.name}
        id={props.id}
        className={props.className}
        styles={props.customStyles}
        formatCreateLabel={props.formatCreateLabel}
        options={props.options}
        onChange={handleChange}
        onBlur={handleBlur}
        value={props.value}
        placeholder={props.value ? props.value : props.placeholder}
        noOptionsMessage={props.noOptionsMessage}
        isMulti={props.isMulti}
        isDisabled={props.isDisabled}
        isClearable={props.isClearable}
        isSearchable={props.isSearchable}
      />
    );
  }

  if (props.async && props.async === true) {
    return (
      <AsyncSelect
        name={props.name}
        id={props.id}
        className={props.className}
        styles={props.customStyles}
        options={props.options}
        onChange={handleChange}
        onBlur={handleBlur}
        value={props.value}
        placeholder={props.value ? props.value : props.placeholder}
        noOptionsMessage={props.noOptionsMessage}
        isMulti={props.isMulti}
        isDisabled={props.isDisabled}
        isClearable={props.isClearable}
        isSearchable={props.isSearchable}
        loadOptions={props.loadOptions}
        cacheOptions
        defaultOptions
      />
    );
  }

  return (
    <Select
      name={props.name}
      id={props.id}
      className={props.className}
      styles={props.customStyles}
      options={props.options}
      onChange={handleChange}
      onBlur={handleBlur}
      value={props.value}
      placeholder={props.value ? props.value : props.placeholder}
      noOptionsMessage={props.noOptionsMessage}
      isMulti={props.isMulti}
      isDisabled={props.isDisabled}
      isClearable={props.isClearable}
      isSearchable={props.isSearchable}
    />
  );
});

export class FileUpload extends PureComponent {
  state = {
    initialValues: this.props.initialValue,
    isUploaded: false
  };

  handleChange = ({
    target: {
      validity,
      files: [file]
    }
  }) => {
    if (validity.valid) {
      this.props.onChange(this.props.name, file);
    }
    const { type } = this.props;
    type && type === 'image-single' && this.handleNewImage(file);
  };

  handleBlur = () => {
    this.props.onBlur(this.props.name, true);
  };

  handleNewImage = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ initialValues: reader.result, isUploaded: true });
    };
  };

  render() {
    const {
      commonComps: { LazyImage }
    } = Common;

    const { type } = this.props;

    const uploadClasses = classNames('image-cover__upload', {
      hide: this.state.isUploaded
    });

    const editClasses = classNames('image-cover__edit', {
      show: true
    });

    return (
      <>
        {type && type === 'image-single' && this.state.initialValues && (
          <LazyImage
            alt=""
            src={this.state.initialValues}
            className={'image-cover__img'}
          />
        )}
        <input
          type="file"
          name={this.props.name}
          id={this.props.id}
          className={this.props.className}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!this.state.initialValues && (
          <div className={uploadClasses}>
            <LazyImage
              alt={this.props.alt}
              src={uploadImg}
              className="image-cover__upload__img"
            />
            <span className="image-cover__upload__text">
              {this.props.placeholder}
            </span>
            <span className="image-cover__upload__text-size">
              {this.props.coverSize}
            </span>
          </div>
        )}
        <div className={editClasses}>
          <span className="image-cover__edit__icon">
            <i className="fa fa-pen icon" />
          </span>
        </div>
      </>
    );
  }
}

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
  ]
});
const { InlineToolbar } = inlineToolbarPlugin;

const generateEditorState = currentValue => {
  if (currentValue) {
    if (typeof currentValue === 'string') {
      if (isJSON(currentValue)) {
        return EditorState.createWithContent(
          convertFromRaw(JSON.parse(currentValue))
        );
      }

      return EditorState.createWithContent(
        ContentState.createFromText(currentValue)
      );
    }

    return EditorState.createWithContent(
      convertFromRaw(JSON.parse(currentValue))
    );
  }

  return EditorState.createEmpty();
};

export class RichEditor extends PureComponent {
  state = {
    editorState: generateEditorState(this.props.value || '')
  };

  _handleChangeState = editorState => {
    this.setState(
      {
        editorState: editorState
      },
      () =>
        this.props.onChange(
          this.props.name,
          JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        )
    );
  };

  _focusEditor = () => {
    this.editor.focus();
  };

  _preventDevTool = e => {
    if (e.keyCode === 123) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
      return false;
    }
  };

  _preventInteraction = e => {
    e.preventDefault();
    e.stopPropagation();

    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  componentDidMount() {
    if (this.props.readOnly) {
      document.addEventListener('keydown', this._preventDevTool, false);
    }
  }

  componentWillUnmount() {
    if (this.props.readOnly) {
      document.removeEventListener('keydown', this._preventDevTool, false);
    }
  }

  render() {
    if (this.props.readOnly) {
      return (
        <div
          className={this.props.className}
          onCopy={this._preventInteraction}
          onSelect={this._preventInteraction}
          onContextMenu={this._preventInteraction}
        >
          <DefaultEditor editorState={this.state.editorState} readOnly />
        </div>
      );
    }

    return (
      <div className={this.props.className} onClick={this._focusEditor}>
        <Editor
          placeholder={this.props.placeholder}
          editorState={this.state.editorState}
          onChange={this._handleChangeState}
          plugins={[inlineToolbarPlugin]}
          ref={element => {
            this.editor = element;
          }}
        />
        <InlineToolbar />
      </div>
    );
  }
}

export const ColorPicker = memo(props => {
  const handleChange = color => {
    props.onChange(props.name, color.hex);
  };

  // const handleBlur = () => {
  //   props.onBlur(props.name, true);
  // };

  return <SketchPicker color={props.color} onChangeComplete={handleChange} />;
});
