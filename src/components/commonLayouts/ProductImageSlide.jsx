import Slider from "react-slick";

export default function ProductImageSlider({ product }) {
  const images = [
    product.productThumbnail,
    ...(product.productGallery || [])
  ].filter(Boolean);

  if (images.length === 0) return <p>No images available</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Slider {...settings} className="product-image-slider">
      {images.map((img, idx) => (
        <div key={idx}>
          <img
            src={img}
            alt={`Product ${idx + 1}`}
            className="w-full h-[300px] sm:h-[500px] md:h-[700px] object-cover rounded-lg"
          />
        </div>
      ))}
    </Slider>
  );
}
