import React from 'react'
import FooterTop from './FooterTop'
import FooterBottom from './FooterBottom'

const Footer = () => {
  return (
    <div className='bg-[linear-gradient(90deg, rgba(244,244,244,1)_29%, rgba(217,217,217,1)_43%)] mt-[50px]'>
      <FooterTop/>
      <FooterBottom/>
    </div>
  )
}

export default Footer