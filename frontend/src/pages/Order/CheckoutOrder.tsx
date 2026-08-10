import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { type SubmitHandler, useForm, Controller, useWatch, type FieldPath } from "react-hook-form";
import Select from 'react-select';
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks.ts";
import FormAsyncSelect from "@/components/FormAsyncSelect.tsx";
import AuthenticationRequired from "@/components/AuthenticationRequired.tsx";
import { clearOrder, selectOrder } from "@/slices/order.slice.ts";
import { selectIsAuthenticated, selectUser } from "@/slices/user.slice.ts";
import { sizeToLabel } from "@/types/enums/product.enums.ts";
import type { CheckoutOrderDto } from "@/types/dtos/order.dto.ts";
import { ORDER_PAYMENT_TYPE, type OrderPaymentType } from "@/types/enums/order.enums.ts";
import {
  clearCities,
  selectIsLoadingWarehouses,
  selectWarehouseMarkers,
  selectWarehouses,
} from "@/slices/nova-poshta.slice.ts";
import { getWarehousesThunk, searchSettlementsThunk } from "@/thunk/nova-poshta.thunk.ts";
import { checkOutOrder } from "@/thunk/order.thunk.ts";
import type { CityOption, UserInput, WarehouseOption } from "@/types/form/checkout.order.types.ts";
import { useCurrencyContext } from "@/contexts/CurrencyContext.tsx";

interface CheckoutForm {
  citySelection: CityOption | null;
  warehouseSelection: WarehouseOption | null;
  userInput: UserInput;
  paymentMethod: OrderPaymentType
}

const CheckoutOrder = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const order = useAppSelector(selectOrder);
  const user = useAppSelector(selectUser);

  const warehouseOptions = useAppSelector(selectWarehouses);
  const isLoadingWarehouses = useAppSelector(selectIsLoadingWarehouses);
  const markers = useAppSelector(selectWarehouseMarkers);

  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [isOpenOrderBlock, setOpenOrderBlock] = useState<boolean | null>();

  const { getCurrencySymbol, convertToCurrency } = useCurrencyContext();

  const sectionRefs = {
    contact: useRef<HTMLDivElement>(null),
    delivery: useRef<HTMLDivElement>(null),
    payment: useRef<HTMLDivElement>(null),
    review: useRef<HTMLDivElement>(null),
  };

  const orderProductRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCancelRef = useRef<(() => void) | null>(null);

  const toggleOpenOrderBlock = () => {
    setOpenOrderBlock(!isOpenOrderBlock);
  };

  const handleNextStep = async (
    step: number,
    ref: React.RefObject<HTMLDivElement | null>,
    fieldsToValidate: (keyof CheckoutForm | `userInput.${ keyof UserInput }`)[],
  ) => {
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) return;

    setActiveStep(step);
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getFieldState,
    formState,
    trigger,
    getValues,
  } = useForm<CheckoutForm>({
    mode: "onChange",
    defaultValues: {
      citySelection: null,
      warehouseSelection: null,
      userInput: {
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        phoneNumber: '',
        emailAddress: user?.email ?? '',
        comment: '',
      },
    },
  });

  const getInputState = (name: FieldPath<CheckoutForm>) => {
    const {error, isTouched, isDirty} = getFieldState(name, formState);

    if (error) return "is-error";

    if (isTouched && isDirty) {
      return "is-success";
    }

    return "";
  };

  const loadCities = useCallback(
     (input: string): Promise<CityOption[]> => {
      if (!input.trim()) {
        return Promise.resolve([])
      }

      if (activeCancelRef.current) {
        activeCancelRef.current();
      }

      return new Promise((resolve) => {
        const cancel = () => {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
          }
          resolve([]);
        };

        activeCancelRef.current = cancel;

        debounceTimerRef.current = setTimeout( async () => {
          try {
            const cities = await dispatch(searchSettlementsThunk(input)).unwrap();
            resolve(cities);
          } catch (error) {
            console.error('Error loading cities', error);
            resolve([]);
          } finally {
            debounceTimerRef.current = null;
            activeCancelRef.current = null;
          }
        }, 400)
      })
    }, [dispatch])

  const selectedCity = useWatch({control, name: "citySelection"});
  const selectedWarehouse = useWatch({control, name: "warehouseSelection"})
  const paymentMethod = useWatch({control, name: "paymentMethod"});

  useEffect(() => {
    return () => {
      if (activeCancelRef.current) {
        activeCancelRef.current();
      }
    };
  }, []);

  useEffect(() => {
    setValue("warehouseSelection", null);

    if (selectedCity?.deliveryCity) {
      dispatch(
        getWarehousesThunk({
          cityRef: selectedCity.deliveryCity,
          findByString: "",
        }),
      );
    } else {
      dispatch(clearCities());
    }
  }, [selectedCity, dispatch, setValue]);

  const onSubmit: SubmitHandler<CheckoutForm> = (data) => {
    console.log("data", data);
  };

  const MapUpdater = ({warehouse}: { warehouse: WarehouseOption | null }) => {
    const map = useMap();

    useEffect(() => {
      if (!warehouse || !map) return;

      map.panTo({
        lat: Number(warehouse.latitude),
        lng: Number(warehouse.longitude),
      });

      map.setZoom(16);
    }, [warehouse, map]);

    return null;
  };

  const confirmOrder = async () => {
    const isValid = await trigger();

    if (!isValid) return;

    const data = getValues();

    const checkOutOrderDto: CheckoutOrderDto = {
      firstName: data.userInput.firstName,
      lastName: data.userInput.lastName,
      email: data.userInput.emailAddress,
      phone: data.userInput.phoneNumber,
      comment: data.userInput.comment,
      city: data.citySelection?.ref ?? '',
      warehouseRef: data.warehouseSelection?.ref || '',
      warehouseLat: Number(data.warehouseSelection?.latitude),
      warehouseLon: Number(data.warehouseSelection?.longitude),
      paymentMethod: Number(data.paymentMethod),
    }
    console.log(data);
    console.log('checkOutOrderDto', checkOutOrderDto);
    dispatch(checkOutOrder(checkOutOrderDto));
    dispatch(clearOrder());
  }

  return (
    <div className="section">
      <div className="container">
        <div className="grid min-h-screen">
          {
            !isAuthenticated ? (
                <div className="flex justify-center items-baseline">
                  <AuthenticationRequired variant={ 'inline' }/>
                </div>) :
              !order?.quantity ? (
                <div className="flex justify-center items-baseline">
                  <p className="text-2xl">Your cart is empty :(.
                    <Link to={ '/women' } className="cart-link"> Continue shopping.</Link>
                  </p></div>) : <>
                <form onSubmit={ handleSubmit(onSubmit) } className="grid gap-8 lg:grid-cols-[650px_1fr]">
                  <div className="form-group-wrapper">
                    <div ref={ sectionRefs.contact } className="border-decor py-4">
                      <div className="flex gap-2 items-center mb-6">
                        <p className="form-badge">1</p>
                        <h3>Your contact details.</h3>
                      </div>
                      <div className="form-group">
                        <div className="input-group">
                          <label htmlFor="firstName"/>
                          <div className={ `input-wrapper ${ getInputState("userInput.firstName") }` }>
                            <input
                              id="firstName"
                              type="text"
                              placeholder="First name"
                              { ...register("userInput.firstName", {
                                required: "First name is required",
                                maxLength: 255,
                              }) }
                              className="form-control"
                            />
                          </div>
                          { formState.errors.userInput?.firstName &&
                            <p className="error-text">{ formState.errors.userInput.firstName.message }</p> }
                        </div>
                        <div className="input-group">
                          <label htmlFor="lastName"/>
                          <div className={ `input-wrapper ${ getInputState("userInput.lastName") }` }>
                            <input
                              id="lastName"
                              type="text"
                              placeholder="Last name"
                              { ...register("userInput.lastName", {
                                required: "Last name is required",
                                maxLength: 255,
                              }) }
                              className="form-control"
                            />
                          </div>
                          { formState.errors.userInput?.lastName &&
                            <p className="error-text">{ formState.errors.userInput.lastName.message }</p> }
                        </div>
                        <div className="input-group">
                          <label htmlFor="emailAddress"/>
                          <div className={ `input-wrapper relative ${ getInputState("userInput.emailAddress") }` }>
                            <input
                              id="emailAddress"
                              type="email"
                              placeholder="email"
                              autoComplete="email"
                              { ...register("userInput.emailAddress", {
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
                          { formState.errors.userInput?.emailAddress &&
                            <p className="error-text">{ formState.errors.userInput.emailAddress.message }</p> }
                        </div>

                        <div className="input-group">
                          <label htmlFor="phoneNumber"/>
                          <div className={ `input-wrapper relative ${ getInputState("userInput.phoneNumber") }` }>
                            <input
                              id="phoneNumber"
                              type="tel"
                              placeholder="Enter your phone number :)"
                              autoComplete="tel"
                              { ...register("userInput.phoneNumber", {
                                required: "Phone number is required",
                                setValueAs: (v) => v.replace(/[\s\-()]/g, ""),
                                pattern: {
                                  value: /^(?:\+?38)?0\d{9}$/,
                                  message: "Invalid phone number",
                                },
                              }) }
                              className="form-control phone-input"
                            />

                            <Phone
                              size={ 18 }
                              className="phone-icon"
                            />
                          </div>
                          { formState.errors.userInput?.phoneNumber &&
                            <p className="error-text">{ formState.errors.userInput.phoneNumber.message }</p> }
                        </div>

                        <div className="input-group">
                          <label htmlFor="comment"/>
                          <div className={ `input-wrapper ${ getInputState("userInput.comment") }` }>
                       <textarea
                         id="comment"
                         placeholder="Comment"
                         className="form-control resize-none"
                         { ...register("userInput.comment", {
                           maxLength: {
                             value: 1000,
                             message: "Comment cannot exceed 1000 characters",
                           },
                         }) }
                       />
                          </div>
                          { formState.errors.userInput?.comment &&
                            <p className="error-text">{ formState.errors.userInput.comment.message }</p> }
                        </div>

                        <div className="input-group">
                          <div className="form-btn-container">
                            <button
                              className="btn-form btn-form--sm"
                              type="button"
                              onClick={ () => handleNextStep(2, sectionRefs.delivery, [
                                "userInput.firstName",
                                "userInput.lastName",
                                "userInput.emailAddress",
                                "userInput.phoneNumber",
                              ]) }
                            >
                              Continue
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div ref={ sectionRefs.delivery }
                         className={ `border-decor py-4 scroll-mt-24 ${ activeStep && activeStep < 2 ? "pointer-events-none opacity-30" : "" }` }>
                      <div className="flex gap-2 items-center mb-6">
                        <p className="form-badge">2</p>
                        <h3>Delivery.</h3>
                      </div>
                      <div className="form-group">
                        <div className="input-group">
                          <div className={ `input-wrapper ${ getInputState("citySelection") }` }>
                            <FormAsyncSelect<CheckoutForm, CityOption>
                              name="citySelection"
                              control={ control }
                              loadOptions={ loadCities }
                              placeholder="Type city..."
                              rules={ {required: "Please, select city"} }
                              classNamePrefix="custom-select"
                            />
                          </div>
                        </div>

                        <div className="input-group">
                          <div className={ `input-wrapper ${ getInputState("warehouseSelection") }` }>
                            <Controller
                              name="warehouseSelection"
                              control={ control }
                              rules={ {required: "Please, select warehouse"} }
                              render={ ({field}) => (
                                <>
                                  <Select
                                    { ...field }
                                    options={ warehouseOptions }
                                    placeholder="Choose warehouse"
                                    isClearable
                                    isSearchable
                                    isLoading={ isLoadingWarehouses }
                                    classNamePrefix="custom-select"
                                  />
                                </>
                              ) }
                            />
                          </div>
                          { formState.errors.warehouseSelection &&
                            <p className="error-text">{ formState.errors.warehouseSelection.message }</p> }
                        </div>

                        <div className="input-group">
                          {
                            markers && markers.length > 0 && (
                              <Map
                                mapId={ import.meta.env.VITE_GOOGLE_MAP_ID }
                                style={ {width: '100%', height: '500px'} }
                                defaultCenter={ {
                                  lat: markers[0].lat,
                                  lng: markers[0].lng,
                                } }
                                defaultZoom={ 13 }

                              >
                                <MapUpdater warehouse={ selectedWarehouse }/>
                                { markers.map((marker) => (
                                  <AdvancedMarker
                                    key={ marker.id }
                                    position={ {
                                      lat: marker.lat,
                                      lng: marker.lng,
                                    } }
                                    clickable={ true }
                                    onClick={ () => {
                                      const warehouse = warehouseOptions.find(
                                        item => item.ref === marker.id,
                                      );

                                      if (warehouse) {
                                        setValue("warehouseSelection", warehouse, {shouldValidate: true});
                                      }
                                    } }
                                  >
                                    <div
                                      className={ `np-icon ${ selectedWarehouse?.ref === marker.ref ? "np-icon--selected" : "" }` }>
                                      H
                                    </div>
                                  </AdvancedMarker>
                                )) }
                              </Map>
                            )
                          }
                        </div>

                        <div className="input-group">
                          <div className="form-btn-container">
                            <button
                              disabled={ !selectedWarehouse }
                              className="btn-form btn-form--sm"
                              type="button"
                              onClick={ () => handleNextStep(3, sectionRefs.payment, [
                                "warehouseSelection",
                                "citySelection",
                              ]) }
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div ref={ sectionRefs.payment }
                         className={ `border-decor py-4 scroll-mt-24${ activeStep && activeStep < 3 ? "pointer-events-none opacity-30" : "" }` }
                    >
                      <div className="flex gap-2 items-center mb-6">
                        <p className="form-badge">3</p>
                        <h3>Payment method.</h3>
                      </div>

                      <div className="input-group">
                        <label htmlFor="card"/>
                        <div className="flex gap-2 items-center mb-6 px-4">
                          <input
                            id="card"
                            type="radio"
                            value={ ORDER_PAYMENT_TYPE.CARD }
                            className="form-radio"
                            { ...register("paymentMethod", {
                              required: "Please select a payment method",
                            }) }
                          />
                          <span>Payment by Card</span>
                        </div>
                      </div>

                      <div className="input-group">
                        <label htmlFor="cash"/>
                        <div className="flex gap-2 items-center mb-6 px-4">
                          <input
                            id="cash"
                            type="radio"
                            value={ ORDER_PAYMENT_TYPE.CASH }
                            { ...register("paymentMethod") }
                          />
                          <span>Cash on delivery</span>
                        </div>

                      </div>
                      <div className="input-group">
                        <div className="form-btn-container">
                          <button
                            disabled={ !paymentMethod }
                            className="btn-form btn-form--sm"
                            type="button"
                            onClick={ () => handleNextStep(4, sectionRefs.review, [
                              "paymentMethod",
                            ]) }
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div ref={ sectionRefs.review } className="form-group-wrapper scroll-mt-24">
                    <div
                      className={ `border-decor py-4 ${ activeStep && activeStep < 4 ? "pointer-events-none opacity-30" : "" }` }>
                      <div className="flex gap-2 items-center mb-6">
                        <p className="form-badge">4</p>
                        <h3>Summary.</h3>
                      </div>
                      <div className={ `order-block ${ isOpenOrderBlock ? 'order-block__open' : '' }` }>
                        <div className="order-block__header" onClick={ toggleOpenOrderBlock }>
                          <div>
                            <p><Link to={ '/order' } className="form-link__edit"> Edit order</Link></p>
                            <h3 className="order-block__count">Items: <span>{ order.quantity }</span></h3>
                          </div>

                          <button
                            type="button"
                            className="order-block__arrow-btn"
                          >
                            <ChevronDown size={ 16 }/>
                          </button>
                        </div>

                        <div
                          className="order-block__collapse"
                          ref={ orderProductRef }
                          style={ {
                            height: isOpenOrderBlock ? `${ orderProductRef.current?.scrollHeight }px` : '0px',
                          } }
                        >
                          <div className="order-container">
                            {
                              order.orderItems.map((item) => {
                                const stock = item.product.stocks.find(s => s.id === item.stockId);
                                const image = item.product.images.find((img) => img.color?.id === stock?.color?.id);

                                return (
                                  <div key={ item.id } className="order-product">
                                    <div className="order-product__img-box">
                                      <img src={ image?.url } alt="Cotton T-Shirt"/>
                                    </div>
                                    <div className="order-product__content">
                                      <div className="order-product__row">
                                        <h4 className="order-product__title">{ item.product.title }</h4>
                                        <span className="order-product__price">{getCurrencySymbol()} { convertToCurrency(item.product.price) }</span>
                                      </div>
                                      <div className="order-product__details">
                                        <div className="order-product__meta">
                                          <span
                                            className="order-product__spec">Size: <b>{ stock && sizeToLabel(stock.productSize) }</b></span>
                                          <span
                                            className="order-product__spec">Color: <b>{ stock?.color?.code }</b></span>
                                        </div>
                                        <span
                                          className="order-product__quantity">Quantity: <b>{ item.quantity }</b></span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="grid gap-2 justify-items-start pb-6 px-4">
                          <div className="grid grid-flow-col grid-rows gap-4 py-2">
                            <div className="row-span-2 row-start-2 ...">
                              <p className="text-md mt-2">Quantity:</p>
                              <p className="font-medium text-md">Total:</p>
                              <p className="font-medium text-md">Delivery:</p>
                            </div>
                            <div className="row-span-2 row-start-2 ...">
                              <p className="font-bold text-md mt-2">{ order.quantity }</p>
                              <p className="font-bold text-md">{getCurrencySymbol()} { convertToCurrency(order.total) }</p>
                              <p className="font-bold text-md">NP</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="input-group">
                        <div className="form-btn-container">
                          <button
                            className="btn-form btn-form--sm"
                            type="button"
                            onClick={ confirmOrder }
                          >
                            Confirm order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default CheckoutOrder;