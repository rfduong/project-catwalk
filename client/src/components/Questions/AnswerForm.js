import React from 'react';
import PropTypes from 'prop-types';
import style from './css/Form.css';

const axios = require('axios');

class AnswerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answerBody: '',
      nickname: '',
      email: '',
      photos: [],
      photoUrls: [],
      showInput: [true, false, false, false, false],
      uploadButtonClicked: false,
      errorMessages: [],
      submitError: false,
      submitted: false,
      bodyInvalid: false,
      nameInvalid: false,
      emailInvalid: false,
    };
  }

  handleAnswerChange(e) {
    this.setState({ answerBody: e.target.value });
  }

  handleNicknameChange(e) {
    this.setState({ nickname: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  // REFACTOR PHOTOS TO BE AN OBJECT
  // USERS CAN CANCEL OUT OF THEIR FORM, LEAVING AN EMPTY UNDEFINED
  // THIS UNDEFINED IS STILL COUNTED IN LENGTH
  // DOES NOT PLAY NICELY WITH FOR LOOPS
  // EX: LENGTH: 3, BUT ARRAY IS [PHOTO, UND, PHOTO, UND, PHOTO]
  // FOR LOOP IS NOW LOOPING AS PHOTO, UND, PHOTO
  handlePhotoChange(e, index) {
    const { photos, showInput } = this.state;
    const newPhotos = [...photos];
    if (!e.target.files.item(0)) {
      console.log('not a valid file');
      newPhotos[index] = undefined;
      this.setState({ photos: newPhotos });
      return;
    }
    newPhotos[index] = e.target.files;
    console.log(JSON.stringify(e.target.files.item(0)));
    console.log(e.target.value);
    const newShowInput = [...showInput];
    if (index === photos.length) {
      newShowInput[photos.length + 1] = true;
    }
    this.setState({
      photos: newPhotos,
      showInput: newShowInput,
    });
  }

  handleSubmitAnswer() {
    this.validateForm(() => {
      const { errorMessages } = this.state;
      if (errorMessages.length === 0) {
        this.setState({ submitError: false, submitted: true }, () => {
          this.postAnswer();
        });
      } else {
        this.setState({ submitError: true });
      }
    });
  }

  handleSubmitPhoto() {
    const { photos } = this.state;
    if (photos.length === 0) {
      console.log('no photos yet');
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < photos.length; i += 1) {
      if (photos[i] !== undefined) {
        formData.append('file', photos[i][0]);
      }
    }
    axios.post('/qa/test-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response);
        const newPhotoUrls = [];
        for (let i = 0; i < response.data.length; i += 1) {
          console.log(response.data[i].Location);
          newPhotoUrls[i] = response.data[i].Location;
        }
        this.setState({ photoUrls: newPhotoUrls, uploadButtonClicked: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  isValidEmail() {
    const { email } = this.state;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }

  postAnswer() {
    const { answerBody, nickname, email } = this.state;
    const { questionId } = this.props;
    axios.post('/qa/answerPost', {
      body: answerBody,
      name: nickname,
      email,
      photos: [], // change to photoUrls here
      questionId,
    })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  validateForm(callback) {
    const { answerBody, nickname, email } = this.state;
    const errorMessages = [];
    let bodyInvalid = false;
    let nameInvalid = false;
    let emailInvalid = false;
    if (answerBody.length === 0) {
      errorMessages.push('Answer');
      bodyInvalid = true;
    }
    if (nickname.length === 0) {
      errorMessages.push('Nickname');
      nameInvalid = true;
    }
    if (email.length === 0) {
      errorMessages.push('Email address');
      emailInvalid = true;
    } else if (!this.isValidEmail()) {
      errorMessages.push('The email address provided is not in correct email format');
      emailInvalid = true;
    }
    this.setState({
      errorMessages,
      bodyInvalid,
      nameInvalid,
      emailInvalid,
    }, callback);
  }

  render() {
    const {
      exitAnswerForm,
      questionBody,
      productName,
      addAnswerClicked,
    } = this.props;
    const {
      errorMessages,
      submitError,
      submitted,
      uploadButtonClicked,
      showInput,
      bodyInvalid,
      nameInvalid,
      emailInvalid,
    } = this.state;
    const errorMessage = errorMessages.join(', ');
    const bodyClass = bodyInvalid ? `${style.invalidField} answerField` : 'answerField';
    const nameClass = nameInvalid ? `${style.invalidField} answerNickname` : 'answerNickname';
    const emailClass = emailInvalid ? `${style.invalidField} answerEmail` : 'answerEmail';
    const submitButtonClass = submitted ? style.submitButtonDisabled : style.submitButton;
    const submitButtonText = submitted ? 'SUBMITTED' : 'SUBMIT';
    const photoInputArray = [];
    for (let i = 0; i < 5; i += 1) {
      photoInputArray.push(<input type="file" accept="image/*" key={`image-input-${i}`} onChange={(e) => this.handlePhotoChange(e, i)} hidden={!showInput[i]} />);
    }
    return (
      <div className={`${style.modal} ${addAnswerClicked ? style.modalShow : ''}`}>
        <div className={style.blocker} onClick={exitAnswerForm} />
        <div className={`${style.form} answerForm`}>
          <div className={`${style.formHeader} answerFormHeader`}>
            <div className={`${style.formTitle} answerFormTitle`}>
              <h3>Submit your Answer</h3>
              <h4 className={`${style.formSubTitle} answerFormSubTitle`}>{`${productName}: ${questionBody}`}</h4>
            </div>
            <button type="button" className={`${style.exitButton} exitButton`} onClick={exitAnswerForm}><span>X</span></button>
          </div>
          <div className={`${style.formContent} answerFormContent`}>
            <form>
              <label htmlFor="answer">
                Answer *
                <textarea className={bodyClass} name="answerField" maxLength="1000" onChange={(e) => this.handleAnswerChange(e)} required />
              </label>
              <label htmlFor="nickname">
                Nickname *
                <input type="text" className={nameClass} placeholder="Example: jack543!" maxLength="60" onChange={(e) => this.handleNicknameChange(e)} required />
                <p className={style.fieldDescription}>
                  For privacy reasons, do not use your full name or email address
                </p>
              </label>
              <label htmlFor="email">
                Email *
                <input type="email" className={emailClass} placeholder="Example: jack@email.com" maxLength="60" onChange={(e) => this.handleEmailChange(e)} required />
                <p className={style.fieldDescription}>
                  For authentication reasons, you will not be emailed
                </p>
              </label>
              <label htmlFor="photos">
                Photos
                <div className={style.photoUploadContainer}>
                  {photoInputArray.map((inputs) => inputs)}
                  {!uploadButtonClicked ? <button type="button" className={`${style.uploadPhoto} uploadPhoto`} onClick={(this.handleSubmitPhoto.bind(this))}>UPLOAD</button> : ''}
                </div>
              </label>
              <div className={`${style.buttonContainer}`}>
                <button type="button" className={`${submitButtonClass} submitAnswer`} onClick={this.handleSubmitAnswer.bind(this)} disabled={submitted}>
                  {submitButtonText}
                  &nbsp;
                  {submitted ? <i className="fa fa-check-circle" aria-hidden="true" /> : ''}
                </button>
              </div>
              {submitError ? <div className={`${style.errorMessage} errorMessage`}>{`You must enter the following: ${errorMessage}`}</div> : ''}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AnswerForm.propTypes = {
  exitAnswerForm: PropTypes.func.isRequired,
  questionBody: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  addAnswerClicked: PropTypes.bool,
};

AnswerForm.defaultProps = {
  addAnswerClicked: false,
};

export default AnswerForm;
