import React, { useEffect } from 'react';
import BlogListScreen from '../../src/features/blog/presentation/screens/BlogListScreen';

const BlogTab: React.FC = () => {
  console.log('[BlogTab] Component rendering');
  
  useEffect(() => {
    console.log('[BlogTab] Component mounted');
    return () => {
      console.log('[BlogTab] Component unmounted');
    };
  }, []);

  return <BlogListScreen />;
};

export default BlogTab;