import AsyncSelect, { type AsyncProps } from 'react-select/async';
import type { GroupBase } from 'react-select';
import { type Control, Controller, type FieldValues, type Path, type RegisterOptions, } from 'react-hook-form';

interface FormAsyncSelectProps<
  TFormValues extends FieldValues,
  TOption
> {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  loadOptions: AsyncProps<TOption, false, GroupBase<TOption>>['loadOptions'];
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  rules?: Omit<RegisterOptions<TFormValues, Path<TFormValues>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  classNamePrefix?: string
}

const FormAsyncSelect = <
  TFormValues extends FieldValues,
  TOption extends { label: string; value: string }
>({
    name,
    control,
    loadOptions,
    placeholder = 'Select...',
    isClearable = true,
    isDisabled = false,
    rules,
    classNamePrefix,
  }: FormAsyncSelectProps<TFormValues, TOption>) => {
  return (
    <Controller
      name={ name }
      control={ control }
      rules={ rules }
      render={ ({field, fieldState: {error}}) => (
        <div className="w-full h-10">
          <AsyncSelect<TOption, false>
            { ...field }
            inputId={ name }
            cacheOptions
            defaultOptions
            loadOptions={ loadOptions }
            placeholder={ placeholder }
            isClearable={ isClearable }
            isDisabled={ isDisabled }
            loadingMessage={ () => 'Searching...' }
            noOptionsMessage={ () => 'Nothing found' }
            classNamePrefix={ classNamePrefix }
          />
          { error && (
            <p className="error-text">
              { error.message }
            </p>
          ) }
        </div>
      ) }
    />
  );
};

export default FormAsyncSelect;