"use client";
import React, { useEffect, useState } from "react";
import Container from "../commonLayouts/Container";
import { SiLibreofficewriter } from "react-icons/si";

const BlogGridView = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("data/blogData.json")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  return (
    <Container>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 p-5 text-center uppercase">Latest Blogs</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            {/* Blog Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            {/* Blog Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {blog.content}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                    <SiLibreofficewriter className="inline-block mr-1" />
                    {blog.author}
                </span>
                <span>{blog.createdAt}</span>
              </div>

              <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BlogGridView;
