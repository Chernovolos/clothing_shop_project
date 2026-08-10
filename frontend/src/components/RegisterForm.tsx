import { type SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { createUser } from "@/thunk/user.thunk.ts";
import { clearError, selectUserError, selectUsesLoading } from "@/slices/user.slice.ts";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext.tsx";

interface Props {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

interface RegisterFormProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegisterForm = ({onSwitchToLogin, onClose}: Props) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUsesLoading);
  const userError = useAppSelector(selectUserError);

  const { openLogin } = useAuthModal();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    }
  }, []);

  const onSwitchForm = () => {
    onSwitchToLogin();
  }

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, touchedFields, isValid, dirtyFields},
  } = useForm<RegisterFormProps>({
    mode: "onChange",
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const getFieldState = (field: keyof RegisterFormProps) => {
    if (errors[field]) return "is-error";

    if (touchedFields[field] && dirtyFields[field]) {
      return "is-success";
    }
    return "";
  };

  const onSubmit: SubmitHandler<RegisterFormProps> = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      plainPassword: data.password,
    }
    try {
      await dispatch(createUser(payload)).unwrap();
      onClose();
      openLogin();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="grid place-items-center min-h-screen sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2">
        { userError && (
          <div className="text-center">
            { userError }
          </div>
        ) }
        <form onSubmit={ handleSubmit(onSubmit) } className="col-span-full w-full max-w-md">
          <h2 className="col-span-full form-title">Register</h2>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <div
                className={ `input-wrapper ${ getFieldState("firstName") }` }>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  autoComplete="firstName"
                  { ...register("firstName", {
                    required: 'First name is required',
                    maxLength: 255,
                  }) }
                  className="form-control"
                />
              </div>

              { errors.firstName && <p className="error-text">{ errors.firstName.message }</p> }
            </div>

            <div className="input-group">
              <label htmlFor="lastname">Last Name</label>
              <div className={ `input-wrapper ${ getFieldState("lastName") }` }>
                <input
                  id="lastname"
                  type="text"
                  placeholder="Enter your last name"
                  { ...register("lastName", {
                    required: "Last name is required",
                    maxLength: 255,
                  }) }
                  className="form-control"
                />
              </div>
              { errors.lastName && <p className="error-text">{ errors.lastName.message }</p> }
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className={ `input-wrapper ${ getFieldState("email") }` }>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  { ...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }) }
                  className="form-control email-input"
                />

                <Mail
                  size={18}
                  className="email-icon"
                />
              </div>
              { errors.email && <p className="error-text">{ errors.email.message }</p> }
            </div>

            <div className="input-group">
              <label htmlFor="password">password</label>
              <div className={ `input-wrapper ${ getFieldState("password") }` }>
                <input
                  id="password"
                  type="password"
                  placeholder="1245_ddweR"
                  autoComplete="new-password"
                  { ...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                      message: "Password must contain at least one letter and one number",
                    },
                  })
                  }
                  className="form-control password-input"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  { showPassword ? <EyeOff size={18} /> : <Eye size={18} /> }
                </button>
              </div>
              { errors.password && <p className="error-text">{ errors.password.message }</p> }
            </div>

            <div className="input-group">
              <button
                type="submit"
                disabled={ !isValid || isSubmitting || isLoading }
                className={ `btn-form ${ (isSubmitting || !isValid) ? "btn-form--disabled" : "" } ` }
              >
                { isSubmitting ? "Sign up..." : "Sign up" }
              </button>
            </div>
            <div className="input-group">
              <div className="form-link-container">
                <span className="form-link-title">Already have an account?</span>
                <button
                  className="form-link"
                  type="button" onClick={ onSwitchForm }>
                  <span>Login</span>
                  <LogIn strokeWidth={ 1 } size={ 15 }/>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm;