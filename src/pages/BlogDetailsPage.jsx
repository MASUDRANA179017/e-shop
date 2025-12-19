import React from "react";
import { useParams } from "react-router-dom";
import BlogDetails from "../components/frontend/blog/BlogDetails";
import Container from "../components/commonLayouts/Container";
 
const BlogDetailsPage = () => {
  const { id } = useParams();
  return (
    <Container>
      <BlogDetails id={id} />
    </Container>
  );
};
 
export default BlogDetailsPage;
