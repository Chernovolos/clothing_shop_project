import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";
import { ShoppingCart } from "lucide-react";
import AdHocStockSelector from "@/components/AdHocStockSelector.tsx";

type Props = {
  product: ProductDetailsDto;
};

const ProductCard = ({product}: Props) => {
  const {category} = useParams();
  const image = product.images.filter((img) => img.isPrimary);
  const [isAdHocSelectorOpen, setAdHocSelectorOpen] = useState(false);
  const adHocStockSelectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutsideStock = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isAdHocSelectorOpen && adHocStockSelectorRef.current && !adHocStockSelectorRef.current.contains(target)) {
        setAdHocSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideStock);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideStock);
    }
  }, [isAdHocSelectorOpen]);

  const closeAdHocSelector = () => setAdHocSelectorOpen(false);

  return (
    <div className="card-container group">
      <figure className="card-body relative" >
        <div className="card-image">
          <img
            src={ image[0].url }
            alt={ product.title }
          />
        </div>
        <figcaption  ref={ adHocStockSelectorRef }>
          <button
            onClick={ () => setAdHocSelectorOpen(prev => !prev) }
            className="btn-card">
            <ShoppingCart className="card-img-basket" strokeWidth={ 1 }/>
          </button>
          <Link to={ `/${ category }/${ product.id }` } className="card-title">
            { product.title }
          </Link>
          <AdHocStockSelector
            product={ product }
            isOpen={ isAdHocSelectorOpen }
            onClose={ closeAdHocSelector }
          />
          <p className="card-price">{ product.price }</p>
        </figcaption>
      </figure>
    </div>
  )
};

export default ProductCard;