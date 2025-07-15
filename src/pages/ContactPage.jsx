import React from 'react'
import ProductLayout from '../components/commonLayouts/ProductLayout'

const ContactPage = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-4 p-4">
      <ProductLayout percentTag={true} roundTag={false} category="LAPTOP" stock={true} stockAmount="50" title="S21 Laptop Ultra HD LED Screen Feature 2025 ......" rating="5" totalRating="100" price="1070" border="true" bg="transparent"/>
      <ProductLayout percentTag={false} roundTag={true} category="SMARTPHONE" stock={true} stockAmount="30" title="S21 Smartphone Ultra HD LED Screen Feature 2025 ......" rating="4" totalRating="10" price="870" border="true" bg="transparent"/>
      <ProductLayout percentTag={true} roundTag={false} category="TABLET" stock={false} stockAmount="20" title="S21 Tablet Ultra HD LED Screen Feature 2025 ......" rating="5" totalRating="50" price="670" border="true" bg="transparent"/>
      <ProductLayout percentTag={true} roundTag={false} category="TABLET" stock={true} stockAmount="20" title="S21 Tablet Ultra HD LED Screen Feature 2025 ......" rating="5" totalRating="50" price="670" border="true" bg="transparent"/>
      {/* <ProductLayout /> */}
    </div>
  )
}

export default ContactPage;