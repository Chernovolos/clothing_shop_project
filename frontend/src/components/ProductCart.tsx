import type { OrderProduct } from "@/types/Order.ts";
import { useProductStock } from "@/hooks/useProductStock.ts";
import { useEffect, useState } from "react";
import type { Size } from "@/types/Size.ts";
import type { Color } from "@/types/Color.ts";
import { useAppDispatch } from "@/app/hooks.ts";
// import { deleteOrder, updateOrderThunk } from "@/pages/CartPage/cartApi.ts";
import type { CartItem } from "@/types/Product.ts";
import ProductCartCarousel from "@/components/ProductCartCarousel.tsx";

type Props = OrderProduct & {
  variant?: "mini" | "page" | "";
};

const ProductCart = ({id, size, color, product, quantity, variant}: Props) => {

  // const dispatch = useAppDispatch();
  const {
    stockAvailabilityMap,
    availableColors,
    availableSizes,
  } = useProductStock(product);

  const [selectedSize, setSelectedSize] = useState<Size | null>(size);
  const [selectedColor, setSelectedColor] = useState<Color | null>(color);


  useEffect(() => {
    setSelectedSize(size);
    setSelectedColor(color);
  }, [size, color]);

  const isAvailableSets = (color?: Color | null, size?: Size | null) => {
    if (!color || !size) return 0;
    return stockAvailabilityMap.get(`${ color.code }_${ size }`) ?? 0;
  }

  const isSizeAvailable = (size: Size) => {
    if (!selectedColor) {
      return availableColors.some((color) => isAvailableSets(color, size) > 0);
    }
    return isAvailableSets(selectedColor, size) > 0;
  };

  const isColorAvailable = (color: Color) => {
    if (!selectedSize) {
      return availableSizes.some((size) => isAvailableSets(color, size) > 0);
    }
    return isAvailableSets(color, selectedSize) > 0;
  };

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);

    if (selectedColor && isAvailableSets(selectedColor, size) === 0) {
      const newColor = availableColors.find(
        (c) => isAvailableSets(c, size) > 0,
      );
      setSelectedColor(newColor ?? null);
    }
  }

  const handleColorChange = (color: Color) => {
    setSelectedColor(color);

    if (selectedSize && isAvailableSets(color, selectedSize) === 0) {
      const newSize = availableSizes.find(
        (s) => isAvailableSets(color, s) > 0,
      );
      setSelectedSize(newSize ?? null);
    }
  };

  const handleDeleteItem = () => {
    if (!selectedColor || !selectedSize) return;

    // const deletedItem: CartItem = {
    //   id: product.id,
    //   quantity: 1,
    //   color: selectedColor,
    //   size: selectedSize,
    //   price: product.price,
    // };
    // dispatch(deleteOrder(deletedItem));
  }

  const updateItem = () => {
    if (!selectedColor || !selectedSize) return;
    //
    // const newItem: CartItem = {
    //   id: id,
    //   quantity: 1,
    //   color: selectedColor,
    //   size: selectedSize,
    //   price: product.price,
    // };
    // dispatch(updateOrderThunk(newItem));
  };

  const currentQuantity = isAvailableSets(selectedColor, selectedSize);

  return (
    <div className={ `cart ${ variant }` }>
      <div className={ `grid grid-cols-12 
    ${ variant === "mini" ? "gap-2 p-4" : "gap-4 py-6 items-stretch"  }` }>
        <div className={ `flex flex-col ${ variant === "mini" ? "col-span-5 gap-0.5" : "col-span-9 gap-1"}` }>
          <h2 className={ `cart-title ${ variant }` }>{ product.title }</h2>
          { variant === "mini" ?  "" :  <p className={ `cart-subtitle ${ variant }` }>{ product.title }</p> }
          <p className={ `cart-price ${ variant }` }>${ product.price }</p>

          <p className={ `cart-label ${ variant }` }>size:</p>
          <div className={ `cart-btn-wrapper ${ variant }` }>
            {/*{*/}
            {/*  availableSizes.map((size, index) => {*/}
            {/*    return (*/}
            {/*      <button*/}
            {/*        key={ index }*/}
            {/*        onClick={ () => handleSizeChange(size) }*/}
            {/*        className={*/}
            {/*        `cart-btn-size ${ variant } ${ selectedSize === size ? "cart-btn-size--active" : "" }*/}
            {/*      */}
            {/*        ${ isSizeAvailable(size) ? "" : "cart-btn-size--unavailable" }*/}
            {/*        ` }*/}
            {/*      >{ size }</button>*/}
            {/*    )*/}
            {/*  })*/}
            {/*}*/}
          </div>

          <p className={ `cart-label ${ variant }` }>color:</p>
          <div className={ `cart-btn-wrapper ${ variant }` }>
            {/*{*/}
            {/*  availableColors.map((color, index) => {*/}
            {/*    return (*/}
            {/*      <button*/}
            {/*        key={ index }*/}
            {/*        onClick={ () => handleColorChange(color) }*/}
            {/*        style={ {backgroundColor: color.hex} }*/}
            {/*        className={ `cart-btn-color ${ variant } ${ selectedColor?.id === color.id ? "cart-btn-color--active" : "" }*/}
            {/*        ${ isColorAvailable(color) ? "" : "cart-btn-color--disabled" }*/}
            {/*        `*/}
            {/*        }*/}
            {/*      ></button>*/}
            {/*    )*/}
            {/*  })*/}
            {/*}*/}
          </div>
        </div>

        <div className={ `flex flex-col justify-between items-center h-full ${ variant === "mini" ? "col-span-2":  "col-span-1"  }` }>
          <button
            disabled={ !selectedColor || !selectedSize || !currentQuantity }
            onClick={ updateItem }
            className={ `cart-btn-action ${ variant } ${ (!selectedColor || !selectedSize || !currentQuantity) ? "cart-btn-acttion--disabled" : "" }` }
          >+
          </button>
          <p className="cart-quantity">{ quantity }</p>
          <button
            onClick={ () => handleDeleteItem() }
            className={ `cart-btn-action ${ variant }` }>
            -
          </button>
        </div>

        <div className={ `flex flex-col ${ variant === "mini" ?  "col-span-5": "col-span-2" }` }>
          <ProductCartCarousel images={product.images} outOfStock={false}/>
        </div>
      </div>
    </div>
  )
}

export default ProductCart;