import React from 'react'
import NewProductLazyLoad from '../components/product/NewProductLazyLoad'
import Container from '../components/commonLayouts/Container'
import SidebarFilter from '../components/SidebarFilter'

export const ProductListPage = () => {
  return (
    <Container>
      <div className="flex">
        <div className="w-[20%]">
          <SidebarFilter/>
        </div>
        <div className="w-[80%]">
          <NewProductLazyLoad />
        </div>
      </div>
    </Container>
  )
}


