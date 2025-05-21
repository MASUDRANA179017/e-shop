import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductList } from './pages/ProductList'
import { BlogPage } from './pages/BlogPage'
import { ContactPage } from './pages/ContactPage'


function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/product-list" element={<ProductList/>} />
      <Route path="/product-details" element={<ProductDetailsPage/>} />
      <Route path="/blog" element={<BlogPage/>} />
      <Route path="/contact" element={<ContactPage/>} />
    </Routes>
  )
}


export default App
