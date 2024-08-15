/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm, Controller } from 'react-hook-form';
import { API } from '../../libs/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import AuthSocialButtons from '../component/AuthSocialButtons';

const LoginPage = () => {
  const { control, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const onSubmit = async (data: any) => {
    try {
      const response = await API.post('/users/login', { ...data });
      console.log(response.data);
      const { token, user } = response.data.data;
      console.log(token, user);
      setToken(token);
      setUser(user);
      navigate('/');
      toast.success('Login successful');
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: '100%', maxWidth: '500px' }} className="p-4 shadow-sm">
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="mt-2">Login</h2>
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      isInvalid={!!fieldState.error}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field, fieldState }) => (
                  <>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      isInvalid={!!fieldState.error}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldState.error?.message}
                    </Form.Control.Feedback>
                  </>
                )}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
          <AuthSocialButtons />
          <div className="text-center mt-4">
            <small>Don't have an account? <a href="/register">Register here</a></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;
