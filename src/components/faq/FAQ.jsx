import React from 'react'
import Container from '../commonLayouts/Container';

const FAQ = () => {
    // Sample FAQ data
    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy on all items."
        },
        {
            question: "How long does shipping take?",
            answer: "Shipping typically takes 5-7 business days."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to most countries worldwide."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order using the tracking link provided in your confirmation email."
        },
        {
            question: "How can I track my order?",
            answer: "You can track your order using the tracking link provided in your confirmation email."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and bank transfers. If you have any other questions, feel free to contact our support team. We are here to help you with any inquiries you may have regarding our products, services, or policies. Your satisfaction is our priority, and we strive to provide prompt and helpful responses to all your questions."
        }
    ];
    const [openIndex, setOpenIndex] = React.useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <Container>

                <h2 className="text-2xl font-bold mt-[40px] mb-4">Frequently Asked Questions</h2>
                <div className=" grid grid-cols-3 bg-gray-100 rounded-lg">
                    <div className='grid grid-cols-1 col-span-2 row-span-1 gap-4 p-4 pb-[-20px]'>
                        <div className="faq">
                            {faqs.map((faq, index) => (
                                <div key={index} className='bg-white p-4 h-auto mb-6 shadow'>
                                    <div
                                        className='flex justify-between items-center cursor-pointer p-0 m-0 '
                                        onClick={() => toggleAnswer(index)}
                                    >
                                        <h3 className='font-semibold text-[20px] '>{faq.question}</h3>
                                        <svg
                                            className={`w-10 h-10 bg-[#FF624C] rounded-full p-3 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-white border border-[#FF624C]' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 10 10"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4.5l-4 4-4-4" />
                                        </svg>
                                    </div>
                                    <p className={`text-lg mt-2 overflow-hidden transition-all duration-300 pr-[40px] ${openIndex === index ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 p-4">
                        <img src="frontend/banner/faq.png" alt="FAQ Image" className="w-full h-auto rounded-lg" />
                    </div>
                </div>
            </Container>
        </>
    )
}

export default FAQ;