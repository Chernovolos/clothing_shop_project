import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, UserRoundPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import { clearError, selectAuthLoading, selectAuthError } from "@/slices/user.slice.ts";
import { login } from "@/thunk/auth.thunk.ts";

interface Props {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

interface LoginFormProps {
  email: string;
  password: string;
}

const LoginForm = ({onSwitchToRegister, onClose}: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const authLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    }
  }, []);

  const onSwitchForm = () => {
    onSwitchToRegister();
  }

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting, touchedFields, isValid, dirtyFields},
  } = useForm<LoginFormProps>({
    mode: "onChange",
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const getFieldFormState = (field: keyof LoginFormProps) => {
    if (errors[field]) return "is-error";
    console.log("field", field);

    if (touchedFields[field] && dirtyFields[field]) {
      return "is-success";
    }
    return "";
  };

  const onSubmit: SubmitHandler<LoginFormProps> = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    }
    try {
      await dispatch(login(payload)).unwrap();
      onClose();
      navigate("/women");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="grid place-items-center min-h-screen sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-2">
        <form onSubmit={ handleSubmit(onSubmit) } className="col-span-full w-full max-w-md">
          { authError && (
            <div className="text-center">
              { authError }
            </div>
          ) }
          <h2 className="col-span-full form-title">Login</h2>
          <div className="form-group">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className={ `input-wrapper ${ getFieldFormState("email") }` }>
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
                  size={ 18 }
                  className="email-icon"
                />
              </div>
              { errors.email && <p className="error-text">{ errors.email.message }</p> }
            </div>

            <div className="input-group">
              <label htmlFor="password">password</label>
              <div className={ `input-wrapper ${ getFieldFormState("password") }  relative` }>
                <input
                  id="password"
                  type={ showPassword ? "text" : "password" }
                  placeholder="1245_ddweR"
                  autoComplete="current-password"
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
                  onClick={ () => setShowPassword((prev) => !prev) }
                  className="password-toggle"
                  aria-label={ showPassword ? "Hide password" : "Show password" }
                >
                  { showPassword ? <EyeOff size={ 18 }/> : <Eye size={ 18 }/> }
                </button>
              </div>

              { errors.password && <p className="error-text">{ errors.password.message }</p> }
            </div>

            <div className="input-group">
              <button
                type="submit"
                disabled={ !isValid || isSubmitting || authLoading }
                className={ `btn-form ${ (isSubmitting || !isValid) ? "btn-form--disabled" : "" } ` }
              >
                { isSubmitting ? "Login..." : "Login" }
              </button>
            </div>
            <div className="input-group">
              <div className="form-link-container">
                <span className="form-link-title">New here?</span>
                <button
                  className="form-link"
                  type="button" onClick={ onSwitchForm }>
                  <span>Create account.</span>
                  <UserRoundPlus strokeWidth={ 1 } size={ 15 }/>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm;