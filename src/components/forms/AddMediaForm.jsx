import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { Control, Form } from 'react-redux-form';


class AddMediaForm extends React.Component {

  renderFileUpload(field) {
    const files = field.input.value;
    let hasError = false;
    let error = '';
    let errorStyle = { border: '1px solid #d9534f' };
    let hasSuccess = false;

    if(!files || !Array.isArray(files)) {
      hasError = field.meta.touched;
      error = 'You must select a picture describing the media'
    } else if(files && Array.isArray(files) && files.length > 0) {
      hasSuccess = true;
    }

    const formGroupClass = classNames({
      'form-group': true,
      row: true,
      'has-success': hasSuccess,
      'has-danger': hasError
    });
    /*
      <div>


        {field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>}
        {files && Array.isArray(files) && (
          <ul>
            { files.map((file, i) => <li key={i}>{file.name}</li>) }
          </ul>
        )}
      </div>
      <Dropzone
        name={field.name}
        onDrop={( filesToUpload, e ) => field.input.onChange(filesToUpload)}
        style={hasError ? { ...errorStyle, cursor: 'pointer'} : { cursor: 'pointer' }}
        className="rounded border-1 bg-faded p-3"
      >
        <div>
        {
            hasSuccess ? files[0].name : 'Choose a file or drag it here'
        }</div>
      </Dropzone>
      <input {...input} className={inputclass} type={type} />
      {touched &&
        ((error && <div className="form-control-feedback">{error}</div>) ||
          (warning && <div className="form-control-feedback">{warning}</div>))}

      <small className="form-text text-muted">{helpText}</small>*/
    return (
      <div className={formGroupClass}>
        <label htmlFor={field.input.name} className="col-sm-2 form-control-label">{field.label}</label>
        <div className="col-sm-6">
          <input type="file" className="form-control-file" />

          {field.meta.touched &&
            (hasError && <div className="form-control-feedback">{error}</div>)}
        </div>
      </div>
    );
  }

  renderField({ input, label, type, meta: { touched, error, warning }, helpText }) {
    const success = touched && !error && !warning;
    const hasDanger = touched && error;
    const hasWarning = touched && warning && !error;

    const formGroupClass = classNames({
      'form-group': true,
      row: true,
      'has-success': success,
      'has-danger': hasDanger,
      'has-warning': hasWarning
    });

    const inputclass = classNames({
      'form-control': true,
      'form-control-success': success,
      'form-control-danger': hasDanger,
      'form-control-warning': hasWarning
    });
    return (
      <div className={formGroupClass}>
        <label htmlFor={input.name} className="col-sm-2 form-control-label">{label}</label>
        <div className="col-sm-6">
          <input {...input} className={inputclass} type={type} />
          {touched &&
            ((error && <div className="form-control-feedback">{error}</div>) ||
              (warning && <div className="form-control-feedback">{warning}</div>))}

          <small className="form-text text-muted">{helpText}</small>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <Form
          model="addMedia"
          className="col-lg-4 offset-lg-4 mb-3"
          onSubmit={() => {}}
        >
          <div className="form-group">
            <label htmlFor="" className="form-control-label">Name</label>
            <Control.text className="form-control" model=".media_name" />
          </div>
          <div className="form-group">
            <label htmlFor="" className="form-control-label">Image</label>
            <Control.file className="form-control-file" model=".media_image" />
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </Form>
      </div>
    );
  }
}

export default AddMediaForm;
