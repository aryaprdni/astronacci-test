import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Button, ButtonGroup } from 'react-bootstrap';

const AuthSocialButtons = () => {
  return (
    <ButtonGroup className="d-flex flex-column mt-4">
      <Button variant="outline-danger" className="d-flex align-items-center mb-2" onClick={() => {
        window.location.href = "http://localhost:3000/auth/google";
      }}>
        <FaGoogle size={24} color="#db4437" className="me-2" />
        Google
      </Button>
      <Button variant="outline-primary" className="d-flex align-items-center" onClick={() => {window.location.href = "http://localhost:3000/auth/facebook";}}>
        <FaFacebook size={24} color="#4267B2" className="me-2" />
        Facebook
      </Button>
    </ButtonGroup>
  );
};

export default AuthSocialButtons;
