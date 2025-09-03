import React from "react";
import { Link } from "react-router-dom";

const BlogCardLayout = ({ id, slug, title, image, author, createdAt, content }) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg w-full flex-row justify-center group p-4 hover:shadow-lg hover:shadow-blue-400 transition-shadow duration-300">
      {/* Blog Image */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          className="object-cover w-full h-[250px] group-hover:scale-105 duration-300"
          src={image}
          alt={title}
        />
        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
          {author}
        </div>
      </div>

      {/* Blog Content */}
      <Link to={`/blog/${slug}`} className="block">
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">
          {new Date(createdAt).toDateString()}
        </p>
        <h3 className="text-lg font-semibold text-gray-800 leading-6 hover:underline mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{content}</p>
        <span className="text-blue-600 text-sm font-medium hover:underline">
          Read More →
        </span>
      </Link>
    </div>
  );
};

export default BlogCardLayout;

