import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import {
  Container,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Subscribe } from 'unstated';
import { GlobalContext } from 'components/common/Context';
import Common from 'components/common';

// 200853467249051
const LoginSocialForm = props => (
  <div className="login">
    <Container>
      <Form>
        <FormGroup className="login-social">
          <span className="login-social__title">Đăng nhập bằng</span>
          <ul className="login-social__list">
            <li className="login-social__list__item">
              <FacebookLogin
                cssClass="btn social-link social-link--facebook"
                icon="ico ico-facebook social-icon social-icon--facebook"
                appId="2030954623901199"
                textButton="Facebook"
                fields="first_name,last_name,picture"
                callback={response =>
                  props.socialSuccess('facebook', response, props.socialLogin)
                }
                onFailure={() =>
                  props.notify.error(
                    'Đăng nhập facebook thất bại, xin vui lòng thử lại!'
                  )
                }
              />
            </li>
            <li className="login-social__list__item">
              <GoogleLogin
                className="btn social-link social-link--google btn-google"
                clientId="257745460484-juo7aj926sd8udpjm1j9rl24pgphjrk7.apps.googleusercontent.com"
                icon={false}
                onSuccess={response =>
                  props.socialSuccess('google', response, props.socialLogin)
                }
                onFailure={response => {
                  let googleErrorMessage = '';
                  switch (response.error) {
                    case 'idpiframe_initialization_failed':
                      googleErrorMessage =
                        'Đăng nhập google thất bại, vui lòng cho phép sử dụng cookie';
                      break;
                    case 'popup_closed_by_user':
                      googleErrorMessage =
                        'Đăng nhập google thất bại, bạn đã đóng cửa sổ đăng nhập';
                      break;
                    case 'access_denied':
                      googleErrorMessage =
                        'Đăng nhập google thất bại, bạn đã từ chối cung cấp thông tin';
                      break;
                    case 'immediate_failed':
                      googleErrorMessage =
                        'Đăng nhập google thất bại, vui lòng thử lại';
                      break;
                    default:
                      break;
                  }
                  props.notify.error(googleErrorMessage);
                }}
              >
                {/* <i className="ico ico-google-plus social-icon social-icon--google" /> */}
                <i className="fab fa-google-plus-g icon-google-custom" />
                Google
              </GoogleLogin>
            </li>
          </ul>
        </FormGroup>
        {props.error &&
        props.error.graphQLErrors &&
        props.error.graphQLErrors.length > 0 ? (
          <props.CommonMessage
            type="error"
            messages={props.error.graphQLErrors.map(error => error.message)}
          />
        ) : null}
      </Form>
    </Container>
  </div>
);
function LoginSocial(props) {
  const socialSuccess = (type, response, socialLogin) => {
    let socialUser = {
      _provider: type,
      _profile: {}
    };

    switch (type) {
      case 'google':
        const profileData = response.profileObj;
        socialUser._profile.id = profileData.googleId;
        socialUser._profile.firstName = profileData.givenName;
        socialUser._profile.lastName = profileData.familyName;
        socialUser._profile.profilePicURL = profileData.imageUrl;
        break;
      case 'facebook':
        socialUser._profile.id = response.userID;
        socialUser._profile.firstName = response.first_name;
        socialUser._profile.lastName = response.last_name;
        socialUser._profile.profilePicURL = response.picture.data.url;
        break;
      default:
        break;
    }
    socialLogin({
      variables: { socialUser }
    });
  };

  const {
    commonProps: {
      queries: { mutation },
      notify
    },
    commonComps: { CommonLoading, CommonMessage, Page500 }
  } = Common;

  return (
    <Subscribe to={[GlobalContext]}>
      {context => (
        <Mutation mutation={mutation.socialLogin}>
          {(socialLogin, { loading, error, data }) => {
            if (loading) {
              return <CommonLoading />;
            }
            if (error && error.networkError) {
              return <Page500 error={error.networkError} />;
            }
            if (data && data.socialLogin && data.socialLogin.success === true) {
              context.changeLoggedInState(
                {
                  isLoggedIn: data.socialLogin.success,
                  banner: data.socialLogin.banner,
                  user: data.socialLogin.user
                },
                () =>
                  context.toggleAuthenModal('login', () => {
                    if (data.socialLogin.token && window.localStorage) {
                      window.localStorage.setItem(
                        'token',
                        data.socialLogin.token
                      );
                    }
                    notify.success('Đăng nhập thành công!');
                  })
              );

              if (data.socialLogin.isNew === true) {
                return (
                  <Modal isOpen={true} className={props.className}>
                    <ModalBody>
                      Bạn có muốn cập nhật thông tin cá nhân?
                    </ModalBody>
                    <ModalFooter>
                      <Link
                        className="btn btn-primary"
                        to={`/nguoi-dung/${data.socialLogin.user.slug}`}
                      >
                        Cập nhật
                      </Link>
                      <Link className="btn btn-danger" to="/">
                        Không
                      </Link>
                    </ModalFooter>
                  </Modal>
                );
              }

              return (
                <LoginSocialForm
                  notify={notify}
                  socialLogin={socialLogin}
                  socialSuccess={socialSuccess}
                  error={error}
                  CommonMessage={CommonMessage}
                />
              );
            }

            return (
              <LoginSocialForm
                notify={notify}
                socialLogin={socialLogin}
                socialSuccess={socialSuccess}
                error={error}
                CommonMessage={CommonMessage}
              />
            );
          }}
        </Mutation>
      )}
    </Subscribe>
  );
}

export default memo(LoginSocial);
