import React, { useEffect, useState } from "react";
import { getBlogById } from "../../../@Services/BlogService";
import Container from "../../commonLayouts/Container";
import { Link } from "react-router-dom";
import { SiLibreofficewriter } from "react-icons/si";
 
const BlogDetails = ({ id }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
 
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
 
  if (!blog) {
    return (
      <Container>
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Blog not found</h2>
          <Link to="/blog" className="text-primary hover:underline">Back to blogs</Link>
        </div>
      </Container>
    );
  }
 
  return (
    <Container>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="w-full h-64 bg-gray-100">
          <img
            src={blog.image || "/frontend/products/product01.png"}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <span className="flex items-center">
              <SiLibreofficewriter className="mr-2" />
              {blog.vendor?.firstName || "Author"}
            </span>
            <span>{blog.createdAt ? new Date(blog.createdAt).toDateString() : ""}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {blog.content}
          </div>
        </div>
      </div>
    </Container>
  );
};
 
export default BlogDetails;
