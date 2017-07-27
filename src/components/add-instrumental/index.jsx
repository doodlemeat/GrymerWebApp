import React from 'react';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';

const required = value => (value ? undefined : 'Required');

const validate = (values) => {

};

class AddInstrumentalForm extends React.Component {
  renderField({ input, label, type, meta: { touched, error, warning } }) {
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
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.props.handleSubmit}>
          <Field
            name="song_name"
            label="Song (optional)"
            className="form-control"
            component={this.renderField}
            type="text"
            validate={[required]} />
          <Field
            name="artist_name"
            label="Artist (optional)"
            className="form-control"
            component={this.renderField}
            type="text"
            validate={[required]} />
          <Field
            name="instrumental_video_id"
            label="Instrumental (optional)"
            className="form-control"
            component={this.renderField}
            type="text"
            validate={[required]} />
          <Field
            name="vocals_video_id"
            label="Vocals (optional)"
            className="form-control"
            component={this.renderField}
            type="text"
            validate={[required]} />
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AddInstrumentalForm = reduxForm({
  form: 'add_instrumental_form',
  validate: validate
})(AddInstrumentalForm);

export default AddInstrumentalForm;
