import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import Basket from "../../public/images/icons/empty_basket.svg";
import type { ProductDetailsDto } from "@/types/dtos/product.dto.ts";

type Props = {
  product: ProductDetailsDto;
};

const ProductCard = ({product}: Props) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const imgURL = product.images?.[0]?.url;

  const handleClick = () => {
    navigate(`/${ category }/${ product.id }`);
  }

  return (
    <div onClick={ handleClick } className="card-container group">
      <figure className="card-body">
        <div className="card-image">
          <img
            src={ imgURL }
            alt={ product.title }
          />
        </div>
        <figcaption className="relative">
          <button className="btn-card">
            <img className="card-img-basket" src={ Basket } alt="Basket Image"/>
          </button>
          <p className="card-title">{ product.title }</p>
          <span className="card-price">{ product.price }</span>
        </figcaption>
      </figure>
    </div>
  )
};

export default ProductCard;